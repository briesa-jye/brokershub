"use client";

import { useState } from "react";
import { Avatar, Card, CardHead, PageHeading, Pill, Progress, Stat, btnDark, btnLight } from "./ui";
import { useDemo } from "./DemoProvider";
import {
  REVIEWS_REQUIRED,
  fileStatus,
  fmtDate,
  initialsOf,
  supervisionStatus,
  type Risk,
  type SupervisionKind,
} from "@/lib/demo-data";

const riskTone = { Low: "neutral", Medium: "neutral", High: "owed" } as const;
const KINDS: SupervisionKind[] = ["Catch-up", "Training", "Team meeting"];

function ContactForm({ rep }: { rep: string }) {
  const { logContact } = useDemo();
  const [kind, setKind] = useState<SupervisionKind>("Catch-up");
  return (
    <span className="flex items-center gap-2">
      <select
        aria-label={`Type of contact with ${rep}`}
        value={kind}
        onChange={(e) => setKind(e.target.value as SupervisionKind)}
        className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-semibold"
      >
        {KINDS.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <button type="button" onClick={() => logContact(rep, kind)} className={btnLight}>
        Log
      </button>
    </span>
  );
}

export function SupervisionView() {
  const { reps, files, reviews, log, reviewFile, resolveFinding } = useDemo();

  const rows = reps.map((r) => {
    const st = supervisionStatus(r);
    const need = REVIEWS_REQUIRED[r.risk];
    const done = reviews.filter((v) => files.find((f) => f.id === v.fileId)?.broker === r.name).length;
    return { r, st, need, done };
  });
  const overdue = rows.filter((x) => x.st.state === "overdue").length;
  const reviewsDone = rows.reduce((n, x) => n + Math.min(x.done, x.need), 0);
  const reviewsNeed = rows.reduce((n, x) => n + x.need, 0);
  const openFindings = reviews.filter((v) => !v.resolved);

  // Reps with the biggest shortfall get their files suggested first.
  const shortfall = new Map(rows.map((x) => [x.r.name, x.need - x.done]));
  const reviewed = new Set(reviews.map((v) => v.fileId));
  const queue = files
    .filter((f) => !reviewed.has(f.id))
    .sort((a, b) => (shortfall.get(b.broker) ?? 0) - (shortfall.get(a.broker) ?? 0))
    .slice(0, 6);

  return (
    <>
      <PageHeading
        title="Supervision"
        sub="Evidence that you monitor and supervise your representatives: regular contact, file reviews, training and what you did about what you found."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Contact overdue"
          value={`${overdue} of ${reps.length}`}
          note="reps past their contact cadence"
          tone={overdue ? "owed" : undefined}
        />
        <Stat label="File reviews this quarter" value={`${reviewsDone} of ${reviewsNeed}`} note="expected by risk rating" />
        <Stat
          label="Open findings"
          value={String(openFindings.length)}
          note="reviewed files needing a fix"
          tone={openFindings.length ? "owed" : undefined}
        />
        <Stat
          label="Training complete"
          value={`${reps.reduce((n, r) => n + r.trainingDone, 0)} of ${reps.reduce((n, r) => n + r.trainingTotal, 0)}`}
          note="assigned modules across the team"
        />
      </div>

      <Card className="mt-6">
        <CardHead title="Representatives" sub="Contact cadence is set by risk rating. High risk reps are contacted more often." />
        <ul>
          {rows.map(({ r, st, need, done }) => (
            <li key={r.name} className={`border-b border-line last:border-0 ${st.state === "overdue" ? "bg-accent/10" : ""}`}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                <Avatar initials={initialsOf(r.name)} tone={1} />
                <div className="min-w-0 flex-1 basis-56">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {r.name} <Pill tone={riskTone[r.risk as Risk]}>{r.risk} risk</Pill>
                  </p>
                  <p className="text-xs text-ink-soft">
                    Last contact {fmtDate(r.lastContact)} ({st.days} days ago) · every {st.cadence} days
                  </p>
                </div>
                <div className="w-36">
                  <div className="mb-1 flex justify-between text-xs text-ink-soft">
                    <span>File reviews</span>
                    <span className="tabular-nums">
                      {Math.min(done, need)} of {need}
                    </span>
                  </div>
                  <Progress pct={Math.min(100, Math.round((done / need) * 100))} />
                </div>
                <Pill tone={st.state === "ok" ? "ok" : "owed"}>
                  {st.state === "overdue"
                    ? `Overdue ${-st.left} days`
                    : st.state === "soon"
                      ? `Due in ${st.left} days`
                      : "On track"}
                </Pill>
                <ContactForm rep={r.name} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="self-start">
          <CardHead title="File review queue" sub="Files not yet reviewed, reps behind on reviews first" />
          {queue.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Every file has been reviewed.</p>
          ) : (
            <ul>
              {queue.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5 last:border-0">
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block truncate text-sm font-semibold">
                      {f.client}, {f.purpose.toLowerCase()}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {f.id} · {f.broker} · {fileStatus(f) === "clear" ? "complete" : "incomplete"}
                    </span>
                  </span>
                  <button type="button" onClick={() => reviewFile(f.id, "pass")} className={btnLight}>
                    Pass
                  </button>
                  <button type="button" onClick={() => reviewFile(f.id, "fix")} className={btnDark}>
                    Needs fix
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="self-start">
          <CardHead
            title="Findings"
            sub="What reviews found and whether it was fixed"
            right={openFindings.length ? <Pill tone="owed">{openFindings.length} open</Pill> : undefined}
          />
          {reviews.filter((v) => v.outcome === "fix").length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">No findings yet.</p>
          ) : (
            <ul>
              {reviews
                .filter((v) => v.outcome === "fix")
                .map((v) => {
                  const f = files.find((x) => x.id === v.fileId);
                  return (
                    <li key={v.fileId} className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5 last:border-0">
                      <span className="min-w-0 flex-1 basis-40">
                        <span className="block text-sm font-semibold">
                          {f?.client}, {f?.broker}
                        </span>
                        <span className="block text-xs text-ink-soft">{v.note}</span>
                      </span>
                      {v.resolved ? (
                        <Pill tone="ok">Fixed</Pill>
                      ) : (
                        <button type="button" onClick={() => resolveFinding(v.fileId)} className={btnLight}>
                          Mark fixed
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <CardHead title="Supervision log" sub="Every contact, review and training session, time-stamped" />
        <ul className="divide-y divide-line">
          {log.slice(0, 8).map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar initials={initialsOf(e.rep)} tone={1} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">
                  <span className="font-semibold">{e.kind}</span> · {e.rep}
                </span>
                <span className="block truncate text-xs text-ink-soft">{e.note}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-ink-soft">{fmtDate(e.date)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
