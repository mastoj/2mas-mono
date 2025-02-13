import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import "server-only";
import { getEntraConfig } from "./config";
import { getClientSecret } from "./entra-id";
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
  const config = getEntraConfig();
  const { clientId, redirectUri, url, scopes } = config;
  const grantType = "authorization_code";
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);
  const clientSecret = await getClientSecret(config);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&code=${code}&redirect_uri=${redirectUri}&grant_type=${grantType}&client_secret=${clientSecret}`;
  console.log("==> Body:", body);
  return await makeExchangeRequest(url, body);
};

export const updateTokens = async (refreshToken: string): Promise<Tokens> => {
  const config = getEntraConfig();
  const { clientId, url, scopes } = config;
  const clientSecret = await getClientSecret(config);

  const grantType = "refresh_token";
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);
  const urlEncodedSecret = encodeURIComponent(clientSecret);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&refresh_token=${refreshToken}&grant_type=${grantType}&client_secret=${urlEncodedSecret}`;

  return makeExchangeRequest(url, body);
};
