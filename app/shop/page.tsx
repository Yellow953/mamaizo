import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: c.shop.meta.title,
  description: c.shop.meta.description,
};

export default function Shop() {
  return (
    <main>
      <header className="t-page-head">
        <p className="t-badge">{c.shop.kicker}</p>
        <h1 className="t-display t-h1 t-h1--page">{c.shop.title}</h1>
        <p className="t-lead">{c.shop.body}</p>
      </header>

      <section className="t-section t-section--flush">
        <div className="t-grid">
          {c.products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="t-tartan t-session">
        <div className="t-session-inner">
          <div>
            <h2 className="t-display t-h2">{c.shop.help.title}</h2>
            <p className="t-lead">{c.shop.help.body}</p>
          </div>
          <a className="t-btn t-btn--red t-btn--big" href={waLink(c.session.message)} {...external}>
            {c.shop.help.cta}
          </a>
        </div>
      </section>
    </main>
  );
}
