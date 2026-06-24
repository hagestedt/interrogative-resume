// Bakes static HTML into dist/index.html after the client build, so the page is
// not an empty shell to crawlers, ATS parsers, and Slack/LinkedIn/Google unfurlers.
//
// Pipeline (see package.json "build"):
//   1. vite build                              -> dist/ (client bundle + index.html)
//   2. vite build --ssr src/entry-server.tsx   -> dist-ssr/entry-server.js
//   3. node scripts/prerender.mjs              -> injects rendered HTML into dist/index.html
//
// dist-ssr/ is gitignored and never deployed (the Pages workflow uploads ./dist only).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '../dist-ssr/entry-server.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'dist/index.html');
const MARKER = '<div id="root"></div>';

const appHtml = render();
const html = readFileSync(indexPath, 'utf-8');

if (!html.includes(MARKER)) {
  throw new Error(`prerender: expected ${MARKER} in dist/index.html but it was not found.`);
}
if (appHtml.trim().length < 500) {
  throw new Error(`prerender: rendered HTML is suspiciously short (${appHtml.length} chars) — aborting.`);
}

writeFileSync(indexPath, html.replace(MARKER, `<div id="root">${appHtml}</div>`));
console.log(`✓ Prerendered ${appHtml.length.toLocaleString()} chars of static HTML into dist/index.html`);
