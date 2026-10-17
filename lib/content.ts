// All site copy lives here. Placeholder text until the client sends the real copy.

// TODO: set the real number, format https://wa.me/961XXXXXXXX
export const WHATSAPP_URL = "https://wa.me/961XXXXXXXX";
export const INSTAGRAM_URL = "https://www.instagram.com/mamaizocooks/";

export const meta = {
  title: "MamaIzo · Stainless steel cookware",
  description:
    "Stainless steel pots made for slow cooking and family recipes. Order from MamaIzo on WhatsApp.",
};

export const brand = {
  name: "MamaIzo",
  handle: "@mamaizocooks",
};

export const nav = {
  home: "MamaIzo home",
  instagram: "Instagram",
  order: "Order",
};

export type Callout = { title: string; text: string };

export type SceneCopy = {
  kicker: string;
  headline: string[];
  body?: string;
  callouts?: Callout[];
  labels?: string[];
};

export const scenes: SceneCopy[] = [
  {
    kicker: "Stainless steel cookware",
    headline: ["MamaIzo"],
    body: "Pots that hold the heat, hold up, and hold the family recipes. Scroll to take a closer look.",
  },
  {
    kicker: "01 · Cook slow",
    headline: ["Cook", "slow"],
    body: "A heavy base spreads the heat evenly, so stews can simmer for hours without catching.",
  },
  {
    kicker: "02 · Lift the lid",
    headline: ["Lift the", "lid"],
    callouts: [
      { title: "Snug lid", text: "Keeps the steam in, so nothing dries out." },
      { title: "Riveted handles", text: "Solid grip, even with a full pot." },
      { title: "Pure steel", text: "No coating to chip or wear off." },
    ],
  },
  {
    kicker: "03 · The range",
    headline: ["The", "range"],
    // Left to right, matching the pots on screen
    labels: ["Stock pot", "Everyday pot", "Casserole"],
  },
  {
    kicker: "04 · Order",
    headline: ["Yours", "next"],
    body: "Message us on WhatsApp to order, or to ask about sizes and prices.",
  },
];

export const cta = {
  primary: "Order on WhatsApp",
  secondary: "See it cooking on Instagram",
};

export const ui = {
  progress: "Scroll progress",
  of: "/",
};
