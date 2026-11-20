"use client";

import { useState } from "react";
import { Icon, type IconName } from "./Icons";
import { DEMO_HREF } from "@/lib/site";

type Plan = {
  name: string;
  icon: IconName;
  blurb: string;
  price: string;
  badge?: string;
  top: string[];
  lead: string;
  features: string[];
};

/** Placeholder pricing. Confirm figures and limits before launch. */
const plans: Plan[] = [
  {
    name: "Solo",
    icon: "user",
    blurb: "For a single broker or credit representative.",
    price: "A$59",
    top: ["1 broker, never charged per file", "5 GB document storage"],
    lead: "What's included:",
    features: [
      "Credit guide and disclosure tracking",
      "Best interests duty file notes",
      "Verification flags on every file",
      "CPD and accreditation alerts",
      "Complaints register",
    ],
  },
  {
    name: "Brokerage",
    icon: "store",
    blurb: "For a brokerage with a few brokers and support staff.",
    price: "A$149",
    badge: "Popular",
    top: ["Up to 10 people, never charged per seat", "50 GB document storage"],
    lead: "Everything in Solo, for the whole brokerage:",
    features: [
      "Each broker sees their own files, the principal sees all",
      "Supervision and file review queue",
      "One-click audit pack export",
      "Aggregator and lender accreditation tracking",
      "Priority support",
    ],
  },
  {
    name: "Group",
    icon: "building",
    blurb: "For larger or multi-office brokerages and licensees.",
    price: "A$299",
    top: ["Up to 30 people, never charged per seat", "200 GB document storage"],
    lead: "Everything in Brokerage:",
    features: [
      "Compliance reporting across offices",
      "Registers rolled up across the group",
      "Onboarding help for your existing files",
    ],
  },
];

const DEFAULT = "Brokerage";

export function PricingGrid() {
  const [active, setActive] = useState(DEFAULT);

  return (
    <div
      data-stagger
      className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 px-5 sm:px-8 md:grid-cols-3"
      onMouseLeave={() => setActive(DEFAULT)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(DEFAULT);
      }}
    >
      {plans.map((p) => {
        const on = active === p.name;
        return (
          <article
            key={p.name}
            onMouseEnter={() => setActive(p.name)}
            onFocus={() => setActive(p.name)}
            className={`flex flex-col rounded-[2rem] border p-8 transition-all duration-300 ease-out ${
              on
                ? "z-10 border-ink bg-ink text-bg shadow-[0_30px_70px_-30px_oklch(0.22_0.04_230/0.6)] md:-translate-y-2 md:scale-[1.04]"
                : "border-line bg-surface"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={on ? "text-accent" : "text-ink"}>
                <Icon name={p.icon} className="h-9 w-9" />
              </span>
              {p.badge && (
                <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] font-medium uppercase tracking-widest text-ink">
                  {p.badge}
                </span>
              )}
            </div>

            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
              {p.name}
            </h2>
            <p className={`mt-2 min-h-12 text-sm ${on ? "text-bg/75" : "text-ink-soft"}`}>
              {p.blurb}
            </p>

            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold tracking-tight">
                {p.price}
              </span>
              <span className={`text-sm ${on ? "text-bg/75" : "text-ink-soft"}`}>
                a month + GST
              </span>
            </p>

            <a
              href={DEMO_HREF}
              className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors duration-200 ${
                on ? "bg-accent text-ink hover:bg-accent/85" : "bg-ink text-bg hover:bg-ink/85"
              }`}
            >
              Book a demo <Icon name="arrow" className="h-4 w-4" />
            </a>

            <ul className={`mt-6 space-y-2 border-t pt-6 text-sm font-semibold ${on ? "border-bg/20" : "border-line"}`}>
              {p.top.map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>

            <p className={`mt-6 text-sm font-semibold ${on ? "text-bg" : "text-ink"}`}>{p.lead}</p>
            <ul className={`mt-3 space-y-2 text-sm ${on ? "text-bg/80" : "text-ink-soft"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
