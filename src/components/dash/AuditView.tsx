"use client";

import { useState } from "react";
import { Card, CardHead, PageHeading, Stat, btnDark } from "./ui";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { BROKERS, STEPS, TODAY, WORKSPACE, fileStatus, fmtDate } from "@/lib/demo-data";

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
      <PageHeading
        title="Audit pack"
        sub="The answer to an aggregator review, a lender audit or a complaint, built from what is already on file."
        actions={
          <button type="button" onClick={download} className={btnDark}>
            <Icon name="download" className="h-4 w-4" /> Download pack (CSV)
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3 text-sm font-semibold">
          Include
          <select
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold"
          >
            <option>All brokers</option>
            {BROKERS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <p className="text-xs text-ink-soft">
          {WORKSPACE} · {complaints.length} complaints on the register · generated {fmtDate(TODAY)}. The full product
          exports a formatted PDF; this demo downloads a CSV.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Stat label="Files in pack" value={String(rows.length)} />
        <Stat label="Fully cleared" value={`${cleared} of ${rows.length}`} />
        <Stat label="Steps still missing" value={String(gaps)} tone={gaps ? "owed" : undefined} note={gaps ? "shown as gaps in the pack" : "nothing missing"} />
      </div>

      <Card className="mt-6">
        <CardHead title="What the pack shows" sub="One row per file. Columns follow the file checklist." />
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
              {rows.map((f) => (
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
