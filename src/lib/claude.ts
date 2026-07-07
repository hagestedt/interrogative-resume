// The Anthropic API key is never in the browser: it lives as a secret on the
// Cloudflare Worker (see /worker/index.ts), which calls Claude Sonnet
// server-side. The system prompts ALSO live server-side (assembled in the
// Worker from src/lib/persona.ts), so this client only ever sends a mode +
// the conversation messages — the endpoint can't be repurposed with an
// arbitrary system prompt.
//
// The Worker runs on its own Cloudflare custom domain (api.hagestedt.com) so
// the GitHub Pages apex stays untouched; CORS is handled in the Worker.
const CHAT_ENDPOINT = "https://api.hagestedt.com/chat";

// Per-message content cap — mirrors the Worker's server-side limits so normal
// use never trips a 400. (chat: 4k chars/message; fit: 20k chars for the JD.)
const FIT_MAX_CHARS = 20000;

interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
}

interface CardMetadata {
    role?: string;
    company?: string;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error occurred";
}

export async function askClaude(
    metadata: CardMetadata | null | undefined,
    userQuery: string,
    history: ChatTurn[] = [],
) {
    try {
        // If metadata is provided (e.g. from a specific job card), prepend it for focus.
        let finalQuery = userQuery;
        if (metadata && metadata.role) {
            finalQuery = `[Context: User is asking from the "${metadata.role} at ${metadata.company}" card]. ${userQuery}`;
        }

        const messages: ChatTurn[] = [...history, { role: "user", content: finalQuery }];

        const res = await fetch(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "chat", messages }),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(`Chat service ${res.status}: ${detail}`);
        }

        const data = await res.json();
        return { text: data.text ?? "", error: false };
    } catch (error: unknown) {
        console.error("Chat Error:", error);
        return {
            text: `AI Error: ${errorMessage(error)}. (Please check the chat service and your connection.)`,
            error: true,
        };
    }
}

// ---------------------------------------------------------------------------
// Fit Assessment — a REAL Claude call (same Worker, fit-mode system prompt)
// that scores a pasted job description against Adam's background. Returns
// structured JSON the UI renders directly.
// ---------------------------------------------------------------------------

export interface FitResult {
    verdict: 'HIGH' | 'MEDIUM' | 'LOW';
    headline: string;
    rationale: string;
    strengths: string[];
    watchouts: string[];
    error?: boolean;
}

function parseFit(text: string): FitResult {
    let cleaned = text.trim();
    // Strip ```json ... ``` fences if the model wrapped its answer.
    cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    // Extract the outermost JSON object in case of stray prose.
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
    }
    const parsed = JSON.parse(cleaned) as Partial<FitResult>;
    const verdict =
        parsed.verdict === 'HIGH' || parsed.verdict === 'LOW' ? parsed.verdict : 'MEDIUM';
    return {
        verdict,
        headline: parsed.headline?.trim() || 'Fit assessment',
        rationale: parsed.rationale?.trim() || '',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter(Boolean).slice(0, 4) : [],
        watchouts: Array.isArray(parsed.watchouts) ? parsed.watchouts.filter(Boolean).slice(0, 2) : [],
    };
}

export async function assessFit(jobDescription: string): Promise<FitResult> {
    try {
        const res = await fetch(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: "fit",
                messages: [{
                    role: "user",
                    content: `Job description:\n\n${jobDescription.slice(0, FIT_MAX_CHARS)}`,
                }],
            }),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(`Fit service ${res.status}: ${detail}`);
        }

        const data = await res.json();
        const text: string = data.text ?? "";
        if (!text) throw new Error("Empty response from fit service");

        try {
            return parseFit(text);
        } catch {
            // Model returned prose instead of clean JSON — degrade gracefully.
            return { verdict: 'MEDIUM', headline: 'Assessment', rationale: text, strengths: [], watchouts: [] };
        }
    } catch (error: unknown) {
        console.error("Fit Error:", error);
        return {
            verdict: 'MEDIUM',
            headline: 'Assessment unavailable',
            rationale: `Couldn't reach the assessment service (${errorMessage(error)}). Please try again in a moment.`,
            strengths: [],
            watchouts: [],
            error: true,
        };
    }
}
