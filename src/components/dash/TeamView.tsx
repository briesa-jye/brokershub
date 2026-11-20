"use client";

import { PageTitle } from "./DashShell";
import { daysFromToday, fmtDate, team } from "@/lib/demo-data";

export function TeamView() {
  return (
    <>
      <PageTitle title="Team and CPD">
        CPD hours and lender accreditations per broker, with a flag before anything lapses.
      </PageTitle>
      <div className="grid gap-6 lg:grid-cols-3">
        {team.map((m) => {
          const pct = Math.min(100, Math.round((m.cpdDone / m.cpdTarget) * 100));
          return (
            <section key={m.name} className="rounded-2xl border border-line bg-surface">
              <div className="border-b border-line p-5">
                <h2 className="font-display text-xl font-extrabold">{m.name}</h2>
                <p className="text-sm text-ink-soft">{m.role}</p>
                <div className="mt-5 flex justify-between text-sm font-semibold">
                  <span>CPD hours this year</span>
                  <span className="font-mono">{m.cpdDone}/{m.cpdTarget}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-tint">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <ul>
                {m.accreditations.map((a) => {
                  const d = daysFromToday(a.expires);
                  const soon = d <= 60;
                  return (
                    <li key={a.lender} className={`flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 text-sm last:border-b-0 ${soon ? "bg-tint" : ""}`}>
                      <span className="font-semibold">{a.lender}</span>
                      <span className="text-right text-ink-soft">
                        {fmtDate(a.expires)}
                        {soon && <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-widest text-ink">{d} days</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
