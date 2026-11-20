"use client";

import { useState } from "react";
import { Card, CardHead, Pill, btnLight } from "./ui";
import { LicenceItemModal } from "./modals";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { daysFromToday, fmtDate } from "@/lib/demo-data";

/** The licensee's own standing: licence, AFCA, insurance, policies. Items with a date can be marked renewed. */
export function LicenceCard() {
  const { licenceItems, renewLicence } = useDemo();
  const [adding, setAdding] = useState(false);
  return (
    <Card>
      <CardHead
        title="Licence health"
        sub="Your obligations as the licensee"
        right={
          <button type="button" onClick={() => setAdding(true)} className={btnLight}>
            <Icon name="plus" className="h-4 w-4" /> Add item
          </button>
        }
      />
      <ul className="divide-y divide-line">
        {licenceItems.map((l) => {
          const d = l.date ? daysFromToday(l.date) : undefined;
          const soon = d !== undefined && d <= 60;
          return (
            <li key={l.label} className="flex items-center gap-3 px-5 py-3.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{l.label}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {l.detail}
                  {l.date ? ` · ${l.dateLabel ?? "Due"} ${fmtDate(l.date)}` : ""}
                </span>
              </span>
              {soon && (
                <button type="button" onClick={() => renewLicence(l.label)} className="text-xs font-semibold underline">
                  Mark renewed
                </button>
              )}
              <Pill tone={soon ? "owed" : "ok"}>{soon ? `${d} days` : "Current"}</Pill>
            </li>
          );
        })}
      </ul>
      {adding && <LicenceItemModal onClose={() => setAdding(false)} />}
    </Card>
  );
}
