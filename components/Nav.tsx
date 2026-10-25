"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

const links = [
  { href: "/", label: c.nav.home },
  { href: "/shop", label: c.nav.shop },
  { href: "/#recipes", label: c.nav.recipes },
  { href: "/#team", label: c.nav.team },
  { href: "/contact", label: c.nav.contact },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // Shop stays highlighted on product pages too
  const isCurrent = (href: string) =>
    href === "/" ? path === href : !href.includes("#") && path.startsWith(href);

  // Close the phone menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className="t-nav">
      <Link className="t-logo" href="/" onClick={close}>
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

      <button
        className="t-menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="t-menu"
        onClick={() => setOpen(!open)}
      >
        <span>{open ? c.nav.close : c.nav.menu}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="t-menu" id="t-menu">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  className="t-display"
                  href={l.href}
                  aria-current={isCurrent(l.href) ? "page" : undefined}
                  onClick={close}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="t-btn t-btn--red t-btn--big" href={waLink(c.session.message)} {...external} onClick={close}>
            {c.nav.session}
          </a>
        </div>
      )}
    </nav>
  );
}
