import { readdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const site = JSON.parse(readFileSync('config/site.json', 'utf8'));
const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
export const guides = readdirSync('content/guides').filter((name) => name.endsWith('.mdx')).map((name) => {
  const raw = readFileSync(`content/guides/${name}`, 'utf8');
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  assert.ok(match, `${name}: missing JSON frontmatter`);
  return { ...JSON.parse(match[1]), body: match[2] };
});
const slugs = new Set(guides.map((guide) => guide.slug));
assert.equal(slugs.size, guides.length, 'Duplicate guide slug');
const paths = new Set(['/', '/puzzles', ...guides.map((guide) => `/${guide.slug}`)]);
const checkLink = (href) => {
  if (href.startsWith('/') && !href.startsWith('//')) assert.ok(paths.has(href.split('#')[0]), `Broken internal link: ${href}`);
};
for (const guide of guides) {
  for (const key of ['slug', 'title', 'description', 'category', 'updated', 'readTime', 'body']) assert.ok(guide[key]?.trim(), `${guide.slug}: missing ${key}`);
  assert.match(guide.slug, /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/);
  assert.ok(!['puzzles', 'robots.txt', 'sitemap.xml'].includes(guide.slug), 'Reserved slug');
  assert.ok(site.categories.some((category) => category.name === guide.category), `Unknown category: ${guide.category}`);
  assert.ok(Number.isFinite(new Date(guide.updated).valueOf()), `${guide.slug}: invalid update date`);
  assert.ok(guide.sources?.length, `${guide.slug}: sources required`);
  for (const source of guide.sources) assert.match(source.url, /^https:\/\//);
  for (const related of guide.relatedSlugs ?? []) assert.ok(slugs.has(related), `${guide.slug}: missing related ${related}`);
  for (const link of guide.body.matchAll(/(?<!!)\[[^\]]+\]\(([^\s)]+)\)/g)) checkLink(link[1]);
}
for (const [, href] of site.navigation) checkLink(href);
for (const [, href] of site.puzzles.callout.links) checkLink(href);
for (const item of home.starts) checkLink(item.href);
for (const item of home.categories) checkLink(item[3]);
checkLink(home.primaryLink.href);
for (const slug of [...home.featuredSlugs, ...home.prioritySlugs]) assert.ok(slugs.has(slug), `Homepage references missing guide: ${slug}`);
console.log(`Content valid: ${guides.length} guides, ${paths.size} public pages, no broken configured links.`);
