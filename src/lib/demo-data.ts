/** Sample data for the demo dashboard. Every name, number and date here is invented. */

/** The demo's fixed "today", so server and client render the same thing. */
export const TODAY = "2026-11-21";

export const WORKSPACE = "Harbour Home Loans";
export const USER = { name: "Jess Smith", role: "Principal and responsible manager" };

// ---------------------------------------------------------------- loan files

export const STEPS = [
  { key: "guide", label: "Credit guide issued" },
  { key: "factfind", label: "Fact find completed" },
  { key: "bid", label: "Lender comparison and best interests reasons" },
  { key: "verify", label: "Income and expenses verified" },
  { key: "serviceability", label: "Serviceability assessed" },
  { key: "disclosure", label: "Credit proposal disclosure issued" },
  { key: "suitability", label: "Suitability assessment signed" },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export type LoanFile = {
  id: string;
  client: string;
  purpose: string;
  amount: number;
  broker: string;
  opened: string;
  /** steps already done */
  done: StepKey[];
  /** steps that are past their due date if not done */
  overdue: StepKey[];
};

export type FileStatus = "clear" | "open" | "flag";

export function fileStatus(f: LoanFile): FileStatus {
  if (f.done.length === STEPS.length) return "clear";
  if (f.overdue.some((k) => !f.done.includes(k))) return "flag";
  return "open";
}

const all = STEPS.map((s) => s.key) as StepKey[];

export const initialFiles: LoanFile[] = [
  { id: "LF-1041", client: "Nguyen", purpose: "Refinance", amount: 640000, broker: "Jess Smith", opened: "2026-11-02", done: all, overdue: [] },
  { id: "LF-1042", client: "Patel", purpose: "First home buyer", amount: 585000, broker: "Aaron Lee", opened: "2026-11-04", done: all, overdue: [] },
  { id: "LF-1043", client: "Harris", purpose: "Investment loan", amount: 910000, broker: "Priya Nair", opened: "2026-11-05", done: ["guide", "factfind", "bid"], overdue: ["verify"] },
  { id: "LF-1044", client: "Kowalski", purpose: "Construction", amount: 780000, broker: "Jess Smith", opened: "2026-11-09", done: ["guide", "factfind", "bid", "verify", "serviceability"], overdue: [] },
  { id: "LF-1045", client: "Brown", purpose: "Debt consolidation", amount: 320000, broker: "Aaron Lee", opened: "2026-11-10", done: all, overdue: [] },
  { id: "LF-1046", client: "Okafor", purpose: "Upgrade and sell", amount: 1150000, broker: "Priya Nair", opened: "2026-11-12", done: ["guide", "factfind"], overdue: ["bid"] },
  { id: "LF-1047", client: "Martin", purpose: "Refinance", amount: 470000, broker: "Jess Smith", opened: "2026-11-13", done: ["guide", "factfind", "bid", "verify"], overdue: [] },
  { id: "LF-1048", client: "Zhang", purpose: "Investment loan", amount: 695000, broker: "Aaron Lee", opened: "2026-11-16", done: ["guide", "factfind"], overdue: [] },
  { id: "LF-1049", client: "Rossi", purpose: "First home buyer", amount: 540000, broker: "Priya Nair", opened: "2026-11-18", done: ["guide"], overdue: [] },
  { id: "LF-1050", client: "Campbell", purpose: "Refinance", amount: 380000, broker: "Jess Smith", opened: "2026-11-19", done: [], overdue: ["guide"] },
  { id: "LF-1051", client: "Tran", purpose: "First home buyer", amount: 610000, broker: "Daniel Cho", opened: "2026-11-11", done: ["guide", "factfind"], overdue: ["bid"] },
  { id: "LF-1052", client: "Edwards", purpose: "Refinance", amount: 430000, broker: "Daniel Cho", opened: "2026-11-14", done: STEPS.map((s) => s.key).filter((k) => k !== "suitability"), overdue: [] },
  { id: "LF-1053", client: "Hughes", purpose: "Investment loan", amount: 720000, broker: "Mia Torres", opened: "2026-11-15", done: all, overdue: [] },
];

// ---------------------------------------------------------------- representatives

export type Risk = "Low" | "Medium" | "High";

export type Accreditation = { lender: string; expires: string };

export type Rep = {
  name: string;
  role: string;
  kind: "Licensee" | "Employee" | "Credit representative";
  risk: Risk;
  authorised: string;
  lastContact: string;
  cpdDone: number;
  cpdTarget: number;
  trainingDone: number;
  trainingTotal: number;
  accreditations: Accreditation[];
};

/** How often a rep must be contacted, in days, by risk rating. The licensee sets these in its own policy. */
export const CADENCE: Record<Risk, number> = { High: 14, Medium: 30, Low: 90 };
/** File reviews expected per rep each quarter, by risk rating. */
export const REVIEWS_REQUIRED: Record<Risk, number> = { High: 4, Medium: 2, Low: 1 };

export const initialReps: Rep[] = [
  {
    name: "Jess Smith", role: "Principal and responsible manager", kind: "Licensee", risk: "Low",
    authorised: "2019-03-01", lastContact: "2026-11-18", cpdDone: 17, cpdTarget: 20, trainingDone: 6, trainingTotal: 6,
    accreditations: [
      { lender: "Lender A", expires: "2027-03-31" },
      { lender: "Lender B", expires: "2026-12-15" },
      { lender: "Lender C", expires: "2027-06-30" },
    ],
  },
  {
    name: "Aaron Lee", role: "Employee broker", kind: "Employee", risk: "Medium",
    authorised: "2021-07-12", lastContact: "2026-10-28", cpdDone: 11, cpdTarget: 20, trainingDone: 4, trainingTotal: 6,
    accreditations: [
      { lender: "Lender A", expires: "2027-03-31" },
      { lender: "Lender D", expires: "2026-11-30" },
    ],
  },
  {
    name: "Priya Nair", role: "Credit representative", kind: "Credit representative", risk: "Medium",
    authorised: "2022-02-21", lastContact: "2026-10-12", cpdDone: 20, cpdTarget: 20, trainingDone: 6, trainingTotal: 6,
    accreditations: [
      { lender: "Lender B", expires: "2027-01-31" },
      { lender: "Lender C", expires: "2027-06-30" },
    ],
  },
  {
    name: "Daniel Cho", role: "Credit representative, joined September", kind: "Credit representative", risk: "High",
    authorised: "2026-09-14", lastContact: "2026-11-10", cpdDone: 4, cpdTarget: 20, trainingDone: 2, trainingTotal: 6,
    accreditations: [{ lender: "Lender A", expires: "2027-09-30" }],
  },
  {
    name: "Mia Torres", role: "Credit representative", kind: "Credit representative", risk: "Low",
    authorised: "2023-05-08", lastContact: "2026-09-05", cpdDone: 9, cpdTarget: 20, trainingDone: 5, trainingTotal: 6,
    accreditations: [
      { lender: "Lender B", expires: "2027-02-28" },
      { lender: "Lender C", expires: "2026-12-31" },
    ],
  },
];

export const BROKERS = initialReps.map((r) => r.name);

export type SupervisionKind = "Catch-up" | "Training" | "Team meeting" | "File review";

export type SupervisionEntry = {
  id: string;
  rep: string;
  kind: SupervisionKind;
  date: string;
  by: string;
  note: string;
};

export const initialLog: SupervisionEntry[] = [
  { id: "S-8", rep: "Jess Smith", kind: "File review", date: "2026-11-18", by: "Jess Smith", note: "Reviewed LF-1041. Reasons and verification on file." },
  { id: "S-7", rep: "Daniel Cho", kind: "Training", date: "2026-11-10", by: "Jess Smith", note: "Best interests duty and verification refresher." },
  { id: "S-6", rep: "Aaron Lee", kind: "File review", date: "2026-11-12", by: "Jess Smith", note: "Reviewed LF-1045. Lender choice reasons too thin." },
  { id: "S-5", rep: "Aaron Lee", kind: "Catch-up", date: "2026-10-28", by: "Jess Smith", note: "Pipeline, complaints and CPD plan." },
  { id: "S-4", rep: "Aaron Lee", kind: "File review", date: "2026-11-12", by: "Jess Smith", note: "Reviewed LF-1042. No issues." },
  { id: "S-3", rep: "Priya Nair", kind: "Catch-up", date: "2026-10-12", by: "Jess Smith", note: "Referrer arrangements and disclosure timing." },
  { id: "S-2", rep: "Mia Torres", kind: "Team meeting", date: "2026-09-05", by: "Jess Smith", note: "Quarterly team compliance meeting." },
];

export type Review = {
  fileId: string;
  outcome: "pass" | "fix";
  date: string;
  note: string;
  resolved: boolean;
};

export const initialReviews: Review[] = [
  { fileId: "LF-1041", outcome: "pass", date: "2026-11-18", note: "", resolved: true },
  { fileId: "LF-1042", outcome: "pass", date: "2026-11-12", note: "", resolved: true },
  { fileId: "LF-1045", outcome: "fix", date: "2026-11-12", note: "Reasons for lender choice are thin. Add the comparison rationale.", resolved: false },
];

export type RepStatus = { days: number; cadence: number; left: number; state: "ok" | "soon" | "overdue" };

export function supervisionStatus(rep: Rep): RepStatus {
  const days = -daysFromToday(rep.lastContact);
  const cadence = CADENCE[rep.risk];
  const left = cadence - days;
  return { days, cadence, left, state: left < 0 ? "overdue" : left <= 7 ? "soon" : "ok" };
}

// ---------------------------------------------------------------- registers

export type Complaint = {
  id: string;
  client: string;
  summary: string;
  received: string;
  /** internal dispute resolution response due */
  due: string;
  owner: string;
  stage: string;
  resolved: boolean;
};

export const initialComplaints: Complaint[] = [
  { id: "C-207", client: "Harris", summary: "Settlement delayed after a lender valuation dispute", received: "2026-11-06", due: "2026-12-06", owner: "Priya Nair", stage: "Investigating", resolved: false },
  { id: "C-208", client: "Lopez", summary: "Fee disclosed late in the process", received: "2026-11-17", due: "2026-12-17", owner: "Aaron Lee", stage: "Acknowledged", resolved: false },
  { id: "C-204", client: "Bennett", summary: "Unclear explanation of a loan feature", received: "2026-10-08", due: "2026-11-07", owner: "Priya Nair", stage: "Response sent", resolved: true },
];

export type BreachStatus = "Assessing" | "Reportable" | "Reported" | "Not reportable";

export type Breach = {
  id: string;
  summary: string;
  rep: string;
  found: string;
  /** the day there were reasonable grounds to believe it was reportable */
  groundsOn: string;
  /** 30 days after groundsOn */
  due: string;
  status: BreachStatus;
  reportedOn?: string;
};

export const initialBreaches: Breach[] = [
  { id: "B-31", summary: "Credit proposal issued before expenses were verified", rep: "Daniel Cho", found: "2026-11-10", groundsOn: "2026-11-10", due: "2026-12-10", status: "Reportable" },
  { id: "B-32", summary: "Client documents emailed to the wrong address", rep: "Priya Nair", found: "2026-11-18", groundsOn: "2026-11-18", due: "2026-12-18", status: "Assessing" },
  { id: "B-29", summary: "Credit guide not issued before assistance began", rep: "Aaron Lee", found: "2026-09-22", groundsOn: "2026-09-22", due: "2026-10-22", status: "Reported", reportedOn: "2026-10-09" },
];

// ---------------------------------------------------------------- the licence

export type LicenceItem = { label: string; detail: string; date?: string; dateLabel?: string };

export const licence: LicenceItem[] = [
  { label: "Australian credit licence", detail: "ACL 000000 (sample), conditions on file" },
  { label: "Credit representatives on ASIC's register", detail: "3 of 3 notified" },
  { label: "AFCA membership", detail: "Current member", date: "2027-01-31", dateLabel: "Renews" },
  { label: "Professional indemnity insurance", detail: "Policy on file", date: "2026-12-18", dateLabel: "Renews" },
  { label: "Complaints and IDR policy", detail: "Last reviewed a year ago", date: "2026-12-01", dateLabel: "Review due" },
];

// ---------------------------------------------------------------- helpers

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function daysFromToday(iso: string) {
  const a = Date.parse(`${TODAY}T00:00:00Z`);
  const b = Date.parse(`${iso}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function money(n: number) {
  return `A$${n.toLocaleString("en-AU")}`;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
