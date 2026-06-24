# Interrogative Resume

The source behind **[hagestedt.com](https://www.hagestedt.com)** — an interactive résumé you can *interrogate*: ask an AI agent about my background, or paste a job description for an honest, AI-generated fit assessment.

## Why it exists
A résumé that demonstrates the thing it claims. Rather than describe shipping AI products, the site *is* one — built and deployed end to end.

## Architecture
- **Frontend** — React 19 + TypeScript + Vite, Tailwind CSS, Framer Motion. Static build, deployed on GitHub Pages.
- **AI backend** — a Cloudflare Worker (`worker/`) that proxies Anthropic's Claude Sonnet server-side. The API key is a Worker secret; it never touches the client bundle.
- **Hardening** — browser-origin allow-listing, per-IP rate limiting (Workers rate-limit binding), and a forced model + output-token cap so the endpoint can't be repurposed.
- **Two AI features** — a context-grounded Q&A agent, and a Fit Assessment that scores a pasted job description HIGH / MEDIUM / LOW against my background and returns structured, honest reasoning (gaps included).

## Run locally
```bash
npm install
npm run dev   # http://localhost:5173
```
The AI features call the deployed Worker; see `worker/README.md` to run your own.

---
*React · TypeScript · Cloudflare Workers · Claude*
