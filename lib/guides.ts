/// <reference types="vite/client" />

import site from "@/config/site.json";

export type GuideSource = {
  label: string;
  url: string;
};

export type Guide = {
  slug: string;
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
  sources: GuideSource[];
  body: string;
};

const modules = import.meta.glob("../content/guides/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseGuide(raw: string): Guide {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error("Guide content is missing JSON frontmatter.");
  const meta = JSON.parse(match[1]) as Omit<Guide, "body">;
  return { ...meta, body: match[2].trim() };
}

const guides = Object.values(modules)
  .map(parseGuide)
  .sort((a, b) => a.title.localeCompare(b.title));

export function getGuides(): Guide[] {
  return guides;
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export const categoryOrder: Guide["category"][] = site.categories.map((category) => category.name);

export function categoryLabel(category: Guide["category"]): string {
  return site.categories.find((item) => item.name === category)?.label ?? category;
}
