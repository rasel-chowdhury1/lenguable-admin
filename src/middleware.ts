import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload || payload.role !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.cookies.delete("accessToken");
      return res;
    }
  }

  if (pathname === "/" && token) {
    const payload = decodeJwtPayload(token);
    if (payload?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
