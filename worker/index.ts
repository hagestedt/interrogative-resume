/**
 * Cloudflare Worker: resume Q&A proxy to Claude Sonnet.
 *
 * The Anthropic API key is stored as the ANTHROPIC_API_KEY *secret* on this Worker
 * and is never sent to the browser. The static site (hagestedt.com) POSTs the
 * conversation to this Worker, which adds the key and calls the Anthropic API.
 *
 * Set the secret with:
 *   npm run worker:secret        (= wrangler secret put ANTHROPIC_API_KEY)
 * or in the dashboard: Workers & Pages > (this worker) > Settings > Variables and Secrets.
 */

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ANTHROPIC_API_KEY: string;
  // Per-IP rate limiter, configured as [[ratelimits]] in wrangler.toml.
  CHAT_RATE_LIMITER: RateLimit;
}

// Model is forced server-side so the endpoint can't be repurposed onto a pricier model.
const MODEL = "claude-sonnet-4-6";
// Hard cap on output tokens.
const MAX_TOKENS = 500;

// Browser origins allowed to call this Worker.
const ALLOWED_ORIGINS = [
  "https://hagestedt.com",
  "https://www.hagestedt.com",
  "http://localhost:5173",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    // Best-effort origin allowlist: blocks other sites' browsers. A non-browser
    // client can omit or spoof Origin, which is why the rate limit below is the
    // real abuse protection.
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ error: "Forbidden" }, 403, origin);
    }

    // Per-IP rate limit (20 requests / 60s; see [[ratelimits]] in wrangler.toml).
    const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.CHAT_RATE_LIMITER.limit({ key: clientIp });
    if (!success) {
      return jsonResponse(
        { error: "Rate limit exceeded — please wait a minute and try again." },
        429,
        origin,
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse(
        { error: "Server is missing ANTHROPIC_API_KEY" },
        500,
        origin,
      );
    }

    let payload: {
      system?: string;
      messages?: Array<{ role: string; content: string }>;
    };
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
    }

    const messages = Array.isArray(payload.messages)
      ? payload.messages.slice(-20)
      : [];
    if (messages.length === 0) {
      return jsonResponse({ error: "No messages provided" }, 400, origin);
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: payload.system ?? "",
        messages,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Anthropic error", upstream.status, detail);
      return jsonResponse({ error: "Upstream model error" }, 502, origin);
    }

    const data = (await upstream.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");

    return jsonResponse({ text }, 200, origin);
  },
};
