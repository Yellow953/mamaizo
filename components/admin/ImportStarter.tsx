"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { importStarter } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/Auth";
import { useToast } from "@/components/admin/Shell";
import { tartan } from "@/lib/content";

const a = tartan.admin;

// Copies the starter content in lib/seed.ts into empty Firestore collections
export default function ImportStarter() {
  const { getToken } = useAdmin();
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    const res = await importStarter(await getToken());
    setBusy(false);
    toast(res.ok ? a.toast.imported : a.errors.failed, !res.ok);
    router.refresh();
  };

  return (
    <button className="t-admin-btn" type="button" onClick={run} disabled={busy}>
      {busy ? a.loading : a.dashboard.importCta}
    </button>
  );
}
