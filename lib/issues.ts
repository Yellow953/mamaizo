import type { Product, Recipe } from "@/lib/types";

// What still needs her attention on an item, shown as "needs work" at /admin
export type Issue = "placeholder" | "noDescription" | "noAlt" | "noInstagram";

export const isProduct = (item: Product | Recipe): item is Product => "cooks" in item;

export function issuesOf(item: Product | Recipe): Issue[] {
  const text = isProduct(item)
    ? [item.name, item.text, item.description, item.alt, ...item.cooks, ...item.features]
    : [item.name, item.time, item.description, ...item.ingredients];
  const issues: Issue[] = [];
  // The starter content marks text to replace with [brackets]
  if (text.some((t) => /\[.*\]/.test(t))) issues.push("placeholder");
  if (!item.description) issues.push("noDescription");
  if (isProduct(item) ? !item.alt : !item.instagram) issues.push(isProduct(item) ? "noAlt" : "noInstagram");
  return issues;
}
