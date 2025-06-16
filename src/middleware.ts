import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/", "/list", "/mypage", "/users", "/write", "/post"];

// @review 미들웨어 위치가 안맞아서 사용불가 next15 이후 미들웨어 위치 src가 있다면 src/middleware.ts 처럼 해당 디렉토리에 위치해야함
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session-user");
  const { pathname } = request.nextUrl;

  // @review /index.tsx 에서 역할을 여기서 하면됨
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/list", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    console.log("Protected path accessed without session:", pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // @review 어차피 matcher가 전체 경로를 다 잡아주기 때문에 아래 matcher는 필요없음
  matcher: ["/:path*"],
  // matcher: ["/", "/list", "/mypage", "/users", "/write", "/post/:path*"],
};
