# MamaIzo site

Website for **MamaIzo** (Instagram: @mamaizocooks), who sells stainless steel cookware and runs free cooking sessions. Arabic first and RTL, built around the red and black tartan she wears in her videos ("Tartan" design). Orders, bookings and questions all go through WhatsApp.

## Stack

- Next.js (App Router) with TypeScript, plain CSS in `app/globals.css` (no Tailwind)
- No backend: every form and CTA opens WhatsApp with a prefilled message
- Deploy target: Vercel

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build and type check (run before finishing any task)

## Structure

- `app/layout.tsx`: `<html lang="ar" dir="rtl">`, fonts (Lalezar for display, Readex Pro for body, loaded via `<link>`), metadata, tartan edges, `<Nav/>` and footer
- `app/page.tsx`: home (hero, promises, generations, pots, recipes, free session, team)
- `app/shop/`: product list; `app/shop/[slug]/`: product page
- `app/contact/`: contact channels and `<ContactForm/>`
- `app/not-found.tsx`: 404
- `components/Nav.tsx`: client, highlights the current page, phone menu
- `components/ProductCard.tsx`: card linking to `/shop/[slug]`
- `components/ContactForm.tsx`: client, turns the form into a prefilled WhatsApp message
- `lib/content.ts`: all copy (`tartan`), products (`tartan.products`), `WHATSAPP_URL`, `INSTAGRAM_URL`, `TIKTOK_URL`
- `lib/whatsapp.ts`: `waLink(text)` builds WhatsApp links with a prefilled message; `external` props for outbound links
- `public/images/`: photos from her Instagram (reel covers, placeholders until she sends originals)
- `next.config.ts`: redirects the old `/design2/*` review URLs to the root

## Design rules

- Define every color as a CSS variable on `:root` (`--t-*` tokens). The site is light mode only.
- Classes are prefixed `t-`.
- Must work at phone width (about 400px) with no horizontal scroll. Keep safe-area insets on fixed elements.
- Keep focus states visible on links and buttons.
- Respect `prefers-reduced-motion`.
- Never show prices anywhere on the site. Orders and pricing go through WhatsApp.

## TODO before client handoff

- Set the WhatsApp number in `lib/content.ts` (`WHATSAPP_URL`, format `https://wa.me/961XXXXXXXX`) and the `[رقم الواتساب]` contact value
- Replace bracketed placeholder copy in `lib/content.ts` (product names, features) with the client's real text
- Add the real product list and photos (no prices)
- Set each recipe's `instagram` reel link in `lib/content.ts` (cards open the profile until then) and its `tiktok` link (the button is hidden when empty)
- Test on a mid-range phone

## Working agreement

- Run `npm run build` after changes and fix type errors before reporting done.
- Keep all copy in `lib/content.ts`, not inline in components.
- Keep changes small and tell me which files changed.
