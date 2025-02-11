import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "server-only";
import {
  accessCookieName,
  getEntraConfig,
  idCookieName,
  refreshCookieName,
} from "./config";
import { Auth, Tokens } from "./types";
import { getAuthData } from "./utils";

const getTokensFromCookies = (cookies: ReadonlyRequestCookies) => {
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const idToken = cookies.get("idToken");

  return {
    accessToken: accessToken?.value,
    refreshToken: refreshToken?.value,
    idToken: idToken?.value,
  };
};

export const auth = async (): Promise<Auth | null> => {
  const cookieJar = await cookies();
  const tokens = getTokensFromCookies(cookieJar);
  const isAuthenticated =
    tokens.accessToken && tokens.refreshToken && tokens.idToken;
  if (!isAuthenticated || !tokens.accessToken || !tokens.idToken) {
    return { isAuthenticated: false };
  }
  return getAuthData(tokens.accessToken, tokens.idToken);
};

export const isInRole = (auth: Auth, role: string) =>
  auth.isAuthenticated && auth.roles.includes(role);

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

const makeExchangeRequest = async (
  url: string,
  body: string
): Promise<Tokens> => {
  const contentType = "application/x-www-form-urlencoded";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body,
  });
  const jsonResp = await response.json();
  console.log("==> JSON Response:", jsonResp);
  return {
    accessToken: jsonResp["access_token"],
    refreshToken: jsonResp["refresh_token"],
    idToken: jsonResp["id_token"],
    expiresIn: jsonResp["expires_in"],
  };
};

export const exchangeCodeForTokens = async (code: string): Promise<Tokens> => {
  const { clientId, clientSecret, redirectUri, url, scopes } = getEntraConfig();
  const grantType = "authorization_code";
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&code=${code}&redirect_uri=${redirectUri}&grant_type=${grantType}&client_secret=${clientSecret}`;
  console.log("==> Body:", body);
  return await makeExchangeRequest(url, body);
};

export const updateTokens = async (refreshToken: string): Promise<Tokens> => {
  const { clientId, clientSecret, url, scopes } = getEntraConfig();
  const grantType = "refresh_token";
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);
  const urlEncodedSecret = encodeURIComponent(clientSecret);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&refresh_token=${refreshToken}&grant_type=${grantType}&client_secret=${urlEncodedSecret}`;

  return makeExchangeRequest(url, body);
};
