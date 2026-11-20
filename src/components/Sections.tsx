import type { ReactNode } from "react";
import { Icon } from "./Icons";
import { Magnetic } from "./Magnetic";
import { DEMO_HREF } from "@/lib/site";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
      <div data-load>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h1
        data-load
        className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,5.6vw,4.8rem)] font-extrabold leading-[1] tracking-tight"
      >
        {title}
      </h1>
      <p data-load className="mt-7 max-w-xl text-lg text-ink-soft">
        {children}
      </p>
    </section>
  );
}

export function CtaBand() {
  return (
    <section id="demo" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-5 sm:px-8">
      <div
        data-reveal
        className="relative overflow-hidden rounded-[2rem] bg-accent px-7 py-16 text-ink sm:px-14 sm:py-20"
      >
        <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1] tracking-tight">
          Find the gaps before the aggregator does.
        </h2>
        <p className="mt-5 max-w-lg text-lg">
          Thirty minutes with one of your real loan files. We will show you what
          would hold up in a review and what would not.
        </p>
        <div className="mt-9">
          <Magnetic>
            <a
              href={DEMO_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-bg transition-colors duration-200 hover:bg-ink/85"
            >
              Book a demo <Icon name="arrow" className="h-4 w-4" />
            </a>
          </Magnetic>
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-widest">
          Early access for Australian brokerages
        </p>
      </div>
    </section>
  );
}
