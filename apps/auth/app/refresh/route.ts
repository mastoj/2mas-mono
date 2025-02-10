import { NextRequest, NextResponse } from "next/server";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
};

const getTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const tenantId = process.env.ENTRA_TENANT_ID;
  const clientId = process.env.ENTRA_CLIENT_ID;
  const clientSecret = process.env.ENTRA_CLIENT_SECRET;
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const contentType = "application/x-www-form-urlencoded";
  const grantType = "refresh_token";
  const scope = [
    "https://graph.microsoft.com/mail.read",
    "openid",
    "profile",
    "offline_access",
  ].join(" ");
  const urlEncodedScope = encodeURIComponent(scope);

  const body = `client_id=${clientId}&scope=${urlEncodedScope}&refresh_token=${refreshToken}&grant_type=${grantType}&client_secret=${clientSecret}`;

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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const refreshToken = body.refreshToken;
  if (!refreshToken) {
    return NextResponse.redirect("/login");
  }
  const tokens = await getTokens(refreshToken.value);
  return NextResponse.json(tokens);
}
