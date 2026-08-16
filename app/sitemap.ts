import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-08-14T00:00:00.000Z");
  return [
    { url: absoluteUrl("/"), lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/puzzles"), lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    ...getGuides().map((guide) => ({ url: absoluteUrl(`/${guide.slug}`), lastModified: updated, changeFrequency: "weekly" as const, priority: guide.slug === "wiki" ? 0.9 : 0.7 })),
  ];
}
