import { writeFileSync } from 'node:fs';
import { guides } from './check-content.mjs';
const origin = process.env.CHECK_ORIGIN;
if (!origin || !/^https:\/\//.test(origin)) throw new Error('Set CHECK_ORIGIN to the public production origin.');
const paths = ['/', '/puzzles', '/about', '/contact', '/privacy', ...guides.map((guide) => '/' + guide.slug)];
const results = [], bodies = new Map();
for (const path of paths) {
  const response = await fetch(origin + path);
  const html = await response.text();
  bodies.set(path, html);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  results.push({path,status:response.status,canonical,h1:(html.match(/<h1\b/g)||[]).length,noindex:/noindex/i.test(response.headers.get('x-robots-tag') || '') || /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html),links:[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m)=>m[1]).filter((href)=>href.startsWith('/'))});
}
const errors = [];
for (const row of results) {
  if (row.status !== 200 || row.h1 !== 1 || row.noindex || row.canonical?.replace(/\/$/,'') !== (origin+row.path).replace(/\/$/,'')) errors.push(`Crawl/SEO check: ${row.path}`);
  for (const href of row.links) {
    const [path, anchor] = href.split('#');
    const body = bodies.get(path);
    if (!body) errors.push(`Missing linked page: ${row.path} -> ${href}`);
    else if (anchor && !body.includes(`id="${anchor}"`)) errors.push(`Missing anchor: ${row.path} -> ${href}`);
  }
}
const sitemapResponse = await fetch(origin+'/sitemap.xml');
const sitemap = await sitemapResponse.text();
for (const path of paths) if (!sitemap.includes(`<loc>${origin+path}</loc>`)) errors.push(`Sitemap missing ${path}`);
const robots = await (await fetch(origin+'/robots.txt')).text();
if (!robots.includes(origin+'/sitemap.xml')) errors.push('robots sitemap mismatch');
const missingStatus = (await fetch(origin+'/not-a-real-guide')).status;
if (missingStatus !== 404) errors.push('Unknown URL is not 404');
const priorities = ['/guide/secrets','/puzzles/old-key','/puzzles/core-key','/puzzles/projector-remote','/endings/ending-c'];
const inbound = Object.fromEntries(priorities.map((path)=>[path,results.filter((row)=>row.links.some((link)=>link.split('#')[0]===path)).map((row)=>row.path)]));
const report = {checkedAt:new Date().toISOString(),origin,pageCount:results.length,errors:[...new Set(errors)],inbound,pages:results.map((row)=>({path:row.path,status:row.status,canonical:row.canonical,h1:row.h1,noindex:row.noindex}))};
if (process.env.CHECK_REPORT) writeFileSync(process.env.CHECK_REPORT, JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pageCount:report.pageCount,errors:report.errors,inbound},null,2));
if (errors.length) process.exitCode=1;
