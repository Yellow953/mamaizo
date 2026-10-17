import { WHATSAPP_URL } from "./content";

// WhatsApp link with an optional prefilled message
export const waLink = (text?: string) => (text ? `${WHATSAPP_URL}?text=${encodeURIComponent(text)}` : WHATSAPP_URL);

export const external = { target: "_blank", rel: "noopener noreferrer" } as const;
