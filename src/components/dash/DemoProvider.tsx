"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  TODAY,
  USER,
  addDays,
  defaultNotify,
  defaultPolicy,
  defaultProfile,
  initialBreaches,
  initialComplaints,
  initialFiles,
  initialLog,
  initialNotes,
  initialReps,
  initialReviews,
  licence as initialLicence,
  type Access,
  type Breach,
  type BreachStatus,
  type Complaint,
  type FileNote,
  type LicenceItem,
  type LoanFile,
  type NotifyKey,
  type Policy,
  type Rep,
  type Review,
  type Risk,
  type StepKey,
  type SupervisionEntry,
  type SupervisionKind,
} from "@/lib/demo-data";

export type NewFile = { client: string; purpose: string; amount: number; broker: string };
export type NewComplaint = { client: string; summary: string; owner: string; received: string };
export type NewBreach = { summary: string; rep: string; found: string; groundsOn: string };
export type NewRep = { name: string; role: string; kind: Rep["kind"]; risk: Risk; authorised: string; access: Access };

export type Result = { ok: true; id: string } | { ok: false; error: string };

export type Demo = {
  files: LoanFile[];
  complaints: Complaint[];
  reps: Rep[];
  log: SupervisionEntry[];
  reviews: Review[];
  breaches: Breach[];
  notes: Record<string, FileNote[]>;
  licenceItems: LicenceItem[];
  policy: Policy;
  setCadence: (risk: Risk, days: number) => void;
  setReviewsRequired: (risk: Risk, n: number) => void;
  notify: Record<NotifyKey, boolean>;
  setNotify: (k: NotifyKey, on: boolean) => void;
  profile: typeof defaultProfile;
  setProfile: (p: Partial<typeof defaultProfile>) => void;
  access: Record<string, Access>;
  setAccess: (name: string, a: Access) => void;
  selectedFileId: string;
  selectFile: (id: string) => void;
  toggleStep: (fileId: string, step: StepKey) => void;
  addFile: (f: NewFile) => Result;
  addNote: (fileId: string, text: string) => void;
  addComplaint: (c: NewComplaint) => Result;
  setComplaintStage: (id: string, stage: string) => void;
  resolveComplaint: (id: string) => void;
  logContact: (rep: string, kind: SupervisionKind, note?: string) => void;
  reviewFile: (fileId: string, outcome: "pass" | "fix") => void;
  resolveFinding: (fileId: string) => void;
  addBreach: (b: NewBreach) => Result;
  setBreachStatus: (id: string, status: BreachStatus) => void;
  addRep: (r: NewRep) => Result;
  setRisk: (name: string, risk: Risk) => void;
  addCpd: (name: string, hours: number) => void;
  completeTraining: (name: string) => void;
  addAccreditation: (name: string, lender: string, expires: string) => void;
  renewLicence: (label: string) => void;
  addLicenceItem: (i: LicenceItem) => void;
};

const Ctx = createContext<Demo | null>(null);

const nextId = (prefix: string, ids: string[]) => {
  const max = ids.reduce((m, id) => Math.max(m, Number(id.split("-")[1]) || 0), 0);
  return `${prefix}-${max + 1}`;
};

/** Holds the demo's data in memory so a change on one page shows up everywhere. Resets on reload. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState(initialFiles);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [reps, setReps] = useState(initialReps);
  const [log, setLog] = useState(initialLog);
  const [reviews, setReviews] = useState(initialReviews);
  const [breaches, setBreaches] = useState(initialBreaches);
  const [notes, setNotes] = useState(initialNotes);
  const [licenceItems, setLicenceItems] = useState(initialLicence);
  const [policy, setPolicy] = useState<Policy>(defaultPolicy);
  const [notify, setNotifyState] = useState(defaultNotify);
  const [profile, setProfileState] = useState(defaultProfile);
  const [access, setAccessState] = useState<Record<string, Access>>(() =>
    Object.fromEntries(
      initialReps.map((r) => [r.name, r.kind === "Licensee" ? "Owner" : r.kind === "Employee" ? "Supervisor" : "Representative"]),
    ),
  );
  const [selectedFileId, selectFile] = useState("LF-1043");

  // The latest records, kept current inside each change too, so several changes in one go (the assistant
  // batches them) see each other and never reuse an id.
  const live = useRef({ files, complaints, reps, breaches });
  useEffect(() => {
    live.current = { files, complaints, reps, breaches };
  }, [files, complaints, reps, breaches]);

  const value = useMemo<Demo>(() => {
    const addLog = (rep: string, kind: SupervisionKind, note: string) =>
      setLog((l) => [{ id: nextId("S", l.map((x) => x.id)), rep, kind, date: TODAY, by: USER.name, note }, ...l]);
    const repExists = (name: string) => live.current.reps.some((r) => r.name === name);

    return {
      files, complaints, reps, log, reviews, breaches, notes, licenceItems,
      policy,
      setCadence: (risk, days) => setPolicy((p) => ({ ...p, cadence: { ...p.cadence, [risk]: Math.max(1, days || 1) } })),
      setReviewsRequired: (risk, n) => setPolicy((p) => ({ ...p, reviews: { ...p.reviews, [risk]: Math.max(1, n || 1) } })),
      notify,
      setNotify: (k, on) => setNotifyState((n) => ({ ...n, [k]: on })),
      profile,
      setProfile: (p) => setProfileState((x) => ({ ...x, ...p })),
      access,
      setAccess: (name, a) => setAccessState((x) => ({ ...x, [name]: a })),
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
      addFile: (f) => {
        if (!f.client.trim()) return { ok: false, error: "A client name is needed." };
        if (!repExists(f.broker)) return { ok: false, error: `No representative called ${f.broker}.` };
        const id = nextId("LF", live.current.files.map((x) => x.id));
        const file: LoanFile = { id, client: f.client.trim(), purpose: f.purpose, amount: Math.max(0, f.amount || 0), broker: f.broker, opened: TODAY, done: [], overdue: [] };
        live.current.files = [...live.current.files, file];
        setFiles((fs) => [...fs, file]);
        selectFile(id);
        return { ok: true, id };
      },
      addNote: (fileId, text) => {
        if (!text.trim()) return;
        setNotes((n) => ({ ...n, [fileId]: [...(n[fileId] ?? []), { date: TODAY, by: USER.name, text: text.trim() }] }));
      },

      addComplaint: (c) => {
        if (!c.client.trim() || !c.summary.trim()) return { ok: false, error: "A client and a summary are needed." };
        if (!repExists(c.owner)) return { ok: false, error: `No representative called ${c.owner}.` };
        const id = nextId("C", live.current.complaints.map((x) => x.id));
        const item: Complaint = { id, client: c.client.trim(), summary: c.summary.trim(), received: c.received, due: addDays(c.received, 30), owner: c.owner, stage: "Received", resolved: false };
        live.current.complaints = [item, ...live.current.complaints];
        setComplaints((cs) => [item, ...cs]);
        return { ok: true, id };
      },
      setComplaintStage: (id, stage) =>
        setComplaints((cs) => cs.map((c) => (c.id === id ? { ...c, stage, resolved: stage === "Resolved" } : c))),
      resolveComplaint: (id) =>
        setComplaints((cs) => cs.map((c) => (c.id === id ? { ...c, resolved: true, stage: "Resolved" } : c))),

      logContact: (rep, kind, note) => {
        addLog(rep, kind, note?.trim() || `${kind} recorded.`);
        setReps((rs) => rs.map((r) => (r.name === rep ? { ...r, lastContact: TODAY } : r)));
      },
      reviewFile: (fileId, outcome) => {
        const f = live.current.files.find((x) => x.id === fileId);
        if (!f) return;
        setReviews((rv) => [
          ...rv.filter((r) => r.fileId !== fileId),
          { fileId, outcome, date: TODAY, note: outcome === "fix" ? "Gap found in review. Remediation needed." : "", resolved: outcome === "pass" },
        ]);
        addLog(f.broker, "File review", `Reviewed ${fileId}. ${outcome === "pass" ? "No issues." : "Finding raised."}`);
      },
      resolveFinding: (fileId) => setReviews((rv) => rv.map((r) => (r.fileId === fileId ? { ...r, resolved: true } : r))),

      addBreach: (b) => {
        if (!b.summary.trim()) return { ok: false, error: "Describe what happened." };
        if (!repExists(b.rep)) return { ok: false, error: `No representative called ${b.rep}.` };
        const id = nextId("B", live.current.breaches.map((x) => x.id));
        const item: Breach = { id, summary: b.summary.trim(), rep: b.rep, found: b.found, groundsOn: b.groundsOn, due: addDays(b.groundsOn, 30), status: "Assessing" };
        live.current.breaches = [item, ...live.current.breaches];
        setBreaches((bs) => [item, ...bs]);
        return { ok: true, id };
      },
      setBreachStatus: (id, status) =>
        setBreaches((bs) =>
          bs.map((b) => (b.id === id ? { ...b, status, reportedOn: status === "Reported" ? TODAY : b.reportedOn } : b)),
        ),

      addRep: (r) => {
        const name = r.name.trim();
        if (!name) return { ok: false, error: "A name is needed." };
        if (repExists(name)) return { ok: false, error: `${name} is already on the team.` };
        const rep: Rep = { name, role: r.role.trim() || r.kind, kind: r.kind, risk: r.risk, authorised: r.authorised, lastContact: TODAY, cpdDone: 0, cpdTarget: 20, trainingDone: 0, trainingTotal: 6, accreditations: [] };
        live.current.reps = [...live.current.reps, rep];
        setReps((rs) => [...rs, rep]);
        setAccessState((a) => ({ ...a, [name]: r.access }));
        addLog(name, "Onboarding", `Added to the team as ${r.kind.toLowerCase()}, ${r.risk.toLowerCase()} risk.`);
        return { ok: true, id: name };
      },
      setRisk: (name, risk) => setReps((rs) => rs.map((r) => (r.name === name ? { ...r, risk } : r))),
      addCpd: (name, hours) =>
        setReps((rs) => rs.map((r) => (r.name === name ? { ...r, cpdDone: Math.max(0, r.cpdDone + (hours || 0)) } : r))),
      completeTraining: (name) =>
        setReps((rs) => rs.map((r) => (r.name === name ? { ...r, trainingDone: Math.min(r.trainingTotal, r.trainingDone + 1) } : r))),
      addAccreditation: (name, lender, expires) =>
        setReps((rs) => rs.map((r) => (r.name === name ? { ...r, accreditations: [...r.accreditations, { lender: lender.trim(), expires }] } : r))),

      renewLicence: (label) =>
        setLicenceItems((ls) => ls.map((l) => (l.label === label && l.date ? { ...l, date: addDays(l.date, 365) } : l))),
      addLicenceItem: (i) => setLicenceItems((ls) => [...ls, i]),
    };
  }, [files, complaints, reps, log, reviews, breaches, notes, licenceItems, selectedFileId, policy, notify, profile, access]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside DemoProvider");
  return v;
}
