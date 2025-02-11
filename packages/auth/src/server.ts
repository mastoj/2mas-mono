import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "server-only";
import { getEntraConfig } from "./config";
import { Auth, Tokens } from "./types";

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

const decodeJwtAccessToken = (accessToken: string) => {
  const base64Url = accessToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export const auth = async (): Promise<Auth | null> => {
  const cookieJar = await cookies();
  const tokens = getTokensFromCookies(cookieJar);
  const isAuthenticated =
    tokens.accessToken && tokens.refreshToken && tokens.idToken;
  if (!isAuthenticated) {
    return { isAuthenticated: false };
  }
  const accessJwt = tokens.accessToken
    ? decodeJwtAccessToken(tokens.accessToken)
    : null;
  const idJwt = tokens.idToken ? decodeJwtAccessToken(tokens.idToken) : null;
  const name = accessJwt?.name || idJwt?.name || "Unknown";
  const username = accessJwt?.preferred_username || idJwt?.preferred_username;
  const roles = accessJwt?.roles || idJwt?.roles || [];
  return {
    accessToken: tokens.accessToken,
    isAuthenticated: true,
    name,
    username,
    roles,
  };
};

export const isInRole = (auth: Auth, role: string) =>
  auth.isAuthenticated && auth.roles.includes(role);

export const setCookies = (
  tokens: Tokens,
  response: NextResponse,
  origin: string
) => {
  const domain = origin.indexOf("localhost") > -1 ? undefined : "2mas.xyz";
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
};

export const makeExchangeRequest = async (
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
  return makeExchangeRequest(url, body);
};

export const updateTokens = async (refreshToken: string): Promise<Tokens> => {
  const { clientId, clientSecret, redirectUri, url, scopes } = getEntraConfig();
  const grantType = "refresh_token";
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);
  const urlEncodedSecret = encodeURIComponent(clientSecret);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&refresh_token=${refreshToken}&grant_type=${grantType}&client_secret=${urlEncodedSecret}`;

  return makeExchangeRequest(url, body);
};
