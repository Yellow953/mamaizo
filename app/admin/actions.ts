"use server";

import { updateTag } from "next/cache";
import { adminAuth, bucket, db, firebaseConfigured } from "@/lib/firebase/admin";
import { seedProducts, seedRecipes } from "@/lib/seed";
import type { Kind, Product, Recipe } from "@/lib/types";

// Every action gets the signed-in user's ID token and checks the admin claim
// (set with scripts/set-admin.mjs). Firestore rules block all client access, so this is the only way in.
async function requireAdmin(idToken: string) {
  if (!firebaseConfigured) throw new Error("Firebase is not configured");
  const user = await adminAuth().verifyIdToken(idToken);
  if (user.admin !== true) throw new Error("Not allowed");
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 200)).filter(Boolean).slice(0, 30) : []);
// Only our Storage bucket or the bundled /images/ starter photos
const photo = (v: unknown) => {
  const s = str(v, 1000);
  return s.startsWith("/images/") || s.startsWith("https://firebasestorage.googleapis.com/") ? s : "";
};
const url = (v: unknown) => {
  const s = str(v, 500);
  return s === "" || s.startsWith("https://") ? s : "";
};

function cleanProduct(p: Product): Product {
  return {
    slug: str(p.slug, 80),
    name: str(p.name, 120),
    category: str(p.category, 60),
    text: str(p.text, 300),
    description: str(p.description),
    cooks: list(p.cooks),
    features: list(p.features),
    photo: photo(p.photo),
    alt: str(p.alt, 200),
    focus: /^\d{1,3}% \d{1,3}%$/.test(str(p.focus)) ? str(p.focus) : "50% 50%",
    order: Number.isFinite(p.order) ? p.order : 0,
  };
}

function cleanRecipe(r: Recipe): Recipe {
  return {
    slug: str(r.slug, 80),
    name: str(r.name, 120),
    time: str(r.time, 60),
    category: str(r.category, 60),
    description: str(r.description),
    ingredients: list(r.ingredients),
    keywords: list(r.keywords),
    photo: photo(r.photo),
    instagram: url(r.instagram),
    tiktok: url(r.tiktok),
    order: Number.isFinite(r.order) ? r.order : 0,
  };
}

// Removes a replaced or deleted photo, but never the bundled /images/ ones
async function removePhoto(photoUrl: string | undefined) {
  const match = photoUrl?.match(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)/);
  if (!match) return;
  await bucket()
    .file(decodeURIComponent(match[1]))
    .delete({ ignoreNotFound: true })
    .catch(() => {});
}

type Result = { ok: true } | { ok: false; error: "slug" | "taken" | "required" | "failed" };

async function save<T extends Product | Recipe>(kind: Kind, idToken: string, item: T, isNew: boolean): Promise<Result> {
  try {
    await requireAdmin(idToken);
    if (!SLUG.test(item.slug)) return { ok: false, error: "slug" };
    if (!item.name || !item.photo || !item.category) return { ok: false, error: "required" };

    const ref = db().collection(kind).doc(item.slug);
    const existing = await ref.get();
    if (isNew && existing.exists) return { ok: false, error: "taken" };
    if (isNew) {
      // New items go to the end of the list
      const last = await db().collection(kind).orderBy("order", "desc").limit(1).get();
      item.order = last.empty ? 0 : (last.docs[0].data().order as number) + 1;
    } else {
      item.order = (existing.data()?.order as number) ?? item.order;
    }

    await ref.set({ ...item, updatedAt: Date.now() });
    const old = existing.data()?.photo as string | undefined;
    if (old && old !== item.photo) await removePhoto(old);
    updateTag(kind);
    return { ok: true };
  } catch (e) {
    console.error(`save ${kind}`, e);
    return { ok: false, error: "failed" };
  }
}

export async function saveProduct(idToken: string, product: Product, isNew: boolean) {
  return save("products", idToken, cleanProduct(product), isNew);
}

export async function saveRecipe(idToken: string, recipe: Recipe, isNew: boolean) {
  const clean = cleanRecipe(recipe);
  // Recipes have no page of their own, so new ones get a generated id
  if (isNew) clean.slug = `r-${Date.now().toString(36)}`;
  return save("recipes", idToken, clean, isNew);
}

export async function deleteItem(idToken: string, kind: Kind, slug: string): Promise<Result> {
  try {
    await requireAdmin(idToken);
    const ref = db().collection(kind).doc(str(slug, 80));
    const existing = await ref.get();
    await ref.delete();
    await removePhoto(existing.data()?.photo);
    updateTag(kind);
    return { ok: true };
  } catch (e) {
    console.error(`delete ${kind}`, e);
    return { ok: false, error: "failed" };
  }
}

// slugs in their new display order
export async function reorder(idToken: string, kind: Kind, slugs: string[]): Promise<Result> {
  try {
    await requireAdmin(idToken);
    const batch = db().batch();
    slugs.forEach((slug, i) => batch.update(db().collection(kind).doc(str(slug, 80)), { order: i }));
    await batch.commit();
    updateTag(kind);
    return { ok: true };
  } catch (e) {
    console.error(`reorder ${kind}`, e);
    return { ok: false, error: "failed" };
  }
}

// One-time import of the starter content from lib/seed.ts into empty collections
export async function importStarter(idToken: string): Promise<Result> {
  try {
    await requireAdmin(idToken);
    const batch = db().batch();
    const [products, recipes] = await Promise.all([
      db().collection("products").limit(1).get(),
      db().collection("recipes").limit(1).get(),
    ]);
    if (products.empty) seedProducts.forEach((p) => batch.set(db().collection("products").doc(p.slug), p));
    if (recipes.empty) seedRecipes.forEach((r) => batch.set(db().collection("recipes").doc(r.slug), r));
    await batch.commit();
    updateTag("products");
    updateTag("recipes");
    return { ok: true };
  } catch (e) {
    console.error("import starter", e);
    return { ok: false, error: "failed" };
  }
}
