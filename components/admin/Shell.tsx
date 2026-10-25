"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/admin/Auth";
import { BookIcon, CloseIcon, ExternalIcon, HomeIcon, LogoutIcon, MenuIcon, PotIcon } from "@/components/admin/Icons";
import { tartan } from "@/lib/content";

const a = tartan.admin;

const links = [
  { href: "/admin", label: a.nav.dashboard, Icon: HomeIcon },
  { href: "/admin/products", label: a.nav.products, Icon: PotIcon },
  { href: "/admin/recipes", label: a.nav.recipes, Icon: BookIcon },
];

type Toast = { id: number; text: string; error?: boolean };
const ToastContext = createContext<(text: string, error?: boolean) => void>(() => {});

// Toasts live in the panel layout, so they survive the navigation after a save
export const useToast = () => useContext(ToastContext);

export default function Shell({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string, error?: boolean) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, error }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), error ? 8000 : 4000);
  }, []);

  useEffect(() => {
    if (auth.status === "out") router.replace("/admin/login");
  }, [auth.status, router]);

  // Close the phone drawer on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (auth.status !== "in") return <div className="t-admin-splash">{a.loading}</div>;

  if (!auth.isAdmin)
    return (
      <div className="t-admin-splash">
        <div className="t-admin-card t-admin-center">
          <h1 className="t-admin-h1">{a.notAllowed.title}</h1>
          <p className="t-admin-sub">{a.notAllowed.body}</p>
          <button className="t-admin-btn" type="button" onClick={auth.signOut}>
            {a.nav.signOut}
          </button>
        </div>
      </div>
    );

  const email = auth.user.email ?? "";

  return (
    <ToastContext.Provider value={toast}>
      <div className="t-admin-shell">
        <header className="t-admin-topbar">
          <button className="t-admin-iconbtn" type="button" onClick={() => setOpen(true)} aria-label={a.nav.menu} aria-expanded={open}>
            <MenuIcon />
          </button>
          <span className="t-display t-admin-logo">{a.brand}</span>
        </header>

        {open && <div className="t-admin-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

        <aside className={`t-admin-side${open ? " t-admin-side--open" : ""}`}>
          <div className="t-admin-side-head">
            <div>
              <span className="t-display t-admin-logo">{a.brand}</span>
              <small>{a.brandSub}</small>
            </div>
            <button className="t-admin-iconbtn t-admin-side-close" type="button" onClick={() => setOpen(false)} aria-label={a.nav.close}>
              <CloseIcon />
            </button>
          </div>
          <div className="t-tartan t-admin-stripe" aria-hidden="true" />

          <nav className="t-admin-nav" aria-label={a.nav.label}>
            {/* The current page is only known at runtime, so the highlight streams in */}
            <Suspense fallback={<NavLinks path="" onNavigate={() => setOpen(false)} />}>
              <CurrentNavLinks onNavigate={() => setOpen(false)} />
            </Suspense>
            <a href="/" target="_blank" rel="noopener">
              <ExternalIcon />
              {a.nav.site}
            </a>
          </nav>

          <div className="t-admin-user">
            <span className="t-admin-avatar" aria-hidden="true">
              {email.charAt(0).toUpperCase()}
            </span>
            <span className="t-admin-email" dir="ltr">
              {email}
            </span>
            <button className="t-admin-iconbtn" type="button" onClick={auth.signOut} aria-label={a.nav.signOut} title={a.nav.signOut}>
              <LogoutIcon />
            </button>
          </div>
        </aside>

        <main className="t-admin-main">{children}</main>

        <div className="t-admin-toasts" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`t-admin-toast${t.error ? " t-admin-toast--error" : ""}`}>
              {t.text}
              <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} aria-label={a.toast.close}>
                <CloseIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function NavLinks({ path, onNavigate }: { path: string; onNavigate: () => void }) {
  const isCurrent = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));
  return links.map(({ href, label, Icon }) => (
    <Link key={href} href={href} aria-current={isCurrent(href) ? "page" : undefined} onClick={onNavigate}>
      <Icon />
      {label}
    </Link>
  ));
}

function CurrentNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return <NavLinks path={usePathname()} onNavigate={onNavigate} />;
}
