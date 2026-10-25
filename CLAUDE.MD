# MamaIzo site

Website for **MamaIzo** (Instagram: @mamaizocooks), who sells stainless steel cookware and runs free cooking sessions. Arabic first and RTL, built around the red and black tartan she wears in her videos ("Tartan" design). Orders, bookings and questions all go through WhatsApp.

## Stack

- Next.js (App Router) with TypeScript, plain CSS in `app/globals.css` (no Tailwind)
- No backend for visitors: every form and CTA opens WhatsApp with a prefilled message
- Firebase: products and recipes in Firestore, photos in Storage, edited at `/admin` (email/password auth). See README for setup
- Deploy target: Vercel

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build and type check (run before finishing any task)

## Structure

- `app/layout.tsx`: `<html lang="ar" dir="rtl">`, fonts (Lalezar for display, Readex Pro for body, loaded via `<link>`), metadata
- `app/(site)/`: public pages; its layout wraps them in `components/SiteChrome.tsx` (tartan edges, `<Nav/>`, footer, WhatsApp button)
- `app/(site)/page.tsx`: home (hero, promises, generations, pots, recipes, free session, team)
- `app/(site)/shop/`: product list; `app/(site)/shop/[slug]/`: product page
- `app/(site)/recipes/`: recipe search
- `app/(site)/contact/`: contact channels and `<ContactForm/>`
- `app/not-found.tsx` (unmatched URLs, adds the chrome) and `app/(site)/not-found.tsx`: both render `components/NotFoundContent.tsx`
- `app/admin/`: own chrome, noindex. `login/` sign-in page; `(panel)/` dashboard, `products/`, `recipes/` (list, `new/`, `[slug]/` editor) inside the sidebar shell; `actions.ts`, the server actions that save, delete, reorder and import. Each verifies the ID token and the `admin` custom claim, then calls `updateTag("products" | "recipes")`
- `components/admin/`: `Auth` (session, `useAuth`/`useAdmin`), `Shell` (sidebar, phone drawer, `useToast`), `LoginForm`, `ItemTable`, `Editors` (with live card preview), `Fields`, `ui` (page header, delete confirm), `Icons`. Classes `t-admin-*`
- `lib/issues.ts`: what makes an item "needs work" (placeholder [brackets], missing description, alt or reel link); `lib/empty.ts`: blank items for the editors
- `components/Nav.tsx`: client, highlights the current page, phone menu
- `components/ProductCard.tsx`: card linking to `/shop/[slug]`
- `components/ContactForm.tsx`: client, turns the form into a prefilled WhatsApp message
- `lib/content.ts`: all copy (`tartan`, including `tartan.admin`), `WHATSAPP_URL`, `INSTAGRAM_URL`, `TIKTOK_URL`
- `lib/data.ts`: `getProducts`, `getProduct`, `getRecipes`, server-only reads with `"use cache"` and `cacheTag`. Falls back to `lib/seed.ts` when the Firebase env vars are missing
- `lib/types.ts`: `Product`, `Recipe`; `lib/seed.ts`: starter content, imported into Firestore from `/admin`
- `lib/firebase/admin.ts` (firebase-admin, server only), `lib/firebase/client.ts` (auth and Storage, `/admin` only)
- `firestore.rules` (all client access denied), `storage.rules` (public read, admin-only write), `scripts/set-admin.mjs`, `.env.example`
- `lib/whatsapp.ts`: `waLink(text)` builds WhatsApp links with a prefilled message; `external` props for outbound links
- `public/images/`: photos from her Instagram (reel covers, placeholders until she sends originals)
- `next.config.ts`: redirects the old `/design2/*` review URLs to the root

## Design rules

- Define every color as a CSS variable on `:root` (`--t-*` tokens). The site is light mode only.
- Classes are prefixed `t-`.
- Must work at phone width (about 400px) with no horizontal scroll. Keep safe-area insets on fixed elements.
- Keep focus states visible on links and buttons.
- Respect `prefers-reduced-motion`.
- Never show prices anywhere on the site. Orders and pricing go through WhatsApp. No price field in the admin forms.

## TODO before client handoff

- Set the WhatsApp number in `lib/content.ts` (`WHATSAPP_URL`, format `https://wa.me/961XXXXXXXX`) and the `[رقم الواتساب]` contact value
- Set up Firebase (README), create her account, run `scripts/set-admin.mjs`, import the starter content
- She replaces the bracketed placeholder products and adds real photos and reel links at `/admin` (no prices)
- Test on a mid-range phone

## Working agreement

- Run `npm run build` after changes and fix type errors before reporting done.
- Keep all copy in `lib/content.ts`, not inline in components. Products and recipes are data in Firestore, not copy.
- Keep changes small and tell me which files changed.
