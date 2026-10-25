"use client";

import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/admin/Auth";
import { tartan } from "@/lib/content";
import { clientAuth } from "@/lib/firebase/client";

const a = tartan.admin;
const l = a.login;

export default function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const email = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Already signed in as admin: straight to the dashboard
  useEffect(() => {
    if (auth.status === "in" && auth.isAdmin) router.replace("/admin");
  }, [auth, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(clientAuth(), String(data.get("email")), String(data.get("password")));
    } catch (err) {
      const tooMany = err instanceof FirebaseError && err.code === "auth/too-many-requests";
      setMessage({ text: tooMany ? l.tooMany : l.error, error: true });
      setBusy(false);
    }
  };

  const forgot = async () => {
    const value = email.current?.value.trim();
    if (!value) {
      setMessage({ text: l.forgotNeedsEmail, error: true });
      email.current?.focus();
      return;
    }
    // Same answer whether or not the account exists
    await sendPasswordResetEmail(clientAuth(), value).catch(() => {});
    setMessage({ text: l.resetSent });
  };

  const signedInNotAdmin = auth.status === "in" && !auth.isAdmin;

  return (
    <div className="t-admin-login">
      <div className="t-tartan t-admin-login-art" aria-hidden="true">
        <span className="t-display">{a.brand}</span>
      </div>

      <div className="t-admin-login-panel">
        <div className="t-admin-login-box">
          <span className="t-display t-admin-logo">{a.brand}</span>
          <h1 className="t-admin-h1">{l.title}</h1>
          <p className="t-admin-sub">{l.body}</p>

          {signedInNotAdmin ? (
            <div className="t-admin-alert t-admin-alert--error">
              <p>{a.notAllowed.body}</p>
              <button className="t-admin-btn t-admin-btn--ghost" type="button" onClick={auth.signOut}>
                {a.nav.signOut}
              </button>
            </div>
          ) : (
            <form className="t-admin-stack" onSubmit={onSubmit}>
              <label className="t-admin-field">
                <span>{l.email}</span>
                <input ref={email} className="t-admin-input" name="email" type="email" required autoComplete="username" dir="ltr" />
              </label>
              <label className="t-admin-field">
                <span>{l.password}</span>
                <span className="t-admin-input-wrap">
                  <input
                    className="t-admin-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    dir="ltr"
                  />
                  <button className="t-admin-input-btn" type="button" onClick={() => setShowPassword((s) => !s)} aria-pressed={showPassword}>
                    {showPassword ? l.hide : l.show}
                  </button>
                </span>
              </label>

              {message && (
                <p className={`t-admin-alert${message.error ? " t-admin-alert--error" : ""}`} role="alert">
                  {message.text}
                </p>
              )}

              <button className="t-admin-btn t-admin-btn--block" type="submit" disabled={busy || auth.status === "loading"}>
                {busy ? l.busy : l.submit}
              </button>
              <button className="t-admin-textbtn" type="button" onClick={forgot}>
                {l.forgot}
              </button>
            </form>
          )}

          <Link className="t-admin-textbtn t-admin-back" href="/">
            {l.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
