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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*"],
};
