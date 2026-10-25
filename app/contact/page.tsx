import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { INSTAGRAM_URL, TIKTOK_URL, tartan as c } from "@/lib/content";
import { external, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: c.contact.meta.title,
  description: c.contact.meta.description,
};

const hrefs: Record<string, string> = {
  whatsapp: waLink(),
  instagram: INSTAGRAM_URL,
  tiktok: TIKTOK_URL,
};

export default function Contact() {
  return (
    <main>
      <header className="t-page-head">
        <p className="t-badge">{c.contact.kicker}</p>
        <h1 className="t-display t-h1 t-h1--page">{c.contact.title}</h1>
        <p className="t-lead">{c.contact.body}</p>
      </header>

      <section className="t-contact">
        <div className="t-contact-side">
          <ul className="t-channels">
            {c.contact.channels.map((ch) => (
              <li key={ch.key}>
                <a href={hrefs[ch.key]} {...external}>
                  <span className="t-channel-label">{ch.label}</span>
                  <span className="t-display t-channel-value" dir="ltr">
                    {ch.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="t-tartan t-frame t-frame--flat t-contact-photo">
            <div className="t-photo t-photo--portrait">
              <Image src={c.team.photo} alt={c.team.photoAlt} fill sizes="(max-width: 700px) 90vw, 40vw" />
            </div>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
