import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished homepage with its own metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Endacopia Guide — Walkthrough, Endings &amp; Puzzle Solutions<\/title>/i);
  assert.match(html, /<h1[^>]*>[^<]*Find your way through/i);
  assert.match(html, /Start the walkthrough/i);
  assert.match(html, /Independent, source-aware guides/i);
  assert.match(html, /href="\/wiki"/i);
  assert.match(html, /href="\/puzzles"/i);
  assert.match(html, /<link[^>]+rel="canonical"[^>]+href="https:\/\/endacopia\.example\/?"/i);
  assert.match(html, /<meta[^>]+name="google-site-verification"[^>]+content="gsc-test-token"/i);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-TEST123/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test("publishes crawl controls for the configured production origin", async () => {
  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Host: https:\/\/endacopia\.example/);
  assert.match(robots, /Sitemap: https:\/\/endacopia\.example\/sitemap\.xml/);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^application\/xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles\/old-key<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles\/core-key<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles\/projector-remote<\/loc>/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 23);
});

test("renders the navigation, listing, and detail page types", async () => {
  const cases = [
    ["/wiki", /All published Endacopia guides/i],
    ["/puzzles", /Endacopia puzzle solutions/i],
    ["/puzzles/password", /The formal-release Saw box code is 471/i],
    ["/endings/ending-c", /Collect all 18 fish/i],
    ["/puzzles/old-key", /six day and night states/i],
    ["/puzzles/core-key", /Transparent Mug/i],
    ["/puzzles/projector-remote", /eight colored seats/i],
  ];

  for (const [path, expected] of cases) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, expected, path);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, path);
    assert.match(html, /<meta[^>]+name="description"[^>]+content=/i, path);
  }
});

test("keeps exactly 21 researched MDX guides and the generated favicon", async () => {
  const contentRoot = new URL("../content/guides/", import.meta.url);
  const files = (await readdir(contentRoot)).filter((file) => file.endsWith(".mdx"));
  assert.equal(files.length, 21);

  for (const file of files) {
    const source = await readFile(new URL(file, contentRoot), "utf8");
    assert.match(source, /^---\n\{"slug":/);
    assert.match(source, /"sources":\[/);
    assert.match(source, /\n## /);
  }

  await access(new URL("../public/favicon.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
