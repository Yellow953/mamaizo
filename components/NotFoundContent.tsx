import Link from "next/link";
import { tartan as c } from "@/lib/content";

export default function NotFoundContent() {
  return (
    <main className="t-page-head t-404">
      <h1 className="t-display t-h1 t-h1--page">{c.notFound.title}</h1>
      <p className="t-lead">{c.notFound.body}</p>
      <div className="t-actions">
        <Link className="t-btn t-btn--red" href="/shop">
          {c.notFound.cta}
        </Link>
      </div>
    </main>
  );
}
