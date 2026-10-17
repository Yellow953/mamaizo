import Nav from "@/components/design2/Nav";
import { INSTAGRAM_URL, TIKTOK_URL, tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

export default function Design2Layout({ children }: LayoutProps<"/design2">) {
  return (
    <div className="t-page" lang="ar" dir="rtl">
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
  );
}
