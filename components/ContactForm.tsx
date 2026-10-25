"use client";

import { tartan } from "@/lib/content";
import { waLink } from "@/lib/whatsapp";

const f = tartan.contact.form;

// No backend: the form turns its fields into a prefilled WhatsApp message
export default function ContactForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const lines = [
      f.greeting,
      `${f.nameLine} ${get("name")}`,
      get("area") && `${f.areaLine} ${get("area")}`,
      `${f.topicLine}: ${get("topic")}`,
      get("message"),
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="t-form" onSubmit={onSubmit} data-stagger>
      <h2 className="t-display t-form-title">{f.title}</h2>
      <label>
        <span>{f.name}</span>
        <input name="name" required autoComplete="given-name" />
      </label>
      <label>
        <span>{f.area}</span>
        <input name="area" autoComplete="address-level2" />
      </label>
      <label>
        <span>{f.topic}</span>
        <select name="topic" defaultValue={f.topics[0]}>
          {f.topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        <span>{f.message}</span>
        <textarea name="message" rows={4} />
      </label>
      <button className="t-btn t-btn--red t-btn--big" type="submit">
        {f.submit}
      </button>
      <p className="t-note">{f.hint}</p>
    </form>
  );
}
