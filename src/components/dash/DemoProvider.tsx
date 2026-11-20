"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialComplaints,
  initialFiles,
  type Complaint,
  type LoanFile,
  type StepKey,
} from "@/lib/demo-data";

type Demo = {
  files: LoanFile[];
  complaints: Complaint[];
  toggleStep: (fileId: string, step: StepKey) => void;
  resolveComplaint: (id: string) => void;
  selectedFileId: string;
  selectFile: (id: string) => void;
};

const Ctx = createContext<Demo | null>(null);

/** Holds the demo's data in memory so ticking a step on one page shows up everywhere. Resets on reload. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState(initialFiles);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedFileId, selectFile] = useState("LF-1043");

  const value = useMemo<Demo>(
    () => ({
      files,
      complaints,
      selectedFileId,
      selectFile,
      toggleStep: (fileId, step) =>
        setFiles((fs) =>
          fs.map((f) =>
            f.id !== fileId
              ? f
              : {
                  ...f,
                  done: f.done.includes(step)
                    ? f.done.filter((s) => s !== step)
                    : [...f.done, step],
                },
          ),
        ),
      resolveComplaint: (id) =>
        setComplaints((cs) =>
          cs.map((c) => (c.id === id ? { ...c, resolved: true, stage: "Resolved" } : c)),
        ),
    }),
    [files, complaints, selectedFileId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside DemoProvider");
  return v;
}
