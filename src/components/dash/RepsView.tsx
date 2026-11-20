"use client";

import { useState } from "react";
import { Avatar, Card, PageHeading, Pill, Progress, btnDark } from "./ui";
import { LicenceCard } from "./LicenceCard";
import { AccreditationModal, CpdModal, NewRepModal } from "./modals";
import { input } from "./forms";
import { useDemo } from "./DemoProvider";
import { Icon } from "../Icons";
import { daysFromToday, fmtDate, initialsOf, type Risk } from "@/lib/demo-data";

export function RepsView() {
  const { reps, setRisk, completeTraining } = useDemo();
  const [adding, setAdding] = useState(false);
  const [cpdFor, setCpdFor] = useState<string | null>(null);
  const [accFor, setAccFor] = useState<string | null>(null);

  return (
    <>
      <PageHeading
        title="Representatives"
        sub="Everyone you are responsible for: authorisation, CPD, training and lender accreditations, flagged before anything lapses."
        actions={
          <button type="button" onClick={() => setAdding(true)} className={btnDark}>
            <Icon name="plus" className="h-4 w-4" /> Add representative
          </button>
        }
      />

      <div className="space-y-6">
        <LicenceCard />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {reps.map((m) => (
            <Card key={m.name}>
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Avatar initials={initialsOf(m.name)} tone={0} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-base font-extrabold tracking-tight">{m.name}</h2>
                  <p className="truncate text-xs text-ink-soft">
                    {m.kind} · since {fmtDate(m.authorised)}
                  </p>
                </div>
                <select
                  aria-label={`Risk rating for ${m.name}`}
                  value={m.risk}
                  onChange={(e) => setRisk(m.name, e.target.value as Risk)}
                  className={`${input} mt-0 w-auto rounded-full py-1.5 text-xs`}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="space-y-4 border-b border-line px-5 py-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
                    <span>CPD hours this year</span>
                    <span className="flex items-center gap-2">
                      <span className="tabular-nums">
                        {m.cpdDone} of {m.cpdTarget}
                      </span>
                      <button type="button" onClick={() => setCpdFor(m.name)} className="font-semibold text-ink underline">
                        Log hours
                      </button>
                    </span>
                  </div>
                  <Progress pct={Math.min(100, Math.round((m.cpdDone / m.cpdTarget) * 100))} />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
                    <span>Assigned training</span>
                    <span className="flex items-center gap-2">
                      <span className="tabular-nums">
                        {m.trainingDone} of {m.trainingTotal}
                      </span>
                      {m.trainingDone < m.trainingTotal && (
                        <button type="button" onClick={() => completeTraining(m.name)} className="font-semibold text-ink underline">
                          Mark module done
                        </button>
                      )}
                    </span>
                  </div>
                  <Progress pct={Math.min(100, Math.round((m.trainingDone / m.trainingTotal) * 100))} />
                </div>
              </div>
              <ul>
                {m.accreditations.length === 0 && <li className="px-5 py-3 text-xs text-ink-soft">No accreditations recorded.</li>}
                {m.accreditations.map((a) => {
                  const d = daysFromToday(a.expires);
                  const soon = d <= 60;
                  return (
                    <li key={a.lender} className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{a.lender}</span>
                        <span className="block text-xs text-ink-soft">Expires {fmtDate(a.expires)}</span>
                      </span>
                      <Pill tone={soon ? "owed" : "ok"}>{soon ? `${d} days` : "Current"}</Pill>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-line bg-bg px-5 py-3">
                <button type="button" onClick={() => setAccFor(m.name)} className="text-xs font-semibold underline">
                  + Add accreditation
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {adding && <NewRepModal onClose={() => setAdding(false)} />}
      {cpdFor && <CpdModal rep={cpdFor} onClose={() => setCpdFor(null)} />}
      {accFor && <AccreditationModal rep={accFor} onClose={() => setAccFor(null)} />}
    </>
  );
}
