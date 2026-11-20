"use client";

import Link from "next/link";
import { PageTitle, StatusPill } from "./DashShell";
import { useDemo } from "./DemoProvider";
import {
  BROKERS,
  STEPS,
  activity,
  daysFromToday,
  fileStatus,
  fmtDate,
  team,
  USER,
} from "@/lib/demo-data";

function Stat({ label, value, sub, hot }: { label: string; value: string; sub: string; hot?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${hot ? "border-ink bg-ink text-bg" : "border-line bg-surface"}`}>
      <p className={`font-mono text-[0.7rem] uppercase tracking-widest ${hot ? "text-accent" : "text-ink-soft"}`}>{label}</p>
      <p className="mt-3 font-display text-4xl font-extrabold tracking-tight">{value}</p>
      <p className={`mt-1 text-sm ${hot ? "text-bg/75" : "text-ink-soft"}`}>{sub}</p>
    </div>
  );
}

export function Overview() {
  const { files, complaints } = useDemo();
  const status = files.map((f) => ({ f, s: fileStatus(f) }));
  const cleared = status.filter((x) => x.s === "clear").length;
  const flagged = status.filter((x) => x.s === "flag");
  const openComplaints = complaints.filter((c) => !c.resolved);
  const cpdOnTrack = team.filter((m) => m.cpdDone >= m.cpdTarget * 0.55).length;

  const expiring = team.flatMap((m) =>
    m.accreditations
      .filter((a) => daysFromToday(a.expires) <= 60)
      .map((a) => ({ who: m.name, ...a, days: daysFromToday(a.expires) })),
  );

  return (
    <>
      <PageTitle title={`Good morning, ${USER.name.split(" ")[0]}`}>
        Here is what needs a decision today. Everything else is already on file.
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Files cleared" value={`${cleared} of ${files.length}`} sub="complete and defensible" />
        <Stat label="Flagged" value={String(flagged.length)} sub="overdue on a required step" hot={flagged.length > 0} />
        <Stat label="Open complaints" value={String(openComplaints.length)} sub="30-day response clock running" />
        <Stat label="CPD on track" value={`${cpdOnTrack} of ${team.length}`} sub="brokers at pace for the year" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-extrabold">Needs attention</h2>
          <ul>
            {flagged.map(({ f }) => {
              const step = STEPS.find((s) => f.overdue.includes(s.key) && !f.done.includes(s.key));
              return (
                <li key={f.id} className="flex items-center justify-between gap-4 border-b border-line bg-tint/60 px-5 py-4 last:border-b-0">
                  <div className="min-w-0">
                    <p className="font-display font-bold">{f.client}, {f.purpose.toLowerCase()}</p>
                    <p className="text-sm text-ink-soft">{step?.label} is overdue · {f.broker}</p>
                  </div>
                  <Link href="/dashboard/files" className="shrink-0 text-sm font-semibold underline underline-offset-4">Open file</Link>
                </li>
              );
            })}
            {openComplaints.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0">
                <div className="min-w-0">
                  <p className="font-display font-bold">Complaint {c.id}, {c.client}</p>
                  <p className="text-sm text-ink-soft">Response due {fmtDate(c.due)} ({daysFromToday(c.due)} days)</p>
                </div>
                <Link href="/dashboard/complaints" className="shrink-0 text-sm font-semibold underline underline-offset-4">View</Link>
              </li>
            ))}
            {expiring.map((a) => (
              <li key={a.who + a.lender} className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0">
                <div className="min-w-0">
                  <p className="font-display font-bold">{a.lender} accreditation, {a.who}</p>
                  <p className="text-sm text-ink-soft">Expires {fmtDate(a.expires)} ({a.days} days)</p>
                </div>
                <Link href="/dashboard/team" className="shrink-0 text-sm font-semibold underline underline-offset-4">View</Link>
              </li>
            ))}
            {flagged.length + openComplaints.length + expiring.length === 0 && (
              <li className="px-5 py-8 text-ink-soft">Nothing needs attention.</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-surface">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-extrabold">Files cleared by broker</h2>
          <ul className="space-y-5 p-5">
            {BROKERS.map((b) => {
              const mine = status.filter((x) => x.f.broker === b);
              const done = mine.filter((x) => x.s === "clear").length;
              const pct = mine.length ? Math.round((done / mine.length) * 100) : 0;
              return (
                <li key={b}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{b}</span>
                    <span className="font-mono text-ink-soft">{done}/{mine.length}</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-tint">
                    <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 font-display text-lg font-extrabold">Recent activity</h2>
        <ol>
          {activity.map((a) => (
            <li key={a.when + a.text} className="grid gap-1 border-b border-line px-5 py-3.5 text-sm last:border-b-0 sm:grid-cols-[9rem_1fr_auto] sm:gap-4">
              <span className="font-mono text-ink-soft">{a.when}</span>
              <span>{a.text}</span>
              <span className="text-ink-soft">{a.who}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
        <StatusPill status="clear" /> means every required step is on file.
      </p>
    </>
  );
}
