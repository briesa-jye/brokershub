export type Guide = {
  slug: string;
  title: string; // <title> and og:title, brand added by the layout template
  h1: string;
  description: string;
  category: string;
  intro: string;
  sections: { h: string; p: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const NOT_ADVICE =
  "This guide is general information, not legal advice. BROKERSHUB is not a law firm and does not guarantee compliance or the outcome of any review or audit. Confirm current requirements with ASIC, your aggregator or your own adviser.";

export const guides: Guide[] = [
  {
    slug: "best-interests-duty-checklist-mortgage-brokers",
    title: "Best Interests Duty Checklist for Mortgage Brokers",
    h1: "A best interests duty file checklist for mortgage brokers",
    description:
      "What a mortgage broker's file should show to evidence the best interests duty: the credit guide, the fact find, the lender comparison, verification and the reasons for the recommendation.",
    category: "Best interests duty",
    intro:
      "Brokers must act in the client's best interests when giving credit assistance. When a file is reviewed, the question is simple: does it show what you did and why? This checklist covers the evidence a reviewer looks for.",
    sections: [
      {
        h: "What a reviewer wants to see",
        p: [
          "A review rarely asks whether you were a good broker. It asks whether the file lets someone else see the steps you took, in order, and the reasons for the recommendation.",
          "The strongest files are written as the work happens. Reasons reconstructed weeks later read as reconstructed.",
        ],
        bullets: [
          "The credit guide issued before credit assistance began, and when",
          "A fact find recording the client's requirements, objectives and financial situation",
          "A comparison of suitable lenders and products, and why the one recommended was chosen",
          "Verification of income and expenses, not just what the client said",
          "A serviceability assessment and a note of any assumptions",
          "Credit proposal disclosure issued, and the suitability assessment signed",
        ],
      },
      {
        h: "Where files usually fall short",
        p: [
          "The gaps are rarely dramatic. They are small things nobody wrote down: the reason a lender was chosen, the date the guide went out, the statement that was promised and never arrived.",
        ],
        bullets: [
          "Reasons for the lender choice are one line, or missing",
          "Expense verification is promised and never chased",
          "Disclosure is issued after the client has already been assisted",
          "Changes to the client's circumstances are not noted",
        ],
      },
      {
        h: "Making it routine",
        p: [
          "A checklist that is part of the file, with a date against each step and a flag when a step is overdue, turns this from memory into process. A second person reviewing a sample of files each quarter shows the licensee is checking that the process holds.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does a complete checklist prove I met the best interests duty?",
        a: "No. It is evidence that you followed a process and recorded your reasons. Whether the duty was met depends on the facts of the file, and that is a judgement for the licensee and, if it comes to it, ASIC or AFCA.",
      },
      {
        q: "How long should reasons for the recommendation be?",
        a: "As long as it takes for someone who was not in the room to understand why this lender and product suited this client. A line that says 'best rate' is rarely enough on its own.",
      },
      {
        q: "Who is responsible for the files of a credit representative?",
        a: "The credit licensee is responsible for the conduct of its credit representatives, which is why sampling and reviewing their files matters.",
      },
    ],
    related: ["supervising-credit-representatives", "broker-audit-pack-guide", "broker-complaints-idr-afca"],
  },
  {
    slug: "supervising-credit-representatives",
    title: "Supervising Credit Representatives: What to Keep",
    h1: "Supervising credit representatives: the records a licensee should keep",
    description:
      "How a credit licensee can show it monitors and supervises its representatives: contact cadence by risk, file reviews, findings and training, all recorded.",
    category: "Supervision",
    intro:
      "A credit licensee answers for what its representatives do. Supervision is how you find problems before a client, a lender or ASIC does, and the record of it is how you show you were looking.",
    sections: [
      {
        h: "What supervision looks like in practice",
        p: [
          "There is no single formula. Your own policy decides how you supervise, and it should match the size and risk of the business. What matters is that the policy is real: that it is followed, and that you can show it.",
        ],
        bullets: [
          "Regular contact with each representative, more often for new or higher-risk reps",
          "Reviews of a sample of their files, with the outcome and any findings recorded",
          "Training, including refreshers after a finding",
          "Team meetings where compliance is on the agenda",
          "Follow-up until each finding is fixed",
        ],
      },
      {
        h: "Setting contact by risk",
        p: [
          "A representative who started last month and handles complex lending needs more attention than someone with years of clean files. Rate each person, set how often you contact them and how many of their files you review each quarter, and write it down in your policy.",
          "Then keep the log. A contact that is not recorded cannot be shown later.",
        ],
      },
      {
        h: "Findings are the point",
        p: [
          "A review that never finds anything either means perfect files or a gentle review. When you do find a gap, the record should show the finding, who owned the fix and the day it was closed. That trail is what shows supervision working.",
        ],
      },
    ],
    faqs: [
      {
        q: "How often must I contact each representative?",
        a: "There is no fixed rule here. Set a frequency in your own supervision policy that is proportionate to risk, follow it, and keep the log. Check current ASIC guidance for what it expects of licensees.",
      },
      {
        q: "Do aggregators do this for me?",
        a: "Aggregators run their own checks on their members, but a licensee who has its own credit licence stays responsible for its own representatives. Independent licensees often have no one else doing this.",
      },
      {
        q: "What if I have one rep?",
        a: "The principle is the same at any size. A short, regular, recorded contact and a few reviewed files each quarter is a reasonable starting point.",
      },
    ],
    related: ["best-interests-duty-checklist-mortgage-brokers", "reportable-situations-credit-licensees", "broker-audit-pack-guide"],
  },
  {
    slug: "reportable-situations-credit-licensees",
    title: "Reportable Situations for Credit Licensees",
    h1: "Reportable situations: the 30-day clock for credit licensees",
    description:
      "A plain-language overview of breach reporting for credit licensees: recording possible breaches, deciding if they are reportable and lodging with ASIC within 30 days.",
    category: "Breach reporting",
    intro:
      "Credit licensees must report certain breaches and other reportable situations to ASIC. The deadline is the part people miss: it runs from when you have reasonable grounds to believe a situation is reportable, not from when you finish investigating.",
    sections: [
      {
        h: "Record first, decide second",
        p: [
          "Something goes wrong: a credit guide was issued late, documents went to the wrong address, a verification step was skipped. The first job is to record it the day it surfaces, with the people involved and what you know.",
          "Whether it is reportable is a separate decision. Make it deliberately, on the facts, and write down who made it and when.",
        ],
      },
      {
        h: "The 30-day clock",
        p: [
          "If a situation is reportable, you generally have 30 calendar days from when you first knew or had reasonable grounds to believe it was reportable to lodge a report with ASIC. Confirm the current rules and any exceptions with ASIC or your adviser.",
        ],
        bullets: [
          "Record the date you first had reasonable grounds",
          "Count 30 days from that date, and diarise it",
          "Keep the decision, the reasoning and the lodgement together",
          "Record what you did to fix the problem and stop it happening again",
        ],
      },
      {
        h: "What a register should show",
        p: [
          "For each entry: what happened, who was involved, when it was found, the grounds date, the deadline, the decision and its reasoning, the date it was lodged, and the follow-up. A register that shows the clock turning is more useful than one you update afterwards.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who decides whether a breach is reportable?",
        a: "The licensee, usually with advice. Software can record the matter and keep the deadline, but it should not make that call for you.",
      },
      {
        q: "Should I record things that turn out not to be reportable?",
        a: "Yes. A record that you assessed a matter and decided it was not reportable, and why, is useful evidence later.",
      },
      {
        q: "What if I miss the deadline?",
        a: "Speak to your adviser and ASIC promptly. This guide is general information only.",
      },
    ],
    related: ["supervising-credit-representatives", "broker-complaints-idr-afca", "broker-audit-pack-guide"],
  },
  {
    slug: "broker-complaints-idr-afca",
    title: "Handling a Broker Complaint: IDR and AFCA",
    h1: "Handling a broker complaint: internal dispute resolution and AFCA",
    description:
      "A plain-language guide to logging, responding to and closing a complaint as a credit licensee: the 30-day response window, records to keep and when AFCA gets involved.",
    category: "Complaints",
    intro:
      "A complaint is not a crisis if you have a process. It becomes one when nobody knows it arrived, nobody owns it and the clock runs out.",
    sections: [
      {
        h: "Log it the day it arrives",
        p: [
          "Record the complainant, what they are unhappy about, the date received and who owns it. Acknowledge it promptly. Many complaints reach the licensee through a broker, so make it easy for anyone to pass one on.",
        ],
      },
      {
        h: "The response window",
        p: [
          "For most complaints, a final response is due within 30 calendar days of receipt. Some complaint types have shorter time limits. Confirm the current timeframes for each type with ASIC's guidance or your adviser, and build the deadline into the record the moment you log the complaint.",
        ],
        bullets: [
          "Acknowledge the complaint and explain the process",
          "Investigate with the relevant file and the broker's account",
          "Respond in writing with the outcome and the reasons",
          "If the complainant is not satisfied, explain how to go to AFCA",
          "Close the complaint and record any change you made as a result",
        ],
      },
      {
        h: "Learning from them",
        p: [
          "Patterns matter more than any single complaint. Three complaints about late fee disclosure is a process problem, not three unlucky files. A register that lets you see them together is how you find it.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need to be an AFCA member?",
        a: "Credit licensees are required to be members of AFCA. Keep your membership current and note the renewal date.",
      },
      {
        q: "Does a complaint always mean a breach?",
        a: "No, but sometimes it does. Assess each complaint for a possible reportable situation as part of handling it.",
      },
      {
        q: "Who should own a complaint?",
        a: "Someone with enough authority to resolve it, and usually not the broker the complaint is about.",
      },
    ],
    related: ["reportable-situations-credit-licensees", "supervising-credit-representatives", "best-interests-duty-checklist-mortgage-brokers"],
  },
  {
    slug: "mortgage-broker-cpd-and-accreditation-tracking",
    title: "Tracking CPD and Lender Accreditations",
    h1: "Tracking CPD and lender accreditations across a brokerage",
    description:
      "How to keep continuing professional development, training and lender accreditations current for every broker, with alerts before anything lapses.",
    category: "CPD and accreditation",
    intro:
      "Hours, courses and accreditations lapse quietly. A broker discovers a lender accreditation expired only when they try to submit a loan, and a CPD shortfall is found in the last month of the year.",
    sections: [
      {
        h: "What there is to track",
        p: [
          "Your licensee, aggregator or industry body sets the CPD and training requirements that apply to each person. The point of tracking is to know where everyone stands against them, not to restate the rules.",
        ],
        bullets: [
          "CPD hours completed against the requirement for the period",
          "Assigned training modules, and who has finished them",
          "Lender and aggregator accreditations with their expiry dates",
          "Authorisation to act as a credit representative",
          "Professional indemnity insurance and AFCA membership for the licensee",
        ],
      },
      {
        h: "Alerts beat reminders",
        p: [
          "A date in someone's calendar is a reminder that depends on that person. An alert that fires 60 days before an expiry, and appears for the licensee too, does not.",
          "Seeing everyone on one page also shows who is behind early enough to do something about it.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many CPD hours does a broker need?",
        a: "It depends on your licensee, aggregator or industry body. Set the requirement for each person in your own records.",
      },
      {
        q: "What should I do with an expired accreditation?",
        a: "Renew it before the person submits loans to that lender, and note the new expiry date.",
      },
    ],
    related: ["supervising-credit-representatives", "broker-audit-pack-guide", "best-interests-duty-checklist-mortgage-brokers"],
  },
  {
    slug: "broker-audit-pack-guide",
    title: "Building an Audit Pack for a Broker Review",
    h1: "Building an audit pack for an aggregator, lender or ASIC review",
    description:
      "What goes into a broker audit pack and how to produce one in minutes: loan files, supervision, reviews, complaints, breaches and representative records.",
    category: "Audit",
    intro:
      "When a reviewer asks for evidence, the difference between an hour and a week is whether your records already live in one place.",
    sections: [
      {
        h: "What to include",
        p: [
          "The reviewer's request will vary, but the same core records come up again and again. If they are kept as you work, the pack is an export rather than a project.",
        ],
        bullets: [
          "Loan files with every checklist step, and the gaps shown as gaps",
          "The supervision log: contacts, training and meetings",
          "File reviews and findings, and what was done about them",
          "The complaints register with response dates",
          "The breaches register with deadlines and lodgements",
          "Representative records: authorisation, CPD, training and accreditations",
        ],
      },
      {
        h: "Never hide a gap",
        p: [
          "A pack that shows a missing step and a fix in progress is stronger than one that quietly leaves the file out. Records should never be hard-deleted, and every entry should carry who made it and when.",
        ],
      },
      {
        h: "Test it before you need it",
        p: [
          "Once a quarter, produce a pack for one representative and read it as a reviewer would. What is missing is what you fix next.",
        ],
      },
    ],
    faqs: [
      {
        q: "How far back should the pack go?",
        a: "Whatever the reviewer asks for, and at least as long as your record keeping obligations require. Check current requirements with ASIC or your adviser.",
      },
      {
        q: "Can I share a pack with an auditor directly?",
        a: "A read-only account for an auditor is the cleanest way, so they can see everything and change nothing.",
      },
    ],
    related: ["supervising-credit-representatives", "best-interests-duty-checklist-mortgage-brokers", "reportable-situations-credit-licensees"],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
