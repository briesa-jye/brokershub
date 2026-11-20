"use client";

import { useState } from "react";
import { Avatar, Card, CardHead, PageHeading, Pill, Progress, btnDark, btnLight, type Tone } from "./ui";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { STEPS, fileStatus, fmtDate, initialsOf, money, type FileStatus } from "@/lib/demo-data";

const filters: { key: "all" | FileStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "flag", label: "Flagged" },
  { key: "open", label: "In progress" },
  { key: "clear", label: "Cleared" },
];

const tone: Record<FileStatus, Tone> = { clear: "ok", open: "neutral", flag: "owed" };
const label: Record<FileStatus, string> = { clear: "Cleared", open: "In progress", flag: "Flagged" };

export function FilesView() {
  const { files, toggleStep, selectedFileId, selectFile, reviews, reviewFile, resolveFinding } = useDemo();
  const [filter, setFilter] = useState<"all" | FileStatus>("all");
  const [query, setQuery] = useState("");

  const shown = files.filter(
    (f) =>
      (filter === "all" || fileStatus(f) === filter) &&
      `${f.client} ${f.purpose} ${f.broker} ${f.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = files.find((f) => f.id === selectedFileId) ?? files[0];
  const pct = Math.round((selected.done.length / STEPS.length) * 100);
  const review = reviews.find((v) => v.fileId === selected.id);
  const missing = STEPS.length - selected.done.length;
  const late = selected.overdue.filter((k) => !selected.done.includes(k)).length;

  return (
    <>
      <PageHeading
        title="Loan files"
        sub="Tick a step to put it on file. Status, overview and the audit pack all update."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {filters.map((x) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={filter === x.key}
              onClick={() => setFilter(x.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                filter === x.key ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:bg-tint"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <label className="ml-auto flex w-full items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 sm:w-64">
          <Icon name="search" className="h-4 w-4 shrink-0 text-ink-soft" />
          <span className="sr-only">Filter files</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by client or broker"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="self-start">
          {shown.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-soft">No files match.</p>
          ) : (
            <ul>
              {shown.map((f) => {
                const s = fileStatus(f);
                const on = f.id === selected.id;
                return (
                  <li key={f.id} className="border-b border-line last:border-0">
                    <button
                      type="button"
                      onClick={() => selectFile(f.id)}
                      aria-current={on}
                      className={`row-hover flex w-full items-center gap-3 px-5 py-3.5 text-left ${on ? "bg-tint" : ""}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {f.client}, {f.purpose.toLowerCase()}
                        </span>
                        <span className="block truncate text-xs text-ink-soft">
                          {f.id} · {money(f.amount)}
                        </span>
                      </span>
                      <Pill tone={tone[s]}>{label[s]}</Pill>
                      <Avatar initials={initialsOf(f.broker)} tone={1} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="self-start lg:sticky lg:top-24">
          <CardHead
            title={`${selected.client}, ${selected.purpose.toLowerCase()}`}
            sub={`${selected.id} · opened ${fmtDate(selected.opened)} · ${selected.broker}`}
            right={<Pill tone={tone[fileStatus(selected)]}>{label[fileStatus(selected)]}</Pill>}
          />
          <div className="border-b border-line px-5 py-4">
            <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
              <span>Steps on file</span>
              <span className="tabular-nums">
                {selected.done.length} of {STEPS.length}
              </span>
            </div>
            <Progress pct={pct} />
            <p className="mt-3 text-sm">
              {missing === 0
                ? "Ready: every step is on file and the file would stand up to a review."
                : late
                  ? `Hold: ${late} overdue step${late === 1 ? "" : "s"} and ${missing} missing in total. Fix before this goes to a lender.`
                  : `${missing} step${missing === 1 ? "" : "s"} still to complete.`}
            </p>
          </div>
          <ul>
            {STEPS.map((st) => {
              const done = selected.done.includes(st.key);
              const late = !done && selected.overdue.includes(st.key);
              return (
                <li key={st.key} className="border-b border-line last:border-0">
                  <label className="row-hover flex cursor-pointer items-center gap-3 px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleStep(selected.id, st.key)}
                      className="peer sr-only"
                    />
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink-soft/60 text-bg peer-checked:border-solid peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <span className={`min-w-0 flex-1 text-sm ${done ? "text-ink-soft line-through" : "font-semibold"}`}>
                      {st.label}
                    </span>
                    {late && <Pill tone="owed">Overdue</Pill>}
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-3 border-t border-line bg-bg px-5 py-4">
            <span className="min-w-0 flex-1 basis-40">
              <span className="block text-sm font-semibold">Supervision review</span>
              <span className="block text-xs text-ink-soft">
                {!review
                  ? "Not reviewed yet"
                  : review.outcome === "pass"
                    ? `Passed ${fmtDate(review.date)}`
                    : review.resolved
                      ? `Finding fixed (raised ${fmtDate(review.date)})`
                      : `Finding open since ${fmtDate(review.date)}`}
              </span>
            </span>
            {!review && (
              <>
                <button type="button" onClick={() => reviewFile(selected.id, "pass")} className={btnLight}>
                  Pass
                </button>
                <button type="button" onClick={() => reviewFile(selected.id, "fix")} className={btnDark}>
                  Needs fix
                </button>
              </>
            )}
            {review && review.outcome === "fix" && !review.resolved && (
              <button type="button" onClick={() => resolveFinding(selected.id)} className={btnLight}>
                Mark fixed
              </button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
