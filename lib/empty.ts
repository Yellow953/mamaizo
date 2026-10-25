import type { Product, Recipe } from "@/lib/types";

// Blank items for the "new" editors at /admin

export const emptyProduct = (): Product => ({
  slug: "",
  name: "",
  category: "",
  text: "",
  description: "",
  cooks: [],
  features: [],
  photo: "",
  alt: "",
  focus: "50% 50%",
  order: 0,
});

// Recipes have no page of their own, so saveRecipe generates the id
export const emptyRecipe = (): Recipe => ({
  slug: "",
  name: "",
  time: "",
  category: "",
  description: "",
  ingredients: [],
  keywords: [],
  photo: "",
  instagram: "",
  tiktok: "",
  order: 0,
});
