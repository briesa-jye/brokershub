/** Sends mail through Resend when RESEND_API_KEY is set. Returns "not_configured" when it is not. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendEmail(o: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<"sent" | "failed" | "not_configured"> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "not_configured";
  const from = process.env.EMAIL_FROM ?? "BROKERSHUB <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: o.to, reply_to: o.replyTo, subject: o.subject, html: o.html, text: o.text }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
