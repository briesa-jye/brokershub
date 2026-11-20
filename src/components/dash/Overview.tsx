"use client";

import Link from "next/link";
import { Icon } from "../Icons";
import { Avatar, Card, CardHead, PageHeading, Pill, Progress, Stat, btnDark, btnLight } from "./ui";
import { useDemo } from "./DemoProvider";
import {
  BROKERS,
  STEPS,
  activity,
  daysFromToday,
  fileStatus,
  fmtDate,
  initialsOf,
  team,
  USER,
} from "@/lib/demo-data";

export function Overview() {
  const { files, complaints, selectFile } = useDemo();
  const status = files.map((f) => ({ f, s: fileStatus(f) }));
  const cleared = status.filter((x) => x.s === "clear").length;
  const flagged = status.filter((x) => x.s === "flag");
  const openComplaints = complaints.filter((c) => !c.resolved);
  const cpdOnTrack = team.filter((m) => m.cpdDone >= m.cpdTarget * 0.55).length;
  const stepsMissing = files.reduce((n, f) => n + (STEPS.length - f.done.length), 0);

  const expiring = team
    .flatMap((m) =>
      m.accreditations
        .filter((a) => daysFromToday(a.expires) <= 60)
        .map((a) => ({ who: m.name, ...a, days: daysFromToday(a.expires) })),
    )
    .sort((a, b) => a.days - b.days);

  type Item = { key: string; t: string; where: string; due: string; owed: boolean; who: string; href: string; id?: string };
  const items: Item[] = [
    ...flagged.map(({ f }) => {
      const step = STEPS.find((s) => f.overdue.includes(s.key) && !f.done.includes(s.key));
      return {
        key: f.id,
        t: `${step?.label ?? "Step"} is overdue`,
        where: `${f.client}, ${f.purpose.toLowerCase()}`,
        due: "Overdue",
        owed: true,
        who: f.broker,
        href: "/dashboard/files",
        id: f.id,
      };
    }),
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
  ];

  return (
    <>
      <PageHeading
        title={`Good morning, ${USER.name.split(" ")[0]}`}
        sub="Here is what needs you today across the brokerage."
        actions={
          <>
            <Link href="/dashboard/audit" className={btnLight}>
              <Icon name="download" className="h-4 w-4" /> Audit pack
            </Link>
            <Link href="/dashboard/files" className={btnDark}>
              <Icon name="plus" className="h-4 w-4" /> New loan file
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Files cleared" value={`${cleared} of ${files.length}`} note="complete and defensible" />
        <Stat label="Steps still missing" value={String(stepsMissing)} note={`${flagged.length} overdue`} tone="owed" />
        <Stat label="Open complaints" value={String(openComplaints.length)} note="30-day response clock running" />
        <Stat label="CPD on track" value={`${cpdOnTrack} of ${team.length}`} note="brokers at pace for the year" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead
            title="Needs attention"
            sub="Overdue steps and complaint deadlines"
            right={items.length > 0 ? <Pill tone="owed">{items.length} items</Pill> : undefined}
          />
          {items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Nothing overdue or due soon.</p>
          ) : (
            <ul>
              {items.map((a) => (
                <li key={a.key} className="border-b border-line last:border-0">
                  <Link
                    href={a.href}
                    onClick={() => a.id && selectFile(a.id)}
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

        <Card>
          <CardHead title="Files cleared by broker" sub="Complete files out of all files" />
          <ul className="space-y-4 p-5">
            {BROKERS.map((b) => {
              const mine = status.filter((x) => x.f.broker === b);
              const done = mine.filter((x) => x.s === "clear").length;
              const pct = mine.length ? Math.round((done / mine.length) * 100) : 0;
              return (
                <li key={b}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold">{b}</span>
                    <span className="text-xs tabular-nums text-ink-soft">
                      {done} of {mine.length}
                    </span>
                  </div>
                  <Progress pct={pct} />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHead
            title="Expiring soon"
            sub="Accreditations and CPD"
            right={
              <Link href="/dashboard/team" className="text-xs font-semibold underline">
                All
              </Link>
            }
          />
          {expiring.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-soft">Nothing due in the next 60 days.</p>
          ) : (
            <ul className="divide-y divide-line">
              {expiring.map((a) => (
                <li key={a.who + a.lender} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{a.lender} accreditation</span>
                    <span className="block truncate text-xs text-ink-soft">
                      {a.who} · {fmtDate(a.expires)}
                    </span>
                  </span>
                  <Pill tone="owed">{a.days} days</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHead title="Recent activity" sub="Latest changes across the brokerage" />
          <ul className="divide-y divide-line">
            {activity.map((a) => (
              <li key={a.when + a.text} className="flex items-center gap-3 px-5 py-3">
                <Avatar initials={a.who === "System" ? "SY" : initialsOf(a.who)} tone={a.who === "System" ? 2 : 1} />
                <span className="min-w-0 flex-1 truncate text-sm">{a.text}</span>
                <span className="shrink-0 font-mono text-xs text-ink-soft">{a.when}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
