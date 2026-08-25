import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";

const fallbackUpdated = new Date("2026-08-14T00:00:00.000Z");
const siteUpdated = new Date("2026-08-24T00:00:00.000Z");

function guideUpdated(value: string): Date {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? fallbackUpdated : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/puzzles"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
    ...getGuides().map((guide) => ({ url: absoluteUrl(`/${guide.slug}`), lastModified: guideUpdated(guide.updated), changeFrequency: "weekly" as const, priority: guide.slug === "wiki" ? 0.9 : 0.7 })),
  ];
}
