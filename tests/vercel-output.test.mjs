import assert from "node:assert/strict";
import test from "node:test";
import { guides } from "../scripts/check-content.mjs";

const { default: app } = await import(
  "../.vercel/output/functions/__server.func/index.mjs"
);

async function render(pathname) {
  return app.fetch(new Request(`https://endacopia.example${pathname}`), {
    waitUntil() {},
  });
}

test("Vercel output serves the public page types and 404", async () => {
  for (const pathname of ["/", "/puzzles", "/wiki"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/i);
  }

  const missing = await render("/not-a-real-guide");
  assert.equal(missing.status, 404);
});

test("Vercel output contains production SEO and Google integrations", async () => {
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
  }
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
