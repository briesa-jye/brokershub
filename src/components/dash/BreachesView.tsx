"use client";

import { Avatar, Card, PageHeading, Pill, btnDark, btnLight, type Tone } from "./ui";
import { useDemo } from "./DemoProvider";
import { daysFromToday, fmtDate, initialsOf, type BreachStatus } from "@/lib/demo-data";

const tone: Record<BreachStatus, Tone> = {
  Assessing: "neutral",
  Reportable: "owed",
  Reported: "ok",
  "Not reportable": "ok",
};

export function BreachesView() {
  const { breaches, setBreachStatus } = useDemo();
  const live = breaches.filter((b) => b.status === "Assessing" || b.status === "Reportable").length;

  return (
    <>
      <PageHeading
        title="Breaches"
        sub="Record every possible breach the day it surfaces. If it is reportable, the 30-day clock to lodge with ASIC starts when you have reasonable grounds to believe so."
        actions={<Pill tone={live ? "owed" : "ok"}>{live} to decide or lodge</Pill>}
      />
      <Card>
        <ul>
          {breaches.map((b) => {
            const left = daysFromToday(b.due);
            const clock = b.status === "Assessing" || b.status === "Reportable";
            return (
              <li key={b.id} className={`border-b border-line last:border-0 ${b.status === "Reportable" ? "bg-accent/10" : ""}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                  <Avatar initials={initialsOf(b.rep)} tone={1} />
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="text-sm font-semibold">
                      {b.id} · {b.summary}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {b.rep} · found {fmtDate(b.found)}
                      {clock && ` · lodge by ${fmtDate(b.due)} (${left} days left)`}
                      {b.status === "Reported" && b.reportedOn && ` · reported ${fmtDate(b.reportedOn)}`}
                    </p>
                  </div>
                  <Pill tone={tone[b.status]}>{b.status}</Pill>
                  {b.status === "Assessing" && (
                    <>
                      <button type="button" onClick={() => setBreachStatus(b.id, "Not reportable")} className={btnLight}>
                        Not reportable
                      </button>
                      <button type="button" onClick={() => setBreachStatus(b.id, "Reportable")} className={btnDark}>
                        Reportable
                      </button>
                    </>
                  )}
                  {b.status === "Reportable" && (
                    <button type="button" onClick={() => setBreachStatus(b.id, "Reported")} className={btnDark}>
                      Mark reported
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
      <p className="mt-4 max-w-2xl text-xs text-ink-soft">
        BROKERSHUB keeps the record and the clock. Whether something is reportable, and what to lodge, is a decision for
        you as licensee, ideally with advice.
      </p>
    </>
  );
}
