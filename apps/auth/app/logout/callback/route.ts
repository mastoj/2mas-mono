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
  const redirectUri = `${process.env.APP_DOMAIN}/auth`;
  const clientSecret = process.env.ENTRA_CLIENT_SECRET;

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
  const state = req.nextUrl.searchParams.get("state")!;
  console.log("==> Logging out callback: ", state);

  const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  console.log("==> State:", stateValue);
  const response = NextResponse.redirect(stateValue.returnUrl);
  const domain =
    req.nextUrl.origin.indexOf("localhost") > -1 ? undefined : "2mas.xyz";
  response.cookies.set("access_token", "", {
    httpOnly: true,
    maxAge: -1,
    domain,
  });
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    maxAge: -1,
    domain,
  });
  response.cookies.set("id_token", "", {
    httpOnly: true,
    maxAge: -1,
    domain,
  });

  return response;
}
