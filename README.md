# Interrogative Résumé

The source behind **[hagestedt.com](https://hagestedt.com)** — a résumé you can *interrogate*: ask an AI agent about my background, or paste a job description for an honest, structured fit assessment.

A résumé that demonstrates the thing it claims. I lead enterprise AI implementations and ship the code; rather than *assert* that, this site **is** the proof — designed, built, secured, and deployed end to end.

**Stack:** React 19 · TypeScript · Vite · Tailwind · Framer Motion · Cloudflare Workers · Claude (Anthropic API) · GitHub Pages.

---

## The parts worth reading

If you're evaluating whether I actually write production code, these are the non-obvious bits — each links to the exact source.

### 1. A hardened LLM proxy, not a leaked API key → [`worker/index.ts`](worker/index.ts)

The Anthropic key is a **Cloudflare Worker secret**; it never reaches the browser bundle. The static site POSTs the conversation to the Worker, which adds the key (`x-api-key`) and calls Claude. The Worker is written to be **un-abusable as a free LLM endpoint**:

- **Model + output cap forced server-side** (`claude-sonnet-4-6`, `max_tokens: 500`) — nobody can repurpose the endpoint onto a pricier model or drain tokens with huge completions.
- **Per-IP rate limit** — 20 req / 60 s via Cloudflare's native `[[ratelimits]]` binding keyed on `CF-Connecting-IP`; returns `429` on exceed.
- **Origin allow-list** — `403` for other sites' browsers.
- **History bounded** to the last 20 messages, so a long conversation can't balloon the prompt (or the bill).
- **Honest threat model, in the code comments:** the origin check only stops *browsers* — a non-browser client can spoof `Origin`, so the **rate limit is the real abuse control.** CORS is not security, and the code says so. That distinction is the difference between someone who's shipped a public endpoint and someone who hasn't.

### 2. Build-time prerender, deliberately *without* hydration → [`scripts/prerender.mjs`](scripts/prerender.mjs) · [`src/entry-server.tsx`](src/entry-server.tsx)

A static SPA serves an empty `<div id="root">` to crawlers, ATS parsers, and link unfurlers (LinkedIn / Slack). So the build runs a small SSR pass that renders the app to HTML and bakes it into `dist/index.html`. **The client does not hydrate it** — it mounts a fresh React tree over it.

- **The tradeoff, stated plainly:** the page renders twice (once at build, once in the browser). That's intentional. The SSR pass is a single cheap `renderToString`, and skipping hydration removes an entire class of hydration-mismatch bugs at zero user-visible cost on a content page. The prerendered HTML is a genuine no-JS fallback; the live app is the client tree. Full meta + Open Graph + `Person` JSON-LD ride along so the page unfurls cleanly.

### 3. A structured Fit Assessment that degrades gracefully → [`src/lib/claude.ts`](src/lib/claude.ts)

Paste a job description; Claude scores it HIGH / MEDIUM / LOW against my background and returns typed JSON (`verdict`, `headline`, `rationale`, `strengths[]`, `watchouts[]`) that the UI renders directly. Two things make it production-shaped rather than a demo:

- **The prompt is instructed to be honest** — *"do NOT force a HIGH; if it's a weak fit, say LOW and explain why"* — so the feature can tell a recruiter *no*.
- **The parser assumes the model misbehaves.** `parseFit()` strips ` ```json ` fences, extracts the outermost `{…}` out of any stray prose, validates `verdict` against an enum, clamps the arrays, and **falls back to a readable MEDIUM card if JSON parsing fails entirely** — no white screen, ever. LLM output is treated as untrusted input, because it is.

---

## Architecture

```
Browser — React SPA on GitHub Pages (hagestedt.com)
   │  POST { system, messages }
   ▼
Cloudflare Worker (api.hagestedt.com)   ←─ secret: ANTHROPIC_API_KEY
   │  origin allow-list · per-IP rate limit · forced model + token cap
   ▼
Anthropic API  (claude-sonnet-4-6)
```

- **Frontend** — React 19 + Vite, Tailwind, Framer Motion. Content (roles, metrics, selected work) is data-driven in [`src/data.ts`](src/data.ts); both AI features live in [`src/lib/claude.ts`](src/lib/claude.ts).
- **AI backend** — the Worker in [`worker/`](worker/); routes, secret, and the rate-limit binding in [`wrangler.toml`](wrangler.toml). It runs on its own subdomain so the GitHub Pages apex stays untouched.
- **Design system** — the "Garnet" personal brand, tokenized in [`tailwind.config.js`](tailwind.config.js): one garnet accent on cool-ink neutrals, Inter + Fraunces.

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b → vite build → SSR build → prerender into dist/
```

The AI features call the deployed Worker. To run your own, see [`worker/README.md`](worker/README.md): set the `ANTHROPIC_API_KEY` secret and deploy with Wrangler.

---

## Honest scope

This is a personal site, not a SaaS — there's no multi-tenant data layer or test suite here; the engineering signal is in the **security model, the build pipeline, and the untrusted-LLM-output handling** above. For a full-stack, test-covered, **SDK-first** build (Python + FastAPI + SQLite + React/D3 + an MCP server, 26 tests green), see its sibling repo: **[ai-adoption-radar](https://github.com/hagestedt/ai-adoption-radar)**.

---

*React · TypeScript · Vite · Tailwind · Cloudflare Workers · Claude · MIT*
