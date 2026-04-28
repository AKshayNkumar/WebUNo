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
      <body className="text-crisp">
        {children}
        <AnnotationOverlay />
      </body>
    </html>
  );
}
