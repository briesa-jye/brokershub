"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "../Logo";
import { Icon, type IconName } from "../Icons";
import { USER, WORKSPACE } from "@/lib/demo-data";
import { useDemo } from "./DemoProvider";
import { fileStatus } from "@/lib/demo-data";

const nav: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/files", label: "Loan files", icon: "file" },
  { href: "/dashboard/complaints", label: "Complaints", icon: "flag" },
  { href: "/dashboard/team", label: "Team and CPD", icon: "users" },
  { href: "/dashboard/audit", label: "Audit pack", icon: "download" },
];

export function DashShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { files } = useDemo();
  const flagged = files.filter((f) => fileStatus(f) === "flag").length;

  return (
    <div className="flex min-h-screen flex-col bg-tint/40 lg:flex-row">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <Link href="/" aria-label="BROKERSHUB home">
            <Logo className="h-6" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-ink lg:hidden">
            Exit demo
          </Link>
        </div>
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {nav.map((n) => {
            const active = n.href === "/dashboard" ? path === n.href : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-ink text-bg" : "hover:bg-tint"
                }`}
              >
                <Icon name={n.icon} className="h-5 w-5" />
                {n.label}
                {n.href === "/dashboard/files" && flagged > 0 && (
                  <span className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[0.65rem] ${active ? "bg-accent text-ink" : "bg-ink text-bg"}`}>
                    {flagged}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-line p-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="text-sm font-semibold">{USER.name}</p>
          <p className="text-xs text-ink-soft">{USER.role}</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
            Exit demo
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ink px-5 py-2.5 text-bg sm:px-8">
          <p className="font-mono text-xs uppercase tracking-widest">
            Demo workspace · sample data · changes reset on reload
          </p>
          <p className="text-sm text-bg/75">{WORKSPACE}</p>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {children && <p className="mt-2 max-w-2xl text-ink-soft">{children}</p>}
    </header>
  );
}

export function StatusPill({ status }: { status: "clear" | "open" | "flag" }) {
  const tone = {
    clear: "bg-accent text-ink",
    open: "bg-tint text-ink",
    flag: "bg-ink text-bg",
  }[status];
  const label = { clear: "Cleared", open: "In progress", flag: "Flagged" }[status];
  return (
    <span className={`inline-block shrink-0 rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider ${tone}`}>
      {label}
    </span>
  );
}
