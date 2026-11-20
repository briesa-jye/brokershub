import { esc, sendEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/site";

/** The contact and demo forms: emails the message to the BROKERSHUB inbox, with Reply going to the sender. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ["Book a demo", "A question before signing up", "Help with my account", "Partnerships or media", "Something else"];
const hits = new Map<string, number[]>();

const hostOf = (origin: string) => {
  try {
    return new URL(origin).host;
  } catch {
    return "";
  }
};

const fail = (status: number, error: string, code?: string) => Response.json({ error, code }, { status });

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && hostOf(origin) !== host) return fail(403, "Requests must come from this site.");

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= 5) return fail(429, "Too many messages. Try again later.");
  hits.set(ip, [...recent, now]);

  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {}
  const s = (k: string, max = 200) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");
  // Hidden field people never fill in.
  if (s("website")) return Response.json({ ok: true });

  const r = {
    name: s("name", 120),
    email: s("email"),
    business: s("business"),
    phone: s("phone", 40),
    topic: TOPICS.includes(s("topic")) ? s("topic") : "Something else",
    message: s("message", 5000),
  };
  if (!r.name) return fail(400, "Enter your name.");
  if (!EMAIL.test(r.email)) return fail(400, "Enter a valid email address.");
  if (r.message.length < 10) return fail(400, "Tell us a little more in your message.");

  const inbox = process.env.CONTACT_INBOX || CONTACT_EMAIL;
  const rows: [string, string][] = [
    ["Name", r.name],
    ["Email", r.email],
    ["Business", r.business || "Not given"],
    ["Phone", r.phone || "Not given"],
    ["Topic", r.topic],
  ];
  const result = await sendEmail({
    to: inbox,
    replyTo: r.email,
    subject: `${r.topic} (${r.name}${r.business ? `, ${r.business}` : ""})`,
    html: `<p><strong>New message from the BROKERSHUB website</strong></p><table style="border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
      .join("")}</table><p style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px">${esc(r.message)}</p>`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${r.message}`,
  });
  if (result === "not_configured")
    return fail(503, `Email is not switched on yet. Your mail app will open so you can send it to ${CONTACT_EMAIL}.`, "not_configured");
  if (result === "failed") return fail(502, `That didn't send. Try again in a minute, or email ${CONTACT_EMAIL}.`);
  return Response.json({ ok: true });
}
