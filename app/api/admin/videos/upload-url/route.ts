import { NextResponse, type NextRequest } from "next/server";
import { adminSessionCookieName, hasValidAdminSession } from "@/lib/admin-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = request.cookies.get(adminSessionCookieName)?.value;
  if (!(await hasValidAdminSession(session))) {
    return NextResponse.json({ error: "Admin sign in required." }, { status: 401 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Video uploads need the connected course database." }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to your administrator account first." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "This account does not have administrator access." }, { status: 403 });

  const body = await request.json().catch(() => null) as { name?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 180) : "";
  if (!name) return NextResponse.json({ error: "Add a lesson name before uploading its video." }, { status: 400 });

  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!account || !token) {
    return NextResponse.json({ error: "Video uploads are not configured on this deployment yet." }, { status: 503 });
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/stream/direct_upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      maxDurationSeconds: 3600,
      expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      creator: user.id,
      meta: { name },
      requireSignedURLs: true,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  const uploadURL = payload?.result?.uploadURL;
  const uid = payload?.result?.uid;
  if (!response.ok || !uploadURL || !uid) {
    const details = Array.isArray(payload?.errors)
      ? payload.errors.map((error: { code?: unknown; message?: unknown }) => {
          const code = typeof error.code === "number" ? `code ${error.code}` : "";
          const message = typeof error.message === "string" ? error.message : "";
          return [code, message].filter(Boolean).join(": ");
        }).filter(Boolean).join("; ")
      : "";
    const reason = details || `HTTP ${response.status}`;
    console.error(`Cloudflare Stream direct upload failed (${response.status}): ${reason}`);
    return NextResponse.json({ error: `Cloudflare rejected the upload (${response.status}): ${reason}` }, { status: 502 });
  }

  return NextResponse.json({ uploadURL, uid }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
