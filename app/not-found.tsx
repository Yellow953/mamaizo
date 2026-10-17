import Link from "next/link";
import { notFound as c } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>{c.title}</h1>
      <p>{c.body}</p>
      <Link href="/">{c.home}</Link>
    </main>
  );
}
