import Link from "next/link";
import { tartan as c } from "@/lib/content";

export default function AdminNotFound() {
  return (
    <div className="t-admin-card t-admin-center">
      <h1 className="t-admin-h1">{c.admin.editor.notFound}</h1>
      <Link className="t-admin-btn" href="/admin">
        {c.admin.nav.dashboard}
      </Link>
    </div>
  );
}
