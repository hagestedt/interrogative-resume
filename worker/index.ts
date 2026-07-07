/**
 * Cloudflare Worker: resume Q&A proxy to Claude.
 *
 * The Anthropic API key is stored as the ANTHROPIC_API_KEY *secret* on this Worker
 * and is never sent to the browser. The static site (hagestedt.com) POSTs the
 * conversation to this Worker, which adds the key and calls the Anthropic API.
 *
 * The system prompts are assembled HERE (from ../src/lib/persona.ts), not in the
 * browser: the client sends only { mode: "chat" | "fit", messages }. A client-
 * supplied `system` field is ignored, so the endpoint cannot be repurposed as a
 * general-purpose proxy with an arbitrary system prompt — it only ever talks
 * about Adam's résumé. Per-message and message-count caps bound input cost.
 *
 * Set the secret with:
 *   npm run worker:secret        (= wrangler secret put ANTHROPIC_API_KEY)
 * or in the dashboard: Workers & Pages > (this worker) > Settings > Variables and Secrets.
 */

import { GENERATED_SYSTEM_PROMPT, FIT_SYSTEM_PROMPT } from "../src/lib/persona";

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ANTHROPIC_API_KEY: string;
  // Per-IP rate limiter, configured as [[ratelimits]] in wrangler.toml.
  CHAT_RATE_LIMITER: RateLimit;
}

// Model is forced server-side so the endpoint can't be repurposed onto a pricier model.
const MODEL = "claude-fable-5";
// Hard cap on output tokens.
const MAX_TOKENS = 500;

// Server-side prompt selection + input bounds per mode. "chat" is the résumé
// Q&A; "fit" scores a pasted job description (longer single message allowed).
const MODES = {
  chat: { system: GENERATED_SYSTEM_PROMPT, maxMessages: 20, maxChars: 4_000 },
  fit: { system: FIT_SYSTEM_PROMPT, maxMessages: 2, maxChars: 20_000 },
} as const;
type Mode = keyof typeof MODES;

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
    // client can omit or spoof Origin, which is why the rate limit below and the
    // server-pinned system prompt are the real abuse protection.
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
      mode?: string;
      messages?: Array<{ role?: string; content?: string }>;
    };
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
    }

    // Default to "chat" so clients deployed before the mode field existed keep
    // working during a deploy window. Any client-sent `system` is ignored.
    const mode: Mode = payload.mode === "fit" ? "fit" : "chat";
    const { system, maxMessages, maxChars } = MODES[mode];

    const rawMessages = Array.isArray(payload.messages)
      ? payload.messages.slice(-maxMessages)
      : [];
    if (rawMessages.length === 0) {
      return jsonResponse({ error: "No messages provided" }, 400, origin);
    }

    // Validate shape + bound input size (input tokens are the uncapped cost
    // otherwise — MAX_TOKENS only bounds output).
    const messages: Array<{ role: string; content: string }> = [];
    for (const m of rawMessages) {
      if (
        !m ||
        (m.role !== "user" && m.role !== "assistant") ||
        typeof m.content !== "string"
      ) {
        return jsonResponse({ error: "Malformed message" }, 400, origin);
      }
      if (m.content.length > maxChars) {
        return jsonResponse(
          { error: `Message too long (max ${maxChars} characters)` },
          413,
          origin,
        );
      }
      messages.push({ role: m.role, content: m.content });
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
        system,
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
