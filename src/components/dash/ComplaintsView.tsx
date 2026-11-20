"use client";

import { useState } from "react";
import { Avatar, Card, PageHeading, Pill, btnDark } from "./ui";
import { NewComplaintModal } from "./modals";
import { input } from "./forms";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { COMPLAINT_STAGES, daysFromToday, fmtDate, initialsOf } from "@/lib/demo-data";

export function ComplaintsView() {
  const { complaints, setComplaintStage } = useDemo();
  const [adding, setAdding] = useState(false);
  const open = complaints.filter((c) => !c.resolved).length;

  return (
    <>
      <PageHeading
        title="Complaints"
        sub="Each complaint is logged the day it arrives, with its response deadline and every step toward closing it."
        actions={
          <>
            <Pill tone={open ? "owed" : "ok"}>{open} open</Pill>
            <button type="button" onClick={() => setAdding(true)} className={btnDark}>
              <Icon name="plus" className="h-4 w-4" /> Log complaint
            </button>
          </>
        }
      />
      <Card>
        {complaints.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">No complaints logged.</p>
        ) : (
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
                        {c.resolved ? " (closed)" : left < 0 ? ` (${-left} days late)` : ` (${left} days left)`}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                      Stage
                      <select
                        aria-label={`Stage of complaint ${c.id}`}
                        value={c.stage}
                        onChange={(e) => setComplaintStage(c.id, e.target.value)}
                        className={`${input} mt-0 w-auto rounded-full py-2`}
                      >
                        {COMPLAINT_STAGES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      {adding && <NewComplaintModal onClose={() => setAdding(false)} />}
    </>
  );
}
