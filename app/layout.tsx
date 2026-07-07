import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "DreamWorks Direct - Premium Tech & Gadgets",
  description: "Shop the best electronics, computing accessories, and smart gadgets at DreamWorks Direct. 22 years of trusted tech retail in Nigeria.",
  metadataBase: new URL("https://dreamworks-alpha.vercel.app"),
  openGraph: {
    title: "DreamWorks Direct - Premium Tech & Gadgets",
    description: "Shop the best electronics, computing accessories, and smart gadgets at DreamWorks Direct.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external domains for faster image loading */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://lzlqbhxwfcnkptqphmms.supabase.co" />
        <link rel="dns-prefetch" href="https://lzlqbhxwfcnkptqphmms.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
