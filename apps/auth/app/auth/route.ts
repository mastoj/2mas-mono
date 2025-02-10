import { NextRequest, NextResponse } from "next/server";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
};

const getTokens = async (code: string): Promise<AuthResponse> => {
  const tenantId = process.env.ENTRA_TENANT_ID;
  const clientId = process.env.ENTRA_CLIENT_ID;
  const redirectUri = `${process.env.AUTH_DOMAIN}/auth`;
  const clientSecret = process.env.ENTRA_CLIENT_SECRET;

  // POST /{tenant}/oauth2/v2.0/token HTTP/1.1
  // Host: https://login.microsoftonline.com
  // Content-Type: application/x-www-form-urlencoded

  // client_id=11112222-bbbb-3333-cccc-4444dddd5555
  // &scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
  // &code=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
  // &redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
  // &grant_type=authorization_code
  // &code_verifier=ThisIsntRandomButItNeedsToBe43CharactersLong
  // &client_secret=sampleCredentia1s

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const contentType = "application/x-www-form-urlencoded";
  const grantType = "authorization_code";
  const scope = [
    "https://graph.microsoft.com/mail.read",
    "openid",
    "profile",
    "offline_access",
  ].join(" ");
  const urlEncodedScope = encodeURIComponent(scope);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&code=${code}&redirect_uri=${redirectUri}&grant_type=${grantType}&client_secret=${clientSecret}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body,
  });
  const jsonResp = await response.json();
  console.log("==> Tokens:", jsonResp);
  return {
    accessToken: jsonResp["access_token"],
    refreshToken: jsonResp["refresh_token"],
    idToken: jsonResp["id_token"],
    expiresIn: jsonResp["expires_in"],
  };
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  console.log("==> Code:", code);
  if (!code) {
    return NextResponse.redirect("/login");
  }
  const tokens = await getTokens(code);

  const state = req.nextUrl.searchParams.get("state")!;
  const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  console.log("==> State:", stateValue);
  const response = NextResponse.redirect(stateValue.returnUrl);
  response.cookies.set("access_token", tokens.accessToken, {
    httpOnly: true,
    maxAge: tokens.expiresIn,
  });
  response.cookies.set("refresh_token", tokens.refreshToken, {
    httpOnly: true,
  });
  response.cookies.set("id_token", tokens.idToken, {
    httpOnly: true,
  });

  return response;
}
