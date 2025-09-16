"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { Provider as RollbarProvider } from "@rollbar/react";
import { clientConfig } from "@/services/rollbar/rollbar";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  // Dynamic background logic
  const backgroundClass = (() => {
    if (pathname.endsWith("/login"))
      return "bg-[url('/zebra-background.jpg')] bg-cover lg:bg-center";
    return "bg-white";
  })();
  return (
    <RollbarProvider config={clientConfig}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${backgroundClass}`}
        >
          <ReactQueryProvider>
            <main>{children}</main>
            <Analytics />
          </ReactQueryProvider>
        </body>
      </html>
    </RollbarProvider>
  );
}
