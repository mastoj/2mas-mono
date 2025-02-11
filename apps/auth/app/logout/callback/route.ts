import { clearCookies } from "@repo/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state")!;
  console.log("==> Logging out callback: ", state);

  const stateValue = JSON.parse(Buffer.from(state, "base64").toString());
  console.log("==> State:", stateValue);
  const response = NextResponse.redirect(stateValue.returnUrl);
  clearCookies(response, req.nextUrl.origin);

  return response;
}
