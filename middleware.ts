import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const portalPublic = ["/portal/login", "/portal/esqueci-senha", "/portal/redefinir-senha"];
  if (pathname.startsWith("/portal") && !portalPublic.some((p) => pathname.startsWith(p))) {
    if (!request.cookies.has("session-id")) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!request.cookies.has("admin-session-id")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
