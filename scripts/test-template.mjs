import { mkdtempSync, cpSync, writeFileSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Build a second game in a disposable folder. No deployment, env files or production content are changed.
const root = mkdtempSync(join(tmpdir(), 'guide-template-'));
const run = (args) => {
  const result = spawnSync(process.execPath, args, { cwd: root, env: { ...process.env, SITE_URL: 'https://moon-archive.example', NEXT_PUBLIC_GA_ID: '', GOOGLE_SITE_VERIFICATION: '', NITRO_PRESET: 'vercel' }, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`);
};
try {
  for (const name of ['app', 'components', 'lib', 'config', 'content', 'public', 'build', 'worker', '.openai', 'scripts', 'vite.config.ts', 'next.config.ts', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs', 'package.json']) cpSync(name, join(root, name), { recursive: true });
  symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  const site = JSON.parse(readFileSync('config/site.json', 'utf8'));
  Object.assign(site, { gameName: 'Moon Archive', siteName: 'Moon Archive Guide', title: 'Moon Archive Guide', description: 'A fictional puzzle guide used only to test this template.', keywords: ['moon archive'], footerDescription: 'Independent Moon Archive guides.', disclaimer: 'Fictional test content.', officialLinks: [['Game', 'https://moon-archive.example/game']], navigation: [['Wiki', '/wiki'], ['Puzzles', '/puzzles']], categories: [{ name: 'Reference', label: 'Start here' }, { name: 'Puzzles', label: 'Puzzles' }], favicon: '/moon.svg', socialImage: '/moon.svg', puzzles: { title: 'Moon Archive Puzzles', description: 'Moon Archive puzzle solutions', heading: 'Moon Archive puzzles', intro: 'Choose a puzzle.', callout: { label: '', title: '', description: '', links: [] } } });
  writeFileSync(join(root, 'config/site.json'), JSON.stringify(site));
  const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
  Object.assign(home, { stats: [['Creator', 'Test Studio']], starts: [{ number: '01', title: 'Moon gate', description: 'Open the gate.', href: '/puzzles/moon-gate', label: 'Read' }], categories: [['Puzzles', 'Moon puzzles', 'Solve the gate.', '/puzzles']], featuredSlugs: ['puzzles/moon-gate'], prioritySlugs: ['puzzles/moon-gate'], heroLead: 'Explore Moon Archive.', primaryLink: { href: '/wiki', label: 'Start the guide' }, consoleName: 'MOON_LINK', objective: 'Open the gate.', areas: [['MOON', 'GUIDES']], about: { eyebrow: 'Moon', title: 'Explore the Moon', lead: 'A fictional puzzle adventure.', description: 'Template test fixture.', features: ['Open the gate'], trailer: 'https://moon-archive.example/trailer', fileLabel: 'MOON.EXE', facts: [['Creator', 'Test Studio']] }, cta: { eyebrow: 'Ready', title: 'Open the moon gate?' } });
  writeFileSync(join(root, 'content/home.json'), JSON.stringify(home));
  rmSync(join(root, 'content/guides'), { recursive: true });
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(root, 'content/guides'));
  writeFileSync(join(root, 'public/moon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="15" fill="silver"/></svg>');
  for (const [slug, category] of [['wiki', 'Reference'], ['puzzles/moon-gate', 'Puzzles']]) {
    const meta = { slug, category, title: `Moon Archive ${slug}`, description: 'Open the moon gate.', updated: '2026-09-11', readTime: '1 min', sources: [{ label: 'Fixture', url: 'https://moon-archive.example/game' }], quickAnswer: 'Use the moon token.' };
    writeFileSync(join(root, 'content/guides', slug.replaceAll('/', '-') + '.mdx'), `---\n${JSON.stringify(meta)}\n---\n## Open the gate\nUse the moon token.\n`);
  }
  run(['scripts/check-content.mjs']);
  run([resolve('node_modules/vite/bin/vite.js'), 'build']);
  writeFileSync(join(root, 'verify.mjs'), `
import assert from 'node:assert/strict';
import app from './.vercel/output/functions/__server.func/index.mjs';
for (const path of ['/', '/wiki', '/puzzles', '/puzzles/moon-gate']) {
 const response = await app.fetch(new Request('https://moon-archive.example' + path), {waitUntil(){}});
 assert.equal(response.status, 200, path);
 const html = (await response.text()).replaceAll('<!-- -->', '');
 assert.match(html, /Moon Archive/);
 assert.doesNotMatch(html, /Endacopia|Mellow|Andyland|andyl4nd|2684630|_wJsmY8huvk/i, path);
 assert.equal((html.match(/<h1\\b/g) || []).length, 1);
 assert.match(html, /2 GUIDES ONLINE/);
 assert.doesNotMatch(html, /googletagmanager/);
}
const sitemap = await (await app.fetch(new Request('https://moon-archive.example/sitemap.xml'), {waitUntil(){}})).text();
assert.equal((sitemap.match(/<url>/g) || []).length, 4);
assert.doesNotMatch(sitemap, /endacopia|old-key/i);
assert.equal((await app.fetch(new Request('https://moon-archive.example/puzzles/old-key'), {waitUntil(){}})).status, 404);
`);
  run(['verify.mjs']);
  console.log('Template replacement passed: second game renders 4 pages, correct canonical origin and sitemap, no old-game text or routes, analytics disabled.');
} finally {
  rmSync(root, { recursive: true, force: true });
}
