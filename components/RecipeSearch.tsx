"use client";

import { useMemo, useState } from "react";
import FinderHeader from "@/components/FinderHeader";
import RecipeCard from "@/components/RecipeCard";
import { tartan } from "@/lib/content";
import type { Recipe } from "@/lib/types";
import { useGridEntrance } from "@/lib/motion";
import { matches, normalize } from "@/lib/search";
import { external, waLink } from "@/lib/whatsapp";

const s = tartan.recipesPage;

export default function RecipeSearch({ recipes }: { recipes: Recipe[] }) {
  const categories = useMemo(
    () =>
      [s.all, ...new Set(recipes.map((r) => r.category))].map((name) => ({
        name,
        count: name === s.all ? recipes.length : recipes.filter((r) => r.category === name).length,
      })),
    [recipes],
  );

  const haystacks = useMemo(
    () => recipes.map((r) => normalize([r.name, r.category, r.description, ...r.ingredients, ...r.keywords].join(" "))),
    [recipes],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(s.all);

  const shown = recipes.filter(
    (r, i) => (category === s.all || r.category === category) && matches(haystacks[i], query),
  );
  const grid = useGridEntrance(shown.map((r) => r.slug).join());

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
          <div className="t-recipe-grid" ref={grid}>
            {shown.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
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
