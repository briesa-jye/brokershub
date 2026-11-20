"use client";

import Link from "next/link";
import { Icon } from "../Icons";
import { Avatar, Card, CardHead, PageHeading, Pill, Progress, Stat, btnDark, btnLight } from "./ui";
import { LicenceCard } from "./LicenceCard";
import { useDemo } from "./DemoProvider";
import {
  REVIEWS_REQUIRED,
  STEPS,
  USER,
  daysFromToday,
  fileStatus,
  fmtDate,
  initialsOf,
  licence,
  supervisionStatus,
} from "@/lib/demo-data";

type Item = {
  key: string;
  t: string;
  where: string;
  due: string;
  owed: boolean;
  who: string;
  href: string;
  fileId?: string;
};

export function Overview() {
  const { files, complaints, reps, reviews, breaches, log, selectFile } = useDemo();

  const flagged = files.filter((f) => fileStatus(f) === "flag");
  const cleared = files.filter((f) => fileStatus(f) === "clear").length;
  const openComplaints = complaints.filter((c) => !c.resolved);
  const liveBreaches = breaches.filter((b) => b.status === "Assessing" || b.status === "Reportable");
  const supervision = reps.map((r) => ({ r, st: supervisionStatus(r) }));
  const overdueReps = supervision.filter((x) => x.st.state === "overdue");
  const openFindings = reviews.filter((v) => !v.resolved).length;

  const items: Item[] = [
    ...liveBreaches.map((b) => {
      const d = daysFromToday(b.due);
      return {
        key: b.id,
        t: b.status === "Reportable" ? `Lodge ${b.id} with ASIC` : `Decide if ${b.id} is reportable`,
        where: b.summary,
        due: `${d} days left`,
        owed: b.status === "Reportable" || d <= 14,
        who: b.rep,
        href: "/dashboard/breaches",
      };
    }),
    ...flagged.map((f) => {
      const step = STEPS.find((s) => f.overdue.includes(s.key) && !f.done.includes(s.key));
      return {
        key: f.id,
        t: `${step?.label ?? "Step"} is overdue`,
        where: `${f.client}, ${f.purpose.toLowerCase()}`,
        due: "Overdue",
        owed: true,
        who: f.broker,
        href: "/dashboard/files",
        fileId: f.id,
      };
    }),
    ...overdueReps.map(({ r, st }) => ({
      key: `sup-${r.name}`,
      t: `Contact ${r.name}`,
      where: `${st.cadence}-day cadence, last contact ${fmtDate(r.lastContact)}`,
      due: `Overdue ${-st.left} days`,
      owed: true,
      who: r.name,
      href: "/dashboard/supervision",
    })),
    ...openComplaints.map((c) => {
      const d = daysFromToday(c.due);
      return {
        key: c.id,
        t: `Respond to complaint ${c.id}`,
        where: `${c.client}: ${c.summary}`,
        due: `${d} days left`,
        owed: d <= 14,
        who: c.owner,
        href: "/dashboard/complaints",
      };
    }),
    ...licence
      .filter((l) => l.date && daysFromToday(l.date) <= 60)
      .map((l) => ({
        key: l.label,
        t: `${l.label}: ${l.dateLabel?.toLowerCase()} ${fmtDate(l.date!)}`,
        where: "Licence health",
        due: `${daysFromToday(l.date!)} days`,
        owed: true,
        who: USER.name,
        href: "/dashboard/representatives",
      })),
  ];

  return (
    <>
      <PageHeading
        title={`Good morning, ${USER.name.split(" ")[0]}`}
        sub="Here is what needs you today across your licence and everyone under it."
        actions={
          <>
            <Link href="/dashboard/audit" className={btnLight}>
              <Icon name="download" className="h-4 w-4" /> Audit pack
            </Link>
            <Link href="/dashboard/supervision" className={btnDark}>
              <Icon name="eye" className="h-4 w-4" /> Supervision
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Files cleared" value={`${cleared} of ${files.length}`} note={`${flagged.length} flagged overdue`} tone={flagged.length ? "owed" : undefined} />
        <Stat label="Supervision overdue" value={`${overdueReps.length} of ${reps.length}`} note={`${openFindings} open review findings`} tone={overdueReps.length ? "owed" : undefined} />
        <Stat label="Open complaints" value={String(openComplaints.length)} note="30-day response clock running" />
        <Stat label="Breaches to decide or lodge" value={String(liveBreaches.length)} note="30-day ASIC clock" tone={liveBreaches.length ? "owed" : undefined} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead
            title="Needs attention"
            sub="Breaches, files, supervision, complaints and licence dates"
            right={items.length > 0 ? <Pill tone="owed">{items.length} items</Pill> : undefined}
          />
          {items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Nothing needs attention.</p>
          ) : (
            <ul>
              {items.slice(0, 8).map((a) => (
                <li key={a.key} className="border-b border-line last:border-0">
                  <Link
                    href={a.href}
                    onClick={() => a.fileId && selectFile(a.fileId)}
                    className="row-hover flex items-center gap-3 px-5 py-3.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink-soft/60" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{a.t}</span>
                      <span className="block truncate text-xs text-ink-soft">{a.where}</span>
                    </span>
                    <Pill tone={a.owed ? "owed" : "neutral"}>{a.due}</Pill>
                    <Avatar initials={initialsOf(a.who)} tone={1} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <LicenceCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHead
            title="Supervision this quarter"
            sub="File reviews done against what each rep's risk rating expects"
            right={
              <Link href="/dashboard/supervision" className="text-xs font-semibold underline">
                Open
              </Link>
            }
          />
          <ul className="space-y-4 p-5">
            {reps.map((r) => {
              const need = REVIEWS_REQUIRED[r.risk];
              const done = reviews.filter((v) => files.find((f) => f.id === v.fileId)?.broker === r.name).length;
              return (
                <li key={r.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold">
                      {r.name} <span className="font-normal text-ink-soft">· {r.risk.toLowerCase()} risk</span>
                    </span>
                    <span className="text-xs tabular-nums text-ink-soft">
                      {Math.min(done, need)} of {need}
                    </span>
                  </div>
                  <Progress pct={Math.min(100, Math.round((done / need) * 100))} />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHead title="Recent activity" sub="Supervision contacts and reviews, as they are logged" />
          <ul className="divide-y divide-line">
            {log.slice(0, 6).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar initials={initialsOf(e.rep)} tone={1} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">
                    <span className="font-semibold">{e.kind}</span> · {e.rep}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">{e.note}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-ink-soft">{fmtDate(e.date)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
