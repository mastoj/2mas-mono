import { NextRequest, NextResponse } from "next/server";

// Docs: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow

// Creates the login url for entra id app
const getLogoutUrl = (returnUrl: string) => {
  const tenantId = process.env.ENTRA_TENANT_ID;
  const state = { returnUrl };
  const base64State = Buffer.from(JSON.stringify(state)).toString("base64");
  const redirectUri = `${process.env.APP_DOMAIN}/logout/callback`;

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri${redirectUri}&state=${base64State}`;

  return url;
};

export async function GET(req: NextRequest) {
  const appDomain = process.env.APP_DOMAIN;
  const returnUrl =
    req.nextUrl.searchParams.get("returnUrl") || `${appDomain}/`;
  return NextResponse.redirect(getLogoutUrl(returnUrl));
}
