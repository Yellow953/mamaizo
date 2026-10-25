// Products and recipes live in Firestore and are edited at /admin. Never add prices.

export type Product = {
  slug: string;
  name: string;
  category: string;
  text: string;
  description: string;
  cooks: string[];
  features: string[];
  // A Firebase Storage URL, or a /images/... path for the starter content
  photo: string;
  alt: string;
  // object-position used to crop the photo into a wide card
  focus: string;
  order: number;
  // ms timestamp of the last save at /admin
  updatedAt?: number;
};

export type Recipe = {
  slug: string;
  name: string;
  time: string;
  category: string;
  description: string;
  ingredients: string[];
  // Extra search terms: other spellings, English names
  keywords: string[];
  photo: string;
  // Reel links; empty hides the TikTok button and sends Instagram to the profile
  instagram: string;
  tiktok: string;
  order: number;
  updatedAt?: number;
};

export type Kind = "products" | "recipes";
