import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { guides } from './check-content.mjs';

// The last version before the reading redesign; retain its public content inventory.
const baseline = JSON.parse(readFileSync('tests/fixtures/migration-baseline.json', 'utf8'));
const anchor = text => text.match(/\{#([a-z0-9-]+)\}$/)?.[1] ?? text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
for (const previous of baseline.guides) {
  const guide = guides.find(item => item.slug === previous.slug);
  assert.ok(guide, `Missing migrated guide: ${previous.slug}`);
  assert.equal(guide.title, previous.title, `Unexpected title change: ${previous.slug}`);
  const anchors = new Set([...guide.body.matchAll(/^#{2,3} (.+)$/gm)].map(match => anchor(match[1])));
  for (const alias of guide.anchorAliases ?? []) anchors.add(alias.id);
  for (const id of previous.anchors) assert.ok(anchors.has(id), `Lost legacy section: ${previous.slug}#${id}`);
  for (const url of previous.sources) assert.ok(guide.sources.some(source => source.url === url), `Lost source credit: ${previous.slug}`);
  assert.deepEqual(guide.checklist ?? null, previous.checklist, `Changed collection data: ${previous.slug}`);
}
for (const asset of baseline.assets) assert.ok(existsSync(asset), `Missing legacy asset: ${asset}`);
console.log(`Migration inventory valid: ${baseline.guides.length} guides, ${baseline.publicPaths.length} public routes, ${baseline.assets.length} retained assets.`);
