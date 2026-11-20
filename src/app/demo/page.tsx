import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icons";
import { PageHeader } from "@/components/Sections";
import { ContactForm } from "@/components/ContactForm";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Book a Demo",
  description: "Book a 30-minute BROKERSHUB demo. See loan file checklists, supervision, complaints, breaches and audit packs on your own workflow.",
  path: "/demo",
});

export default function Demo() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Book a demo", path: "/demo" }])} />
      <PageHeader
        eyebrow="Book a demo"
        title={
          <>
            See BROKERSHUB on <span className="tape">your</span> files.
          </>
        }
      >
        Tell us about your licence and team and we&apos;ll walk you through files, supervision and the audit pack.
      </PageHeader>
      <section className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <ul data-reveal className="space-y-4 self-start">
          {[
            "A 30-minute walkthrough tailored to your licence",
            "Your checklists and supervision policy, not a generic tour",
            "Answers on access levels, representatives and audit exports",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 text-ink">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-ink" /> {t}
            </li>
          ))}
        </ul>
        <ContactForm defaultTopic="Book a demo" messageLabel="Tell us about your team" />
      </section>
    </>
  );
}
