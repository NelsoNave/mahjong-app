import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";

import { Montserrat } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ["300", "500", "700"],
  variable: '--font-montserrat',
})

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-notoSansJp',
})

export const metadata: Metadata = {
  title: "Mahjong-app",
  description: "Record the result of Mahjong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <SessionProvider>
        <body className={`${montserrat.variable} ${notoSansJp.variable} font-sans flex justify-center antialiased`}>
          <main className="flex h-screen w-full max-w-md flex-col justify-between bg-background">
            {children}
          </main>
        </body>
      </SessionProvider>
    </html>
  );
}
