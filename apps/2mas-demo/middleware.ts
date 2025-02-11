import { withAuth } from "@repo/auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = withAuth(async (request: NextRequest) => {
  return NextResponse.next();
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|sw.js|2mas-demo-static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
