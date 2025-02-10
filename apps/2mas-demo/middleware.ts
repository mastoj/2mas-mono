import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const refreshTokenMiddleware = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refresh_token");
  const access_token = req.cookies.get("access_token");
  if (!access_token && refreshToken) {
    const response = await fetch(`${process.env.AUTH_DOMAIN}/refresh`, {
      body: JSON.stringify({ refreshToken: refreshToken.value }),
      method: "POST",
    });
    const tokens = await response.json();
    console.log("==> Tokens:", tokens.accessToken, req.nextUrl.pathname);

    return tokens;
  }
  return null;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const tokens = await refreshTokenMiddleware(request);
  const response = NextResponse.next();
  const domain =
    request.nextUrl.origin.indexOf("localhost") > -1 ? undefined : "2mas.xyz";
  response.cookies.set("access_token", tokens.accessToken, {
    httpOnly: true,
    maxAge: tokens.expiresIn,
    domain,
  });
  response.cookies.set("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    domain,
  });
  response.cookies.set("id_token", tokens.idToken, {
    httpOnly: true,
    domain,
  });
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|sw.js|2mas-demo-static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
