import type { Demo } from "@/components/dash/DemoProvider";
import {
  STEPS,
  daysFromToday,
  fileStatus,
  fmtDate,
  money,
  supervisionStatus,
} from "./demo-data";

const MAX = 24_000;

/**
 * A compact, plain-text picture of the licensee's workspace as it stands today, sent with each question so
 * the assistant can answer about the business. The tools read anything more exact.
 */
export function buildContext(s: Demo, today: string): string {
  const out: string[] = [];
  out.push(`Today is ${today}.`);
  out.push(`LICENSEE: ${s.profile.workspace}, ACL ${s.profile.acl}.`);

  out.push("\nPEOPLE:");
  for (const r of s.reps) {
    const st = supervisionStatus(r, s.policy.cadence);
    out.push(
      `- ${r.name} (${r.kind}, ${r.risk} risk): last contact ${fmtDate(r.lastContact)}, ${st.state === "overdue" ? `OVERDUE ${-st.left} days` : st.state === "soon" ? `due in ${st.left} days` : "on track"}; CPD ${r.cpdDone}/${r.cpdTarget}; training ${r.trainingDone}/${r.trainingTotal}.`,
    );
  }

  out.push("\nLOAN FILES (id, client, purpose, broker, status, steps done):");
  for (const f of s.files) {
    const status = fileStatus(f);
    out.push(
      `- ${f.id} ${f.client}, ${f.purpose}, ${f.broker}, ${status === "flag" ? "FLAGGED" : status === "clear" ? "cleared" : "in progress"}, ${f.done.length}/${STEPS.length} steps, ${money(f.amount)}`,
    );
  }

  out.push("\nCOMPLAINTS:");
  for (const c of s.complaints)
    out.push(`- ${c.id} ${c.client}: ${c.summary}. ${c.stage}, owner ${c.owner}, response due ${fmtDate(c.due)} (${c.resolved ? "closed" : `${daysFromToday(c.due)} days left`}).`);

  out.push("\nBREACHES:");
  for (const b of s.breaches)
    out.push(`- ${b.id} ${b.summary} (${b.rep}): ${b.status}, lodge by ${fmtDate(b.due)} (${daysFromToday(b.due)} days).`);

  out.push("\nLICENCE:");
  for (const l of s.licenceItems)
    out.push(`- ${l.label}: ${l.detail}${l.date ? `, ${l.dateLabel ?? "due"} ${fmtDate(l.date)} (${daysFromToday(l.date)} days)` : ""}`);

  return out.join("\n").slice(0, MAX);
}

export type Suggestion = { title: string; prompt: string };

export const SUGGESTIONS: Suggestion[] = [
  {
    title: "What needs me today",
    prompt: "What is outstanding across the licence this week? Rank it by urgency.",
  },
  {
    title: "Get review ready",
    prompt:
      "Get us ready for an aggregator file review. Check files, supervision, complaints and breaches, tell me the gaps and what to fix first.",
  },
  {
    title: "Who am I overdue to contact",
    prompt: "Which representatives am I overdue to contact, and how many file reviews is everyone behind on?",
  },
  {
    title: "Log a complaint",
    prompt: "I want to log a new complaint. Ask me for the details you need, then record it.",
  },
];
