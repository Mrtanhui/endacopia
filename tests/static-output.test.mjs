import assert from "node:assert/strict";
import test from "node:test";
import { guides } from "../scripts/check-content.mjs";

import { readFileSync, existsSync } from 'node:fs';
async function render(pathname) {
 const file = `out${pathname === '/' ? '/index.html' : /\.(xml|txt)$/.test(pathname) ? pathname : pathname + '.html'}`;
 if (!existsSync(file)) return new Response(readFileSync('out/404.html', 'utf8'), {status:404});
 return new Response(readFileSync(file,'utf8'), {headers:{'content-type':file.endsWith('.html') ? 'text/html' : 'text/plain'}});
}

test("Static Next.js output serves the public page types and 404", async () => {
  for (const pathname of ["/", "/puzzles", "/wiki"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/i);
  }

  const missing = await render("/not-a-real-guide");
  assert.equal(missing.status, 404);
});

test("Static Next.js output contains production SEO and Google integrations", async () => {
  const home = await render("/");
  const html = await home.text();
  assert.match(html, /href="https:\/\/endacopia\.example\/?"/i);
  assert.match(html, /name="google-site-verification"[^>]+content="gsc-test-token"/i);
  assert.match(html, /data-measurement-id="G-TEST123"/i);
  assert.doesNotMatch(html, /src="https:\/\/www\.googletagmanager\.com/);

  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/endacopia\.example\/sitemap\.xml/);

  const sitemap = await (await render("/sitemap.xml")).text();
  assert.equal((sitemap.match(/<url>/g) ?? []).length, guides.length + 5);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles\/old-key<\/loc>/);
});

test("key and secrets answers include readable tables, sources and task links", async () => {
  const key = await (await render("/puzzles/old-key")).text();
  assert.match(key, /<table>/);
  for (const fish of ["Nautilus", "Colisa Lalia", "Pirate", "Drawing of a Fish"]) assert.ok(key.includes(fish), fish);
  assert.match(key, /3772931269/);
  assert.match(key, /Alt\+Enter/);
  assert.doesNotMatch(key, /Target query|targets the wording players/);
  assert.ok(key.indexOf('aria-label="Quick answer"') < key.indexOf('class="article-toc"'));
  assert.match(key, /href="\/endings\/ending-c"/);
  const secrets = await (await render("/guide/secrets")).text();
  assert.match(secrets, /<table>/);
  for (const target of ["puzzles/old-key", "puzzles/core-key", "puzzles/projector-remote", "endings/ending-c"]) assert.ok(secrets.includes(target), target);
  assert.doesNotMatch(secrets, /hidden map information in Chapter 2/);
});

test("every configured guide keeps a canonical, one heading and a working route", async () => {
  for (const guide of guides) {
    const response = await render(`/${guide.slug}`);
    assert.equal(response.status, 200, guide.slug);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, guide.slug);
    assert.ok(html.includes(`rel="canonical" href="https://endacopia.example/${guide.slug}"`), guide.slug);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const graph = structured.find((item) => item['@graph'])['@graph'];
    const article = graph.find((item) => item['@type'] === 'Article');
    assert.equal(article.headline, guide.title);
    assert.equal(article.dateModified, new Date(guide.updated).toISOString().slice(0, 10));
    const crumbs = graph.find((item) => item['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs.at(-1).item, `https://endacopia.example/${guide.slug}`);
    assert.ok(html.includes('Sources &amp; corrections'));
    assert.ok(html.includes('/issues/new?title='));
    assert.doesNotMatch(html, /pagead2|adsbygoogle|adsterra/i);
  }
});

test('collection, search and diagrams are rendered without depending on hydration', async () => {
  const key = await (await render('/puzzles/old-key')).text();
  assert.equal((key.match(/type="checkbox"/g) ?? []).length, 18);
  assert.match(key, /data-checklist="timesville-fish"/);
  assert.match(key, /id="timesville-fish-checklist"/);
  assert.match(key, /aria-controls="timesville-fish-items"/);
  assert.match(key, /data-checklist-filter/);
  assert.match(key, /href="#your-fish-progress"/);
  assert.match(key, /aria-label="Collection shortcuts"/);
  assert.match(key, /id="read-the-clock-and-advance-time"/);
  assert.match(key, /href="#if-a-step-does-not-work"/);
  assert.match(key, /src="\/images\/fishing-clock.svg"/);
  const wiki = await (await render('/wiki')).text();
  assert.equal((wiki.match(/data-search-text=/g) ?? []).length, guides.length);
  assert.match(wiki, /id="find-a-guide"/);
  const ending = await (await render('/endings/ending-c')).text();
  assert.match(ending, /id="seven-office-symbol-stages"/);
  assert.match(ending, /id="stage-six-reference"/);
});

test("information pages are crawlable and linked without inflating guide counts", async () => {
  for (const path of ['/about', '/contact', '/privacy']) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = (await response.text()).replaceAll('<!-- -->', '');
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="https://endacopia.example${path}"`));
    assert.match(html, /21 GUIDES ONLINE/);
    for (const link of ['/about','/contact','/privacy']) assert.ok(html.includes(`href="${link}"`));
  }
  const contact = await (await render('/contact')).text();
  assert.match(contact, /https:\/\/github.com\/Mrtanhui\/endacopia\/issues/);
  assert.doesNotMatch(contact, /mailto:|tandonghui2003@gmail/);
  const privacy = await (await render('/privacy')).text();
  assert.match(privacy, /data-analytics-choice="denied"/);
  assert.match(privacy, /data-analytics-choice="granted"/);
  assert.match(privacy, /id="analytics-choices"/);
});


test('published pages are English-only and Chinese routes are retired', async () => {
 const paths=['/','/wiki','/puzzles','/about','/contact','/privacy',...guides.map(g=>'/'+g.slug)];
 for(const path of paths){
  const html=await (await render(path)).text();
  assert.match(html,/<html lang="en"/);
  assert.doesNotMatch(html,/href="\/zh(?:["/])|hrefLang="zh/i);
  const visible=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'');
  assert.doesNotMatch(visible,/[\u3400-\u9fff]/,path);
 }
 assert.equal((await render('/zh')).status,404);
 assert.equal((await render('/zh/puzzles/old-key')).status,404);
 const config=JSON.parse(readFileSync('vercel.json','utf8'));
 assert.ok(config.redirects.some(r=>r.source==='/zh/:path*'&&r.destination==='/:path*'&&r.permanent));
 const map=await (await render('/sitemap.xml')).text();
 assert.doesNotMatch(map,/\/zh(?:<|\/)|hreflang/i);
});
