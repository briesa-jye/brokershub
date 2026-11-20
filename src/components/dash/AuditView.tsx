"use client";

import { useState } from "react";
import { PageTitle } from "./DashShell";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { BROKERS, STEPS, WORKSPACE, fileStatus, fmtDate, TODAY } from "@/lib/demo-data";

export function AuditView() {
  const { files, complaints } = useDemo();
  const [broker, setBroker] = useState("All brokers");

  const rows = files.filter((f) => broker === "All brokers" || f.broker === broker);
  const cleared = rows.filter((f) => fileStatus(f) === "clear").length;
  const gaps = rows.reduce((n, f) => n + (STEPS.length - f.done.length), 0);

  function download() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const head = ["File", "Client", "Purpose", "Broker", "Opened", "Status", ...STEPS.map((s) => s.label)];
    const lines = rows.map((f) =>
      [
        f.id, f.client, f.purpose, f.broker, f.opened, fileStatus(f),
        ...STEPS.map((s) => (f.done.includes(s.key) ? "Yes" : "No")),
      ].map(String).map(esc).join(","),
    );
    const csv = [head.map(esc).join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-pack-demo-${TODAY}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageTitle title="Audit pack">
        The answer to an aggregator review, a lender audit or a complaint, built from what is already on file.
      </PageTitle>

      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">Include</span>
            <select
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              className="mt-2 block w-64 max-w-full rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold"
            >
              <option>All brokers</option>
              {BROKERS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-bg hover:bg-ink/85"
          >
            <Icon name="download" className="h-4 w-4" /> Download pack (CSV)
          </button>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {[
            ["Files in pack", String(rows.length)],
            ["Fully cleared", `${cleared} of ${rows.length}`],
            ["Steps still missing", String(gaps)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">{k}</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm text-ink-soft">
          {WORKSPACE} · {complaints.length} complaints on the register · generated {fmtDate(TODAY)}. The full product
          exports a formatted PDF; this demo downloads a CSV.
        </p>
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-xs uppercase tracking-widest text-ink-soft">
              <th className="px-5 py-3.5 font-medium">File</th>
              <th className="px-3 py-3.5 font-medium">Broker</th>
              {STEPS.map((s, i) => (
                <th key={s.key} className="px-2 py-3.5 text-center font-medium" title={s.label}>
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b border-line last:border-b-0">
                <td className="px-5 py-3 font-semibold">{f.client}</td>
                <td className="px-3 py-3 text-ink-soft">{f.broker}</td>
                {STEPS.map((s) => {
                  const done = f.done.includes(s.key);
                  return (
                    <td key={s.key} className="px-2 py-3 text-center">
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${done ? "bg-accent" : f.overdue.includes(s.key) ? "bg-ink" : "border border-ink/30"}`}
                        title={`${s.label}: ${done ? "on file" : "missing"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-line px-5 py-3 text-xs text-ink-soft">
          Columns follow the file checklist, 1 to {STEPS.length}. Green is on file, black is overdue, hollow is not yet due.
        </p>
      </section>
    </>
  );
}
