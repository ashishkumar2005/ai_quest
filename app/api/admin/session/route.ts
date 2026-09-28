import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookieName, createAdminSession, matchesAdminPassword } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PORTAL_PASSWORD || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return NextResponse.json({ error: "Admin password access is not configured on this server." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !(await matchesAdminPassword(body.password))) {
    return NextResponse.json({ error: "The password is incorrect." }, { status: 401 });
  }

  const session = await createAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(session.cookieName, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
