import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Sections";
import { LEGAL_UPDATED, type LegalSection } from "@/lib/legal";
import { breadcrumbs } from "@/lib/schema";

/** A legal document (Terms of Service, Privacy Policy) laid out for reading. */
export function LegalPage({
  title,
  path,
  intro,
  sections,
}: {
  title: string;
  path: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />
      <PageHeader eyebrow={`Last updated ${LEGAL_UPDATED}`} title={title}>
        {intro}
      </PageHeader>
      <article className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <div className="max-w-3xl">
          {sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">{s.h}</h2>
              {s.p?.map((t) => (
                <p key={t} className="mt-3 leading-relaxed text-ink-soft">
                  {t}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
