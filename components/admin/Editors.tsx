"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveProduct, saveRecipe } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/Auth";
import { FocusField, ListField, PhotoField, TextField } from "@/components/admin/Fields";
import { TrashIcon } from "@/components/admin/Icons";
import { useToast } from "@/components/admin/Shell";
import { useDelete } from "@/components/admin/ui";
import ProductCard from "@/components/ProductCard";
import RecipeCard from "@/components/RecipeCard";
import { tartan } from "@/lib/content";
import type { Kind, Product, Recipe } from "@/lib/types";

const a = tartan.admin;
const e = a.editor;
const f = a.fields;

type Result = Awaited<ReturnType<typeof saveProduct>>;
type EditorProps<T> = { initial: T; isNew: boolean; categories: string[] };

// Form state plus save, delete and the unsaved-changes guard, shared by both editors
function useEditor<T extends Product | Recipe>(kind: Kind, initial: T, isNew: boolean, save: (token: string, item: T) => Promise<Result>) {
  const { getToken } = useAdmin();
  const toast = useToast();
  const router = useRouter();
  const [item, setItem] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(item) !== JSON.stringify(saved);
  const list = `/admin/${kind}`;

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (ev: BeforeUnloadEvent) => ev.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set =
    <K extends keyof T>(k: K) =>
    (v: T[K]) =>
      setItem((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError(null);
    const res = await save(await getToken(), item);
    setBusy(false);
    if (!res.ok) return setError(a.errors[res.error]);
    setSaved(item);
    toast(isNew ? a.toast.created : a.toast.saved);
    if (isNew) router.push(list);
    router.refresh();
  };

  const del = useDelete(kind, () => {
    setSaved(item);
    router.push(list);
  });

  return { item, set, dirty, busy, error, onSubmit, del, list };
}

function EditorLayout({
  title,
  editor,
  isNew,
  main,
  aside,
}: {
  title: string;
  editor: ReturnType<typeof useEditor<Product>> | ReturnType<typeof useEditor<Recipe>>;
  isNew: boolean;
  main: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <form className="t-admin-editor" onSubmit={editor.onSubmit}>
      <div className="t-admin-editor-bar">
        <div className="t-admin-editor-title">
          <Link className="t-admin-textbtn" href={editor.list}>
            {e.back}
          </Link>
          <h1 className="t-admin-h1">{title}</h1>
          {editor.dirty && <span className="t-admin-status t-admin-status--todo">{e.unsaved}</span>}
        </div>
        <button className="t-admin-btn" type="submit" disabled={editor.busy || (!isNew && !editor.dirty)}>
          {editor.busy ? e.saving : isNew ? e.create : e.save}
        </button>
      </div>

      {editor.error && (
        <p className="t-admin-alert t-admin-alert--error" role="alert">
          {editor.error}
        </p>
      )}

      <div className="t-admin-editor-grid">
        <div className="t-admin-stack">
          {main}
          {!isNew && (
            <section className="t-admin-card t-admin-danger">
              <div>
                <h2 className="t-admin-h2">{e.danger}</h2>
                <p className="t-admin-sub">{e.dangerBody}</p>
              </div>
              <button
                className="t-admin-btn t-admin-btn--danger-ghost"
                type="button"
                onClick={() => editor.del.ask({ slug: editor.item.slug, name: editor.item.name })}
              >
                <TrashIcon />
                {a.actions.delete}
              </button>
            </section>
          )}
        </div>
        <aside className="t-admin-stack">{aside}</aside>
      </div>
      {editor.del.dialog}
    </form>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="t-admin-card t-admin-stack">
    <h2 className="t-admin-h2">{title}</h2>
    {children}
  </section>
);

// The real site card, so she sees exactly what visitors will see. inert: not clickable here.
const Preview = ({ children, ready }: { children: React.ReactNode; ready: boolean }) => (
  <Section title={e.preview}>
    {ready ? (
      <div className="t-admin-site" inert>
        {children}
      </div>
    ) : (
      <p className="t-admin-empty">{e.previewEmpty}</p>
    )}
  </Section>
);

export function ProductEditor({ initial, isNew, categories }: EditorProps<Product>) {
  const editor = useEditor("products", initial, isNew, (token, p) => saveProduct(token, p, isNew));
  const { item: p, set } = editor;

  return (
    <EditorLayout
      title={isNew ? e.newProduct : initial.name}
      editor={editor}
      isNew={isNew}
      main={
        <>
          <Section title={e.basics}>
            <TextField label={f.name} value={p.name} onChange={set("name")} required />
            {isNew && (
              <TextField
                label={f.slug}
                hint={f.slugHint}
                value={p.slug}
                onChange={(v) => set("slug")(v.toLowerCase().replace(/\s+/g, "-"))}
                required
                dir="ltr"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
            )}
            <TextField label={f.category} hint={f.categoryHint} value={p.category} onChange={set("category")} options={categories} required />
            <TextField label={f.text} value={p.text} onChange={set("text")} />
            <TextField label={f.description} value={p.description} onChange={set("description")} multiline />
          </Section>
          <Section title={e.details}>
            <ListField label={f.cooks} value={p.cooks} onChange={set("cooks")} />
            <ListField label={f.features} value={p.features} onChange={set("features")} />
          </Section>
        </>
      }
      aside={
        <>
          <Section title={e.photo}>
            <PhotoField kind="products" value={p.photo} onChange={set("photo")} focus={p.focus} />
            <FocusField value={p.focus} onChange={set("focus")} />
            <TextField label={f.alt} value={p.alt} onChange={set("alt")} />
          </Section>
          <Preview ready={Boolean(p.photo)}>
            <ProductCard product={p} />
          </Preview>
        </>
      }
    />
  );
}

export function RecipeEditor({ initial, isNew, categories }: EditorProps<Recipe>) {
  const editor = useEditor("recipes", initial, isNew, (token, r) => saveRecipe(token, r, isNew));
  const { item: r, set } = editor;

  return (
    <EditorLayout
      title={isNew ? e.newRecipe : initial.name}
      editor={editor}
      isNew={isNew}
      main={
        <>
          <Section title={e.basics}>
            <TextField label={f.name} value={r.name} onChange={set("name")} required />
            <div className="t-admin-row2">
              <TextField label={f.category} hint={f.categoryHint} value={r.category} onChange={set("category")} options={categories} required />
              <TextField label={f.time} hint={f.timeHint} value={r.time} onChange={set("time")} />
            </div>
            <TextField label={f.description} value={r.description} onChange={set("description")} multiline />
          </Section>
          <Section title={e.details}>
            <ListField label={f.ingredients} value={r.ingredients} onChange={set("ingredients")} />
            <ListField label={f.keywords} hint={f.keywordsHint} value={r.keywords} onChange={set("keywords")} />
          </Section>
          <Section title={e.links}>
            <TextField
              label={f.instagram}
              hint={f.instagramHint}
              value={r.instagram}
              onChange={set("instagram")}
              type="url"
              dir="ltr"
              placeholder="https://www.instagram.com/reel/…"
            />
            <TextField
              label={f.tiktok}
              hint={f.tiktokHint}
              value={r.tiktok}
              onChange={set("tiktok")}
              type="url"
              dir="ltr"
              placeholder="https://www.tiktok.com/@mamaizo/video/…"
            />
          </Section>
        </>
      }
      aside={
        <>
          <Section title={e.photo}>
            <PhotoField kind="recipes" value={r.photo} onChange={set("photo")} />
          </Section>
          <Preview ready={Boolean(r.photo)}>
            <div className="t-admin-recipe-preview">
              <RecipeCard recipe={r} />
            </div>
          </Preview>
        </>
      }
    />
  );
}
