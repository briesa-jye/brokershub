import { USER } from "@/lib/demo-data";
import type { Api, Block, StreamEvent } from "./types";

/**
 * A small stand-in for the live model, used when no Claude API key is connected. It understands a handful of
 * requests about the sample workspace, runs the same tools the live assistant would (so the approval cards and
 * the changes are real), and writes the answer from the tool results. It cannot answer general compliance
 * questions: those need the live model.
 */

type Call = { name: string; input: Record<string, unknown> };
type Plan = { text: string; tools: Call[] };

const STOP = new Set(["Add", "New", "Team", "Member", "Representative", "Credit", "Log", "Open", "Record", "Create", "Start", "Please", "Can", "Could", "Loan", "File", "Onboard", "Broker", "Employee", "Licensee", "The", "A", "An", "Complaint", "Breach", "Catch", "Training"]);

const cap = /([A-Z][a-z'’-]+(?:\s[A-Z][a-z'’-]+)*)/g;
const names = (q: string) =>
  [...q.matchAll(cap)].map((m) => m[1].split(/\s+/).filter((w) => !STOP.has(w)).join(" ")).filter(Boolean);

const after = (q: string, re: RegExp) => q.match(re)?.[1]?.trim().replace(/[.]+$/, "");

function textOf(m: Api): string {
  if (typeof m.content === "string") return m.content;
  return m.content.map((b) => (b.type === "text" ? String(b.text ?? "") : "")).join(" ");
}

function plan(q: string): Plan {
  const l = q.toLowerCase();
  const ask = (text: string): Plan => ({ text, tools: [] });

  // changes
  if (/complain/.test(l) && /\b(log|record|add|new|lodge|received)\b/.test(l)) {
    const client = after(q, /(?:from|by|client)\s+([A-Z][\w'’-]+)/);
    const summary = after(q, /(?:about|regarding|over|re:)\s+(.+)$/i)?.replace(/[,;]?\s*(?:owner|assigned? to|handled by|owned by)\b.*$/i, "").trim();
    const owner = after(q, /(?:assigned? to|owner|handled by|owned by)\s+([A-Z][\w'’-]+(?:\s[A-Z][\w'’-]+)?)/) ?? USER.name;
    if (!client || !summary) return ask("Who is the complaint from, and what is it about? For example: log a complaint from Lopez about a late fee disclosure.");
    return { text: "Logging that now.", tools: [{ name: "log_complaint", input: { client, summary, owner } }] };
  }
  if (/breach/.test(l) && /\b(log|record|add|new|found|possible)\b/.test(l)) {
    const summary = after(q, /breach(?:\s+(?:where|that|of|-|:))?\s+(.+?)(?:\s+(?:by|involving)\s+[A-Z].*)?$/i);
    const rep = after(q, /(?:by|involving|rep(?:resentative)?)\s+([A-Z][\w'’-]+(?:\s[A-Z][\w'’-]+)?)/);
    if (!summary || !rep) return ask("What happened, and which representative was involved? For example: record a breach where a credit guide was issued late by Aaron.");
    return { text: "Recording it as a possible breach. You decide next whether it is reportable.", tools: [{ name: "record_breach", input: { summary, rep } }] };
  }
  if (/\b(add|onboard|new)\b/.test(l) && /\b(team member|representative|rep|broker|employee)\b/.test(l) && !/\bfile\b/.test(l)) {
    const name = names(q).find((n) => n.split(" ").length >= 2);
    if (!name) return ask("What is their full name, and are they a credit representative, an employee or a licensee?");
    const kind = /employee/.test(l) ? "Employee" : /licensee/.test(l) ? "Licensee" : "Credit representative";
    return { text: "Adding them to the team.", tools: [{ name: "add_team_member", input: { name, kind } }] };
  }
  if (/\b(open|add|new|create|start)\b/.test(l) && /\bfile\b/.test(l)) {
    const client = after(q, /(?:for|client)\s+([A-Z][\w'’-]+)/);
    if (!client) return ask("Which client is the loan file for, and what is it for (refinance, first home, investment)? Tell me the amount and broker if you have them.");
    const purpose = /refinanc/.test(l) ? "Refinance" : /first home/.test(l) ? "First home buyer" : /invest/.test(l) ? "Investment loan" : /construct/.test(l) ? "Construction" : /consolidat/.test(l) ? "Debt consolidation" : /upgrade/.test(l) ? "Upgrade and sell" : "Other";
    const m = l.match(/\$?\s?(\d[\d,.]*)\s*(k|m)?\b/);
    const amount = m ? Math.round(parseFloat(m[1].replace(/,/g, "")) * (m[2] === "m" ? 1_000_000 : m[2] === "k" ? 1_000 : 1)) : 0;
    const broker = after(q, /(?:broker|assigned? to)\s+([A-Z][\w'’-]+(?:\s[A-Z][\w'’-]+)?)/) ?? USER.name;
    return { text: "Opening that file.", tools: [{ name: "add_file", input: { client, purpose, amount, broker } }] };
  }
  if (/\b(log|record)\b/.test(l) && /(catch.?up|training|meeting)/.test(l)) {
    const who = after(q, /(?:with|for)\s+([A-Z][\w'’-]+(?:\s[A-Z][\w'’-]+)?)/);
    if (!who) return ask("Who was it with? For example: log a catch-up with Priya about disclosure timing.");
    const kind = /training/.test(l) ? "Training" : /meeting/.test(l) ? "Team meeting" : "Catch-up";
    const note = after(q, /(?:about|covering|covered|re)\s+(.+)$/i) ?? "";
    return { text: "Logging that contact.", tools: [{ name: "log_supervision_contact", input: { rep: who, kind, note } }] };
  }
  const cpd = l.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/);
  if (/cpd/.test(l) && cpd && /\b(log|add|record)\b/.test(l)) {
    const who = after(q, /(?:for|to)\s+([A-Z][\w'’-]+(?:\s[A-Z][\w'’-]+)?)/);
    if (!who) return ask("Whose CPD hours are they?");
    return { text: "Adding those hours.", tools: [{ name: "log_cpd", input: { rep: who, hours: Number(cpd[1]) } }] };
  }

  // questions
  if (/(contact|catch.?up|supervis|review|behind)/.test(l) && /(overdue|behind|due|who|which|how many)/.test(l))
    return { text: "Checking supervision.", tools: [{ name: "list_supervision", input: {} }] };
  if (/(outstanding|overdue|priorit|attention|today|this week|what needs|ready|gaps|inspection|audit)/.test(l))
    return { text: "Checking your files, supervision, complaints and breaches.", tools: [{ name: "get_overview", input: {} }, { name: "list_supervision", input: {} }] };
  if (/(flagged|incomplete|missing|loan file|files)/.test(l))
    return { text: "Looking at your files.", tools: [{ name: "list_files", input: /flag|overdue|incomplete|missing/.test(l) ? { status: "flag" } : {} }] };
  if (/complaint/.test(l)) return { text: "Reading the complaints register.", tools: [{ name: "list_complaints", input: { open_only: true } }] };
  if (/(breach|asic|reportable)/.test(l)) return { text: "Reading the breaches register.", tools: [{ name: "list_breaches", input: {} }] };
  if (/(licen[cs]e|afca|insurance|renew)/.test(l)) return { text: "Checking licence health.", tools: [{ name: "list_licence", input: {} }] };
  if (/(team|cpd|training|accredit|people)/.test(l)) return { text: "Checking the team.", tools: [{ name: "list_team", input: {} }] };

  return ask(
    "I am running in demo mode, so I can look across your sample files, supervision, complaints, breaches and licence dates, and make changes like logging a complaint, opening a file or adding a team member. Try: what is outstanding this week, or log a complaint from Lopez about a late fee disclosure. General compliance questions need the live assistant, which is switched on by adding a Claude API key.",
  );
}

/* ---------- writing the answer from tool results ---------- */

type J = Record<string, unknown>;
const arr = (v: unknown): J[] => (Array.isArray(v) ? (v as J[]) : []);
const parse = (s: string): unknown => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

function summarise(api: Api[]): string {
  const last = api[api.length - 1];
  const prev = api[api.length - 2];
  const results = (Array.isArray(last.content) ? last.content : []).filter((b) => b.type === "tool_result");
  const uses = Array.isArray(prev?.content) ? (prev.content as Block[]).filter((b) => b.type === "tool_use") : [];
  const nameOf = (id: unknown) => String(uses.find((u) => u.id === id)?.name ?? "");

  const data: Record<string, unknown> = {};
  const out: string[] = [];
  for (const r of results) {
    const name = nameOf(r.tool_use_id);
    const content = String(r.content ?? "");
    if (r.is_error) {
      out.push(`I could not do that: ${content}`);
      continue;
    }
    data[name] = parse(content);
    if (/^(add_|log_|record_)/.test(name)) out.push(`Done. ${content}`);
    if (name === "open_page") out.push(content);
  }

  const lines: string[] = [];
  const ov = data.get_overview as J | undefined;
  const sup = data.list_supervision as J | undefined;
  if (ov) {
    const breaches = arr(ov.breachesLive);
    const flagged = arr((ov.files as J)?.flagged);
    const complaints = arr(ov.complaintsOpen);
    const lic = arr(ov.licenceDue);
    const overdue = arr(ov.supervisionOverdue);
    lines.push("**In order of urgency**");
    breaches.forEach((b) => lines.push(`- Breach ${b.id}: ${b.status === "Reportable" ? "lodge with ASIC" : "decide if reportable"}, ${b.daysLeft} days left. ${b.summary}`));
    flagged.forEach((f) => lines.push(`- ${f.client} (${f.id}, ${f.broker}): overdue ${(f.overdueSteps as string[]).join(", ").toLowerCase()}`));
    overdue.forEach((o) => lines.push(`- Contact ${o.rep}: ${o.daysOverdue} days past their ${o.cadenceDays}-day cadence`));
    complaints.forEach((c) => lines.push(`- Complaint ${c.id} (${c.client}): response due in ${c.daysLeft} days, ${c.owner}`));
    lic.forEach((x) => lines.push(`- ${x.item}: ${x.daysLeft} days`));
    const findings = arr(ov.openFindings);
    if (findings.length) lines.push(`- ${findings.length} review finding${findings.length === 1 ? "" : "s"} still open`);
    if (lines.length === 1) lines.push("Nothing is overdue. You are up to date.");
    else lines.push("", "Want me to log a supervision contact for anyone, or send you to a page to deal with one?");
  } else if (sup) {
    lines.push("**Supervision**");
    arr(sup.reps).forEach((r) => lines.push(`- ${r.rep} (${String(r.risk).toLowerCase()} risk): ${r.status}, reviews ${r.reviews}`));
    const findings = arr(sup.openFindings);
    if (findings.length) lines.push("", `${findings.length} review finding${findings.length === 1 ? " is" : "s are"} still open.`);
  }
  if (sup && ov) {
    // already folded into the overview above
  }
  const files = data.list_files as unknown;
  if (Array.isArray(files)) {
    lines.push(files.length ? `**${files.length} loan file${files.length === 1 ? "" : "s"}**` : "No files match.");
    arr(files).slice(0, 10).forEach((f) => lines.push(`- ${f.client}, ${String(f.purpose).toLowerCase()} (${f.id}, ${f.broker}): ${f.status === "flag" ? "flagged" : f.status === "clear" ? "cleared" : "in progress"}, ${f.stepsDone} steps${(f.overdue as string[]).length ? `, overdue: ${(f.overdue as string[]).join(", ").toLowerCase()}` : ""}`));
  }
  const cs = data.list_complaints as unknown;
  if (Array.isArray(cs)) {
    lines.push(cs.length ? "**Open complaints**" : "No open complaints.");
    arr(cs).forEach((c) => lines.push(`- ${c.id} ${c.client}: ${c.summary}. ${c.stage}, ${c.owner}, ${c.daysLeft} days left`));
  }
  const bs = data.list_breaches as unknown;
  if (Array.isArray(bs)) {
    lines.push("**Breaches**");
    arr(bs).forEach((b) => lines.push(`- ${b.id} ${b.summary} (${b.rep}): ${b.status}${b.status === "Assessing" || b.status === "Reportable" ? `, lodge by ${b.lodgeBy} (${b.daysLeft} days)` : ""}`));
    lines.push("", "Whether something is reportable is your decision as licensee. I can only record and track them.");
  }
  const lic = data.list_licence as unknown;
  if (Array.isArray(lic)) {
    lines.push("**Licence health**");
    arr(lic).forEach((x) => lines.push(`- ${x.item}: ${x.detail}${x.date ? `, ${x.date} (${x.daysLeft} days)` : ""}`));
  }
  const team = data.list_team as unknown;
  if (Array.isArray(team)) {
    lines.push("**Team**");
    arr(team).forEach((r) => lines.push(`- ${r.name} (${String(r.kind).toLowerCase()}, ${String(r.risk).toLowerCase()} risk): CPD ${r.cpd}, training ${r.training}`));
  }
  return [...out, ...(out.length && lines.length ? [""] : []), ...lines].join("\n") || "Done.";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function* demoModel(api: Api[]): AsyncGenerator<StreamEvent> {
  const last = api[api.length - 1];
  const isResult = Array.isArray(last.content) && last.content.some((b) => b.type === "tool_result");
  const { text, tools } = isResult ? { text: summarise(api), tools: [] as Call[] } : plan(textOf(last));

  // stream the words so it reads like a reply being written
  const words = text.split(/(\s+)/);
  for (let i = 0; i < words.length; i += 4) {
    yield { t: "text", d: words.slice(i, i + 4).join("") };
    await sleep(14);
  }
  const content: Block[] = [
    ...(text ? [{ type: "text", text } as Block] : []),
    ...tools.map((t, i) => ({ type: "tool_use", id: `demo_${Date.now().toString(36)}_${i}`, name: t.name, input: t.input }) as Block),
  ];
  yield { t: "final", stop: tools.length ? "tool_use" : "end_turn", content };
}
