import type { Metadata } from "next";
import "./globals.css";
import { AnnotationOverlay } from "@/components/features/AnnotationOverlay";

export const metadata: Metadata = {
  title: "ElderBridge — Your Digital Companion",
  description: "A senior-friendly digital companion for medicine reminders, bill alerts, voice control, and everyday tasks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="text-crisp">
        {children}
        <AnnotationOverlay />
      </body>
    </html>
  );
}
