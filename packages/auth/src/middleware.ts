import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { setCookies } from "./server";

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

    return tokens as {
      accessToken: string;
      refreshToken: string;
      idToken: string;
      expiresIn: number;
    };
  }
  return null;
};

export const withAuth =
  (middleware: Middleware) => async (request: NextRequest) => {
    const response = await middleware(request);
    const tokens = await refreshTokenMiddleware(request);
    if (tokens) {
      setCookies(tokens, response, request.nextUrl.origin);
    }
    return response;
  };
