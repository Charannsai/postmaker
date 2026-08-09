import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 – Frame & Builder ID Generator",
  description:
    "Generate your official Hacker House Goa 2026 PFP frame overlay or Builder ID card. Upload your photo, customize your style, and share on X with #FrameInGoa.",
  keywords: [
    "Hacker House Goa",
    "HH Goa 2026",
    "PFP Frame",
    "Builder ID Card",
    "FrameInGoa",
    "profile picture maker",
  ],
  openGraph: {
    title: "HH Goa 2026 – Frame & Builder ID Generator",
    description:
      "Create your branded Hacker House Goa 2026 profile frame or builder badge. Share on X with #FrameInGoa!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 – Frame & Builder ID Generator",
    description:
      "Create your branded Hacker House Goa 2026 profile frame or builder badge!",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-900 text-foreground">
        {children}
      </body>
    </html>
  );
}
