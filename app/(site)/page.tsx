import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Motion from "@/components/Motion";
import ProductCard from "@/components/ProductCard";
import RecipeCard from "@/components/RecipeCard";
import { tartan as c } from "@/lib/content";
import { getProducts, getRecipes } from "@/lib/data";
import { external, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
};

export default async function Tartan() {
  const [products, recipes] = await Promise.all([getProducts(), getRecipes()]);

  return (
    <main>
      <Motion>
        <header className="t-hero">
          <div className="t-hero-copy" data-intro-children>
            <p className="t-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
              </svg>
              {c.hero.badge}
            </p>
            <h1 className="t-display t-h1">
              {c.hero.title}
              <br />
              <span className="t-accent">{c.hero.titleAccent}</span>
            </h1>
            <p className="t-lead">{c.hero.body}</p>
            <div className="t-actions">
              <a className="t-btn t-btn--red" href={waLink(c.session.message)} {...external}>
                {c.hero.primary}
              </a>
              <Link className="t-btn t-btn--outline" href="/shop">
                {c.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="t-hero-media" data-parallax>
            <div className="t-tartan t-frame" data-intro>
              <div className="t-photo t-photo--portrait">
                <Image src={c.hero.photo} alt={c.hero.photoAlt} fill priority sizes="(max-width: 700px) 90vw, 440px" />
              </div>
            </div>
            <div className="t-stat" data-pop>
              <p className="t-display">{c.hero.stat}</p>
              <p>{c.hero.statLabel}</p>
            </div>
          </div>
        </header>

        <section className="t-tartan t-strip">
          <ul className="t-pills" data-stagger>
            {c.promises.map((p) => (
              <li key={p} className="t-display">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="t-section">
          <h2 className="t-display t-h2" data-reveal>
            {c.generations.title}
          </h2>
          <p className="t-display t-h2-accent" data-reveal>{c.generations.accent}</p>
          <div className="t-grid" data-stagger>
            {c.generations.items.map((g, i) => (
              <div key={g.who} className={`t-card${i === c.generations.items.length - 1 ? " t-card--ink" : ""}`}>
                <p className="t-display t-card-title">{g.who}</p>
                <p className="t-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pots" className="t-section t-section--flush">
          <div className="t-section-head" data-reveal>
            <h2 className="t-display t-h2">{c.pots.title}</h2>
            <Link className="t-chip" href="/shop">
              {c.pots.more} ←
            </Link>
          </div>
          <div className="t-grid" data-stagger>
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        <section id="recipes" className="t-section t-section--flush">
          <div className="t-section-head" data-reveal>
            <h2 className="t-display t-h2">{c.recipes.title}</h2>
            <Link className="t-chip" href="/recipes">
              {c.recipes.more} ←
            </Link>
          </div>
          <div className="t-grid t-grid--small" data-stagger>
            {recipes.slice(0, 4).map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>

        <section id="session" className="t-tartan t-session">
          <div className="t-session-inner" data-stagger>
            <div>
              <h2 className="t-display t-h2">
                {c.session.title} <span className="t-accent">{c.session.accent}</span> {c.session.titleEnd}
              </h2>
              <p className="t-lead">{c.session.body}</p>
            </div>
            <a className="t-btn t-btn--red t-btn--big" href={waLink(c.session.message)} {...external}>
              {c.session.cta}
            </a>
          </div>
        </section>

        <section id="team" className="t-team">
          <div className="t-team-copy" data-stagger>
            <p className="t-team-kicker" lang="en" dir="ltr">
              {c.team.kicker}
            </p>
            <h2 className="t-display t-h2">{c.team.title}</h2>
            <p className="t-team-body">{c.team.body}</p>
            <a className="t-btn t-btn--light" href={waLink(c.team.message)} {...external}>
              {c.team.cta}
            </a>
          </div>
          <div className="t-tartan t-team-ring" data-reveal>
            <div className="t-photo t-photo--round">
              <Image src={c.team.photo} alt={c.team.photoAlt} fill sizes="(max-width: 700px) 80vw, 410px" />
            </div>
          </div>
        </section>
      </Motion>
    </main>
  );
}
