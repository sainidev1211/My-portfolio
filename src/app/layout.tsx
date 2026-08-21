import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Dev Saini — Full Stack Developer & AI Engineer",
  description: "Portfolio of Dev Saini — CS (AIML) student at Chandigarh University building full-stack web apps and AI systems.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollProgress />
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
