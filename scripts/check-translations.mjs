import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { guides } from './check-content.mjs';
const translations = readdirSync('content/translations/zh').filter(name => name.endsWith('.json')).map(name => JSON.parse(readFileSync(`content/translations/zh/${name}`, 'utf8')));
assert.equal(translations.length, guides.length, 'Each guide needs a complete paired translation');
assert.equal(new Set(translations.map(item => item.slug)).size, guides.length, 'Duplicate translation');
const slugify = text => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
for (const guide of guides) {
  const translated = translations.find(item => item.slug === guide.slug);
  assert.ok(translated, `${guide.slug}: missing translation`);
  for (const key of ['title', 'description', 'body']) assert.ok(translated[key]?.trim(), `${guide.slug}: missing ${key}`);
  const originalIds = [...guide.body.matchAll(/^#{2,3} (.+)$/gm)].map(match => slugify(match[1]));
  const translatedIds = [...translated.body.matchAll(/^#{2,3} .+ \{#([a-z0-9-]+)\}$/gm)].map(match => match[1]);
  assert.deepEqual(translatedIds, originalIds, `${guide.slug}: translated sections must preserve all heading IDs`);
  for (const task of translated.taskLinks ?? []) assert.ok(translatedIds.includes(task.anchor), `${guide.slug}: broken task link`);
  if (guide.checklist) assert.deepEqual(translated.checklist.groups.flatMap(group=>group.items.map(item=>item.id)),guide.checklist.groups.flatMap(group=>group.items.map(item=>item.id)),`${guide.slug}: checklist IDs must survive language changes`);
}
console.log(`Translations valid: ${translations.length} complete paired guides; ${guides.length * 2 + 7} public pages.`);
