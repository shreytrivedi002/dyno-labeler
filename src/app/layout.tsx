import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { NavBar } from "@/components/NavBar";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jewellery Price Label",
  description: "Real-time price labels for jewellery shops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <NavBar />
          <main className="max-w-5xl mx-auto px-4 py-6 pb-24 sm:pb-6">
            <div className="grid gap-6">{children}</div>
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
