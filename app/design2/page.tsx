import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/design2/ProductCard";
import { INSTAGRAM_URL, tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
};

export default function Tartan() {
  return (
    <main>
      <header className="t-hero">
        <div className="t-hero-copy">
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
            <Link className="t-btn t-btn--outline" href="/design2/shop">
              {c.hero.secondary}
            </Link>
          </div>
        </div>

        <div className="t-hero-media">
          <div className="t-tartan t-frame">
            <div className="t-photo t-photo--portrait">
              <Image src={c.hero.photo} alt={c.hero.photoAlt} fill priority sizes="(max-width: 700px) 90vw, 440px" />
            </div>
          </div>
          <div className="t-stat">
            <p className="t-display">{c.hero.stat}</p>
            <p>{c.hero.statLabel}</p>
          </div>
        </div>
      </header>

      <section className="t-tartan t-strip">
        <ul className="t-pills">
          {c.promises.map((p) => (
            <li key={p} className="t-display">
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="t-section">
        <h2 className="t-display t-h2">{c.generations.title}</h2>
        <p className="t-display t-h2-accent">{c.generations.accent}</p>
        <div className="t-grid">
          {c.generations.items.map((g, i) => (
            <div key={g.who} className={`t-card${i === c.generations.items.length - 1 ? " t-card--ink" : ""}`}>
              <p className="t-display t-card-title">{g.who}</p>
              <p className="t-muted">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pots" className="t-section t-section--flush">
        <div className="t-section-head">
          <h2 className="t-display t-h2">{c.pots.title}</h2>
          <Link className="t-chip" href="/design2/shop">
            {c.pots.more} ←
          </Link>
        </div>
        <div className="t-grid">
          {c.products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section id="recipes" className="t-section t-section--flush">
        <h2 className="t-display t-h2 t-mb">{c.recipes.title}</h2>
        <div className="t-grid t-grid--small">
          {c.recipes.items.map((r) => (
            <a key={r.name} className="t-recipe" href={INSTAGRAM_URL} {...external}>
              <span className="t-recipe-time">{r.time}</span>
              <Image className="t-recipe-img" src={r.photo} alt="" fill sizes="(max-width: 700px) 46vw, 25vw" />
              <span className="t-display t-recipe-name">{r.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section id="session" className="t-tartan t-session">
        <div className="t-session-inner">
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
        <div className="t-team-copy">
          <p className="t-team-kicker" lang="en" dir="ltr">
            {c.team.kicker}
          </p>
          <h2 className="t-display t-h2">{c.team.title}</h2>
          <p className="t-team-body">{c.team.body}</p>
          <a className="t-btn t-btn--light" href={waLink(c.team.message)} {...external}>
            {c.team.cta}
          </a>
        </div>
        <div className="t-tartan t-team-ring">
          <div className="t-photo t-photo--round">
            <Image src={c.team.photo} alt={c.team.photoAlt} fill sizes="(max-width: 700px) 80vw, 410px" />
          </div>
        </div>
      </section>

    </main>
  );
}
