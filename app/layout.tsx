"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { Provider as RollbarProvider } from "@rollbar/react";
import { clientConfig } from "@/services/rollbar/rollbar";
import { usePathname } from "next/navigation";

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
    if (pathname.startsWith("/login"))
      return "bg-[url('/background.jpg')] bg-cover lg:bg-center md:bg-left";
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
          </ReactQueryProvider>
        </body>
      </html>
    </RollbarProvider>
  );
}
