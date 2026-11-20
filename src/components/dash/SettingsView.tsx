"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Icon, type IconName } from "../Icons";
import { Avatar, Card, CardHead, PageHeading, Pill } from "./ui";
import { useDemo } from "./DemoProvider";
import { USER, initialsOf, type Access, type NotifyKey, type Risk } from "@/lib/demo-data";

const noSubscribe = () => () => {};

const SECTIONS: { id: string; label: string; icon: IconName; blurb: string }[] = [
  { id: "policy", label: "Supervision policy", icon: "eye", blurb: "How often you contact each representative and how many files you review." },
  { id: "licence", label: "Licence", icon: "building", blurb: "Your licensee and contact details." },
  { id: "team", label: "Team", icon: "users", blurb: "Who has access, and at what level." },
  { id: "notifications", label: "Notifications", icon: "bell", blurb: "Which reminders appear under the bell." },
  { id: "account", label: "Account", icon: "user", blurb: "Your profile and leaving the demo." },
];

export function SettingsView() {
  const [picked, setTab] = useState<string | null>(null);
  // Links such as the bell's can open a tab directly: /dashboard/settings?tab=notifications
  const asked = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("tab") ?? "",
    () => "",
  );
  const tab = picked ?? (SECTIONS.some((s) => s.id === asked) ? asked : "policy");
  const current = SECTIONS.find((s) => s.id === tab) ?? SECTIONS[0];

  return (
    <>
      <PageHeading title="Settings" sub="Set your policy, people and reminders. Changes apply across the dashboard straight away." />

      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div
          role="tablist"
          aria-label="Settings sections"
          aria-orientation="vertical"
          className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              id={`tab-${s.id}`}
              aria-selected={tab === s.id}
              aria-controls={`panel-${s.id}`}
              onClick={() => setTab(s.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                tab === s.id ? "bg-accent/15 text-ink" : "text-ink-soft hover:bg-tint hover:text-ink"
              }`}
            >
              <Icon name={s.icon} className="h-[18px] w-[18px]" />
              {s.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} className="min-w-0">
          <p className="mb-4 text-sm text-ink-soft">{current.blurb}</p>
          {tab === "policy" && <PolicySection />}
          {tab === "licence" && <LicenceSection />}
          {tab === "team" && <TeamSection />}
          {tab === "notifications" && <NotificationsSection />}
          {tab === "account" && <AccountSection />}
        </div>
      </div>
    </>
  );
}

const field =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold placeholder:font-normal";

function PolicySection() {
  const { policy, setCadence, setReviewsRequired } = useDemo();
  const risks: Risk[] = ["High", "Medium", "Low"];
  return (
    <Card>
      <CardHead title="By risk rating" sub="Representatives are rated in Representatives. These examples are yours to change to match your licensee policy." />
      <div className="divide-y divide-line">
        {risks.map((r) => (
          <div key={r} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="w-28">
              <Pill tone={r === "High" ? "owed" : "neutral"}>{r} risk</Pill>
            </span>
            <label className="flex items-center gap-2 text-sm">
              Contact every
              <input
                type="number"
                min={1}
                value={policy.cadence[r]}
                onChange={(e) => setCadence(r, Number(e.target.value))}
                className="w-20 rounded-xl border border-line bg-surface px-3 py-2 text-center text-sm font-semibold"
              />
              days
            </label>
            <label className="flex items-center gap-2 text-sm">
              File reviews each quarter
              <input
                type="number"
                min={1}
                value={policy.reviews[r]}
                onChange={(e) => setReviewsRequired(r, Number(e.target.value))}
                className="w-20 rounded-xl border border-line bg-surface px-3 py-2 text-center text-sm font-semibold"
              />
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LicenceSection() {
  const { profile, setProfile } = useDemo();
  const rows: [string, keyof typeof profile, string][] = [
    ["Business name", "workspace", "text"],
    ["Australian credit licence number", "acl", "text"],
    ["Contact email", "email", "email"],
    ["Phone", "phone", "tel"],
  ];
  return (
    <Card>
      <CardHead title="Licensee details" sub="Shown in the sidebar and at the top of every audit pack" />
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {rows.map(([label, key, type]) => (
          <label key={key} className="block">
            <span className="text-xs font-medium text-ink-soft">{label}</span>
            <input
              type={type}
              value={profile[key]}
              onChange={(e) => setProfile({ [key]: e.target.value })}
              className={`${field} mt-1.5`}
            />
          </label>
        ))}
      </div>
    </Card>
  );
}

const LEVELS: Access[] = ["Owner", "Supervisor", "Representative", "Read-only"];

function TeamSection() {
  const { reps, access, setAccess } = useDemo();
  return (
    <Card>
      <CardHead title="People" sub="Representatives see their own files. Supervisors see everyone's. Read-only suits auditors." />
      <ul>
        {reps.map((r) => (
          <li key={r.name} className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5 last:border-0">
            <Avatar initials={initialsOf(r.name)} tone={1} />
            <span className="min-w-0 flex-1 basis-40">
              <span className="block truncate text-sm font-semibold">{r.name}</span>
              <span className="block truncate text-xs text-ink-soft">{r.kind}</span>
            </span>
            <select
              aria-label={`Access level for ${r.name}`}
              value={access[r.name]}
              onChange={(e) => setAccess(r.name, e.target.value as Access)}
              className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-semibold"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Switch({ on, onChange, label, note }: { on: boolean; onChange: (v: boolean) => void; label: string; note: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{note}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function NotificationsSection() {
  const { notify, setNotify } = useDemo();
  const rows: [NotifyKey, string, string][] = [
    ["breaches", "Breaches and the ASIC clock", "Possible and reportable breaches with a deadline."],
    ["files", "Overdue loan file steps", "Files with a required step past due."],
    ["supervision", "Supervision overdue", "Representatives past their contact cadence."],
    ["complaints", "Complaint deadlines", "Open complaints and their response dates."],
    ["licence", "Licence and insurance dates", "AFCA, insurance and policy reviews coming due."],
  ];
  return (
    <Card>
      <CardHead title="Reminders" sub="Shown under the bell. The dashboard always shows everything." />
      <div className="divide-y divide-line">
        {rows.map(([k, label, note]) => (
          <Switch key={k} label={label} note={note} on={notify[k]} onChange={(v) => setNotify(k, v)} />
        ))}
      </div>
    </Card>
  );
}

function AccountSection() {
  return (
    <Card>
      <CardHead title="Your profile" />
      <div className="flex flex-wrap items-center gap-4 p-5">
        <Avatar initials={initialsOf(USER.name)} tone={0} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{USER.name}</p>
          <p className="text-xs text-ink-soft">{USER.role}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-tint"
        >
          <Icon name="logout" className="h-4 w-4" /> Exit demo
        </Link>
      </div>
      <p className="border-t border-line px-5 py-4 text-xs text-ink-soft">
        This is a demo with sample data. Nothing you change here is saved after you reload the page.
      </p>
    </Card>
  );
}
