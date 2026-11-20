/** Product visuals built in code with sample data. Replace with real screenshots once the app exists. */

type Status = "clear" | "open" | "flag";

const files: { client: string; item: string; status: Status }[] = [
  { client: "Nguyen, refinance", item: "Credit guide issued before assistance", status: "clear" },
  { client: "Patel, first home buyer", item: "Best interests duty reasons on file", status: "clear" },
  { client: "Harris, investment loan", item: "Expense verification missing", status: "flag" },
  { client: "Kowalski, construction", item: "Credit proposal disclosure due Friday", status: "open" },
  { client: "Brown, debt consolidation", item: "Unsuitability assessment signed", status: "clear" },
];

const tone: Record<Status, string> = {
  clear: "bg-accent text-ink",
  open: "bg-tint text-ink",
  flag: "bg-ink text-bg",
};
const label: Record<Status, string> = { clear: "Cleared", open: "Due", flag: "Flagged" };

export function FileBoardMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-30px_oklch(0.22_0.04_230/0.35)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Loan files this week
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Sample data
        </p>
      </div>
      <ul>
        {files.map((f) => (
          <li
            key={f.client}
            className={`board-row flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0 ${f.status === "flag" ? "bg-tint" : ""}`}
          >
            <div className="min-w-0">
              <p className="font-display font-bold">{f.client}</p>
              <p className="truncate text-sm text-ink-soft">{f.item}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider ${tone[f.status]}`}
            >
              {label[f.status]}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-bg">
        <p className="text-sm">3 of 5 cleared</p>
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          1 flagged
        </p>
      </div>
    </div>
  );
}

const trail = [
  ["09:12", "Credit guide sent to client", "J. Smith"],
  ["09:40", "Fact find completed, 14 questions", "J. Smith"],
  ["11:05", "Comparison of 3 lenders saved with reasons", "J. Smith"],
  ["11:22", "Expense verification flagged as missing", "System"],
  ["14:30", "Statements uploaded, flag cleared", "A. Lee"],
];

export function AuditTrailMock() {
  return (
    <div className="rounded-2xl border border-bg/15 bg-bg/5 p-2">
      <div className="rounded-xl bg-surface p-5 text-ink">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Harris, investment loan / audit trail (sample)
        </p>
        <ol className="mt-4">
          {trail.map(([t, what, who]) => (
            <li
              key={t}
              className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-line py-3 text-sm sm:grid-cols-[3.5rem_1fr_auto]"
            >
              <span className="font-mono text-ink-soft">{t}</span>
              <span>{what}</span>
              <span className="col-start-2 text-ink-soft sm:col-start-auto">{who}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
