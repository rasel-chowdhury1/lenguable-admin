import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs on the server, so use request.cookies, not js-cookie
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // Protected routes
  const protectedPaths = ["/dashboard"];

  const { pathname } = request.nextUrl;

  // If trying to access protected page without token → redirect to login
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to go to /login → redirect to dashboard
  if (pathname === "/" && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Apply middleware only on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
