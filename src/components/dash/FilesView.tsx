"use client";

import { useState } from "react";
import { PageTitle, StatusPill } from "./DashShell";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { STEPS, fileStatus, fmtDate, money, type FileStatus } from "@/lib/demo-data";

const filters: { key: "all" | FileStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "flag", label: "Flagged" },
  { key: "open", label: "In progress" },
  { key: "clear", label: "Cleared" },
];

export function FilesView() {
  const { files, toggleStep } = useDemo();
  const [filter, setFilter] = useState<"all" | FileStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("LF-1043");

  const shown = files.filter(
    (f) =>
      (filter === "all" || fileStatus(f) === filter) &&
      `${f.client} ${f.purpose} ${f.broker} ${f.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = files.find((f) => f.id === selectedId) ?? files[0];

  return (
    <>
      <PageTitle title="Loan files">
        Tick a step to put it on file. The status, the overview and the audit pack all update.
      </PageTitle>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {filters.map((x) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={filter === x.key}
              onClick={() => setFilter(x.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === x.key ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:bg-tint"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <label className="ml-auto flex w-full items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 sm:w-64">
          <span className="sr-only">Search files</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client or broker"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ul className="self-start overflow-hidden rounded-2xl border border-line bg-surface">
          {shown.map((f) => {
            const s = fileStatus(f);
            const on = f.id === selected.id;
            return (
              <li key={f.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  aria-current={on}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
                    on ? "bg-tint" : "hover:bg-tint/60"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-display font-bold">{f.client}, {f.purpose.toLowerCase()}</p>
                    <p className="truncate text-sm text-ink-soft">
                      {f.id} · {f.broker} · {money(f.amount)}
                    </p>
                  </div>
                  <StatusPill status={s} />
                </button>
              </li>
            );
          })}
          {shown.length === 0 && <li className="px-5 py-10 text-center text-ink-soft">No files match.</li>}
        </ul>

        <aside className="self-start rounded-2xl border border-line bg-surface lg:sticky lg:top-6">
          <div className="border-b border-line px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold">{selected.client}, {selected.purpose.toLowerCase()}</h2>
                <p className="text-sm text-ink-soft">
                  {selected.id} · opened {fmtDate(selected.opened)} · {selected.broker}
                </p>
              </div>
              <StatusPill status={fileStatus(selected)} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-tint">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${(selected.done.length / STEPS.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
              {selected.done.length} of {STEPS.length} steps on file
            </p>
          </div>
          <ul>
            {STEPS.map((st) => {
              const done = selected.done.includes(st.key);
              const late = !done && selected.overdue.includes(st.key);
              return (
                <li key={st.key} className={`border-b border-line last:border-b-0 ${late ? "bg-tint" : ""}`}>
                  <label className="flex cursor-pointer items-center gap-3 px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleStep(selected.id, st.key)}
                      className="peer sr-only"
                    />
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/40 bg-surface text-ink peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span className={`text-sm ${done ? "text-ink-soft line-through" : "font-semibold"}`}>{st.label}</span>
                    {late && <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-widest">Overdue</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </>
  );
}
