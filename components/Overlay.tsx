"use client";

import { useEffect, useRef } from "react";
import { INSTAGRAM_URL, WHATSAPP_URL, cta, scenes, ui } from "@/lib/content";
import { SCENE_COUNT, progress, sceneTime, weight } from "@/lib/progress";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Overlay() {
  const back = useRef<(HTMLDivElement | null)[]>([]);
  const front = useRef<(HTMLElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (progress.current === last) return;
      last = progress.current;
      const t = sceneTime();

      scenes.forEach((_, i) => {
        const w = weight(i, t);
        const d = t - i;
        const b = back.current[i];
        const f = front.current[i];
        if (b) {
          b.style.opacity = String(w);
          b.style.transform = `translate3d(0, ${-d * 14}vh, 0)`;
        }
        if (f) {
          f.style.opacity = String(w);
          f.style.transform = `translate3d(0, ${-d * 8}vh, 0)`;
          // Hidden scenes drop out of the tab order and stop catching clicks
          f.style.visibility = w < 0.02 ? "hidden" : "visible";
        }
      });

      if (bar.current) bar.current.style.transform = `scaleX(${progress.current})`;
      if (count.current) count.current.textContent = pad(Math.round(t) + 1);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const initial = (i: number) => (i === 0 ? undefined : { opacity: 0, visibility: "hidden" as const });

  return (
    <>
      <div className="layer layer-back" aria-hidden="true">
        {scenes.map((s, i) => (
          <div key={i} className="scene-back" ref={(el) => { back.current[i] = el; }} style={i === 0 ? undefined : { opacity: 0 }}>
            <p className={`headline${i === 0 ? " headline--hero" : ""}`}>
              {s.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="layer layer-front">
        {scenes.map((s, i) => {
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <section
              key={i}
              className={`scene-front scene-front--${i}`}
              ref={(el) => { front.current[i] = el; }}
              style={initial(i)}
            >
              <div className="copy">
                <p className="kicker">{s.kicker}</p>
                <Heading className="visually-hidden">{s.headline.join(" ")}</Heading>
                {s.body && <p className="body">{s.body}</p>}
                {i === SCENE_COUNT - 1 && (
                  <div className="ctas">
                    <a className="btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      {cta.primary}
                    </a>
                    <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      {cta.secondary}
                    </a>
                  </div>
                )}
              </div>

              {s.callouts && (
                <ul className="callouts">
                  {s.callouts.map((c, j) => (
                    <li key={c.title} className={`callout callout-${j}`}>
                      <strong>{c.title}</strong>
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.labels && (
                <ul className="labels">
                  {s.labels.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <div className="meter" aria-hidden="true" title={ui.progress}>
          <span className="count">
            <span ref={count}>01</span> {ui.of} {pad(SCENE_COUNT)}
          </span>
          <div className="bar">
            <div className="bar-fill" ref={bar} />
          </div>
        </div>
      </div>
    </>
  );
}
