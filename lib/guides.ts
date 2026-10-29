import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import site from "@/config/site.json";

export type GuideSource = {
  label: string;
  url: string;
};

export type GuideChecklist = {
  id: string;
  title: string;
  groups: { title: string; items: { id: string; label: string }[] }[];
};

export type Guide = {
  slug: string;
  language?: "en" | "zh";
  originalSlug?: string;
  title: string;
  description: string;
  category: string;
  keyword: string;
  updated: string;
  readTime: string;
  spoiler?: boolean;
  quickAnswer?: string;
  relatedSlugs?: string[];
  scope?: string;
  reviewNote?: string;
  reviewNoteZh?: string;
  taskLinks?: { label: string; anchor: string }[];
  checklist?: GuideChecklist;
  sources: GuideSource[];
  body: string;
};


function parseGuide(raw: string): Guide {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error("Guide content is missing JSON frontmatter.");
  const meta = JSON.parse(match[1]) as Omit<Guide, "body">;
  return { ...meta, body: match[2].trim() };
}

const guideDirectory = join(process.cwd(), "content/guides");
const guides = readdirSync(guideDirectory).filter(name => name.endsWith(".mdx"))
  .map(name => parseGuide(readFileSync(join(guideDirectory, name), "utf8")))
  .sort((a, b) => a.title.localeCompare(b.title));

export function getGuides(language: "en" | "zh" = "en"): Guide[] {
  if (language === "en") return guides;
  const directory = join(process.cwd(), "content/translations/zh");
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter(name => name.endsWith(".json")).flatMap(name => {
    const translation = JSON.parse(readFileSync(join(directory, name), "utf8"));
    const original = guides.find(item => item.slug === translation.slug);
    if (!original) return [];
    return [{ ...original, ...translation, language: "zh" as const, originalSlug: original.slug, slug: `zh/${original.slug}`, relatedSlugs: original.relatedSlugs?.map(slug => `zh/${slug}`) }];
  });
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides(slug.startsWith("zh/") ? "zh" : "en").find((guide) => guide.slug === slug);
}

export const categoryOrder: Guide["category"][] = site.categories.map((category) => category.name);

export function categoryLabel(category: Guide["category"]): string {
  return site.categories.find((item) => item.name === category)?.label ?? category;
}
