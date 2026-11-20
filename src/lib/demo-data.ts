/** Sample data for the demo dashboard. Every name, number and date here is invented. */

/** The demo's fixed "today", so server and client render the same thing. */
export const TODAY = "2026-11-21";

export const WORKSPACE = "Harbour Home Loans";
export const USER = { name: "Jess Smith", role: "Principal broker" };

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

export const BROKERS = ["Jess Smith", "Aaron Lee", "Priya Nair"];

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
];

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
  { id: "C-207", client: "Harris", summary: "Settlement delayed after a lender valuation dispute", received: "2026-11-06", due: "2026-12-06", owner: "Jess Smith", stage: "Investigating", resolved: false },
  { id: "C-208", client: "Lopez", summary: "Fee disclosed late in the process", received: "2026-11-17", due: "2026-12-17", owner: "Aaron Lee", stage: "Acknowledged", resolved: false },
  { id: "C-204", client: "Bennett", summary: "Unclear explanation of a loan feature", received: "2026-10-08", due: "2026-11-07", owner: "Priya Nair", stage: "Response sent", resolved: true },
];

export type Accreditation = { lender: string; expires: string };
export type TeamMember = {
  name: string;
  role: string;
  cpdDone: number;
  cpdTarget: number;
  accreditations: Accreditation[];
};

export const team: TeamMember[] = [
  {
    name: "Jess Smith",
    role: "Principal broker",
    cpdDone: 17,
    cpdTarget: 20,
    accreditations: [
      { lender: "Lender A", expires: "2027-03-31" },
      { lender: "Lender B", expires: "2026-12-15" },
      { lender: "Lender C", expires: "2027-06-30" },
    ],
  },
  {
    name: "Aaron Lee",
    role: "Broker",
    cpdDone: 11,
    cpdTarget: 20,
    accreditations: [
      { lender: "Lender A", expires: "2027-03-31" },
      { lender: "Lender D", expires: "2026-11-30" },
    ],
  },
  {
    name: "Priya Nair",
    role: "Broker",
    cpdDone: 20,
    cpdTarget: 20,
    accreditations: [
      { lender: "Lender B", expires: "2027-01-31" },
      { lender: "Lender C", expires: "2027-06-30" },
    ],
  },
];

export const activity: { when: string; text: string; who: string }[] = [
  { when: "Today 09:12", text: "Credit guide issued for Rossi", who: "Priya Nair" },
  { when: "Today 08:40", text: "Verification flagged as overdue on Harris", who: "System" },
  { when: "Yesterday 16:05", text: "Suitability assessment signed for Brown", who: "Aaron Lee" },
  { when: "Yesterday 14:30", text: "Complaint C-208 acknowledged", who: "Aaron Lee" },
  { when: "Yesterday 11:22", text: "Serviceability assessed for Kowalski", who: "Jess Smith" },
];

// ---- dates, formatted by hand so server and client agree ----
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
