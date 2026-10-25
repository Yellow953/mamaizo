import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "@/components/admin/Icons";
import ItemTable from "@/components/admin/ItemTable";
import { PageHeader } from "@/components/admin/ui";
import { tartan as c } from "@/lib/content";
import { getRecipes } from "@/lib/data";

const copy = c.admin.recipes;

export const metadata: Metadata = { title: copy.meta };

export default async function AdminRecipes() {
  const items = await getRecipes();
  return (
    <>
      <PageHeader title={copy.title} body={copy.body}>
        <Link className="t-admin-btn" href="/admin/recipes/new">
          <PlusIcon />
          {copy.add}
        </Link>
      </PageHeader>
      <ItemTable kind="recipes" items={items} />
    </>
  );
}
