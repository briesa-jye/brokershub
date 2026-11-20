import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHeader } from "@/components/Sections";
import { guides } from "@/lib/guides";
import { breadcrumbs } from "@/lib/schema";
import { abs, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Compliance Guides for Mortgage Brokers and Credit Licensees",
  description:
    "Plain-language guides for credit licensees and brokers: best interests duty, supervising credit representatives, reportable situations, complaints, CPD and audit packs.",
  path: "/guides",
});

export default function GuidesHub() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Compliance guides for mortgage brokers and credit licensees",
            url: abs("/guides"),
            hasPart: guides.map((g) => ({ "@type": "Article", headline: g.h1, url: abs(`/guides/${g.slug}`) })),
          },
        ]}
      />
      <PageHeader
        eyebrow="Guides"
        title={
          <>
            Compliance guides for <span className="tape">brokers</span> and licensees.
          </>
        }
      >
        Checklists and explainers for credit licensees, compliance managers and brokers. General information, not legal advice.
      </PageHeader>
      <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <ul data-stagger className="grid gap-x-10 border-t border-ink md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug} className="border-b border-line">
              <Link href={`/guides/${g.slug}`} className="row-hover block py-6">
                <span className="eyebrow">{g.category}</span>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight">{g.h1}</h2>
                <p className="mt-2 text-sm text-ink-soft">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
