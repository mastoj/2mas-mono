import { NextResponse } from "next/server";

// Creates the login url for entra id app
const getLoginUrl = (redirect: string) => {
  const clientId = process.env.CLIENT_ID;
  const domain = process.env.AUTH_DOMAIN;
  const responseType = "code";
  const scope = "openid profile email";
  const state = "1234567890";
  const nonce = "0987654321";
  const url = `${domain}/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&state=${state}&nonce=${nonce}&redirect_uri=${redirect}`;
  return url;
};

export async function GET() {
  const redirect = `${process.env.BASE_URL}/auth`;
  return NextResponse.redirect(`${process.env.AUTH_DOMAIN}/logout`);
}
