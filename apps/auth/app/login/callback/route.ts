import { getEntraConfig } from "@repo/auth/config";
import {
  getPkceCookie,
  getReturnUrlCookie,
  setCookies,
} from "@repo/auth/cookies";
import { getPublicClientApplication } from "@repo/auth/msal";
import { Tokens } from "@repo/auth/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const entraConfig = getEntraConfig();
  const searchParams = req.nextUrl.searchParams;
  const cookies = req.cookies;
  const code = searchParams.get("code");
  const pkceVerifierCookie = getPkceCookie(cookies);
  const returnUrlCookie = getReturnUrlCookie(cookies);
  const pca = getPublicClientApplication(entraConfig);

  if (!pkceVerifierCookie) {
    return NextResponse.json(
      { error: "No PKCE verifier cookie found" },
      { status: 400 }
    );
  }

  const tokenRequest = {
    code: code as string,
    scopes: entraConfig.scopes,
    redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
    codeVerifier: pkceVerifierCookie,
  };

  try {
    console.log("==> Logging in callback: ", tokenRequest);
    const tokenResponse = await pca.acquireTokenByCode(tokenRequest);
    // const tokenCache = pca.getTokenCache();
    // const account = (await tokenCache.getAllAccounts())[0];
    const tokens: Tokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: "",
      idToken: tokenResponse.idToken,
      expiresIn: tokenResponse.expiresOn?.getTime(),
    };
    const response = NextResponse.redirect(
      returnUrlCookie || process.env.APP_DOMAIN!
    );
    setCookies(tokens, response, req.nextUrl.origin);
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // console.log(
  //   "==> Logging in callback: ",
  //   req.nextUrl.searchParams.get("code")
  // );
  // // const code = req.nextUrl.searchParams.get("code");
  // // if (!code) {
  // //   return NextResponse.redirect(`${process.env.APP_DOMAIN}/auth/login`);
  // // }
  // // const pca = getPublicClientApplication(getEntraConfig());
  // const state = req.nextUrl.searchParams.get("state")!;
  // const tokens = await getTokens(pca, getEntraConfig(), code, state);
  // if (!tokens) {
  //   return NextResponse.redirect(`${process.env.APP_DOMAIN}/auth/login`);
  // }
  // // // const tokens = await exchangeCodeForTokens(code);
  // const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  // const response = NextResponse.redirect(stateValue.returnUrl);
  // console.log("==> Logging in callback: ", tokens);
  // setCookies(tokens, response, req.nextUrl.origin);
  // return response;
}
