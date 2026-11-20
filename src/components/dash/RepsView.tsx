"use client";

import { Avatar, Card, PageHeading, Pill, Progress } from "./ui";
import { LicenceCard } from "./LicenceCard";
import { useDemo } from "./DemoProvider";
import { daysFromToday, fmtDate, initialsOf } from "@/lib/demo-data";

export function RepsView() {
  const { reps } = useDemo();
  return (
    <>
      <PageHeading
        title="Representatives"
        sub="Everyone you are responsible for: authorisation, CPD, training and lender accreditations, flagged before anything lapses."
      />

      <div className="space-y-6">
        <LicenceCard />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {reps.map((m) => (
            <Card key={m.name}>
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Avatar initials={initialsOf(m.name)} tone={0} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-base font-extrabold tracking-tight">{m.name}</h2>
                  <p className="truncate text-xs text-ink-soft">
                    {m.kind} · since {fmtDate(m.authorised)}
                  </p>
                </div>
                <Pill tone={m.risk === "High" ? "owed" : "neutral"}>{m.risk}</Pill>
              </div>
              <div className="space-y-4 border-b border-line px-5 py-4">
                {[
                  ["CPD hours this year", m.cpdDone, m.cpdTarget],
                  ["Assigned training", m.trainingDone, m.trainingTotal],
                ].map(([k, d, t]) => (
                  <div key={k as string}>
                    <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
                      <span>{k}</span>
                      <span className="tabular-nums">
                        {d} of {t}
                      </span>
                    </div>
                    <Progress pct={Math.min(100, Math.round(((d as number) / (t as number)) * 100))} />
                  </div>
                ))}
              </div>
              <ul>
                {m.accreditations.map((a) => {
                  const d = daysFromToday(a.expires);
                  const soon = d <= 60;
                  return (
                    <li key={a.lender} className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{a.lender}</span>
                        <span className="block text-xs text-ink-soft">Expires {fmtDate(a.expires)}</span>
                      </span>
                      <Pill tone={soon ? "owed" : "ok"}>{soon ? `${d} days` : "Current"}</Pill>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
