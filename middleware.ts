import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { adminSessionCookieName, hasValidAdminSession } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLogin) {
    const validSession = await hasValidAdminSession(request.cookies.get(adminSessionCookieName)?.value);
    if (!validSession) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(login);
    }
  }

  if (isAdminLogin) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items: { name: string; value: string; options: Parameters<typeof response.cookies.set>[2] }[]) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    if (isAdminRoute) return NextResponse.redirect(new URL("/unauthorized", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAdminRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/units/:path*", "/papers/:path*", "/quizzes/:path*", "/progress/:path*", "/suggestions/:path*", "/profile/:path*", "/admin/:path*"] };
