"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { reorder } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/Auth";
import { DownIcon, EditIcon, ExternalIcon, SearchIcon, TrashIcon, UpIcon } from "@/components/admin/Icons";
import { useToast } from "@/components/admin/Shell";
import { useDelete } from "@/components/admin/ui";
import { tartan } from "@/lib/content";
import { issuesOf } from "@/lib/issues";
import { matches, normalize } from "@/lib/search";
import type { Kind, Product, Recipe } from "@/lib/types";

const a = tartan.admin;
const t = a.table;

// Products and recipes share the same list: search, category filter, status, reorder, edit, delete
export default function ItemTable({ kind, items }: { kind: Kind; items: (Product | Recipe)[] }) {
  const { getToken } = useAdmin();
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [list, setList] = useOptimistic(items);
  const [moving, startMove] = useTransition();
  const del = useDelete(kind);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const filtering = query.trim() !== "" || category !== "";
  const shown = list.filter((i) => (!category || i.category === category) && matches(normalize(`${i.name} ${i.category}`), query));

  const move = (index: number, by: -1 | 1) =>
    startMove(async () => {
      const next = [...list];
      [next[index], next[index + by]] = [next[index + by], next[index]];
      setList(next);
      const res = await reorder(
        await getToken(),
        kind,
        next.map((i) => i.slug),
      );
      toast(res.ok ? a.toast.reordered : a.errors.failed, !res.ok);
      router.refresh();
    });

  return (
    <>
      <div className="t-admin-card t-admin-table-card">
        <div className="t-admin-toolbar">
          <label className="t-admin-search">
            <SearchIcon />
            <input className="t-admin-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />
          </label>
          {categories.length > 1 && (
            <select className="t-admin-input t-admin-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t.category}>
              <option value="">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
          <span className="t-admin-count">{t.count.replace("{shown}", String(shown.length)).replace("{total}", String(items.length))}</span>
        </div>
        {filtering && <p className="t-admin-hintbar">{t.reorderHint}</p>}

        {shown.length === 0 ? (
          <p className="t-admin-empty">{items.length === 0 ? a[kind].empty : t.noResults}</p>
        ) : (
          <table className="t-admin-table">
            <thead>
              <tr>
                <th scope="col" className="t-admin-col-order">
                  {t.order}
                </th>
                <th scope="col">{t.item}</th>
                <th scope="col">{t.category}</th>
                <th scope="col">{t.status}</th>
                <th scope="col" className="t-admin-col-actions">
                  <span className="t-admin-sr">{t.actions}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item, i) => {
                const issues = issuesOf(item);
                const edit = `/admin/${kind}/${item.slug}`;
                return (
                  <tr key={item.slug}>
                    <td className="t-admin-col-order">
                      <div className="t-admin-order">
                        <button
                          className="t-admin-iconbtn t-admin-iconbtn--sm"
                          type="button"
                          disabled={filtering || moving || i === 0}
                          onClick={() => move(i, -1)}
                          aria-label={`${a.actions.up}: ${item.name}`}
                        >
                          <UpIcon />
                        </button>
                        <button
                          className="t-admin-iconbtn t-admin-iconbtn--sm"
                          type="button"
                          disabled={filtering || moving || i === shown.length - 1}
                          onClick={() => move(i, 1)}
                          aria-label={`${a.actions.down}: ${item.name}`}
                        >
                          <DownIcon />
                        </button>
                      </div>
                    </td>
                    <td>
                      <Link className="t-admin-item" href={edit}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- small thumbnail, mixed local and Storage URLs */}
                        <img src={item.photo} alt="" />
                        <span>
                          <strong>{item.name}</strong>
                          <small dir="ltr">{"time" in item ? item.time : `/shop/${item.slug}`}</small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className="t-admin-pill">{item.category}</span>
                    </td>
                    <td>
                      {issues.length === 0 ? (
                        <span className="t-admin-status t-admin-status--ok">{t.ok}</span>
                      ) : (
                        <span className="t-admin-status t-admin-status--todo" title={issues.map((x) => a.issues[x]).join("، ")}>
                          {t.todo}
                        </span>
                      )}
                    </td>
                    <td className="t-admin-col-actions">
                      <div className="t-admin-rowactions">
                        <Link className="t-admin-iconbtn" href={edit} aria-label={`${a.actions.edit}: ${item.name}`} title={a.actions.edit}>
                          <EditIcon />
                        </Link>
                        {kind === "products" && (
                          <a
                            className="t-admin-iconbtn"
                            href={`/shop/${item.slug}`}
                            target="_blank"
                            rel="noopener"
                            aria-label={`${a.actions.view}: ${item.name}`}
                            title={a.actions.view}
                          >
                            <ExternalIcon size={18} />
                          </a>
                        )}
                        <button
                          className="t-admin-iconbtn t-admin-iconbtn--danger"
                          type="button"
                          onClick={() => del.ask({ slug: item.slug, name: item.name })}
                          aria-label={`${a.actions.delete}: ${item.name}`}
                          title={a.actions.delete}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {del.dialog}
    </>
  );
}
