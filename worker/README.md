# Resume Q&A Worker (Cloudflare → Claude Sonnet)

This Cloudflare Worker is the backend for the AI Q&A on the resume site. It holds the
Anthropic API key as a **secret** and proxies chat requests to **Claude Sonnet
(`claude-sonnet-4-6`)**. The key never reaches the browser.

## Request shape

`POST https://api.hagestedt.com/chat`

```json
{ "system": "<system prompt>", "messages": [{ "role": "user", "content": "..." }] }
```

Response: `{ "text": "<assistant reply>" }`

The model (`claude-sonnet-4-6`) and `max_tokens` (500) are forced server-side — the
client cannot change them.

## One-time setup

1. **Authorize wrangler** with your Cloudflare account:

   ```bash
   npx wrangler login
   ```

2. **Deploy the Worker.** This also creates the `api.hagestedt.com` custom domain
   (a proxied DNS record pointing at the Worker; the GitHub Pages apex is untouched):

   ```bash
   npm run worker:deploy      # = wrangler deploy
   ```

3. **Set the API key secret** (the only place the key lives):

   ```bash
   npm run worker:secret      # = wrangler secret put ANTHROPIC_API_KEY
   ```

   or in the dashboard: **Workers & Pages → resume-chat → Settings → Variables and
   Secrets → Add → Type: Secret → Name `ANTHROPIC_API_KEY` → paste `sk-ant-...`**.

The site calls `https://api.hagestedt.com/chat` (set as `CHAT_ENDPOINT` in
`src/lib/claude.ts`). Prefer not to add a subdomain? Remove the `routes` block from
`wrangler.toml`, redeploy to get the `*.workers.dev` URL, and point `CHAT_ENDPOINT`
at that instead (CORS is already handled in the Worker).

## Local development

```bash
npm run worker:dev   # serves the Worker at http://localhost:8787
```

## Abuse protection

A **per-IP rate limit is built in** — 20 requests / 60s, keyed by `CF-Connecting-IP`
via the `[[ratelimits]]` binding in `wrangler.toml`. Exceeding it returns HTTP 429.
Tune the numbers in `wrangler.toml` (`period` must be `10` or `60`).

For a public, billable key you may also want, in the Cloudflare dashboard:

- A **WAF rate limiting rule** on `api.hagestedt.com` as a second layer
  (Security → WAF → Rate limiting rules).
- **Cloudflare Turnstile** in front of the chat widget to block headless bots.
