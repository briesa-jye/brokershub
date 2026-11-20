/**
 * The actions the Assistance agent can take. The model only ever sees these definitions; the work itself
 * runs in the browser against the licensee's workspace. Tools marked `write` change records, so the user
 * approves each one before it runs (unless they have switched approval off for the chat).
 *
 * Deliberately absent: anything that makes a compliance judgement or signs off for the licensee: passing or
 * failing a file review, ticking a checklist step, deciding whether a breach is reportable, marking one
 * lodged, or changing policy, access or settings. The agent says so and points to the right page instead.
 */
export type AgentTool = {
  name: string;
  description: string;
  write: boolean;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

const str = (description: string) => ({ type: "string", description });
const iso = (description: string) => ({
  type: "string",
  description: `${description} Format yyyy-mm-dd.`,
});

export const AGENT_TOOLS: AgentTool[] = [
  /* ---------- look things up ---------- */
  {
    name: "get_overview",
    write: false,
    description:
      "The headline picture and everything that needs attention right now: files cleared and flagged, representatives overdue for contact, open complaints, breaches with a clock running, and licence dates coming due.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_files",
    write: false,
    description:
      "List loan files with ids, client, purpose, broker, status (cleared, in progress or flagged), the steps still missing and whether a supervision review has happened. Use to find a file id.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["clear", "open", "flag"], description: "clear = complete, open = in progress, flag = a required step is overdue." },
        broker: str("A representative's name."),
        search: str("Part of a client name or purpose."),
      },
    },
  },
  {
    name: "get_file",
    write: false,
    description: "Get one loan file with every checklist step (done, missing or overdue), its notes and its review result.",
    input_schema: {
      type: "object",
      properties: { file_id: str("Id from list_files, for example LF-1043.") },
      required: ["file_id"],
    },
  },
  {
    name: "list_team",
    write: false,
    description:
      "List the licensee's people with type, risk rating, last contact, CPD, training and accreditations. Use for exact names.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_supervision",
    write: false,
    description:
      "For each representative: contact cadence, days since last contact, whether they are overdue, and file reviews done against what is expected this quarter. Also lists recent supervision log entries and open review findings.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_complaints",
    write: false,
    description: "List complaints with ids, owner, stage, the response due date and days left.",
    input_schema: {
      type: "object",
      properties: { open_only: { type: "boolean", description: "Only complaints not yet resolved." } },
    },
  },
  {
    name: "list_breaches",
    write: false,
    description: "List possible and reportable breaches with status, the 30-day lodge-by date and days left.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_licence",
    write: false,
    description: "List the licensee's own obligations: credit licence, representatives on ASIC's register, AFCA, insurance and policy reviews, with dates.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "open_page",
    write: false,
    description:
      "Show the user a link to a page in BROKERSHUB, for example Supervision to pass a file review or Breaches to decide reportability. Use this to send them somewhere to finish what you cannot do yourself.",
    input_schema: {
      type: "object",
      properties: {
        path: str("Path starting with /dashboard/, for example /dashboard/supervision."),
        label: str("Short link text, for example 'Open Supervision'."),
      },
      required: ["path", "label"],
    },
  },

  /* ---------- make changes (the user approves each one) ---------- */
  {
    name: "add_file",
    write: true,
    description: "Open a new loan file for a client. It starts with every checklist step still to do.",
    input_schema: {
      type: "object",
      properties: {
        client: str("Client surname or name."),
        purpose: { type: "string", enum: ["Refinance", "First home buyer", "Investment loan", "Construction", "Debt consolidation", "Upgrade and sell", "Other"] },
        amount: { type: "number", description: "Loan amount in Australian dollars. Use 0 if unknown." },
        broker: str("The responsible representative's exact name from list_team."),
      },
      required: ["client", "purpose", "broker"],
    },
  },
  {
    name: "add_file_note",
    write: true,
    description: "Add a note to a loan file, for example the reason a lender was chosen.",
    input_schema: {
      type: "object",
      properties: { file_id: str("Id from list_files."), note: str("The note, in plain words.") },
      required: ["file_id", "note"],
    },
  },
  {
    name: "log_complaint",
    write: true,
    description: "Log a complaint on the register. The response deadline is set to 30 days after it was received.",
    input_schema: {
      type: "object",
      properties: {
        client: str("Who complained."),
        summary: str("What the complaint is about, in plain words."),
        owner: str("The representative who will handle it, exact name from list_team."),
        received: iso("The day it was received. Defaults to today."),
      },
      required: ["client", "summary", "owner"],
    },
  },
  {
    name: "record_breach",
    write: true,
    description:
      "Record a possible breach on the register as 'Assessing'. You cannot decide whether it is reportable, that is the licensee's call.",
    input_schema: {
      type: "object",
      properties: {
        summary: str("What happened, in plain words."),
        rep: str("Representative involved, exact name from list_team."),
        found: iso("The day it was found. Defaults to today."),
        grounds_on: iso("The day there were reasonable grounds to believe it reportable. Defaults to the day found."),
      },
      required: ["summary", "rep"],
    },
  },
  {
    name: "log_supervision_contact",
    write: true,
    description: "Record a supervision contact with a representative today. This resets their contact clock.",
    input_schema: {
      type: "object",
      properties: {
        rep: str("Representative's exact name from list_team."),
        kind: { type: "string", enum: ["Catch-up", "Training", "Team meeting"] },
        note: str("What was covered."),
      },
      required: ["rep", "kind"],
    },
  },
  {
    name: "add_team_member",
    write: true,
    description: "Add a person to the licensee's team. New people start at high risk unless told otherwise.",
    input_schema: {
      type: "object",
      properties: {
        name: str("Full name."),
        kind: { type: "string", enum: ["Credit representative", "Employee", "Licensee"] },
        role: str("Optional role description."),
        risk: { type: "string", enum: ["High", "Medium", "Low"] },
      },
      required: ["name", "kind"],
    },
  },
  {
    name: "log_cpd",
    write: true,
    description: "Add completed CPD hours to a representative's record.",
    input_schema: {
      type: "object",
      properties: { rep: str("Representative's exact name."), hours: { type: "number", description: "Hours completed." } },
      required: ["rep", "hours"],
    },
  },
];

export const toolByName = (name: string) => AGENT_TOOLS.find((t) => t.name === name);
