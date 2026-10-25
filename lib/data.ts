import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db, firebaseConfigured } from "@/lib/firebase/admin";
import { seedProducts, seedRecipes } from "@/lib/seed";
import type { Product, Recipe } from "@/lib/types";

// Cached until an /admin save calls updateTag("products" | "recipes")

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("max");
  if (!firebaseConfigured) return seedProducts;
  const snap = await db().collection("products").orderBy("order").get();
  return snap.docs.map((d) => d.data() as Product);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getRecipes(): Promise<Recipe[]> {
  "use cache";
  cacheTag("recipes");
  cacheLife("max");
  if (!firebaseConfigured) return seedRecipes;
  const snap = await db().collection("recipes").orderBy("order").get();
  return snap.docs.map((d) => d.data() as Recipe);
}
