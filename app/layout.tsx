import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://youthclubofmirzapur.vercel.app"), // Placeholder domain, you can adapt this
  title: {
    default: "Youth Club of Mirzapur",
    template: "%s | Youth Club of Mirzapur",
  },
  description:
    "Youth Club of Mirzapur is a community platform for our village.",
  keywords: [
    "Mirzapur",
    "Youth Club",
    "Community",
    "Village",
    "Events",
    "Treasury",
  ],
  authors: [{ name: "Youth Club of Mirzapur" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://youthclubofmirzapur.vercel.app",
    title: "Youth Club of Mirzapur - Community Platform",
    description:
      "Join the Youth Club of Mirzapur! A community platform for our village to organize events and do many staffs.",
    siteName: "Youth Club of Mirzapur",
    images: [
      {
        url: "/logo-y.png",
        width: 1200,
        height: 630,
        alt: "Youth Club of Mirzapur Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Club of Mirzapur",
    description: "A community platform for our village.",
    images: ["/logo-y.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "icon.png",
    shortcut: "icon.png",
    apple: "icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
