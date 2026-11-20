"use client";

import { useMemo, useState } from "react";
import { Icon } from "../Icons";
import { PageHeading, btnDark } from "./ui";
import { HELP, HELP_CATEGORIES } from "@/lib/help";
import { CONTACT_EMAIL } from "@/lib/site";

export function HelpView() {
  const [q, setQ] = useState("");
  const tokens = useMemo(() => q.toLowerCase().split(/\s+/).filter(Boolean), [q]);
  const found = useMemo(
    () =>
      HELP.filter((a) => {
        const t = `${a.title} ${a.summary} ${a.category} ${a.body.join(" ")}`.toLowerCase();
        return tokens.every((tok) => t.includes(tok));
      }),
    [tokens],
  );

  return (
    <div>
      <PageHeading title="Help" sub="Short guides to getting around BROKERSHUB and getting the work done." />

      <label className="mb-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft focus-within:border-ink-soft">
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <span className="sr-only">Search help</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help, for example breach or cadence"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft"
        />
      </label>

      {found.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-ink-soft">
          No guides match &ldquo;{q.trim()}&rdquo;. Try another word, or email us.
        </p>
      ) : (
        <div className="space-y-9">
          {HELP_CATEGORIES.map((cat) => {
            const list = found.filter((a) => a.category === cat);
            if (!list.length) return null;
            return (
              <section key={cat} aria-labelledby={`h-${cat}`}>
                <h2 id={`h-${cat}`} className="mb-3 font-display text-lg font-extrabold tracking-tight">
                  {cat}
                </h2>
                <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                  {list.map((a) => (
                    <details key={a.id} className="group border-b border-line last:border-0" open={tokens.length > 0}>
                      <summary className="row-hover flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold leading-snug">{a.title}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{a.summary}</span>
                        </span>
                        <Icon name="plus" className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-45" />
                      </summary>
                      <div className="max-w-2xl space-y-3 px-5 pb-5 text-sm text-ink-soft">
                        {a.body.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="font-display text-base font-extrabold">Can&apos;t find it?</p>
          <p className="mt-0.5 text-sm text-ink-soft">Tell us what you were trying to do and we will help.</p>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}?subject=BROKERSHUB%20help`} className={btnDark}>
          Email support
        </a>
      </div>
    </div>
  );
}
