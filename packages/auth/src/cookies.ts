import { NextResponse } from "next/server";
import { accessCookieName, idCookieName, refreshCookieName } from "./config";
import { Tokens } from "./types";

export const setCookies = (
  tokens: Tokens,
  response: NextResponse,
  origin: string
) => {
  const domain = origin.indexOf("localhost") > -1 ? undefined : "2mas.xyz";
  response.cookies.set(accessCookieName, tokens.accessToken, {
    maxAge: tokens.expiresIn,
    domain,
  });
  response.cookies.set(refreshCookieName, tokens.refreshToken, {
    httpOnly: true,
    domain,
  });
  response.cookies.set(idCookieName, tokens.idToken, {
    domain,
  });
};

export const clearCookies = (response: NextResponse, origin: string) => {
  const domain = origin.indexOf("localhost") > -1 ? undefined : "2mas.xyz";
  response.cookies.set(accessCookieName, "", {
    maxAge: -1,
    domain,
  });
  response.cookies.set(refreshCookieName, "", {
    httpOnly: true,
    maxAge: -1,
    domain,
  });
  response.cookies.set(idCookieName, "", {
    domain,
    maxAge: -1,
  });
};
