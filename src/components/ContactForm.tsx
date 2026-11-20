"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { CONTACT_EMAIL } from "@/lib/site";

const field = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-3 text-ink focus:border-ink";

const TOPICS = ["Book a demo", "A question before signing up", "Help with my account", "Partnerships or media", "Something else"];

/** The contact and demo forms. They email the team; until email is connected they open your mail app instead. */
export function ContactForm({ defaultTopic = TOPICS[1], messageLabel = "Message" }: { defaultTopic?: string; messageLabel?: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div role="status" className="rounded-3xl border border-line bg-surface p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-ink">Message sent</h2>
        <p className="mt-2 text-sm text-ink-soft">Thanks for getting in touch. We&apos;ll reply to the email you gave us.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const reply = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
          if (reply.code === "not_configured") {
            // no mail service connected: hand the message to the person's own mail app
            const body = `${data.message}\n\n${data.name}${data.business ? `, ${data.business}` : ""}${data.phone ? `, ${data.phone}` : ""}\n${data.email}`;
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.topic)}&body=${encodeURIComponent(body)}`;
            setSent(true);
            return;
          }
          if (!res.ok) throw new Error(reply.error ?? "That didn't send.");
          setSent(true);
        } catch (err) {
          setError(
            err instanceof Error && err.message !== "Failed to fetch"
              ? err.message
              : `Couldn't reach us. Check your connection, or email ${CONTACT_EMAIL}.`,
          );
        } finally {
          setBusy(false);
        }
      }}
      className="relative rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Business <span className="font-normal text-ink-soft">(optional)</span>
          <input name="business" autoComplete="organization" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Phone <span className="font-normal text-ink-soft">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          What&apos;s it about?
          <select name="topic" defaultValue={defaultTopic} className={field}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          {messageLabel}
          <textarea name="message" rows={6} required minLength={10} className={field} />
        </label>
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-semibold">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-bg transition-colors hover:bg-ink/85 disabled:opacity-60"
      >
        {busy ? "Sending" : "Send message"} <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
