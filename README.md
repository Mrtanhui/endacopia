# Endacopia Field Guide

An independent, spoiler-conscious guide site for **Endacopia**. It brings
walkthroughs, endings, puzzle answers, character notes, secrets, bosses, and
achievements into one searchable content hub.

## Included pages

- Homepage with featured guides and topic navigation
- Wiki and puzzle indexes
- 21 source-reviewed English guides
- 26 public English HTML pages, including indexes and information pages
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
- Restricted Markdown/MDX content
- TypeScript and CSS

This is a fan-made guide and is not affiliated with the creators or publishers
of Endacopia.

## October 29 migration

The deployed application now uses standard Next.js. Existing English URLs are preserved. The public site is English-only by user requirement. Legacy `/zh` URLs permanently redirect to their English equivalents through Vercel; they are excluded from the sitemap and language links. Translation JSON is retained only as unpublished source history. Legacy Vinext/Cloudflare scaffolding is retained for provenance but is not used by the Next/Vercel build.

Run `npm run test:vercel`, `npm run test:analytics`, `npm run test:guide-tools` and `npm run test:template` before publishing. The static-output suite checks English-only output and retired language routes; the template suite builds a separate fictional game. `npm run dev` is for local preview; production is served by Vercel from the exported build.
