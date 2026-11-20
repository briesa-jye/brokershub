"use client";

import { Avatar, Card, PageHeading, Pill, btnDark } from "./ui";
import { useDemo } from "./DemoProvider";
import { daysFromToday, fmtDate, initialsOf } from "@/lib/demo-data";

export function ComplaintsView() {
  const { complaints, resolveComplaint } = useDemo();
  const open = complaints.filter((c) => !c.resolved).length;

  return (
    <>
      <PageHeading
        title="Complaints"
        sub="Each complaint is logged the day it arrives, with its response deadline and every step toward closing it."
        actions={<Pill tone={open ? "owed" : "ok"}>{open} open</Pill>}
      />
      <Card>
        <ul>
          {complaints.map((c) => {
            const left = daysFromToday(c.due);
            const urgent = !c.resolved && left <= 14;
            return (
              <li key={c.id} className={`border-b border-line last:border-0 ${urgent ? "bg-accent/10" : ""}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                  <Avatar initials={initialsOf(c.owner)} tone={1} />
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="text-sm font-semibold">
                      {c.id} · {c.client}
                    </p>
                    <p className="text-sm text-ink-soft">{c.summary}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Received {fmtDate(c.received)} · {c.owner} · response due {fmtDate(c.due)}
                      {c.resolved ? " (closed within time)" : ` (${left} days left)`}
                    </p>
                  </div>
                  <Pill tone={c.resolved ? "ok" : urgent ? "owed" : "neutral"}>{c.stage}</Pill>
                  {!c.resolved && (
                    <button type="button" onClick={() => resolveComplaint(c.id)} className={btnDark}>
                      Mark resolved
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
