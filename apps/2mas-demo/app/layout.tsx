/* eslint-disable @next/next/no-html-link-for-pages */
import { LoginLink } from "@repo/ui/login-link";
import { LogoutLink } from "@repo/ui/logout-link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const decodeJwtAccessToken = (accessToken: string) => {
  const base64Url = accessToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const UserInfo = async () => {
  const cookieJar = await cookies();
  const accessToken = cookieJar.get("access_token");

  if (!accessToken) {
    return <p>Not logged in</p>;
  }

  const jwt = decodeJwtAccessToken(accessToken.value);
  const jwtIdToken = decodeJwtAccessToken(cookieJar.get("id_token")!.value);

  return (
    <div className="flex flex-col gap-4">
      <div>Access token: {accessToken.value}</div>
      <div>Access token jwt: {JSON.stringify(jwt, null, 2)}</div>
      <div>Id token jwt: {JSON.stringify(jwtIdToken, null, 2)}</div>
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appDomain = process.env.APP_DOMAIN!;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h1>DEMO 1</h1>
            <LoginLink appDomain={appDomain} />
            <LogoutLink appDomain={appDomain} />
            {/* <a
              href={`/login?returnUrl=${appDomain}/`}
              className="px-4 py-2 bg-green-400"
            >
              Login
            </a> */}
            <a href="/" className="px-4 py-2 bg-green-400">
              Go to home
            </a>
            <a href="/demo2" className="px-4 py-2 bg-green-400">
              Go to demo2
            </a>

            <UserInfo />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
