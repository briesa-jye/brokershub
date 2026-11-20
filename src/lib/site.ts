import type { Metadata } from "next";

/** Set NEXT_PUBLIC_SITE_URL in the host environment to the live domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://brokershub.com.au").replace(/\/$/, "");
export const SITE_NAME = "BROKERSHUB";
export const SITE_TAGLINE = "Compliance for mortgage and finance brokers";
export const SITE_DESCRIPTION =
  "BROKERSHUB keeps mortgage and finance broker files defensible: best interests duty checklists, supervision of credit representatives, complaints and breach registers, CPD and licence dates, and an audit pack on demand.";
/** Last content update, used by the sitemap and structured data. */
export const LAST_UPDATED = "2026-11-21";

/** Where messages go until a mail service is connected. Replace with a real address. */
export const CONTACT_EMAIL = "hello@brokershub.com.au";
export const DEMO_HREF = "/demo";

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: abs(path), siteName: SITE_NAME, title, description, locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}
