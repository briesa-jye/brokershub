"use client";

import { useState } from "react";
import { Card, CardHead, PageHeading, Stat, btnDark } from "./ui";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { BROKERS, STEPS, TODAY, WORKSPACE, fileStatus, fmtDate } from "@/lib/demo-data";

type Section = "files" | "supervision" | "reviews" | "complaints" | "breaches" | "reps";

const SECTIONS: { key: Section; label: string; note: string }[] = [
  { key: "files", label: "Loan files", note: "Every checklist step, on file or missing" },
  { key: "supervision", label: "Supervision log", note: "Contacts, training and meetings" },
  { key: "reviews", label: "File reviews and findings", note: "What was reviewed and what was fixed" },
  { key: "complaints", label: "Complaints register", note: "With response deadlines" },
  { key: "breaches", label: "Breaches register", note: "With the 30-day clock and what was lodged" },
  { key: "reps", label: "Representatives", note: "Authorisation, CPD, training and accreditations" },
];

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const line = (cells: unknown[]) => cells.map(esc).join(",");

export function AuditView() {
  const { files, complaints, reps, log, reviews, breaches } = useDemo();
  const [broker, setBroker] = useState("All brokers");
  const [on, setOn] = useState<Record<Section, boolean>>({
    files: true, supervision: true, reviews: true, complaints: true, breaches: true, reps: true,
  });

  const mine = <T extends { broker?: string; rep?: string; owner?: string; name?: string }>(x: T) =>
    broker === "All brokers" || [x.broker, x.rep, x.owner, x.name].includes(broker);

  const fileRows = files.filter(mine);
  const logRows = log.filter(mine);
  const reviewRows = reviews.filter((v) => mine({ broker: files.find((f) => f.id === v.fileId)?.broker }));
  const complaintRows = complaints.filter(mine);
  const breachRows = breaches.filter(mine);
  const repRows = reps.filter(mine);

  const counts: Record<Section, number> = {
    files: fileRows.length, supervision: logRows.length, reviews: reviewRows.length,
    complaints: complaintRows.length, breaches: breachRows.length, reps: repRows.length,
  };
  const included = SECTIONS.filter((s) => on[s.key]);
  const records = included.reduce((n, s) => n + counts[s.key], 0);
  const gaps = fileRows.reduce((n, f) => n + (STEPS.length - f.done.length), 0);
  const openFindings = reviewRows.filter((v) => !v.resolved).length;

  function download() {
    const out: string[] = [`${WORKSPACE} audit pack (demo), generated ${TODAY}`, `Scope: ${broker}`, ""];
    if (on.files) {
      out.push("LOAN FILES", line(["File", "Client", "Purpose", "Broker", "Opened", "Status", ...STEPS.map((s) => s.label)]));
      fileRows.forEach((f) =>
        out.push(line([f.id, f.client, f.purpose, f.broker, f.opened, fileStatus(f), ...STEPS.map((s) => (f.done.includes(s.key) ? "Yes" : "No"))])),
      );
      out.push("");
    }
    if (on.supervision) {
      out.push("SUPERVISION LOG", line(["Date", "Representative", "Type", "By", "Note"]));
      logRows.forEach((e) => out.push(line([e.date, e.rep, e.kind, e.by, e.note])));
      out.push("");
    }
    if (on.reviews) {
      out.push("FILE REVIEWS AND FINDINGS", line(["File", "Reviewed", "Outcome", "Fixed", "Note"]));
      reviewRows.forEach((v) => out.push(line([v.fileId, v.date, v.outcome === "pass" ? "Pass" : "Needs fix", v.resolved ? "Yes" : "No", v.note])));
      out.push("");
    }
    if (on.complaints) {
      out.push("COMPLAINTS", line(["ID", "Client", "Summary", "Received", "Response due", "Owner", "Stage"]));
      complaintRows.forEach((c) => out.push(line([c.id, c.client, c.summary, c.received, c.due, c.owner, c.stage])));
      out.push("");
    }
    if (on.breaches) {
      out.push("BREACHES", line(["ID", "Summary", "Representative", "Found", "Lodge by", "Status", "Reported on"]));
      breachRows.forEach((b) => out.push(line([b.id, b.summary, b.rep, b.found, b.due, b.status, b.reportedOn])));
      out.push("");
    }
    if (on.reps) {
      out.push("REPRESENTATIVES", line(["Name", "Type", "Risk", "Authorised", "Last contact", "CPD", "Training", "Accreditations"]));
      repRows.forEach((r) =>
        out.push(
          line([r.name, r.kind, r.risk, r.authorised, r.lastContact, `${r.cpdDone}/${r.cpdTarget}`, `${r.trainingDone}/${r.trainingTotal}`, r.accreditations.map((a) => `${a.lender} to ${a.expires}`).join("; ")]),
        ),
      );
    }
    const url = URL.createObjectURL(new Blob([out.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-pack-demo-${TODAY}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeading
        title="Audit pack"
        sub="The answer to an ASIC enquiry, an aggregator review or a complaint, built from what is already on file."
        actions={
          <button type="button" onClick={download} disabled={included.length === 0} className={`${btnDark} disabled:opacity-40`}>
            <Icon name="download" className="h-4 w-4" /> Download pack (CSV)
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Records in pack" value={String(records)} note={`${included.length} of ${SECTIONS.length} sections`} />
        <Stat label="Files fully cleared" value={`${fileRows.filter((f) => fileStatus(f) === "clear").length} of ${fileRows.length}`} />
        <Stat label="Steps still missing" value={String(gaps)} tone={gaps ? "owed" : undefined} note="shown as gaps, never hidden" />
        <Stat label="Open review findings" value={String(openFindings)} tone={openFindings ? "owed" : undefined} note="fix before an auditor asks" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="self-start">
          <CardHead title="What goes in the pack" sub="Tick the sections you want to include" />
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.key} className="border-b border-line last:border-0">
                <label className="row-hover flex cursor-pointer items-center gap-3 px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={on[s.key]}
                    onChange={() => setOn((o) => ({ ...o, [s.key]: !o[s.key] }))}
                    className="peer sr-only"
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink-soft/60 text-bg peer-checked:border-solid peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{s.label}</span>
                    <span className="block truncate text-xs text-ink-soft">{s.note}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-ink-soft">{counts[s.key]}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="self-start">
          <CardHead title="Scope" />
          <div className="space-y-4 p-5">
            <label className="block">
              <span className="text-xs font-medium text-ink-soft">Representative</span>
              <select
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                className="mt-1.5 block w-full rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold"
              >
                <option>All brokers</option>
                {BROKERS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <p className="text-xs text-ink-soft">
              {WORKSPACE} · generated {fmtDate(TODAY)}. Entries are kept with who made them and when, and are never
              deleted. The full product exports a formatted PDF; this demo downloads a CSV.
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHead title="Loan file coverage" sub="One row per file. Columns follow the file checklist." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">File</th>
                <th className="px-3 py-3 font-medium">Broker</th>
                {STEPS.map((s, i) => (
                  <th key={s.key} className="px-2 py-3 text-center font-medium" title={s.label}>
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileRows.map((f) => (
                <tr key={f.id} className="row-hover border-b border-line last:border-0">
                  <td className="px-5 py-3 font-semibold">{f.client}</td>
                  <td className="px-3 py-3 text-ink-soft">{f.broker}</td>
                  {STEPS.map((s) => {
                    const done = f.done.includes(s.key);
                    const late = !done && f.overdue.includes(s.key);
                    return (
                      <td key={s.key} className="px-2 py-3 text-center">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${done ? "bg-ink" : late ? "bg-accent" : "border-[1.5px] border-dashed border-ink-soft/60"}`}
                          title={`${s.label}: ${done ? "on file" : late ? "overdue" : "not yet due"}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-line px-5 py-3 text-xs text-ink-soft">
          Dark is on file, green is overdue, dashed is not yet due. Steps 1 to {STEPS.length}: {STEPS.map((s) => s.label).join(", ")}.
        </p>
      </Card>
    </>
  );
}
