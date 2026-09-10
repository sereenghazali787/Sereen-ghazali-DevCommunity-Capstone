import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DevCommunity",
  description:
    "A developer community platform for learning, sharing, and discovering technical content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
  fallback={
    <div className="h-16 border-b border-border bg-background" />
  }
>
  <Navbar />
</Suspense>

        {children}
      </body>
    </html>
  );
}