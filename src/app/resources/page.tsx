import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { guides } from "@/lib/guides";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Compliance Resources for Brokers and Licensees",
  description:
    "Guides for credit licensees and brokers: best interests duty files, supervising credit representatives, reportable situations, complaints, CPD and audit packs. Plain language, not legal advice.",
  path: "/resources",
});

export default function Resources() {
  const [feature, ...rest] = guides;
  const supervision = guides.find((g) => g.slug === "supervising-credit-representatives") ?? feature;
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }])} />
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Guides for people who keep the <span className="tape">files</span>.
          </>
        }
      >
        Plain-language material on what a credit licensee and its brokers answer for. None of it is legal advice.
      </PageHeader>

      <section className="mx-auto mt-16 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <article data-reveal className="flex flex-col justify-between rounded-3xl bg-ink p-8 text-bg sm:p-10 lg:min-h-96">
          <Eyebrow>Start here</Eyebrow>
          <div className="mt-16">
            <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-tight">{supervision.h1}</h2>
            <p className="mt-4 max-w-sm text-bg/75">The gap most broker software leaves open, and the records that close it.</p>
            <Link
              href={`/guides/${supervision.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-ink"
            >
              Read the guide <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </article>

        <ul data-stagger className="border-t border-ink">
          {[feature, ...rest].filter((g) => g.slug !== supervision.slug).map((g) => (
            <li key={g.slug} className="border-b border-line">
              <Link href={`/guides/${g.slug}`} className="row-hover block py-6">
                <span className="eyebrow">{g.category}</span>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{g.h1}</h3>
                <p className="mt-1 max-w-md text-sm text-ink-soft">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
