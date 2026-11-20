import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icons";
import { PageHeader } from "@/components/Sections";
import { ContactForm } from "@/components/ContactForm";
import { breadcrumbs } from "@/lib/schema";
import { CONTACT_EMAIL, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact BROKERSHUB",
  description: "Questions about BROKERSHUB? Send us a message and we'll reply by email.",
  path: "/contact",
});

export default function Contact() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Talk to the <span className="tape">people</span> who built it.
          </>
        }
      >
        Questions before you sign up, help with the demo, or anything else. Send us a message and we&apos;ll reply by email.
      </PageHeader>
      <section className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div data-reveal className="space-y-8 self-start">
          <div>
            <h2 className="font-display text-xl font-bold">Email us</h2>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 inline-block text-lg underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Want to see it first?</h2>
            <p className="mt-1 text-ink-soft">
              <Link href="/demo" className="underline underline-offset-4">
                Book a demo
              </Link>{" "}
              and we&apos;ll walk you through it on your own files, or{" "}
              <Link href="/dashboard" className="underline underline-offset-4">
                try the demo dashboard
              </Link>{" "}
              yourself.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Reading first?</h2>
            <ul className="mt-2 space-y-2">
              {[
                ["/guides/supervising-credit-representatives", "Supervising credit representatives"],
                ["/guides/best-interests-duty-checklist-mortgage-brokers", "A best interests duty file checklist"],
                ["/guides/broker-audit-pack-guide", "Building an audit pack"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                    <Icon name="arrow" className="h-4 w-4" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
