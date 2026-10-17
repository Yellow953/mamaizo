import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductCard from "@/components/design2/ProductCard";
import { tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

const find = (slug: string) => c.products.find((p) => p.slug === slug);

type Params = PageProps<"/design2/shop/[slug]">["params"];

export function generateStaticParams() {
  return c.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/design2/shop/[slug]">): Promise<Metadata> {
  const p = find((await props.params).slug);
  return p ? { title: `${p.name} · ${c.name}`, description: p.text } : {};
}

export default function Product(props: PageProps<"/design2/shop/[slug]">) {
  return (
    <main>
      <div className="t-crumb">
        <Link href="/design2/shop">{c.product.back}</Link>
      </div>
      {/* Reading params inside Suspense keeps navigation to the page instant */}
      <Suspense fallback={<div className="t-pdp-fallback" />}>
        <ProductDetail params={props.params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const p = find((await params).slug);
  if (!p) notFound();
  const related = c.products.filter((r) => r.slug !== p.slug);

  return (
    <>
      <article className="t-pdp">
        <div className="t-pdp-media">
          <div className="t-tartan t-frame t-frame--flat">
            <div className="t-photo t-photo--portrait">
              <Image src={p.photo} alt={p.alt} fill priority sizes="(max-width: 700px) 90vw, 45vw" />
            </div>
          </div>
        </div>

        <div className="t-pdp-info">
          <p className="t-badge">{p.category}</p>
          <h1 className="t-display t-h1 t-h1--page">{p.name}</h1>
          <p className="t-lead">{p.description}</p>

          <h2 className="t-pdp-label">{c.product.cooks}</h2>
          <ul className="t-tags">
            {p.cooks.map((dish) => (
              <li key={dish}>{dish}</li>
            ))}
          </ul>

          <h2 className="t-pdp-label">{c.product.features}</h2>
          <ul className="t-features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className="t-actions">
            <a className="t-btn t-btn--red" href={waLink(c.product.message.replace("{name}", p.name))} {...external}>
              {c.product.order}
            </a>
            <a className="t-btn t-btn--outline" href={waLink(c.session.message)} {...external}>
              {c.product.session}
            </a>
          </div>
          <p className="t-note">{c.product.note}</p>
        </div>
      </article>

      <section className="t-section">
        <h2 className="t-display t-h2 t-mb">{c.product.related}</h2>
        <div className="t-grid">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
      </section>
    </>
  );
}
