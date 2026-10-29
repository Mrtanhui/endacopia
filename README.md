# Endacopia Field Guide

An independent, spoiler-conscious guide site for **Endacopia**. It brings
walkthroughs, endings, puzzle answers, character notes, secrets, bosses, and
achievements into one searchable content hub.

## Included pages

- Homepage with featured guides and topic navigation
- Wiki and puzzle indexes
- 21 source-reviewed English guides and 21 complete Chinese translations
- 49 public HTML pages, including localized indexes and information pages
- Dynamic metadata, Open Graph image, sitemap, and robots directives
- Responsive desktop and mobile layouts

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm test
npm run build
```

## Tech stack

- React 19
- Standard Next.js 16.4.3 App Router, exported as crawlable static HTML
- Restricted Markdown/MDX content plus Chinese translation JSON
- TypeScript and CSS

This is a fan-made guide and is not affiliated with the creators or publishers
of Endacopia.

## October 29 migration

The deployed application now uses standard Next.js. Existing English URLs are preserved. Chinese guides live at `/zh/<original-slug>`, with matching `lang`, canonical, hreflang, sitemap entries and Article language. Source files in `app/(en)` and `app/(zh)` use separate root layouts. Legacy Vinext/Cloudflare scaffolding is retained for provenance but is not used by the Next/Vercel build.

Run `npm run test:vercel`, `npm run test:analytics`, `npm run test:guide-tools` and `npm run test:template` before publishing. The static-output suite checks both languages; the template suite builds a separate fictional game. `npm run dev` is for local preview; production is served by Vercel from the exported build.
