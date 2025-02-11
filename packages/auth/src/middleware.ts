import { NextRequest, NextResponse } from "next/server";

export type Middleware = (
  request: NextRequest
) => Promise<NextResponse<unknown>>;

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

export const withAuth =
  (middleware: Middleware) => async (request: NextRequest) => {
    const response = await middleware(request);
    const tokens = await refreshTokenMiddleware(request);
    if (tokens) {
      const domain =
        request.nextUrl.origin.indexOf("localhost") > -1
          ? undefined
          : "2mas.xyz";
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
    }
    return response;
  };
