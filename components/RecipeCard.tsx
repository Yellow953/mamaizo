"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";
import { INSTAGRAM_URL, tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

type Recipe = (typeof c.recipes.items)[number];

const m = c.recipes.modal;

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

// The card opens a modal with the recipe details and its Instagram and TikTok links.
// <dialog> handles Escape, the focus trap and returning focus to the card.
export default function RecipeCard({ recipe: r }: { recipe: Recipe }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = () => dialog.current?.close();
  // Falls back to the profile until the reel link is set in lib/content.ts
  const instagram = r.instagram || INSTAGRAM_URL;

  return (
    <>
      <button className="t-recipe" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        <span className="t-recipe-time">{r.time}</span>
        <Image className="t-recipe-img" src={r.photo} alt="" fill sizes="(max-width: 700px) 46vw, 340px" />
        <span className="t-display t-recipe-name">{r.name}</span>
        <span className="t-recipe-open">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          {c.recipes.open}
        </span>
      </button>

      {/* A click on the backdrop lands on the dialog itself, not its content */}
      <dialog ref={dialog} className="t-modal" aria-labelledby={titleId} onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="t-modal-inner">
          <button className="t-modal-close" type="button" onClick={close} aria-label={m.close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="t-modal-media">
            <Image src={r.photo} alt="" fill sizes="(max-width: 700px) 100vw, 380px" />
            <span className="t-recipe-time">{r.time}</span>
          </div>

          <div className="t-modal-body">
            <p className="t-product-cat">{r.category}</p>
            <h2 className="t-display t-modal-title" id={titleId}>
              {r.name}
            </h2>
            <p className="t-muted">{r.description}</p>

            <p className="t-pdp-label">{m.ingredients}</p>
            <ul className="t-tags">
              {r.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>

            <p className="t-pdp-label">{m.method}</p>
            <div className="t-modal-watch">
              <a className="t-btn t-btn--red" href={instagram} {...external}>
                <InstagramIcon />
                {m.instagram}
              </a>
              {r.tiktok && (
                <a className="t-btn t-btn--ink" href={r.tiktok} {...external}>
                  <TikTokIcon />
                  {m.tiktok}
                </a>
              )}
            </div>

            <div className="t-modal-foot">
              <a className="t-link" href={waLink(m.message.replace("{name}", r.name))} {...external}>
                {m.ask}
              </a>
              <p>
                {m.pots}{" "}
                <Link className="t-link" href="/shop" onClick={close}>
                  {m.potsCta}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
