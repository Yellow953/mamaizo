import type { Metadata } from "next";
import Link from "next/link";
import ImportStarter from "@/components/admin/ImportStarter";
import { AlertIcon, BookIcon, ExternalIcon, PlusIcon, PotIcon } from "@/components/admin/Icons";
import { PageHeader } from "@/components/admin/ui";
import { tartan as c } from "@/lib/content";
import { getProducts, getRecipes } from "@/lib/data";
import { issuesOf, isProduct } from "@/lib/issues";

const a = c.admin;
const d = a.dashboard;

export const metadata: Metadata = { title: d.meta };

const date = new Intl.DateTimeFormat("ar-LB-u-nu-latn", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit", timeZone: "Asia/Beirut" });

export default async function Dashboard() {
  const [products, recipes] = await Promise.all([getProducts(), getRecipes()]);
  const all = [...products, ...recipes];
  const href = (item: (typeof all)[number]) => `/admin/${isProduct(item) ? "products" : "recipes"}/${item.slug}`;
  const attention = all.map((item) => ({ item, issues: issuesOf(item) })).filter((x) => x.issues.length > 0);
  const recent = all
    .filter((i) => i.updatedAt)
    .sort((x, y) => (y.updatedAt ?? 0) - (x.updatedAt ?? 0))
    .slice(0, 5);

  const stats = [
    { label: d.stats.products, value: products.length, Icon: PotIcon, href: "/admin/products" },
    { label: d.stats.recipes, value: recipes.length, Icon: BookIcon, href: "/admin/recipes" },
    { label: d.stats.attention, value: attention.length, Icon: AlertIcon, warn: attention.length > 0 },
  ];

  return (
    <>
      <PageHeader title={d.title} body={d.body} />

      {all.length === 0 && (
        <section className="t-admin-card t-admin-import">
          <div>
            <h2 className="t-admin-h2">{d.importTitle}</h2>
            <p className="t-admin-sub">{d.importBody}</p>
          </div>
          <ImportStarter />
        </section>
      )}

      <div className="t-admin-stats">
        {stats.map(({ label, value, Icon, href, warn }) => {
          const body = (
            <>
              <span className={`t-admin-stat-icon${warn ? " t-admin-stat-icon--warn" : ""}`}>
                <Icon />
              </span>
              <span>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </>
          );
          return href ? (
            <Link key={label} className="t-admin-card t-admin-stat" href={href}>
              {body}
            </Link>
          ) : (
            <div key={label} className="t-admin-card t-admin-stat">
              {body}
            </div>
          );
        })}
      </div>

      <section className="t-admin-quick" aria-label={d.quick}>
        <Link className="t-admin-btn" href="/admin/products/new">
          <PlusIcon />
          {a.products.add}
        </Link>
        <Link className="t-admin-btn t-admin-btn--ghost" href="/admin/recipes/new">
          <PlusIcon />
          {a.recipes.add}
        </Link>
        <a className="t-admin-btn t-admin-btn--ghost" href="/" target="_blank" rel="noopener">
          <ExternalIcon />
          {a.nav.site}
        </a>
      </section>

      <div className="t-admin-panels">
        <section className="t-admin-card">
          <h2 className="t-admin-h2">{d.attention}</h2>
          {attention.length === 0 ? (
            <p className="t-admin-empty">{d.attentionEmpty}</p>
          ) : (
            <ul className="t-admin-rows">
              {attention.map(({ item, issues }) => (
                <li key={href(item)}>
                  <Link className="t-admin-item" href={href(item)}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- small thumbnail */}
                    <img src={item.photo} alt="" />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{issues.map((x) => a.issues[x]).join("، ")}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="t-admin-card">
          <h2 className="t-admin-h2">{d.recent}</h2>
          {recent.length === 0 ? (
            <p className="t-admin-empty">{d.recentEmpty}</p>
          ) : (
            <ul className="t-admin-rows">
              {recent.map((item) => (
                <li key={href(item)}>
                  <Link className="t-admin-item" href={href(item)}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- small thumbnail */}
                    <img src={item.photo} alt="" />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{date.format(item.updatedAt)}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
