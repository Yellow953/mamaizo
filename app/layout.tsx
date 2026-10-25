import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { INSTAGRAM_URL, TIKTOK_URL, tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

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
    <html lang="ar" dir="rtl">
      <head>
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
        <div className="t-page">
          <div className="t-tartan t-edge" aria-hidden="true" />
          <Nav />
          {children}
          <footer className="t-footer">
            <span className="t-display t-footer-logo">{c.name}</span>
            <div className="t-footer-links" dir="ltr">
              <a href={INSTAGRAM_URL} {...external}>
                {c.footer.instagram}
              </a>
              <a href={TIKTOK_URL} {...external}>
                {c.footer.tiktok}
              </a>
              <a href={waLink()} {...external}>
                {c.footer.whatsapp}
              </a>
            </div>
          </footer>
          <div className="t-tartan t-edge" aria-hidden="true" />
        </div>
      </body>
    </html>
  );
}
