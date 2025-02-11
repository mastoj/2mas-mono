import { exchangeCodeForTokens, setCookies } from "@repo/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect("/login");
  }
  const tokens = await exchangeCodeForTokens(code);
  const state = req.nextUrl.searchParams.get("state")!;
  const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  const response = NextResponse.redirect(stateValue.returnUrl);
  setCookies(tokens, response, req.nextUrl.origin);
  return response;
}
