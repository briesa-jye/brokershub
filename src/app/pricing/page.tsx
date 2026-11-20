import type { Metadata } from "next";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { FaqList } from "@/components/Faq";
import { PricingGrid } from "@/components/PricingGrid";

export const metadata: Metadata = {
  title: "Pricing from A$59 a Month",
  description:
    "BROKERSHUB plans from A$59 a month plus GST. Priced per brokerage, never per file or per seat. No lock-in contract.",
  alternates: { canonical: "/pricing" },
};

const faqs: [string, string][] = [
  [
    "Does BROKERSHUB guarantee we will pass a review or audit?",
    "No. BROKERSHUB supports your diligence: it keeps your records in one place and flags what needs attention. It is not a law firm, does not give legal advice and does not guarantee compliance. Your credit licensee remains responsible for decisions and sign-off.",
  ],
  [
    "Do you charge per file or per seat?",
    "No. The number of people who sign in decides which plan fits. Files are unlimited on every plan.",
  ],
  [
    "Is GST added to the prices?",
    "Yes. Prices are in AUD plus 10% GST, billed monthly with no lock-in contract.",
  ],
  [
    "Can we change plan later?",
    "Yes. A plan is a limit, not a different system, so your data stays exactly as it is when you move up or down.",
  ],
  [
    "Does our aggregator or auditor need a seat?",
    "No. A reviewer you invite gets a read-only account that sees everything and changes nothing.",
  ],
  [
    "Will pipeline and operations features cost extra?",
    "We will tell early-access brokerages before anything is priced separately. Early-access plans keep their price while the platform grows.",
  ],
];

const limits = [
  ["People who sign in", "1", "10", "30"],
  ["Loan files", "Unlimited", "Unlimited", "Unlimited"],
  ["Document storage", "5 GB", "50 GB", "200 GB"],
  ["Audit pack export", "Yes", "Yes", "Yes"],
  ["Multi-office reporting", "No", "No", "Yes"],
];

export default function Pricing() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Priced per brokerage, never per <span className="tape">file</span>.
          </>
        }
      >
        No lock-in contract and cancel anytime. Hover a plan to compare. We are
        onboarding early-access brokerages now, so every plan starts with a
        demo.
      </PageHeader>

      <ul
        data-reveal
        className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 font-semibold sm:px-8"
      >
        {["No lock-in contracts", "Cancel anytime", "Unlimited loan files"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink">
              <Icon name="check" className="h-3.5 w-3.5" />
            </span>
            {t}
          </li>
        ))}
      </ul>

      <PricingGrid />

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Limits by plan</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.02] tracking-tight">
            The same system on every plan.
          </h2>
        </div>
        <div data-reveal className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-t border-ink text-left text-sm">
            <thead>
              <tr className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                <th className="py-4 font-medium">&nbsp;</th>
                <th className="py-4 font-medium">Solo</th>
                <th className="py-4 font-medium">Brokerage</th>
                <th className="py-4 font-medium">Group</th>
              </tr>
            </thead>
            <tbody>
              {limits.map(([k, ...v]) => (
                <tr key={k} className="border-t border-line">
                  <th className="py-4 pr-4 font-semibold">{k}</th>
                  {v.map((c, i) => (
                    <td key={i} className="py-4 pr-4 text-ink-soft">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-3xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight">
            About pricing.
          </h2>
          <div className="mt-10">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
