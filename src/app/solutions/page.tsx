import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { AuditTrailMock, BreachClockMock, FileBoardMock, SupervisionMock } from "@/components/Mocks";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Solutions for Licensees, Brokerages and Credit Representatives",
  description:
    "Compliance software sized for a solo broker, a brokerage or a licensee supervising a team of credit representatives: files, supervision, complaints, breaches and the audit pack.",
  path: "/solutions",
});

const audiences = [
  {
    title: "Solo broker",
    line: "For the broker who is also the admin: one person, one set of files, nobody spare to run the software.",
    points: ["A best interests duty checklist on every file", "Verification flags until the statements are in", "CPD and accreditation alerts", "A complaints register with deadlines"],
  },
  {
    title: "Brokerage",
    line: "For a brokerage with a few brokers and support staff, and one principal answering for all of it.",
    points: ["Each broker sees their own files, the principal sees all", "A supervision and file review queue", "One-click audit pack export", "Aggregator and lender accreditation tracking"],
  },
  {
    title: "Licensee group",
    line: "For an independent licence holder supervising credit representatives across offices.",
    points: ["Contact cadence set by each representative's risk rating", "File reviews, findings and remediation tracked", "Breach register with the 30-day clock", "Reporting across every office"],
  },
];

const modules = [
  ["Loan files", "A checklist per file, from credit guide to suitability, with a date against each step and a flag when one is overdue."],
  ["Supervision", "Contact cadence by risk rating, a file review queue, findings and the log that proves you were looking."],
  ["Registers", "Complaints with response deadlines and breaches with the 30-day clock, recorded the day they surface."],
  ["Licence health", "Your credit licence, representatives on ASIC's register, AFCA, insurance and policy reviews, with renewal dates."],
];

const levels = [
  ["Owner", "The licensee or principal. Sees everything and runs the account."],
  ["Supervisor", "Reviews files and logs supervision for the representatives they look after."],
  ["Representative", "Sees their own files and records their own work."],
  ["Read-only", "An external auditor or aggregator reviewer. Sees everything and changes nothing."],
];

const rows = [
  {
    n: "01",
    eyebrow: "Loan files",
    title: "Every file shows what was done, in order, and why.",
    body: "Steps go on file as the work happens. A step that is past due flags the file, so the gap is found by you rather than by the reviewer.",
    points: ["Credit guide, fact find, reasons, verification, serviceability, disclosure, suitability", "Notes that record why a lender was chosen", "Ready or Hold, at a glance"],
    visual: <FileBoardMock />,
  },
  {
    n: "02",
    eyebrow: "Supervision",
    title: "Prove you supervise, not just that you intended to.",
    body: "Rate each representative, set how often you contact them and how many files you review, and the system tells you who is overdue before anyone else does.",
    points: ["Catch-ups, training and meetings logged with who and when", "A review queue that puts reps behind on reviews first", "Findings stay open until they are fixed"],
    visual: <SupervisionMock />,
  },
  {
    n: "03",
    eyebrow: "Breaches",
    title: "A deadline you can see, on a decision that stays yours.",
    body: "Record a possible breach the day it surfaces and the 30-day clock is visible. You decide whether it is reportable, and the record keeps the reasoning and the lodgement.",
    points: ["Assessing, reportable, reported or not reportable", "Days left shown on the dashboard and under the bell", "Complaints on the same footing, with their own deadlines"],
    visual: <BreachClockMock />,
  },
  {
    n: "04",
    eyebrow: "Audit pack",
    title: "The reviewer asks. The pack is already built.",
    body: "Choose the sections and the representative, and export. Gaps are shown as gaps, entries are never deleted and each one carries who made it.",
    points: ["Files, supervision, reviews, complaints, breaches and representatives", "Narrow to one representative or include everyone", "A read-only account for an external auditor"],
    visual: <AuditTrailMock />,
    dark: true,
  },
];

export default function Solutions() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }])} />
      <PageHeader
        eyebrow="Solutions"
        title={
          <>
            One record from the first file to the <span className="tape">audit</span>.
          </>
        }
      >
        Whether you write your own loans or answer for a team of credit representatives, the same record carries the
        files, the supervision and the registers.
      </PageHeader>

      <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <div data-stagger className="grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className="flex flex-col rounded-3xl border border-line bg-surface p-7">
              <h2 className="font-display text-3xl font-bold">{a.title}</h2>
              <p className="mt-3 text-ink-soft">{a.line}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Modules</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Four modules on one core.
          </h2>
        </div>
        <dl data-stagger className="mt-10 grid border-t border-ink md:grid-cols-2 md:gap-x-12">
          {modules.map(([t, d]) => (
            <div key={t} className="border-b border-line py-6">
              <dt className="font-display text-2xl font-bold">{t}</dt>
              <dd className="mt-2 text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {rows.map((r, i) => (
        <section key={r.n} className={`mt-28 ${r.dark ? "bg-ink py-24 text-bg" : ""}`}>
          <div className={`mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2`}>
            <div data-reveal className={i % 2 === 1 && !r.dark ? "lg:order-2" : ""}>
              <p className="font-mono text-sm opacity-60">{r.n}</p>
              <Eyebrow>{r.eyebrow}</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">{r.title}</h2>
              <p className={`mt-5 max-w-md ${r.dark ? "text-bg/75" : "text-ink-soft"}`}>{r.body}</p>
              <ul className="mt-6 space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-2 font-medium">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal>{r.visual}</div>
          </div>
        </section>
      ))}

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Access</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Four access levels, so everyone sees what they should.
          </h2>
        </div>
        <dl data-stagger className="mt-10 grid border-t border-ink md:grid-cols-2 md:gap-x-12">
          {levels.map(([t, d]) => (
            <div key={t} className="border-b border-line py-5">
              <dt className="font-display text-xl font-bold">{t}</dt>
              <dd className="mt-1 text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand />
    </>
  );
}
