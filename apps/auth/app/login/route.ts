import { getEntraConfig } from "@repo/auth/config";
import { setPkceVerifierCookie, setReturnUrlCookie } from "@repo/auth/cookies";
import { getAuthCodeUrl, getPublicClientApplication } from "@repo/auth/msal";
import { NextRequest, NextResponse } from "next/server";

// Docs: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow

// Creates the login url for entra id app
const getLoginUrl = (returnUrl: string) => {
  const { tenantId, clientId, redirectUri, scopes } = getEntraConfig();
  const state = { returnUrl };
  const base64State = Buffer.from(JSON.stringify(state)).toString("base64");
  const scope = scopes.join(" ");
  const urlEncodedScope = encodeURIComponent(scope);

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${urlEncodedScope}&state=${base64State}`;

  return url;
};

export async function GET(req: NextRequest) {
  const appDomain = process.env.APP_DOMAIN;
  const returnUrl =
    req.nextUrl.searchParams.get("returnUrl") || `${appDomain}/`;

  const config = getEntraConfig();
  const { authCodeUrl, pkceVerifier } = await getAuthCodeUrl(
    getPublicClientApplication(config),
    config
  );
  console.log("==> Logging in: ", authCodeUrl);
  const response = NextResponse.redirect(authCodeUrl);
  setPkceVerifierCookie(response, pkceVerifier, req.nextUrl.origin);
  setReturnUrlCookie(response, returnUrl, req.nextUrl.origin);
  return response;
}
