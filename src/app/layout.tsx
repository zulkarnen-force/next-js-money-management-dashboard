// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-switcher";

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monee - Smart Money Management Dashboard",
  description: "Monee helps you take control of your finances with powerful tools for expense tracking, budgeting, savings goals, and insightful analytics. Secure, easy-to-use, and designed to help you grow your wealth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <link rel="icon" href="/monee-icon-nobg.png" />
        <SessionWrapper>
          <WalletProvider>{children}</WalletProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
