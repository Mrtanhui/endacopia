import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-08-14T00:00:00.000Z");
  return [
    { url: "https://endacopia.guide", lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: "https://endacopia.guide/puzzles", lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    ...getGuides().map((guide) => ({ url: `https://endacopia.guide/${guide.slug}`, lastModified: updated, changeFrequency: "weekly" as const, priority: guide.slug === "wiki" ? 0.9 : 0.7 })),
  ];
}
