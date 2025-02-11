import { updateTokens } from "@repo/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const refreshToken = body.refreshToken;
  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token provided" },
      { status: 400 }
    );
  }
  const tokens = await updateTokens(refreshToken);
  return NextResponse.json(tokens);
}
