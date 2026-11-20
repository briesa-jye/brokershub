import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { LAST_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/solutions", 0.9],
    ["/pricing", 0.9],
    ["/about", 0.7],
    ["/resources", 0.7],
    ["/guides", 0.8],
    ["/demo", 0.8],
    ["/contact", 0.5],
    ["/terms", 0.3],
    ["/privacy", 0.3],
  ];
  return [
    ...pages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: LAST_UPDATED, changeFrequency: "monthly" as const, priority })),
    ...guides.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: LAST_UPDATED, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
