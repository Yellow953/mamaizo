"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deleteItem } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/Auth";
import { useToast } from "@/components/admin/Shell";
import { tartan } from "@/lib/content";
import type { Kind } from "@/lib/types";

const a = tartan.admin;

export function PageHeader({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <header className="t-admin-pagehead">
      <div>
        <h1 className="t-admin-h1">{title}</h1>
        {body && <p className="t-admin-sub">{body}</p>}
      </div>
      {children && <div className="t-admin-pagehead-actions">{children}</div>}
    </header>
  );
}

// "Are you sure" before deleting. <dialog> handles Escape, the focus trap and returning focus.
export function ConfirmDelete({ name, busy, onConfirm, onCancel }: { name: string | null; busy: boolean; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (name && !dialog.current?.open) dialog.current?.showModal();
    if (!name && dialog.current?.open) dialog.current.close();
  }, [name]);

  return (
    <dialog ref={dialog} className="t-admin-dialog" onClose={onCancel} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <h2 className="t-admin-h2">{a.confirm.title.replace("{name}", name ?? "")}</h2>
      <p className="t-admin-sub">{a.confirm.body}</p>
      <div className="t-admin-dialog-actions">
        <button className="t-admin-btn t-admin-btn--danger" type="button" onClick={onConfirm} disabled={busy}>
          {a.confirm.yes}
        </button>
        <button className="t-admin-btn t-admin-btn--ghost" type="button" onClick={onCancel} disabled={busy} autoFocus>
          {a.confirm.no}
        </button>
      </div>
    </dialog>
  );
}

// Delete with confirmation, a toast, and fresh server data afterwards
export function useDelete(kind: Kind, after?: () => void) {
  const { getToken } = useAdmin();
  const toast = useToast();
  const router = useRouter();
  const [target, setTarget] = useState<{ slug: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!target) return;
    setBusy(true);
    const res = await deleteItem(await getToken(), kind, target.slug);
    setBusy(false);
    setTarget(null);
    toast(res.ok ? a.toast.deleted : a.errors.failed, !res.ok);
    if (res.ok) after?.();
    router.refresh();
  };

  const dialog = <ConfirmDelete name={target?.name ?? null} busy={busy} onConfirm={confirm} onCancel={() => setTarget(null)} />;
  return { ask: setTarget, dialog };
}
