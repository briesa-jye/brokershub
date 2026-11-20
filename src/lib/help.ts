export type Guide = { id: string; category: string; title: string; summary: string; body: string[] };

export const HELP_CATEGORIES = ["Getting started", "Assistance", "Loan files", "Supervision", "Registers", "Audit pack", "Settings"];

export const HELP: Guide[] = [
  {
    id: "overview",
    category: "Getting started",
    title: "How the dashboard works",
    summary: "What each page is for and where to start each day.",
    body: [
      "Start on Dashboard. The Needs attention list puts the most pressing items first: breaches with a clock running, overdue loan file steps, representatives you are overdue to contact, complaint deadlines and licence renewals.",
      "Loan files holds the checklist for each file. Supervision is where you log contact and review files. Representatives, Complaints and Breaches are the registers. Audit pack pulls them all into one export.",
    ],
  },
  {
    id: "demo",
    category: "Getting started",
    title: "About the demo data",
    summary: "Everything here is sample data and resets when you reload.",
    body: [
      "The workspace, people, files and dates are invented so you can try the product. Anything you change stays in your browser tab until you reload the page.",
    ],
  },
  {
    id: "adding",
    category: "Getting started",
    title: "Adding records",
    summary: "Every area has a button to add what is missing.",
    body: [
      "Loan files: New loan file, then add notes on the file. Supervision: log a catch-up, training or team meeting with a note. Representatives: add a representative, set their risk rating, log CPD hours, mark a training module done and add lender accreditations.",
      "Complaints: Log complaint, then move it through its stages. Breaches: Record breach. Licence health: Add item, and Mark renewed when something is renewed. Settings, Team also lets you add a team member.",
    ],
  },
  {
    id: "assistant",
    category: "Assistance",
    title: "What Assistance can do",
    summary: "Ask questions about your licence and have it do the paperwork.",
    body: [
      "Assistance can look across your loan files, supervision, complaints, breaches and licence dates, and make changes for you: open files, add notes, log complaints, record possible breaches, log supervision contacts, add team members and log CPD hours.",
      "It will not pass or fail a file review, tick a checklist step, decide whether a breach is reportable or change your policy. Those are your calls as licensee, and it sends you to the right page instead.",
    ],
  },
  {
    id: "approval",
    category: "Assistance",
    title: "Approving changes",
    summary: "Nothing is changed until you approve it, unless you turn that off.",
    body: [
      "With Ask before making changes switched on, each change appears as a card showing exactly what will happen. Approve it or skip it. If several are waiting you can approve or skip them all.",
      "In the demo, Assistance runs in demo mode and answers from the sample data. The live assistant, which also answers general compliance questions, is switched on by connecting a Claude API key.",
    ],
  },
  {
    id: "steps",
    category: "Loan files",
    title: "Putting a step on file",
    summary: "Tick a checklist step and the status updates everywhere.",
    body: [
      "Open a file and tick a step when it is done. The file's status, the dashboard counts and the audit pack all update straight away.",
      "A step shown as overdue is one that should already be on file. Files with an overdue step are flagged.",
    ],
  },
  {
    id: "ready",
    category: "Loan files",
    title: "What Ready and Hold mean",
    summary: "A quick read on whether a file would stand up to a review.",
    body: [
      "Ready means every step is on file. Hold means there are overdue or missing steps to fix before the file goes to a lender.",
      "These are prompts to help your diligence. They are not legal advice and do not replace your own judgement or sign-off.",
    ],
  },
  {
    id: "cadence",
    category: "Supervision",
    title: "How contact cadence works",
    summary: "Each representative has a risk rating that sets how often you contact them.",
    body: [
      "Each representative has a risk rating. Your supervision policy sets how many days can pass between contacts for each rating, and how many file reviews to expect each quarter.",
      "A representative becomes overdue when the days since last contact pass their cadence. They show as due soon in the last week. You can change the policy under Settings.",
    ],
  },
  {
    id: "contact",
    category: "Supervision",
    title: "Logging a catch-up or training",
    summary: "One click records it and resets the clock.",
    body: [
      "On Supervision, pick the type of contact next to a representative and press Log. It is time-stamped with who recorded it and becomes part of the supervision log in your audit pack.",
    ],
  },
  {
    id: "reviews",
    category: "Supervision",
    title: "Reviewing a file and raising findings",
    summary: "Pass a file, or mark it Needs fix and track the remediation.",
    body: [
      "The file review queue suggests files, starting with representatives who are behind on reviews. Pass a file if it is sound. Choose Needs fix to raise a finding.",
      "Findings stay open until you mark them fixed, so the audit pack shows what you found and what you did about it.",
    ],
  },
  {
    id: "complaints",
    category: "Registers",
    title: "Recording a complaint",
    summary: "Each complaint carries a response deadline.",
    body: [
      "Complaints are logged with the date received, an owner and a response due date. Mark a complaint resolved once the response is sent and it is closed.",
    ],
  },
  {
    id: "breaches",
    category: "Registers",
    title: "How the breach clock works",
    summary: "The 30-day window to lodge with ASIC starts at reasonable grounds.",
    body: [
      "Record a possible breach the day it surfaces. If it is reportable, the clock to lodge with ASIC runs for 30 days from when you had reasonable grounds to believe it was.",
      "Mark it Reportable or Not reportable, and Reported once lodged. BROKERSHUB keeps the record and the clock. Whether something is reportable is a decision for you as the licensee, ideally with advice.",
    ],
  },
  {
    id: "pack",
    category: "Audit pack",
    title: "Building an audit pack",
    summary: "Choose sections and a representative, then download.",
    body: [
      "Tick the sections to include (files, supervision log, reviews and findings, complaints, breaches, representatives) and optionally narrow to one representative. Gaps are shown as gaps, never hidden.",
      "The demo downloads a CSV. The full product exports a formatted PDF.",
    ],
  },
  {
    id: "policy",
    category: "Settings",
    title: "Changing your supervision policy",
    summary: "Set contact cadence and expected reviews by risk rating.",
    body: [
      "Under Settings, Supervision policy, set the number of days between contacts and the number of file reviews each quarter for Low, Medium and High risk. Overdue flags and the dashboard recalculate immediately.",
      "These defaults are examples. Set them to match your own licensee policy.",
    ],
  },
];
