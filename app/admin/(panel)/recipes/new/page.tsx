import type { Metadata } from "next";
import { RecipeEditor } from "@/components/admin/Editors";
import { emptyRecipe } from "@/lib/empty";
import { tartan as c } from "@/lib/content";
import { getRecipes } from "@/lib/data";

export const metadata: Metadata = { title: c.admin.editor.newRecipe };

export default async function NewRecipe() {
  const categories = [...new Set((await getRecipes()).map((i) => i.category))];
  return <RecipeEditor initial={emptyRecipe()} isNew categories={categories} />;
}
