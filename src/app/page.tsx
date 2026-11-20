import { AuditTrailMock, FileBoardMock } from "@/components/Mocks";
import { CtaBand, Eyebrow } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { FaqList } from "@/components/Faq";
import { Magnetic } from "@/components/Magnetic";
import { DEMO_HREF, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const cta =
  "inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-colors duration-200";

const who = [
  "Independent credit licensees",
  "Boutique licensee groups",
  "Brokerage principals",
  "Mortgage brokers",
  "Credit representatives",
];

const pains: [string, string][] = [
  [
    "The credit guide went out after the conversation started.",
    "Every file records what was issued, to whom and when, and flags a file where assistance began first.",
  ],
  [
    "Best interests duty lives in the broker's head, not on the file.",
    "Lender comparisons and the reasons for the recommendation are captured as you work, not rebuilt later.",
  ],
  [
    "Expense verification is promised and never chased.",
    "Missing verification is flagged against the file and the broker until the statements are in.",
  ],
  [
    "Supervising your reps means catch-ups nobody wrote down.",
    "Contact cadence by risk rating, file reviews, findings and training are logged, so oversight is something you can show.",
  ],
  [
    "A complaint arrives and nobody knows the clock has started.",
    "Complaints are logged with their deadlines and every step toward a response and, if needed, AFCA.",
  ],
  [
    "An aggregator file review means a week of digging through email.",
    "Everything is logged with who did it and when. The audit pack is an export.",
  ],
];

const stages: { tag: string; title: string; body: string; items: string[]; live?: boolean }[] = [
  {
    tag: "Starting here",
    title: "Compliance",
    live: true,
    body: "The records a review will ask for, kept as the work happens.",
    items: [
      "Best interests duty and file checklists",
      "Supervision of every representative",
      "File reviews, findings and remediation",
      "Complaints and breach registers with clocks",
      "CPD, training, accreditation and licence dates",
      "Audit pack across every register",
    ],
  },
  {
    tag: "Next",
    title: "Pipeline",
    body: "The same files, now running the day: where each loan sits and what it is waiting on.",
    items: [
      "Loan pipeline by stage",
      "Tasks and chasers per file",
      "Settlement and trail tracking",
      "Referrer and client updates",
    ],
  },
  {
    tag: "Later",
    title: "Brokerage operations",
    body: "One place to run the brokerage once the files and the people are already in it.",
    items: [
      "Team workloads and onboarding",
      "Lender and aggregator contacts",
      "Reporting for owners",
      "Integrations with your CRM",
    ],
  },
];

const faqs: [string, string][] = [
  [
    "Does BROKERSHUB make us compliant?",
    "No software can. BROKERSHUB helps you do the diligence and keep the evidence. Your credit licensee, or aggregator where you are a credit representative, remains responsible for sign-off.",
  ],
  [
    "Who is it for?",
    "Australian credit licensees first: independent licence holders and boutique groups that have to supervise their credit representatives. Individual brokers and brokerages with their own team use it too.",
  ],
  [
    "Is it available now?",
    "We are building with a small group of early-access brokerages. Book a demo and we will show you where the product is and what is next.",
  ],
  [
    "Will it replace our CRM?",
    "No, and it is not trying to. It is compliance only for now. It sits alongside your CRM and aggregator tools and keeps the record your licence depends on, especially supervision of your representatives. Pipeline and operations features come later.",
  ],
  [
    "Where is our data kept?",
    "Client and file data is hosted in Australia and access is logged. We will publish the full security and privacy detail before anyone is onboarded.",
  ],
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            applicationCategory: "BusinessApplication",
            areaServed: { "@type": "Country", name: "Australia" },
          }),
        }}
      />

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div data-load>
              <Eyebrow>Compliance for mortgage and finance brokers</Eyebrow>
            </div>
            <h1
              data-load
              className="mt-6 font-display text-[clamp(2.7rem,6.4vw,5.5rem)] font-extrabold leading-[0.98] tracking-tight"
            >
              Every loan file <span className="tape">defensible</span> before
              anyone asks.
            </h1>
            <p data-load className="mt-7 max-w-lg text-lg text-ink-soft">
              BROKERSHUB keeps credit guides, best interests duty, verification,
              complaints and CPD in one place, with a flag on whatever is still
              owed. Built for brokers, then for the brokerage.
            </p>
            <div data-load className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a href={DEMO_HREF} className={`${cta} bg-ink text-bg hover:bg-ink/85`}>
                  Book a demo <Icon name="arrow" className="h-4 w-4" />
                </a>
              </Magnetic>
              <a
                href="#platform"
                className={`${cta} border border-ink/30 hover:border-ink hover:bg-tint`}
              >
                See what it covers
              </a>
            </div>
          </div>
          <div data-load>
            <div data-parallax="6">
              <div className="float">
                <FileBoardMock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* scope strip */}
      <div className="relative overflow-hidden bg-[linear-gradient(110deg,oklch(0.18_0.04_230),oklch(0.3_0.05_215)_55%,oklch(0.19_0.04_230))] py-5 font-mono text-xs uppercase tracking-[0.18em] text-bg shadow-[inset_0_1px_0_oklch(1_0_0/0.18),inset_0_-1px_0_oklch(0_0_0/0.4)]">
        <div
          aria-hidden="true"
          className="glow-x pointer-events-none absolute h-24 w-72 rounded-full bg-accent/70 blur-3xl"
        />
        <ul className="marquee flex w-max gap-10 whitespace-nowrap" aria-label="What BROKERSHUB covers">
          {[0, 1, 2, 3].flatMap((k) =>
            [
              "Credit guide",
              "Best interests duty",
              "Responsible lending",
              "Verification",
              "Complaints",
              "CPD",
              "Accreditation",
              "Audit pack",
            ].map((t) => (
              <li key={`${k}-${t}`} className="flex items-center gap-10" aria-hidden={k > 0}>
                {t}
                <span className="text-accent">/</span>
              </li>
            )),
          )}
        </ul>
      </div>

      {/* problem */}
      <section id="problem" className="mx-auto mt-28 grid max-w-6xl scroll-mt-24 gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div data-reveal>
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight">
            The proof lives in inboxes, spreadsheets and memory.
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Gaps are found when a lender, an aggregator or a complaint asks for
            the file. By then you are reconstructing what happened from emails.
          </p>
          <p className="mt-6 max-w-md font-mono text-xs uppercase leading-relaxed tracking-wider text-ink-soft">
            You have to show what you did, not just say it.
          </p>
        </div>
        <div data-reveal className="relative min-h-72 sm:min-h-80">
          {[
            ["Outlook, 'Re: Re: Fwd: bank statements'", "which version did the lender get?", "left-0 top-2 -rotate-3"],
            ["compliance_tracker_FINAL2.xlsx", "last updated four months ago", "right-0 top-24 rotate-2"],
            ["Notes app", "'told client about fees, I think'", "left-6 bottom-0 -rotate-1"],
          ].map(([t, s, pos]) => (
            <div key={t} className={`absolute w-64 max-w-[80%] border border-line bg-surface p-4 shadow-md ${pos}`}>
              <p className="font-mono text-xs uppercase tracking-wider">{t}</p>
              <p className="mt-1 text-sm text-ink-soft">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* who + pains */}
      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div
          data-reveal
          className="flex flex-col gap-4 border-y border-line py-6 lg:flex-row lg:items-center lg:gap-10"
        >
          <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Built for
          </p>
          <ul className="flex flex-wrap gap-2">
            {who.map((c) => (
              <li key={c} className="rounded-full bg-tint px-4 py-2 text-sm font-semibold">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Where it goes wrong</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.02] tracking-tight">
              Six places broker files lose their evidence.
            </h2>
            <p className="mt-5 max-w-sm text-ink-soft">
              Each one has a fix that does not depend on someone remembering.
            </p>
          </div>
          <ol data-stagger className="border-t border-ink">
            {pains.map(([pain, fix], i) => (
              <li
                key={pain}
                className="row-hover grid gap-3 border-b border-line py-6 md:grid-cols-[2.5rem_1fr_1fr] md:gap-6"
              >
                <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
                <p className="font-display text-xl font-extrabold leading-snug">{pain}</p>
                <p className="text-ink-soft">
                  <span className="mb-1 block font-mono text-[0.7rem] uppercase tracking-widest text-ink">
                    With BROKERSHUB
                  </span>
                  {fix}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* platform: compliance first, operations later */}
      <section id="platform" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>The platform</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight">
            Starts with compliance. Grows into how the brokerage runs.
          </h2>
          <p className="mt-6 max-w-xl text-ink-soft">
            The files and the people go in once for compliance. Later stages
            reuse them instead of asking brokers to enter everything again.
          </p>
        </div>
        <ol data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {stages.map((s) => (
            <li
              key={s.title}
              className={`flex flex-col rounded-3xl border p-7 ${s.live ? "border-ink bg-tint" : "border-line bg-surface"}`}
            >
              <span
                className={`self-start rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest ${s.live ? "bg-accent text-ink" : "bg-tint text-ink-soft"}`}
              >
                {s.tag}
              </span>
              <h3 className="mt-5 font-display text-3xl font-extrabold">{s.title}</h3>
              <p className="mt-3 text-ink-soft">{s.body}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* audit */}
      <section id="audit" className="mt-28 scroll-mt-16 bg-ink py-24 text-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Audit ready</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight">
              The reviewer asks. The file already answers.
            </h2>
            <p className="mt-6 max-w-md text-bg/75">
              Every step on a loan file is time-stamped and kept with who did
              it. Records are never hard-deleted, so the proof for an aggregator
              review, a lender audit or a complaint is an export, not a week of
              searching.
            </p>
          </div>
          <div data-reveal>
            <AuditTrailMock />
          </div>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="mx-auto mt-28 max-w-3xl scroll-mt-24 px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight">
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
