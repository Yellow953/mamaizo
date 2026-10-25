import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/Editors";
import { emptyProduct } from "@/lib/empty";
import { tartan as c } from "@/lib/content";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: c.admin.editor.newProduct };

export default async function NewProduct() {
  const categories = [...new Set((await getProducts()).map((i) => i.category))];
  return <ProductEditor initial={emptyProduct()} isNew categories={categories} />;
}
