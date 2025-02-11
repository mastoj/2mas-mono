import { NextRequest, NextResponse } from "next/server";
import { getEntraConfig } from "../../../../packages/auth/src/config";

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
  return NextResponse.redirect(getLoginUrl(returnUrl));
}
