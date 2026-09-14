import { NextRequest, NextResponse } from "next/server";

// Only /admin is gated — this is the CMS behind the public marketing
// site, not the whole site (unlike the SRS Catalogue project, where the
// entire dashboard lives at "/"). Everything outside /admin stays fully
// public.
const PUBLIC_ADMIN_PREFIXES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

// admin.<domain> is the same app as the main site — no separate deployment
// — just a friendlier address. A request there is silently rewritten (URL
// bar keeps showing admin.<domain>/whatever) onto the real /admin/whatever
// route before the usual auth gate below runs, so both addresses share one
// login/session.
function isAdminHost(hostname: string) {
  return hostname === "admin" || hostname.startsWith("admin.");
}

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];
  let pathname = request.nextUrl.pathname;

  if (isAdminHost(hostname) && !pathname.startsWith("/admin")) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`;
    pathname = rewritten.pathname;

    if (PUBLIC_ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.rewrite(rewritten);
    }

    const adminSession = request.cookies.get("srs_website_admin_session")?.value;
    const isAdmin = !!adminSession && adminSession === process.env.ADMIN_PASSWORD;
    if (isAdmin) return NextResponse.rewrite(rewritten);

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get("srs_website_admin_session")?.value;
  const isAdmin = !!adminSession && adminSession === process.env.ADMIN_PASSWORD;

  if (isAdmin) return NextResponse.next();

  const adminLoginUrl = new URL("/admin/login", request.url);
  adminLoginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(adminLoginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|videos|brand).*)"],
};
