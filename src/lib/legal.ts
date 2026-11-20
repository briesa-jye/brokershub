/**
 * BROKERSHUB's Terms and Privacy Policy, shown at /terms and /privacy.
 * DRAFT written for the current early-access stage (no accounts, no payments). Have a lawyer review and
 * update these before taking customer data or payments, and change LEGAL_UPDATED when they change.
 */
import { CONTACT_EMAIL } from "./site";

export const LEGAL_UPDATED = "21 November 2026";

/** The standard statement of what BROKERSHUB is and isn't, shown in the footer, the terms and the guides. */
export const DISCLAIMER =
  "BROKERSHUB provides diligence support to help credit licensees, brokers and credit representatives stay on top of their compliance obligations. It is not a law firm and does not provide legal advice, and it does not guarantee compliance or the outcome of any review, audit or ASIC enquiry. The licensee remains responsible for decisions and sign-off.";

export const OPERATOR = { name: "Brokers Hub", email: CONTACT_EMAIL };

export type LegalSection = { h: string; p?: string[]; bullets?: string[] };

export const TERMS: LegalSection[] = [
  {
    h: "1. About these terms",
    p: [
      `These terms apply to the BROKERSHUB website and the demo workspace (together, the "service"), provided by ${OPERATOR.name} ("we", "us"). By using the service you agree to them. If you do not agree, please do not use it.`,
      "BROKERSHUB is in early access. Features, plans and prices may change, and some parts described on the website are still being built.",
    ],
  },
  {
    h: "2. The demo",
    p: [
      "The demo dashboard runs on sample data. Names, files, dates and figures in it are invented. Changes you make in the demo are kept only in your browser tab and are lost when you reload. Do not enter real client information into the demo.",
    ],
  },
  {
    h: "3. Not legal advice",
    p: [
      DISCLAIMER,
      "Guides, help articles and answers from the assistant are general information. Check current requirements with ASIC, your aggregator or your own adviser.",
    ],
  },
  {
    h: "4. Using the service",
    bullets: [
      "Use the service lawfully and do not try to disrupt, copy or reverse engineer it.",
      "Do not use another person's details or submit anything misleading through our forms.",
      "We may change or withdraw parts of the service, particularly during early access.",
    ],
  },
  {
    h: "5. Our responsibility",
    p: [
      "We take reasonable care in building the service, but we provide it as is and do not promise it will be uninterrupted or error free. To the extent the law allows, we are not liable for loss arising from your use of an early-access service. Nothing in these terms limits rights you have under the Australian Consumer Law that cannot be excluded.",
    ],
  },
  {
    h: "6. Changes and contact",
    p: [
      `We may update these terms and will change the date at the top when we do. Questions? Email ${OPERATOR.email}.`,
    ],
  },
];

export const PRIVACY: LegalSection[] = [
  {
    h: "1. What this covers",
    p: [
      `This policy explains how ${OPERATOR.name} handles personal information collected through the BROKERSHUB website. We aim to follow the Australian Privacy Principles.`,
    ],
  },
  {
    h: "2. What we collect",
    bullets: [
      "Details you send us through the contact or demo forms: your name, email, business name, phone number and message.",
      "Basic technical information your browser sends when you visit, such as pages viewed and device type.",
    ],
    p: [
      "The demo dashboard does not collect personal information. It uses sample data and keeps what you type only in your browser tab.",
    ],
  },
  {
    h: "3. How we use it",
    bullets: [
      "To reply to your message and arrange a demo.",
      "To keep the website working and understand how it is used.",
    ],
    p: ["We do not sell personal information."],
  },
  {
    h: "4. Sharing and storage",
    p: [
      "Form messages are sent to us by email through a mail service provider. We keep them only as long as we need them to deal with your request. We do not share your details with other businesses except service providers who help us run the website, and where the law requires.",
    ],
  },
  {
    h: "5. Your rights",
    p: [
      `You can ask to see or correct the personal information we hold about you, or ask us to delete it, by emailing ${OPERATOR.email}. If you are unhappy with how we handle your information, you can complain to us first, and then to the Office of the Australian Information Commissioner.`,
    ],
  },
  {
    h: "6. Changes",
    p: ["We may update this policy and will change the date at the top when we do."],
  },
];
