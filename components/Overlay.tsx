"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { INSTAGRAM_URL, WHATSAPP_URL, cta, scenes, ui } from "@/lib/content";
import { SCENE_COUNT, progress, sceneScrollY, sceneTime, weight } from "@/lib/progress";

const pad = (n: number) => String(n).padStart(2, "0");

function Headline({ lines, hero }: { lines: string[]; hero: boolean }) {
  return (
    <p className={`headline${hero ? " headline--hero" : ""}`}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </p>
  );
}

export default function Overlay() {
  const back = useRef<(HTMLDivElement | null)[]>([]);
  const outline = useRef<(HTMLDivElement | null)[]>([]);
  const front = useRef<(HTMLElement | null)[]>([]);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const badge = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    let active = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (progress.current === last) return;
      last = progress.current;
      const t = sceneTime();

      scenes.forEach((_, i) => {
        const w = weight(i, t);
        const d = t - i;
        // The outline copy sits in front of the pot and moves with the filled one
        for (const b of [back.current[i], outline.current[i]]) {
          if (!b) continue;
          b.style.opacity = String(w);
          b.style.transform = `translate3d(0, ${-d * 14}vh, 0)`;
        }
        const f = front.current[i];
        if (f) {
          f.style.opacity = String(w);
          f.style.transform = `translate3d(0, ${-d * 8}vh, 0)`;
          // Hidden scenes drop out of the tab order and stop catching clicks
          f.style.visibility = w < 0.02 ? "hidden" : "visible";
        }
      });

      const now = Math.round(t);
      if (now !== active) {
        dots.current.forEach((d, i) => {
          if (i === now) d?.setAttribute("aria-current", "step");
          else d?.removeAttribute("aria-current");
        });
        active = now;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${progress.current})`;
      if (count.current) count.current.textContent = pad(now + 1);
      if (badge.current) badge.current.style.transform = `rotate(${progress.current * 540}deg)`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const initial = (i: number) => (i === 0 ? undefined : { opacity: 0, visibility: "hidden" as const });
  const go = (i: number) => progress.scrollTo(sceneScrollY(i));

  return (
    <>
      <div className="layer layer-back" aria-hidden="true">
        {scenes.map((s, i) => (
          <div key={i} className="scene-back" ref={(el) => { back.current[i] = el; }} style={i === 0 ? undefined : { opacity: 0 }}>
            <Headline lines={s.headline} hero={i === 0} />
          </div>
        ))}
      </div>

      <div className="layer layer-outline" aria-hidden="true">
        {scenes.map((s, i) => (
          <div key={i} className="scene-back" ref={(el) => { outline.current[i] = el; }} style={i === 0 ? undefined : { opacity: 0 }}>
            <Headline lines={s.headline} hero={i === 0} />
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

              {i === 0 && (
                <svg className="badge" ref={badge} viewBox="0 0 120 120" aria-hidden="true">
                  <defs>
                    <path id="badge-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
                  </defs>
                  <circle cx="60" cy="60" r="58" />
                  <text>
                    <textPath href="#badge-ring" textLength="286" lengthAdjust="spacing">{ui.badge}</textPath>
                  </text>
                  <path className="badge-star" d="M60 44l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" />
                </svg>
              )}

              {s.photo && (
                <figure className="portrait">
                  <div className="portrait-frame">
                    <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(max-width: 700px) 38vw, 300px" />
                  </div>
                  <p className="sticker">{s.photo.sticker}</p>
                </figure>
              )}

              {s.callouts && (
                <ul className="callouts">
                  {s.callouts.map((c, j) => (
                    <li key={c.title} className={`callout callout-${j}`}>
                      <span className="callout-num">{pad(j + 1)}</span>
                      <strong>{c.title}</strong>
                      <span className="callout-text">{c.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.labels && (
                <ul className="labels">
                  {s.labels.map((l) => (
                    <li key={l.title}>
                      <strong>{l.title}</strong>
                      <span>{l.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <div className="meter">
          <span className="count" aria-hidden="true">
            <span ref={count}>01</span> {ui.of} {pad(SCENE_COUNT)}
          </span>
          <div className="track">
            <nav className="index" aria-label={ui.scenes}>
              {scenes.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  ref={(el) => { dots.current[i] = el; }}
                  aria-current={i === 0 ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span className="index-num">{pad(i + 1)}</span>
                  <span className="index-name">{s.name}</span>
                </button>
              ))}
            </nav>
            <div className="bar" aria-hidden="true" title={ui.progress}>
              <div className="bar-fill" ref={bar} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
