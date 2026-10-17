"use client";

import { useSyncExternalStore } from "react";

// Reads a CSS color token so the 3D scene follows the palette and dark mode.
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function useCssVar(name: string, fallback: string) {
  return useSyncExternalStore(
    subscribe,
    () => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback,
    () => fallback,
  );
}
