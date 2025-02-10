import { NextRequest, NextResponse } from "next/server";

// Docs: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow

// Creates the login url for entra id app
const getLoginUrl = (returnUrl: string) => {
  const tenantId = process.env.ENTRA_TENANT_ID;
  const clientId = process.env.ENTRA_CLIENT_ID;
  const state = { returnUrl };
  const base64State = Buffer.from(JSON.stringify(state)).toString("base64");
  const redirectUri = `${process.env.APP_DOMAIN}/auth`;
  const scope = [
    "https://graph.microsoft.com/mail.read",
    "openid",
    "profile",
    "offline_access",
  ].join(" ");
  const urlEncodedScope = encodeURIComponent(scope);
  //   https://login.microsoftonline.com/053ac3d7-7efe-4c7a-95eb-b97b59e68b82/oauth2/v2.0/authorize?
  // client_id=4b91ee5e-9b04-4a85-a61b-6be414083c1b
  // &response_type=code
  // &redirect_uri=http%3A%2F%2Flocalhost:3000%2Fauth
  // &response_mode=query
  // &scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
  // &state=http://localhost:3000/

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${urlEncodedScope}&state=${base64State}`;

  return url;
};

export async function GET(req: NextRequest) {
  const appDomain = process.env.APP_DOMAIN;
  const returnUrl =
    req.nextUrl.searchParams.get("returnUrl") || `${appDomain}/`;
  return NextResponse.redirect(getLoginUrl(returnUrl));
}
