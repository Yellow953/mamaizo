"use client";

import { useRef } from "react";
import { animatable, gsap, motionOn, useGSAP } from "@/lib/motion";

// Animates the marked elements inside it (globals.css hides them until their turn):
// data-intro plays on load in page order, data-intro-children does the same for each child,
// data-pop springs in after the intro, data-reveal rises in when scrolled to,
// data-stagger brings its children in one after another when scrolled to,
// data-parallax drifts slowly while the page scrolls.
export default function Motion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const q = gsap.utils.selector(scope);
      const ease = "power3.out";

      gsap.set(q("[data-intro], [data-intro-children] > *, [data-pop], [data-reveal], [data-stagger] > *"), {
        visibility: "visible",
      });

      gsap
        .timeline({ defaults: { duration: 0.7, ease } })
        .from(q("[data-intro], [data-intro-children] > *"), { opacity: 0, y: 30, stagger: 0.08 })
        .from(q("[data-pop]"), { opacity: 0, scale: 0.4, rotation: "-=40", ease: "back.out(1.8)" }, "-=0.3");

      for (const el of q("[data-reveal]")) {
        gsap.from(el, { opacity: 0, y: 40, duration: 0.8, ease, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      }

      for (const el of q("[data-stagger]")) {
        gsap.from(animatable([...el.children]), {
          opacity: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.1,
          ease,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }

      for (const el of q("[data-parallax]")) {
        gsap.to(el, { yPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className="t-motion-scope" data-motion>
      {children}
    </div>
  );
}
