import type { Demo } from "../dash/DemoProvider";
import { toolByName } from "@/lib/agent-tools";
import {
  PURPOSES,
  STEPS,
  TODAY,
  daysFromToday,
  fileStatus,
  fmtDate,
  isISODate,
  money,
  supervisionStatus,
  type Risk,
  type SupervisionKind,
} from "@/lib/demo-data";

export type AppStore = Demo;
export type Input = Record<string, unknown>;
export type Outcome = {
  ok: boolean;
  /** What goes back to the model. */
  text: string;
  /** Short plain sentence for the person. */
  outcome?: string;
  link?: { path: string; label: string };
};

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const json = (v: unknown) => JSON.stringify(v).slice(0, 12_000);
const fail = (text: string): Outcome => ({ ok: false, text, outcome: text });
const norm = (v: string) => v.trim().toLowerCase();

/** Exact name first, then a unique first-name or partial match, so "Priya" finds Priya Nair. */
const repName = (store: AppStore, name: string) => {
  const n = norm(name);
  if (!n) return undefined;
  const exact = store.reps.find((r) => norm(r.name) === n);
  if (exact) return exact.name;
  const part = store.reps.filter((r) => norm(r.name).startsWith(n) || norm(r.name).split(" ").includes(n));
  return part.length === 1 ? part[0].name : undefined;
};
const fileLabel = (store: AppStore, id: string) => {
  const f = store.files.find((x) => x.id === id);
  return f ? `${f.client}, ${f.purpose.toLowerCase()} (${f.id})` : id;
};

/** Plain words for a step, used on approval cards and in the activity trail. */
export function describeTool(name: string, input: Input, store: AppStore): { title: string; detail?: string } {
  const who = (v: unknown) => repName(store, s(v)) ?? s(v);
  switch (name) {
    case "get_overview":
      return { title: "Checking what needs attention" };
    case "list_files":
      return { title: "Looking up loan files" };
    case "get_file":
      return { title: "Opening a loan file", detail: fileLabel(store, s(input.file_id)) };
    case "list_team":
      return { title: "Checking the team" };
    case "list_supervision":
      return { title: "Checking supervision" };
    case "list_complaints":
      return { title: "Reading the complaints register" };
    case "list_breaches":
      return { title: "Reading the breaches register" };
    case "list_licence":
      return { title: "Checking licence health" };
    case "open_page":
      return { title: "Finding the right page", detail: s(input.label) };
    case "add_file":
      return {
        title: "Open a loan file",
        detail: `${s(input.client)}, ${s(input.purpose).toLowerCase()}${Number(input.amount) ? `, ${money(Number(input.amount))}` : ""} · ${who(input.broker)}`,
      };
    case "add_file_note":
      return { title: "Add a file note", detail: `${fileLabel(store, s(input.file_id))}: ${s(input.note)}` };
    case "log_complaint":
      return { title: "Log a complaint", detail: `${s(input.client)}: ${s(input.summary)} · owner ${who(input.owner)}` };
    case "record_breach":
      return { title: "Record a possible breach", detail: `${s(input.summary)} · ${who(input.rep)}` };
    case "log_supervision_contact":
      return { title: `Log a ${s(input.kind).toLowerCase()}`, detail: `${who(input.rep)}${s(input.note) ? `: ${s(input.note)}` : ""}` };
    case "add_team_member":
      return { title: "Add a team member", detail: `${s(input.name)}, ${s(input.kind).toLowerCase()}${s(input.risk) ? `, ${s(input.risk).toLowerCase()} risk` : ""}` };
    case "log_cpd":
      return { title: "Log CPD hours", detail: `${who(input.rep)}: ${Number(input.hours)} hours` };
    default:
      return { title: name };
  }
}

/** Runs one tool against the workspace. Reads return data for the model; changes go through the same functions the pages use. */
export async function executeTool(name: string, input: Input, store: AppStore): Promise<Outcome> {
  if (!toolByName(name)) return fail(`Unknown tool ${name}.`);
  // let the workspace settle after a previous change in the same batch
  await new Promise((r) => setTimeout(r, 0));

  switch (name) {
    case "get_overview": {
      const flagged = store.files.filter((f) => fileStatus(f) === "flag");
      const overdue = store.reps
        .map((r) => ({ r, st: supervisionStatus(r, store.policy.cadence) }))
        .filter((x) => x.st.state === "overdue");
      return {
        ok: true,
        text: json({
          today: TODAY,
          files: {
            total: store.files.length,
            cleared: store.files.filter((f) => fileStatus(f) === "clear").length,
            flagged: flagged.map((f) => ({ id: f.id, client: f.client, broker: f.broker, overdueSteps: STEPS.filter((st) => f.overdue.includes(st.key) && !f.done.includes(st.key)).map((st) => st.label) })),
          },
          supervisionOverdue: overdue.map((x) => ({ rep: x.r.name, daysOverdue: -x.st.left, cadenceDays: x.st.cadence })),
          openFindings: store.reviews.filter((v) => !v.resolved).map((v) => ({ file: v.fileId, note: v.note })),
          complaintsOpen: store.complaints.filter((c) => !c.resolved).map((c) => ({ id: c.id, client: c.client, owner: c.owner, daysLeft: daysFromToday(c.due) })),
          breachesLive: store.breaches.filter((b) => b.status === "Assessing" || b.status === "Reportable").map((b) => ({ id: b.id, status: b.status, summary: b.summary, daysLeft: daysFromToday(b.due) })),
          licenceDue: store.licenceItems.filter((l) => l.date && daysFromToday(l.date) <= 60).map((l) => ({ item: l.label, date: l.date, daysLeft: daysFromToday(l.date!) })),
        }),
      };
    }
    case "list_files": {
      const rows = store.files
        .filter((f) => !input.status || fileStatus(f) === input.status)
        .filter((f) => !input.broker || norm(f.broker) === norm(s(input.broker)))
        .filter((f) => !input.search || `${f.client} ${f.purpose}`.toLowerCase().includes(norm(s(input.search))))
        .map((f) => ({
          id: f.id,
          client: f.client,
          purpose: f.purpose,
          broker: f.broker,
          amount: f.amount,
          status: fileStatus(f),
          stepsDone: `${f.done.length}/${STEPS.length}`,
          missing: STEPS.filter((st) => !f.done.includes(st.key)).map((st) => st.label),
          overdue: STEPS.filter((st) => f.overdue.includes(st.key) && !f.done.includes(st.key)).map((st) => st.label),
          review: store.reviews.find((v) => v.fileId === f.id)?.outcome ?? "not reviewed",
        }));
      return { ok: true, text: json(rows) };
    }
    case "get_file": {
      const f = store.files.find((x) => x.id === s(input.file_id));
      if (!f) return fail("No loan file with that id. Call list_files.");
      return {
        ok: true,
        text: json({
          id: f.id,
          client: f.client,
          purpose: f.purpose,
          broker: f.broker,
          opened: f.opened,
          status: fileStatus(f),
          steps: STEPS.map((st) => ({ step: st.label, done: f.done.includes(st.key), overdue: !f.done.includes(st.key) && f.overdue.includes(st.key) })),
          notes: store.notes[f.id] ?? [],
          review: store.reviews.find((v) => v.fileId === f.id) ?? null,
        }),
      };
    }
    case "list_team":
      return {
        ok: true,
        text: json(
          store.reps.map((r) => ({
            name: r.name,
            kind: r.kind,
            risk: r.risk,
            lastContact: r.lastContact,
            cpd: `${r.cpdDone}/${r.cpdTarget}`,
            training: `${r.trainingDone}/${r.trainingTotal}`,
            accreditations: r.accreditations.map((a) => `${a.lender} to ${a.expires}`),
          })),
        ),
      };
    case "list_supervision": {
      return {
        ok: true,
        text: json({
          reps: store.reps.map((r) => {
            const st = supervisionStatus(r, store.policy.cadence);
            const need = store.policy.reviews[r.risk];
            const done = store.reviews.filter((v) => store.files.find((f) => f.id === v.fileId)?.broker === r.name).length;
            return {
              rep: r.name,
              risk: r.risk,
              cadenceDays: st.cadence,
              daysSinceContact: st.days,
              status: st.state === "overdue" ? `overdue by ${-st.left} days` : st.state === "soon" ? `due in ${st.left} days` : "on track",
              reviews: `${Math.min(done, need)} of ${need}`,
            };
          }),
          openFindings: store.reviews.filter((v) => !v.resolved).map((v) => ({ file: v.fileId, note: v.note })),
          recentLog: store.log.slice(0, 8).map((e) => `${e.date} ${e.kind} ${e.rep}: ${e.note}`),
        }),
      };
    }
    case "list_complaints":
      return {
        ok: true,
        text: json(
          store.complaints
            .filter((c) => !input.open_only || !c.resolved)
            .map((c) => ({ id: c.id, client: c.client, summary: c.summary, owner: c.owner, stage: c.stage, due: c.due, daysLeft: daysFromToday(c.due), resolved: c.resolved })),
        ),
      };
    case "list_breaches":
      return {
        ok: true,
        text: json(store.breaches.map((b) => ({ id: b.id, summary: b.summary, rep: b.rep, status: b.status, lodgeBy: b.due, daysLeft: daysFromToday(b.due), reportedOn: b.reportedOn ?? null }))),
      };
    case "list_licence":
      return { ok: true, text: json(store.licenceItems.map((l) => ({ item: l.label, detail: l.detail, date: l.date ?? null, daysLeft: l.date ? daysFromToday(l.date) : null }))) };
    case "open_page": {
      const path = s(input.path);
      if (!path.startsWith("/dashboard")) return fail("Only pages inside the dashboard can be opened.");
      return { ok: true, text: `Showed a link to ${path}.`, link: { path, label: s(input.label) || "Open" } };
    }

    /* ---------- changes ---------- */
    case "add_file": {
      const broker = repName(store, s(input.broker));
      if (!broker) return fail("That representative is not on the team. Call list_team for exact names.");
      const purpose = PURPOSES.includes(s(input.purpose)) ? s(input.purpose) : "Other";
      const r = store.addFile({ client: s(input.client), purpose, amount: Number(input.amount) || 0, broker });
      if (!r.ok) return fail(r.error);
      return { ok: true, text: `Opened loan file ${r.id}.`, outcome: `Opened file ${r.id}`, link: { path: "/dashboard/files", label: "Open Loan files" } };
    }
    case "add_file_note": {
      if (!store.files.some((f) => f.id === s(input.file_id))) return fail("No loan file with that id. Call list_files.");
      if (!s(input.note)) return fail("The note is empty.");
      store.addNote(s(input.file_id), s(input.note));
      return { ok: true, text: "Note added.", outcome: "Note added", link: { path: "/dashboard/files", label: "Open Loan files" } };
    }
    case "log_complaint": {
      const owner = repName(store, s(input.owner));
      if (!owner) return fail("That owner is not on the team. Call list_team for exact names.");
      const received = s(input.received) || TODAY;
      if (!isISODate(received)) return fail("The received date must be yyyy-mm-dd.");
      const r = store.addComplaint({ client: s(input.client), summary: s(input.summary), owner, received });
      if (!r.ok) return fail(r.error);
      return { ok: true, text: `Logged complaint ${r.id}. Response due 30 days after ${received}.`, outcome: `Logged complaint ${r.id}`, link: { path: "/dashboard/complaints", label: "Open Complaints" } };
    }
    case "record_breach": {
      const rep = repName(store, s(input.rep));
      if (!rep) return fail("That representative is not on the team. Call list_team for exact names.");
      const found = s(input.found) || TODAY;
      const grounds = s(input.grounds_on) || found;
      if (!isISODate(found) || !isISODate(grounds)) return fail("Dates must be yyyy-mm-dd.");
      const r = store.addBreach({ summary: s(input.summary), rep, found, groundsOn: grounds });
      if (!r.ok) return fail(r.error);
      return { ok: true, text: `Recorded ${r.id} as Assessing. The licensee decides whether it is reportable.`, outcome: `Recorded ${r.id}, now assessing`, link: { path: "/dashboard/breaches", label: "Open Breaches" } };
    }
    case "log_supervision_contact": {
      const rep = repName(store, s(input.rep));
      if (!rep) return fail("That representative is not on the team. Call list_team for exact names.");
      const kind = (["Catch-up", "Training", "Team meeting"].includes(s(input.kind)) ? s(input.kind) : "Catch-up") as SupervisionKind;
      store.logContact(rep, kind, s(input.note));
      return { ok: true, text: `Logged a ${kind.toLowerCase()} with ${rep} today.`, outcome: `Logged ${kind.toLowerCase()} with ${rep}`, link: { path: "/dashboard/supervision", label: "Open Supervision" } };
    }
    case "add_team_member": {
      const kind = (["Credit representative", "Employee", "Licensee"].includes(s(input.kind)) ? s(input.kind) : "Credit representative") as "Credit representative" | "Employee" | "Licensee";
      const risk = (["High", "Medium", "Low"].includes(s(input.risk)) ? s(input.risk) : "High") as Risk;
      const r = store.addRep({ name: s(input.name), role: s(input.role), kind, risk, authorised: TODAY, access: kind === "Employee" ? "Supervisor" : "Representative" });
      if (!r.ok) return fail(r.error);
      return { ok: true, text: `Added ${r.id} as ${kind.toLowerCase()}, ${risk.toLowerCase()} risk.`, outcome: `Added ${r.id} to the team`, link: { path: "/dashboard/representatives", label: "Open Representatives" } };
    }
    case "log_cpd": {
      const rep = repName(store, s(input.rep));
      if (!rep) return fail("That representative is not on the team. Call list_team for exact names.");
      const hours = Number(input.hours);
      if (!hours || hours <= 0 || hours > 100) return fail("Hours must be a positive number.");
      store.addCpd(rep, hours);
      return { ok: true, text: `Added ${hours} CPD hours for ${rep}.`, outcome: `Logged ${hours} CPD hours for ${rep}`, link: { path: "/dashboard/representatives", label: "Open Representatives" } };
    }
  }
  return fail(`Unknown tool ${name}.`);
}

export const formatDate = fmtDate;
