"use client";

import { Avatar, Card, CardHead, PageHeading, Pill, Progress } from "./ui";
import { daysFromToday, fmtDate, initialsOf, team } from "@/lib/demo-data";

export function TeamView() {
  return (
    <>
      <PageHeading
        title="Team and CPD"
        sub="CPD hours and lender accreditations for each broker, flagged before anything lapses."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {team.map((m) => {
          const pct = Math.min(100, Math.round((m.cpdDone / m.cpdTarget) * 100));
          return (
            <Card key={m.name}>
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Avatar initials={initialsOf(m.name)} tone={0} />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-base font-extrabold tracking-tight">{m.name}</h2>
                  <p className="text-xs text-ink-soft">{m.role}</p>
                </div>
              </div>
              <div className="border-b border-line px-5 py-4">
                <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
                  <span>CPD hours this year</span>
                  <span className="tabular-nums">
                    {m.cpdDone} of {m.cpdTarget}
                  </span>
                </div>
                <Progress pct={pct} />
              </div>
              <CardHead title="Accreditations" />
              <ul>
                {m.accreditations.map((a) => {
                  const d = daysFromToday(a.expires);
                  const soon = d <= 60;
                  return (
                    <li key={a.lender} className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-0">
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
          );
        })}
      </div>
    </>
  );
}
