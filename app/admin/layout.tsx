import type { Metadata } from "next";
import AuthProvider from "@/components/admin/Auth";
import { tartan as c } from "@/lib/content";
import { firebaseConfigured } from "@/lib/firebase/admin";

const a = c.admin;

export const metadata: Metadata = {
  title: { default: a.meta.title, template: a.meta.template },
  robots: { index: false, follow: false },
};

// The admin has its own chrome (no site nav or footer), see components/admin/Shell.tsx
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="t-admin-app">
      {firebaseConfigured ? (
        <AuthProvider>{children}</AuthProvider>
      ) : (
        <div className="t-admin-splash">
          <div className="t-admin-card t-admin-center">
            <h1 className="t-admin-h1">{a.notConfigured.title}</h1>
            <p className="t-admin-sub">{a.notConfigured.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
