import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-TEST123/i);

  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/endacopia\.example\/sitemap\.xml/);

  const sitemap = await (await render("/sitemap.xml")).text();
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 20);
  assert.match(sitemap, /<loc>https:\/\/endacopia\.example\/puzzles<\/loc>/);
});
