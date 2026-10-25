import type { Metadata, Viewport } from "next";
import "./globals.css";
import { tartan as c } from "@/lib/content";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Runs before paint so animated elements start hidden instead of flashing (see components/Motion.tsx) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("t-motion")`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout applies to every page, so this rule is a false positive */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lalezar&family=Readex+Pro:wght@400;500;600;700&display=swap"
        />
      </head>
      {/* Browser extensions (e.g. ColorZilla) add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
