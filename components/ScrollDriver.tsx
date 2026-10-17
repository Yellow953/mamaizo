"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { progress } from "@/lib/progress";

export default function ScrollDriver() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    progress.reduced = reduced;

    const lenis = reduced ? null : new Lenis();
    lenis?.on("scroll", ScrollTrigger.update);

    const st = ScrollTrigger.create({
      trigger: "#spacer",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.target = self.progress;
      },
    });
    progress.target = st.progress;
    progress.current = st.progress;

    const tick = (time: number, deltaTime: number) => {
      lenis?.raf(time * 1000);
      if (reduced) {
        progress.current = progress.target;
        return;
      }
      const k = 1 - Math.exp((-deltaTime / 1000) * 6);
      progress.current += (progress.target - progress.current) * k;
      if (Math.abs(progress.target - progress.current) < 0.00005) progress.current = progress.target;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      lenis?.destroy();
    };
  }, []);

  return null;
}
