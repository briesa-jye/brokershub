"use client";

import { PageTitle } from "./DashShell";
import { useDemo } from "./DemoProvider";
import { daysFromToday, fmtDate } from "@/lib/demo-data";

export function ComplaintsView() {
  const { complaints, resolveComplaint } = useDemo();

  return (
    <>
      <PageTitle title="Complaints">
        Every complaint is logged the day it arrives, with its response deadline and each step toward closing it.
      </PageTitle>
      <ul className="space-y-4">
        {complaints.map((c) => {
          const left = daysFromToday(c.due);
          const urgent = !c.resolved && left <= 14;
          return (
            <li key={c.id} className={`rounded-2xl border p-5 sm:p-6 ${urgent ? "border-ink bg-tint" : "border-line bg-surface"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                    {c.id} · received {fmtDate(c.received)} · {c.owner}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-extrabold">{c.client}</h2>
                  <p className="mt-1 text-ink-soft">{c.summary}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider ${
                    c.resolved ? "bg-accent text-ink" : "bg-ink text-bg"
                  }`}
                >
                  {c.stage}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-sm">
                  <span className="font-semibold">Response due {fmtDate(c.due)}</span>{" "}
                  <span className="text-ink-soft">
                    {c.resolved ? "· closed within time" : `· ${left} days left`}
                  </span>
                </p>
                {!c.resolved && (
                  <button
                    type="button"
                    onClick={() => resolveComplaint(c.id)}
                    className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-bg hover:bg-ink/85"
                  >
                    Mark resolved
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
