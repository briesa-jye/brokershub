"use client";

import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { Icon } from "../Icons";
import { btnDark, btnLight } from "./ui";

export const input =
  "mt-1.5 block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold placeholder:font-normal placeholder:text-ink-soft";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

/** A centred dialog. Esc and the backdrop close it, and focus moves to its first field. */
export function Modal({
  title,
  sub,
  onClose,
  onSubmit,
  submitLabel,
  error,
  children,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  error?: string | null;
  children: ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    form.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/40" onClick={onClose} tabIndex={-1} />
      <form
        ref={form}
        onSubmit={submit}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tight">{title}</h2>
            {sub && <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-tint">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">{children}</div>
        {error && (
          <p role="alert" className="mx-6 mb-4 rounded-xl border border-accent/50 bg-accent/10 px-4 py-2.5 text-sm font-semibold">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className={btnLight}>
            Cancel
          </button>
          <button type="submit" className={btnDark}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
