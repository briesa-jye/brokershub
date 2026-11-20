"use client";

import { useDemo } from "./DemoProvider";
import { STEPS, USER, daysFromToday, fileStatus, fmtDate, supervisionStatus, type NotifyKey } from "@/lib/demo-data";

export type AttentionItem = {
  key: string;
  kind: NotifyKey;
  t: string;
  where: string;
  due: string;
  owed: boolean;
  who: string;
  href: string;
  fileId?: string;
};

/** Everything that needs the licensee: breaches, overdue files, supervision, complaints and licence dates. Used by the overview and the bell. */
export function useAttention(): AttentionItem[] {
  const { files, complaints, reps, breaches, policy, licenceItems } = useDemo();

  return [
    ...breaches
      .filter((b) => b.status === "Assessing" || b.status === "Reportable")
      .map((b): AttentionItem => {
        const d = daysFromToday(b.due);
        return {
          key: b.id,
          kind: "breaches",
          t: b.status === "Reportable" ? `Lodge ${b.id} with ASIC` : `Decide if ${b.id} is reportable`,
          where: b.summary,
          due: `${d} days left`,
          owed: b.status === "Reportable" || d <= 14,
          who: b.rep,
          href: "/dashboard/breaches",
        };
      }),
    ...files
      .filter((f) => fileStatus(f) === "flag")
      .map((f): AttentionItem => {
        const step = STEPS.find((s) => f.overdue.includes(s.key) && !f.done.includes(s.key));
        return {
          key: f.id,
          kind: "files",
          t: `${step?.label ?? "Step"} is overdue`,
          where: `${f.client}, ${f.purpose.toLowerCase()}`,
          due: "Overdue",
          owed: true,
          who: f.broker,
          href: "/dashboard/files",
          fileId: f.id,
        };
      }),
    ...reps
      .map((r) => ({ r, st: supervisionStatus(r, policy.cadence) }))
      .filter((x) => x.st.state === "overdue")
      .map(({ r, st }): AttentionItem => ({
        key: `sup-${r.name}`,
        kind: "supervision",
        t: `Contact ${r.name}`,
        where: `${st.cadence}-day cadence, last contact ${fmtDate(r.lastContact)}`,
        due: `Overdue ${-st.left} days`,
        owed: true,
        who: r.name,
        href: "/dashboard/supervision",
      })),
    ...complaints
      .filter((c) => !c.resolved)
      .map((c): AttentionItem => {
        const d = daysFromToday(c.due);
        return {
          key: c.id,
          kind: "complaints",
          t: `Respond to complaint ${c.id}`,
          where: `${c.client}: ${c.summary}`,
          due: `${d} days left`,
          owed: d <= 14,
          who: c.owner,
          href: "/dashboard/complaints",
        };
      }),
    ...licenceItems
      .filter((l) => l.date && daysFromToday(l.date) <= 60)
      .map((l): AttentionItem => ({
        key: l.label,
        kind: "licence",
        t: `${l.label}: ${l.dateLabel?.toLowerCase()} ${fmtDate(l.date!)}`,
        where: "Licence health",
        due: `${daysFromToday(l.date!)} days`,
        owed: true,
        who: USER.name,
        href: "/dashboard/representatives",
      })),
  ];
}
