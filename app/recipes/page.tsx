import type { Metadata } from "next";
import RecipeSearch from "@/components/RecipeSearch";
import { INSTAGRAM_URL, tartan as c } from "@/lib/content";
import { external } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: c.recipesPage.meta.title,
  description: c.recipesPage.meta.description,
};

export default function Recipes() {
  return (
    <main>
      <RecipeSearch />

      <section className="t-tartan t-session">
        <div className="t-session-inner">
          <div>
            <h2 className="t-display t-h2">{c.recipesPage.more.title}</h2>
            <p className="t-lead">{c.recipesPage.more.body}</p>
          </div>
          <a className="t-btn t-btn--red t-btn--big" href={INSTAGRAM_URL} {...external}>
            {c.recipesPage.more.cta}
          </a>
        </div>
      </section>
    </main>
  );
}
