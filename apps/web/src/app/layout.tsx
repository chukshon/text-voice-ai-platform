import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { TOAST_OPTIONS } from "@/config/toastOptions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Text to Voice AI Platform",
  description: "Generate realistic voice from text with Ai powered text to voice platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProviders>
          <NextTopLoader color="#40475C" speed={600} />
          <Toaster position="top-right" toastOptions={TOAST_OPTIONS} />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
