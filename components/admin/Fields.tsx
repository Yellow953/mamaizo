"use client";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useId, useState } from "react";
import { CloseIcon, ImageIcon } from "@/components/admin/Icons";
import { tartan } from "@/lib/content";
import { clientStorage } from "@/lib/firebase/client";
import type { Kind } from "@/lib/types";

const f = tartan.admin.fields;

type TextProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  multiline?: boolean;
  // Suggestions shown while typing (e.g. existing categories)
  options?: string[];
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export function TextField({ label, value, onChange, hint, multiline, options, ...rest }: TextProps) {
  const listId = useId();
  return (
    <label className="t-admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea className="t-admin-input" rows={5} value={value} onChange={(e) => onChange(e.target.value)} required={rest.required} />
      ) : (
        <input className="t-admin-input" value={value} onChange={(e) => onChange(e.target.value)} list={options ? listId : undefined} {...rest} />
      )}
      {options && (
        <datalist id={listId}>
          {options.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      )}
      {hint && <small className="t-admin-hint">{hint}</small>}
    </label>
  );
}

// Short lists (dishes, features, ingredients) as removable tags plus an input to add one
export function ListField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div className="t-admin-field">
      <label htmlFor={id}>{label}</label>
      <div className="t-admin-tagbox">
        {value.map((item) => (
          <span key={item} className="t-admin-tag">
            {item}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== item))} aria-label={`${f.listRemove} ${item}`}>
              <CloseIcon size={14} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={f.listPlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          // Enter adds the item instead of submitting the whole form; Backspace on empty removes the last one
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
        />
      </div>
      {hint && <small className="t-admin-hint">{hint}</small>}
    </div>
  );
}

// Uploads straight to Firebase Storage; the form saves the download URL
export function PhotoField({ kind, value, onChange, focus }: { kind: Kind; value: string; onChange: (url: string) => void; focus?: string }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const id = useId();

  const upload = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return setError(true);
    setError(false);
    setProgress(0);
    const name = file.name.replace(/[^a-zA-Z0-9.]/g, "-").slice(-40);
    const task = uploadBytesResumable(ref(clientStorage(), `${kind}/${Date.now()}-${name}`), file, { contentType: file.type });
    task.on(
      "state_changed",
      (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      () => {
        setError(true);
        setProgress(null);
      },
      async () => {
        onChange(await getDownloadURL(task.snapshot.ref));
        setProgress(null);
      },
    );
  };

  return (
    <div className="t-admin-field">
      <div className="t-admin-photo">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- live preview of a just-uploaded photo
          <img src={value} alt="" style={{ objectPosition: focus }} />
        ) : (
          <span className="t-admin-photo-empty">
            <ImageIcon />
          </span>
        )}
        {progress !== null && (
          <span className="t-admin-progress" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
        )}
      </div>
      {/* Visually hidden input before the styled label, so its focus ring shows on the label */}
      <input
        id={id}
        className="t-admin-file-input"
        type="file"
        accept="image/*"
        disabled={progress !== null}
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      <label className="t-admin-btn t-admin-btn--ghost t-admin-btn--block" htmlFor={id}>
        {progress !== null ? `${f.uploading} ${progress}%` : value ? f.photoChange : f.photoPick}
      </label>
      <small className="t-admin-hint">{f.photoHint}</small>
      {error && (
        <p className="t-admin-alert t-admin-alert--error" role="alert">
          {tartan.admin.errors.upload}
        </p>
      )}
    </div>
  );
}

// Which part of a tall photo shows in the wide product card, as "50% <y>%"
export function FocusField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const y = Number(value.split(" ")[1]?.replace("%", "")) || 50;
  return (
    <label className="t-admin-field">
      <span>{f.focus}</span>
      <span className="t-admin-range">
        <small>{f.focusTop}</small>
        <input type="range" min={0} max={100} value={y} onChange={(e) => onChange(`50% ${e.target.value}%`)} />
        <small>{f.focusBottom}</small>
      </span>
    </label>
  );
}
