"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  TODAY,
  USER,
  initialBreaches,
  initialComplaints,
  initialFiles,
  initialLog,
  initialReps,
  initialReviews,
  type Breach,
  type BreachStatus,
  type Complaint,
  type LoanFile,
  type Rep,
  type Review,
  type StepKey,
  type SupervisionEntry,
  type SupervisionKind,
} from "@/lib/demo-data";

type Demo = {
  files: LoanFile[];
  complaints: Complaint[];
  reps: Rep[];
  log: SupervisionEntry[];
  reviews: Review[];
  breaches: Breach[];
  selectedFileId: string;
  selectFile: (id: string) => void;
  toggleStep: (fileId: string, step: StepKey) => void;
  resolveComplaint: (id: string) => void;
  logContact: (rep: string, kind: SupervisionKind, note?: string) => void;
  reviewFile: (fileId: string, outcome: "pass" | "fix") => void;
  resolveFinding: (fileId: string) => void;
  setBreachStatus: (id: string, status: BreachStatus) => void;
};

const Ctx = createContext<Demo | null>(null);

/** Holds the demo's data in memory so a change on one page shows up everywhere. Resets on reload. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState(initialFiles);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [reps, setReps] = useState(initialReps);
  const [log, setLog] = useState(initialLog);
  const [reviews, setReviews] = useState(initialReviews);
  const [breaches, setBreaches] = useState(initialBreaches);
  const [selectedFileId, selectFile] = useState("LF-1043");

  const value = useMemo<Demo>(() => {
    const addLog = (rep: string, kind: SupervisionKind, note: string) =>
      setLog((l) => [{ id: `S-${100 + l.length}`, rep, kind, date: TODAY, by: USER.name, note }, ...l]);

    return {
      files,
      complaints,
      reps,
      log,
      reviews,
      breaches,
      selectedFileId,
      selectFile,
      toggleStep: (fileId, step) =>
        setFiles((fs) =>
          fs.map((f) =>
            f.id !== fileId
              ? f
              : { ...f, done: f.done.includes(step) ? f.done.filter((s) => s !== step) : [...f.done, step] },
          ),
        ),
      resolveComplaint: (id) =>
        setComplaints((cs) => cs.map((c) => (c.id === id ? { ...c, resolved: true, stage: "Resolved" } : c))),
      logContact: (rep, kind, note) => {
        addLog(rep, kind, note || `${kind} recorded.`);
        setReps((rs) => rs.map((r) => (r.name === rep ? { ...r, lastContact: TODAY } : r)));
      },
      reviewFile: (fileId, outcome) => {
        const f = files.find((x) => x.id === fileId);
        if (!f) return;
        setReviews((rv) => [
          ...rv.filter((r) => r.fileId !== fileId),
          {
            fileId,
            outcome,
            date: TODAY,
            note: outcome === "fix" ? "Gap found in review. Remediation needed." : "",
            resolved: outcome === "pass",
          },
        ]);
        addLog(f.broker, "File review", `Reviewed ${fileId}. ${outcome === "pass" ? "No issues." : "Finding raised."}`);
      },
      resolveFinding: (fileId) =>
        setReviews((rv) => rv.map((r) => (r.fileId === fileId ? { ...r, resolved: true } : r))),
      setBreachStatus: (id, status) =>
        setBreaches((bs) =>
          bs.map((b) =>
            b.id === id ? { ...b, status, reportedOn: status === "Reported" ? TODAY : b.reportedOn } : b,
          ),
        ),
    };
  }, [files, complaints, reps, log, reviews, breaches, selectedFileId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside DemoProvider");
  return v;
}
