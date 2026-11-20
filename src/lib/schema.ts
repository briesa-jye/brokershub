import { abs, LAST_UPDATED, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/logo-mark.svg"),
  description: SITE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "Australia" },
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-AU",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const software = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Mortgage and finance broker compliance software",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  areaServed: { "@type": "Country", name: "Australia" },
};

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const faqPage = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const article = ({ title, description, path }: { title: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: abs(path),
  inLanguage: "en-AU",
  dateModified: LAST_UPDATED,
  author: { "@id": `${SITE_URL}/#organization` },
  publisher: { "@id": `${SITE_URL}/#organization` },
});
