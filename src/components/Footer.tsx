import Link from "next/link";
import { guides } from "@/lib/guides";
import { DISCLAIMER } from "@/lib/legal";

const items = [
  ["Solutions", "/solutions"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Resources", "/resources"],
  ["Guides", "/guides"],
  ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="mt-28 overflow-hidden bg-ink text-bg">
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <p className="max-w-sm font-display text-2xl font-semibold leading-snug">
            Find the gap while there is still time to fix it.
          </p>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {items.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-bg/75 transition-colors hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Compliance guides" className="mt-12 border-t border-bg/15 pt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bg/60">Compliance guides</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-bg/75 transition-colors hover:text-accent">
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 max-w-3xl border-t border-bg/15 pt-8 text-sm leading-relaxed text-bg/60">{DISCLAIMER}</p>
        <p
          aria-hidden="true"
          className="mt-14 select-none font-display text-[clamp(3rem,15vw,13rem)] font-bold leading-[0.8] tracking-tighter text-bg/10"
        >
          BROKERSHUB
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 border-t border-bg/15 py-5 text-center font-mono text-xs uppercase tracking-widest text-bg/60 sm:flex-row sm:gap-6">
        <span>© 2026 BROKERSHUB.</span>
        <Link href="/terms" className="transition-colors hover:text-accent">
          Terms
        </Link>
        <Link href="/privacy" className="transition-colors hover:text-accent">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
