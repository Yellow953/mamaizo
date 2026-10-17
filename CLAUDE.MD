# MamaIzo showroom site

Scroll-driven 3D showroom website for **MamaIzo** (Instagram: @mamaizocooks), a seller of stainless steel cookware. One 3D pot is the hero. Scrolling moves the camera and the pot through six scenes while giant headlines change behind it.

Reference look: a product showroom where huge type sits behind a 3D product on a flat background, and the product tilts, travels and changes position as you scroll.

## Stack

- Next.js (App Router) with TypeScript, plain CSS in `app/globals.css` (no Tailwind)
- react-three-fiber + @react-three/drei for the 3D scene
- GSAP ScrollTrigger + Lenis for smooth scroll and scroll progress
- Deploy target: Vercel

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build and type check (run before finishing any task)

## Structure

- `app/layout.tsx`: fonts (Anton for display, Familjen Grotesk for body, loaded via `<link>`), metadata
- `app/page.tsx`: nav, `#spacer` (scroll distance), fixed `.stage` containing `<Stage/>` and `<Overlay/>`, `<ScrollDriver/>`
- `components/Stage.tsx`: client wrapper that loads `Scene` with `dynamic(..., { ssr: false })`
- `components/Scene.tsx`: `<Canvas>`, procedural `<Environment>` built from `Lightformer`s (no HDR download), `ContactShadows`, camera rig
- `components/Pot.tsx`: parametric pot with `variant` of `main`, `left` or `right`. Lathe-geometry body and lid, torus handles, black knob, steam as `<points>`
- `components/Overlay.tsx`: headlines (filled behind the pot, plus an outline copy in front so they read across it), spinning hero badge, callouts, CTA, and the bottom scene index (click to jump, via `progress.scrollTo`), all updated each frame from scroll progress
- `components/ScrollDriver.tsx`: Lenis wired into ScrollTrigger, writes `progress.target`, eases `progress.current`
- `lib/progress.ts`: shared scroll store plus the keyframe arrays and the `at()` interpolator
- `lib/content.ts`: all copy and `WHATSAPP_URL`
- `app/design2/`: second design ("Tartan"), Arabic and RTL. `layout.tsx` (nav + footer), home, `shop/`, `shop/[slug]/` (product page), `contact/`. Copy lives in `tartan` in `lib/content.ts`; products are `tartan.products`
- `components/design2/`: `Nav` (client, highlights the current page), `ProductCard`, `ContactForm` (client, turns the form into a prefilled WhatsApp message, no backend)
- `lib/whatsapp.ts`: `waLink(text)` builds WhatsApp links with a prefilled message
- `public/images/showroom/mamaizo.jpg`: her portrait for the showroom, cropped from `design2/team.jpg`
- `public/images/design2/`: photos from her Instagram (reel covers, placeholders until she sends originals)

## How the scroll works

`#spacer` is 670vh tall. ScrollTrigger maps scrolling through it to `progress.target` (0 to 1). `progress.current` eases toward it. Everything reads `t = progress.current * 5`, then `at(array, t)` interpolates between six keyframes with smoothstep.

Scenes: 0 hero, 1 cook slow, 2 lift the lid, 3 the range, 4 meet her (her photo, pot on the left), 5 order.

Keyframes in `lib/progress.ts` (one value per scene):

| Key | Values |
|---|---|
| `ry` pot rotation Y | 0.5, 2.9, 3.7, 5.2, 6.1, 6.78 |
| `rx` pot tilt X | 0.1, 0.28, 0.38, 0.12, 0.16, 0.08 |
| `px` pot x offset | 0, 0.95, 0, 0, -1.05, 0 |
| `sc` pot scale | 1.45, 1.4, 1.5, 1.05, 1.15, 1.35 |
| `lift` lid lift | 0, 0, 1, 0, 0, 0 |
| `cy` camera y | 0, 0.15, 1.1, 0.2, 0.1, 0 |
| `rng` side pots visible | 0, 0, 0, 1, 0, 0 |

Extras: the pot follows the mouse slightly (`state.pointer`). On narrow screens (under 700px) the pot is scaled down and centered.

## Design rules

Palette comes from the MamaIzo Instagram feed. Never go back to black and green.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F0E3CF` cream | `#2A0F08` deep brown |
| `--ink` | `#3B160C` sauce brown | `#F4E6D2` |
| `--accent` | `#C0391B` ketchup red | `#F08A4B` apricot |
| `--blue` | `#2C5AA0` floral blue | `#8FB3E3` |
| `--muted` | `#7A5A49` | `#C4A58F` |

- Define every color as a CSS variable on `:root`. The site is light mode only (no dark-mode overrides).
- Giant condensed headlines (Anton) in the accent color sit behind the pot. Keep the page otherwise quiet.
- Motion is scroll-driven only. Respect `prefers-reduced-motion` (Lenis is skipped, progress is not eased).
- Must work at phone width (about 400px) with no horizontal scroll. Keep safe-area insets on fixed elements.
- Keep focus states visible on links and buttons.
- Never show prices anywhere on the site. Orders and pricing go through WhatsApp.

## 3D rules

- The canvas is client-only (`dynamic` with `ssr: false`). Never render three.js on the server.
- Steel needs `metalness: 1`, `roughness` around 0.2 and a good environment. The lighting matters more than the geometry. Do not add an HDR file; keep the `Lightformer` environment.
- The base of each pot stays on a fixed floor (`y = -0.82 + 0.55 * scale`) so the contact shadow lines up.
- The lid must stay a separate group so it can lift and rotate.
- If a real model is used, put it in `public/models/pot.glb`, load it with `useGLTF`, keep the lid as its own node, and compress it with gltf-transform first.

## TODO before client handoff

- Set the WhatsApp number in `lib/content.ts` (`WHATSAPP_URL`, format `https://wa.me/961XXXXXXXX`)
- Replace placeholder copy in `lib/content.ts` with the client's real text (English and Arabic are both likely needed; Arabic means RTL layout and an Arabic display font)
- Add the real product list and photos (no prices)
- Try replacing the code-built pot with a model generated from her pot photos (Higgsfield image-to-3D)
- Add a product lineup section where clicking a pot flies the camera to it
- Add a recipes or Instagram section and a real footer
- Test on a mid-range phone and lower pixel ratio and shadow resolution if it stutters

## Working agreement

- Run `npm run build` after changes and fix type errors before reporting done.
- Keep all copy in `lib/content.ts`, not inline in components.
- Keep changes small and tell me which files changed.