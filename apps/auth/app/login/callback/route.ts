import { getEntraConfig } from "@repo/auth/config";
import { setCookies } from "@repo/auth/cookies";
import { getPublicClientApplication, getTokens } from "@repo/auth/msal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(
    "==> Logging in callback: ",
    req.nextUrl.searchParams.get("code")
  );
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${process.env.APP_DOMAIN}/auth/login`);
  }
  const pca = getPublicClientApplication(getEntraConfig());
  const state = req.nextUrl.searchParams.get("state")!;
  const tokens = await getTokens(pca, getEntraConfig(), code, state);
  if (!tokens) {
    return NextResponse.redirect(`${process.env.APP_DOMAIN}/auth/login`);
  }
  // // const tokens = await exchangeCodeForTokens(code);
  const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  const response = NextResponse.redirect(stateValue.returnUrl);
  console.log("==> Logging in callback: ", tokens);
  setCookies(tokens, response, req.nextUrl.origin);
  return response;
}
