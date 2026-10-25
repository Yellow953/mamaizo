import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "@/components/admin/Icons";
import ItemTable from "@/components/admin/ItemTable";
import { PageHeader } from "@/components/admin/ui";
import { tartan as c } from "@/lib/content";
import { getProducts } from "@/lib/data";

const copy = c.admin.products;

export const metadata: Metadata = { title: copy.meta };

export default async function AdminProducts() {
  const items = await getProducts();
  return (
    <>
      <PageHeader title={copy.title} body={copy.body}>
        <Link className="t-admin-btn" href="/admin/products/new">
          <PlusIcon />
          {copy.add}
        </Link>
      </PageHeader>
      <ItemTable kind="products" items={items} />
    </>
  );
}
