"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "../Logo";
import { Icon, type IconName } from "../Icons";
import { Avatar, Pill } from "./ui";
import { useDemo } from "./DemoProvider";
import { USER, WORKSPACE, fileStatus, initialsOf } from "@/lib/demo-data";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/dashboard/files", label: "Loan files", icon: "file" },
  { href: "/dashboard/supervision", label: "Supervision", icon: "eye" },
  { href: "/dashboard/representatives", label: "Representatives", icon: "users" },
  { href: "/dashboard/complaints", label: "Complaints", icon: "flag" },
  { href: "/dashboard/breaches", label: "Breaches", icon: "alert" },
  { href: "/dashboard/audit", label: "Audit pack", icon: "shield" },
];

export function DashShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { files } = useDemo();
  const flagged = files.filter((f) => fileStatus(f) === "flag").length;
  const current = NAV.find((n) =>
    n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href),
  );
  const who = { name: USER.name, initials: initialsOf(USER.name), role: USER.role };

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/dashboard"
        className="flex h-16 shrink-0 items-center px-5"
        onClick={() => setOpen(false)}
        aria-label="BROKERSHUB dashboard"
      >
        <Logo className="h-6" />
      </Link>

      <div className="mx-3 shrink-0 rounded-xl border border-line bg-surface px-3 py-2.5">
        <p className="truncate text-sm font-bold">{WORKSPACE}</p>
        <p className="text-xs text-ink-soft">Brokerage plan</p>
      </div>

      <GlobalSearch
        tone="tint"
        onNavigate={() => setOpen(false)}
        className="mx-3 mt-3 shrink-0 sm:hidden"
      />

      <nav
        aria-label="App"
        data-lenis-prevent
        className="mt-5 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3"
      >
        {NAV.map((n) => {
          const active = n === current;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-accent/15 text-ink" : "text-ink-soft hover:bg-tint hover:text-ink"
              }`}
            >
              <Icon name={n.icon} className="h-[18px] w-[18px]" />
              {n.label}
              {n.href === "/dashboard/files" && flagged > 0 && (
                <span className="ml-auto rounded-full bg-ink px-2 py-0.5 font-mono text-[0.65rem] text-bg">
                  {flagged}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 shrink-0 rounded-xl border border-line bg-surface p-3">
        <div className="flex items-center gap-3">
          <Avatar initials={who.initials} tone={0} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{who.name}</p>
            <p className="truncate text-xs text-ink-soft">{who.role}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-soft hover:text-ink"
        >
          <Icon name="logout" className="h-3.5 w-3.5" /> Exit demo
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-bg lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-bg shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <p className="font-display text-base font-extrabold tracking-tight lg:hidden">
            {current?.label ?? "Dashboard"}
          </p>
          <GlobalSearch className="ml-auto hidden max-w-md flex-1 sm:block lg:ml-0" />
          <span className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex">
              <Pill tone="neutral">Demo · sample data</Pill>
            </span>
            <Avatar initials={who.initials} tone={0} />
          </span>
        </header>

        <div className="app-content mx-auto max-w-6xl p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

/** Searches loan files and complaints. Picking a result opens it. */
function GlobalSearch({
  className = "",
  tone = "bg",
  onNavigate,
}: {
  className?: string;
  tone?: "bg" | "tint";
  onNavigate?: () => void;
}) {
  const { files, complaints, selectFile } = useDemo();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const term = q.trim().toLowerCase();

  const hits = term
    ? [
        ...files
          .filter((f) => `${f.client} ${f.purpose} ${f.broker} ${f.id}`.toLowerCase().includes(term))
          .map((f) => ({
            key: f.id,
            label: `${f.client}, ${f.purpose.toLowerCase()}`,
            sub: `Loan file · ${f.id}`,
            go: () => {
              selectFile(f.id);
              router.push("/dashboard/files");
            },
          })),
        ...complaints
          .filter((c) => `${c.client} ${c.summary} ${c.id}`.toLowerCase().includes(term))
          .map((c) => ({
            key: c.id,
            label: `Complaint ${c.id}, ${c.client}`,
            sub: c.summary,
            go: () => router.push("/dashboard/complaints"),
          })),
      ].slice(0, 6)
    : [];

  return (
    <div className={`relative ${className}`}>
      <label
        className={`flex items-center gap-2 rounded-full border border-line px-4 py-2 ${tone === "tint" ? "bg-tint" : "bg-bg"}`}
      >
        <Icon name="search" className="h-4 w-4 shrink-0 text-ink-soft" />
        <span className="sr-only">Search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="Search files and complaints"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft"
        />
      </label>
      {focus && term && (
        <ul className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
          {hits.length === 0 && <li className="px-4 py-3 text-sm text-ink-soft">No matches.</li>}
          {hits.map((h) => (
            <li key={h.key} className="border-b border-line last:border-0">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  h.go();
                  setQ("");
                  onNavigate?.();
                }}
                className="row-hover block w-full px-4 py-2.5 text-left"
              >
                <span className="block truncate text-sm font-semibold">{h.label}</span>
                <span className="block truncate text-xs text-ink-soft">{h.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
