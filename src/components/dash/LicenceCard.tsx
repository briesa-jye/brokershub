"use client";

import { Card, CardHead, Pill } from "./ui";
import { daysFromToday, fmtDate, licence } from "@/lib/demo-data";

/** The licensee's own standing: licence, AFCA, insurance, policies. */
export function LicenceCard() {
  return (
    <Card>
      <CardHead title="Licence health" sub="Your obligations as the licensee" />
      <ul className="divide-y divide-line">
        {licence.map((l) => {
          const d = l.date ? daysFromToday(l.date) : undefined;
          const soon = d !== undefined && d <= 60;
          return (
            <li key={l.label} className="flex items-center gap-3 px-5 py-3.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{l.label}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {l.detail}
                  {l.date ? ` · ${l.dateLabel} ${fmtDate(l.date)}` : ""}
                </span>
              </span>
              <Pill tone={soon ? "owed" : "ok"}>{soon ? `${d} days` : "Current"}</Pill>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
