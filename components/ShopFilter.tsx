"use client";

import { useState } from "react";
import FinderHeader from "@/components/FinderHeader";
import ProductCard from "@/components/ProductCard";
import { tartan } from "@/lib/content";
import { useGridEntrance } from "@/lib/motion";
import { matches, normalize } from "@/lib/search";
import { external, waLink } from "@/lib/whatsapp";

const s = tartan.shop;
const products = tartan.products;
const categories = [s.all, ...new Set(products.map((p) => p.category))].map((name) => ({
  name,
  count: name === s.all ? products.length : products.filter((p) => p.category === name).length,
}));

// Search covers everything written about a product, so "رز" finds the pot she cooks rice in
const haystacks = products.map((p) =>
  normalize([p.name, p.category, p.text, p.description, ...p.cooks, ...p.features].join(" ")),
);

export default function ShopFilter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(s.all);

  const shown = products.filter(
    (p, i) => (category === s.all || p.category === category) && matches(haystacks[i], query),
  );

  const grid = useGridEntrance(shown.map((p) => p.slug).join());

  return (
    <>
      <FinderHeader
        copy={s}
        query={query}
        onQuery={setQuery}
        categories={categories}
        category={category}
        onCategory={setCategory}
        shown={shown.length}
      />

      <section className="t-finder-results">
        {shown.length > 0 ? (
          <div className="t-product-grid" ref={grid}>
            {shown.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="t-card t-search-empty">
            <p className="t-display t-card-title">{s.empty.title}</p>
            <p className="t-muted">{s.empty.body}</p>
            <a className="t-btn t-btn--red" href={waLink(s.empty.message.replace("{query}", query.trim() || category))} {...external}>
              {s.empty.cta}
            </a>
          </div>
        )}
      </section>
    </>
  );
}
