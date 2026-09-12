import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";

import home from "@/content/home.json";
import site from "@/config/site.json";

const fallbackUpdated = new Date(`${home.updated}T00:00:00.000Z`);
const siteUpdated = new Date(Math.max(fallbackUpdated.valueOf(), ...getGuides().map((guide) => guideUpdated(guide.updated).valueOf())));

function guideUpdated(value: string): Date {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? fallbackUpdated : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/puzzles"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
    ...site.informationPages.map(([, path]) => ({ url: absoluteUrl(path), lastModified: new Date(`${site.informationUpdated}T00:00:00.000Z`), changeFrequency: "monthly" as const, priority: 0.3 })),
    ...getGuides().map((guide) => ({ url: absoluteUrl(`/${guide.slug}`), lastModified: guideUpdated(guide.updated), changeFrequency: "weekly" as const, priority: guide.slug === "wiki" ? 0.9 : 0.7 })),
  ];
}
