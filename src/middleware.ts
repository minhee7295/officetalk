import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/", "/list", "/mypage", "/users", "/write", "/post"];

export function middleware(request: NextRequest) {
  console.log("미들웨어 실행됨", request.nextUrl.pathname);
  const session = request.cookies.get("session-user");
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    console.log("세션없음");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/list",
    "/list/:path*",
    "/mypage",
    "/users",
    "/write",
    "/post",
    "/post/:path*",
  ],
};
