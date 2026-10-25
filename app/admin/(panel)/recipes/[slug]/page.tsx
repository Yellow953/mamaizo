import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeEditor } from "@/components/admin/Editors";
import { tartan as c } from "@/lib/content";
import { getRecipes } from "@/lib/data";

type Params = PageProps<"/admin/recipes/[slug]">["params"];

export default function EditRecipe(props: PageProps<"/admin/recipes/[slug]">) {
  // Reading params inside Suspense keeps navigation to the page instant
  return (
    <Suspense fallback={<p className="t-admin-empty">{c.admin.loading}</p>}>
      <Editor params={props.params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Params }) {
  const { slug } = await params;
  const items = await getRecipes();
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <RecipeEditor key={slug} initial={item} isNew={false} categories={[...new Set(items.map((i) => i.category))]} />;
}
