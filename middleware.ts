import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/", "/list", "/mypage", "/users", "/write", "/post"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session-user");
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/list", "/mypage", "/users", "/write", "/post/:path*"],
};
