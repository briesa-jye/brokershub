import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/Faq";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About BROKERSHUB, Compliance for Brokers and Licensees",
  description:
    "BROKERSHUB is compliance software for Australian credit licensees and brokers: best interests duty files, supervision of representatives, complaints, breaches and an audit pack.",
  path: "/about",
});

const principles = [
  ["The record is the proof", "Entries are never hard-deleted, every change carries who and when, and history is not editable. If it happened, the file says so."],
  ["Licensee first", "The person holding the credit licence answers for everyone under it. The product starts there, then works down to the individual broker."],
  ["Compliance, then the rest", "We do the compliance record properly before anything else. Pipeline and operations come later, built on the same files and people."],
  ["Priced so hiring is free", "Per brokerage, never per file or per head. Adding a representative should not be a budget conversation."],
];

const faqs: [string, string][] = [
  ["Does BROKERSHUB make us compliant?", "No software can. BROKERSHUB helps you do the diligence and keep the evidence. Your credit licensee, or aggregator where you are a credit representative, remains responsible for sign-off."],
  ["Who is it for?", "Australian credit licensees first: independent licence holders and boutique groups that have to supervise their credit representatives. Individual brokers and brokerages with their own team use it too."],
  ["Is it available now?", "We are building with a small group of early-access brokerages. Book a demo and we will show you where the product is and what is next."],
  ["Will it replace our CRM?", "No, and it is not trying to. It is compliance only for now. It sits alongside your CRM and aggregator tools and keeps the record your licence depends on, especially supervision of your representatives."],
  ["Where is our data kept?", "We will host client and file data in Australia with access logged. The full security and privacy detail will be published before anyone is onboarded."],
];

export default function About() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHeader
        eyebrow="About BROKERSHUB"
        title={
          <>
            Compliance should not slow down a <span className="tape">settlement</span>.
          </>
        }
      >
        Brokers spend hours rebuilding evidence that software should be keeping. BROKERSHUB exists to make the right thing
        the easy thing, for the licensee and everyone under the licence.
      </PageHeader>

      <section className="mx-auto mt-20 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Why we built it</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">Supervision is the gap.</h2>
        </div>
        <div data-reveal className="space-y-5 text-lg text-ink-soft">
          <p>
            Most broker tools bring a checklist for each loan. That helps the broker. It does not help the licensee, who has
            to show that they monitor and supervise their representatives: regular contact, file reviews, training and what
            they did about what they found.
          </p>
          <p>
            Aggregator tools mostly serve their own members. An independent licence holder or a boutique licensee group is
            usually on their own, with a spreadsheet and good intentions.
          </p>
          <p>
            BROKERSHUB puts supervision, complaints, breaches and licence dates on the same record as the loan file, so the
            audit pack is an export instead of a project.
          </p>
        </div>
      </section>

      <section className="mt-24 bg-ink py-20 text-bg">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div data-reveal>
            <Eyebrow>What we hold to</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
              Four principles behind the product.
            </h2>
          </div>
          <dl data-stagger className="mt-10 grid border-t border-bg/20 md:grid-cols-2 md:gap-x-12">
            {principles.map(([t, d]) => (
              <div key={t} className="border-b border-bg/20 py-6">
                <dt className="font-display text-2xl font-bold">{t}</dt>
                <dd className="mt-2 text-bg/70">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-3xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Common questions.
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
