"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

const links = [
  { href: "/design2", label: c.nav.home },
  { href: "/design2/shop", label: c.nav.shop },
  { href: "/design2#recipes", label: c.nav.recipes },
  { href: "/design2#team", label: c.nav.team },
  { href: "/design2/contact", label: c.nav.contact },
];

export default function Nav() {
  const path = usePathname();
  // Shop stays highlighted on product pages too
  const isCurrent = (href: string) =>
    href === "/design2" ? path === href : !href.includes("#") && path.startsWith(href);

  return (
    <nav className="t-nav">
      <Link className="t-logo" href="/design2">
        {c.name}
      </Link>
      <div className="t-nav-links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
        <a className="t-btn t-btn--ink" href={waLink(c.session.message)} {...external}>
          {c.nav.session}
        </a>
      </div>
    </nav>
  );
}
