/* eslint-disable @next/next/no-html-link-for-pages */
// import { LoginLink } from "@repo/ui";
import { AuthProvider } from "@repo/auth/client/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserInfo } from "./user-info";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-blue-700">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
              <h1>DEMO 2</h1>

              {/* <a
              href={`/login?returnUrl=${appDomain}/demo2`}
              className="px-4 py-2 bg-green-400"
            >
              Login
            </a> */}
              <a href="/" className="px-4 py-2 bg-green-400 text-black">
                Go to home
              </a>
              <a href="/demo2" className="px-4 py-2 bg-green-400 text-black">
                Go to demo2
              </a>
              <div className="p-8 bg-teal-400 rounded">{children}</div>
              <UserInfo />
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
