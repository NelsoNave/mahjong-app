import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <SessionProvider>
        <body className="flex justify-center antialiased">
          <div className="flex h-screen w-full max-w-md flex-col justify-between bg-background">
            {children}
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
