import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// layout.tsx sets this class before paint unless the visitor prefers reduced motion
export const motionOn = () => document.documentElement.classList.contains("t-motion");

// Dialogs (the recipe popups) sit in the grids too but never animate in
export const animatable = (els: Element[]) => els.filter((el) => el.tagName !== "DIALOG");

// For filtered grids: cards that appear after a filter change rise in, cards already showing stay put
// (globals.css keeps new cards hidden, so still-hidden means not animated yet).
// No useGSAP here: its revert would hide cards that already played.
export function useGridEntrance(key: string) {
  const grid = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!grid.current || !motionOn()) return;
    const fresh = [...grid.current.children].filter((el) => getComputedStyle(el).visibility === "hidden");
    if (!fresh.length) return;
    gsap.set(fresh, { visibility: "visible" });
    gsap.from(fresh, { opacity: 0, y: 30, duration: 0.5, stagger: 0.06, ease: "power3.out" });
  }, [key]);
  return grid;
}

export { gsap, useGSAP };
