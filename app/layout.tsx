import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Background Remover - Remove Image Backgrounds Online",
  description: "Free online tool to remove backgrounds from images automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </head>
        <body className="antialiased bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
          <I18nProvider>
            {children}
          </I18nProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
