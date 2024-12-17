import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/session-wrapper";
import ThemeProvider from "@/components/theme-provider";
import TerminalProvider from "@/components/terminal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Git Fit",
  description: "Workout Tracker for Programmers",
  icons: {
    icon: "/favicon.ico", // Default favicon
    apple: "/apple-touch-icon.png", // iOS icon
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TerminalProvider>{children}</TerminalProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
