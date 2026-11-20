"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icons";
import { Avatar, Pill } from "./ui";
import { useAttention } from "./attention";
import { useDemo } from "./DemoProvider";
import { initialsOf } from "@/lib/demo-data";

/** The bell: breaches, overdue files, supervision, complaints and licence dates, filtered by the person's notification settings. */
export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { notify, selectFile } = useDemo();
  const items = useAttention().filter((i) => notify[i.kind]);
  const urgent = items.filter((i) => i.owed).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label={`Notifications${items.length ? `, ${items.length} reminder${items.length === 1 ? "" : "s"}` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-tint"
      >
        <Icon name="bell" className="h-5 w-5" />
        {items.length > 0 && (
          <span
            className={`absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              urgent ? "bg-accent text-ink" : "bg-ink-soft text-bg"
            }`}
          >
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="font-display text-base font-extrabold">Reminders</p>
            <Link
              href="/dashboard/settings?tab=notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold underline"
            >
              Settings
            </Link>
          </div>
          {items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Nothing is due. You are up to date.</p>
          ) : (
            <ul className="max-h-[26rem] divide-y divide-line overflow-y-auto">
              {items.map((a) => (
                <li key={a.key}>
                  <Link
                    href={a.href}
                    onClick={() => {
                      if (a.fileId) selectFile(a.fileId);
                      setOpen(false);
                    }}
                    className="row-hover flex items-center gap-3 px-5 py-3"
                  >
                    <Avatar initials={initialsOf(a.who)} tone={1} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{a.t}</span>
                      <span className="block truncate text-xs text-ink-soft">{a.where}</span>
                    </span>
                    <Pill tone={a.owed ? "owed" : "neutral"}>{a.due}</Pill>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
