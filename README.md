# Interrogative Resume

The source behind **[hagestedt.com](https://www.hagestedt.com)** — an interactive résumé you can *interrogate*: ask an AI agent about my background, or paste a job description for an honest, AI-generated fit assessment.

## Why it exists
A résumé that demonstrates the thing it claims. Rather than describe shipping AI products, the site *is* one — designed, built, and deployed end to end.

## Architecture
- **Frontend** — React 19 + TypeScript + Vite, Tailwind CSS, Framer Motion. Static build, deployed on GitHub Pages.
- **Build-time prerender** — a small SSR pass (`src/entry-server.tsx` + `scripts/prerender.mjs`) bakes rendered HTML into `dist/index.html`, so search engines, ATS parsers, and link unfurlers (Slack / LinkedIn) get real content instead of an empty `#root`. The client still takes over into the full app on load.
- **AI backend** — a Cloudflare Worker (`worker/`) that proxies Anthropic's Claude server-side. The API key is a Worker secret; it never touches the client bundle.
- **Hardening** — browser-origin allow-listing, per-IP rate limiting, and a forced model + output-token cap so the endpoint can't be repurposed.
- **Two AI features** — a context-grounded Q&A agent, and a Fit Assessment that scores a pasted job description HIGH / MEDIUM / LOW against my background and returns structured, honest reasoning (gaps included).
- **Design system** — the "Garnet" personal brand: a single garnet accent on cool-ink neutrals, Inter + Fraunces, tokenised in `tailwind.config.js`.

## Highlights
- A 6-second-scan hero (one-line value prop + headline metrics), a **Selected work** proof layer, and a downloadable résumé PDF.
- Full Open Graph / Twitter card + `Person` JSON-LD for clean unfurls and search results.

## Run locally
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # static build + prerender into dist/
```
The AI features call the deployed Worker; see `worker/README.md` to run your own.

---
*React · TypeScript · Vite · Tailwind · Cloudflare Workers · Claude*
