import { JOBS } from '../data';

// The Anthropic API key is no longer stored in the browser. It lives as a secret
// on the Cloudflare Worker (see /worker/index.ts), which calls Claude Sonnet
// server-side. The client only talks to that Worker via CHAT_ENDPOINT.
//
// The Worker runs on its own Cloudflare custom domain (api.hagestedt.com) so the
// GitHub Pages apex stays untouched; CORS is handled in the Worker.
const CHAT_ENDPOINT = "https://api.hagestedt.com/chat";

// Hardcoded context from the reference files we read
const BRIEF_CONTEXT = `
# Professional Biography & Knowledge Base: Adam Christopher Hagestedt

## Executive Summary
Strategic product and engineering leader specializing in AI data platforms, marketplaces, and agentic systems. Proven track record of engineering massive scale automation at Amazon, managing high-stakes hardware supply chains at Apple, and leading SaaS/AI transformations at Cisco and Centific.

## Employment History

### Centific (2025–Present)
**Role:** VP of Product Management (joined as Senior Director, Apr 2025; promoted to VP, 2026)
**Focus:** AI Data Marketplace, AIDF Platform Strategy, Agentic-by-Default Operations.
* **VibeCoding & Rapid Prototyping:** Replaced $1M/year third-party annotation software with a custom build (Data Canvas) developed in 1.5 weeks using vibe coding.
* **Agentic-by-Default Operating Model:** Pioneered internal workflows where agents generate UIs and documents on-the-fly. Established "No-Meeting Fridays" for team upskilling.
* **Physical AI Strategy:** Leading the move into robotics labs and sensor fusion data collection.
* **The Trust Framework:** Established the "Human-in-the-Loop" vs. "Human-on-the-Loop" matrix.

### AWS (2023–2024)
**Role:** Group PM, Salesforce Success Central
**Focus:** Enterprise Buy vs. Build Strategy & Secure AI.
* **Strategic Migration:** Managed pivot to Salesforce ensuring 100% AppSec compliance.
* **Secure AI:** Influenced Salesforce’s Einstein AI roadmap to meet Amazon's security standards.

### Cisco (2021–2022)
**Role:** Senior Director, CX SaaS & Chief of Staff
**Focus:** On-Prem to Cloud Transformation.
* **SaaS Transition:** Integrated contact center features across WebEx ecosystem.
* **Customer Journey as a Service:** Built AI-driven digital footprint tracking.
* **Chief of Staff:** Acted as strategic right-hand to GM.

### AWS (2019–2021)
**Role:** Group PM, Analytics & AI (Amazon Connect)
**Focus:** Global Scale SaaS & AI Operations.
* **The Math Engine:** Architected event-based analytics platform.
* **AI Products:** Launched Contact Lens for real-time sentiment analysis.
* **High-Stakes Closer:** Managed critical customer escalations.

### Amazon (2015–2019)
**Role:** Group PM, Automated Profitability Management (APM)
**Focus:** Algorithmic Negotiation.
* **$1.5B Profitability Lift:** Automated negotiations for 6,000+ vendors.
* **C.R.a.P. Mitigation:** Automated identification of unprofitable items.

### Apple (2014–2015)
**Role:** Global Supply Manager
**Focus:** Hardware Supply Chain.
* **Global Tax Strategy:** Launched Brazil manufacturing line.
* **Apple Watch Launch:** Led retail display prototyping.

### Amazon (2011–2014)
**Role:** Category Leader, Amazon Supply
**Focus:** B2B Flywheels.
* **Hyper-Growth:** Scaled industrial categories 200% YoY.
* **Pioneering Logistics:** Engineered "Vendor-as-Carrier" models.

## Core Competencies
* **Synthesis of Disparate Data:** Ability to take non-linear information and identify 1+1=3 opportunities.
* **Operational Empathy:** Bridging gap between engineering and business.
* **Framework Design:** Building templates and operating models.

## Technical Frameworks
* **AI Deployment:** Deterministic for 100% accuracy, Agentic for 90% with oversight.
* **The End of UI:** Fixed interfaces will be replaced by agent-generated workflows.
`;

const INTERVIEW_CONTEXT = `
# Interview Questions & Answers Knowledge Base

## General / Strategy
**Q: What is your core philosophy on Product Management?**
A: "The End of UI", "Operational Empathy", and "Synthesis of Disparate Data".

**Q: How do you decide between deterministic automation and AI agents?**
A: Framework: Deterministic for 100% accuracy, Agentic for 90% accuracy (Human-in-the-Loop/Human-on-the-Loop).

## Specific Stories
**Centific:** Replaced $1M vendor tool with "Data Canvas" in 1.5 weeks using VibeCoding. Agentic-by-Default model with "No-Meeting Fridays". Focus on Physical AI/Sensor Fusion.
**AWS (Salesforce):** Bridged "Build vs Buy" culture gap. Built security middleware for Salesforce.
**Cisco:** Driven velocity via Product Ops. "Better Together" bundling.
**AWS (Connect):** "The Math Engine" for decoupled analytics. "Traffic Control" routing logic to prevent agent burnout.
**Amazon (APM):** "Virtual Vendor" benchmarking for automated negotiations ($1.5B lift). "Win-Win" logic for payment terms.
**Apple:** Onsite factory optimization for haptic buttons. Rapid prototyping for Apple Watch tables.
**Amazon (Supply):** "Tree Analysis" for ML trust. "Vendor-as-Carrier" for heavy equipment.
`;

function formatJobData(): string {
    return JOBS.map(job => `
Role: ${job.role} at ${job.company} (${job.period})
Summary: ${job.summary}
Key Highlights:
${job.highlights.map(h => `- ${h.title}: broken="${h.broken}", fixed="${h.fixed}", lesson="${h.lesson}"`).join('\n')}
    `).join('\n\n');
}

export const GENERATED_SYSTEM_PROMPT = `
You are an AI assistant representing Adam Hagestedt. Your goal is to answer questions about Adam's professional background, skills, and philosophy.
You have access to a rich context of his employment history, specific achievements ("broken/fixed/lesson" framework), and interview Q&A.

**Core Instructions:**
1.  **Identity:** You are helpful, professional, and agentic. You speak as an expert on Adam's background.
2.  **Context Usage:** STRICTLY use the provided context. If a question is not answered by the context, politely state that you are focused on Adam's professional background and don't have that specific information.
3.  **Keywords:** Pay special attention to explaining these concepts if asked:
    - "Synthesis of Disparate Data"
    - "Operational Empathy"
    - "AI Organization & Transition"
    - "Framework Design"
    - "The End of UI"
4.  **Tone:** Confident, strategic, yet accessible. Adam bridges the gap between technical engineering and business operations.
5.  **Privacy:** Do not reveal personal contact info (email/phone) unless explicitly in the context (which it isn't).

**Context Data:**
${BRIEF_CONTEXT}

${INTERVIEW_CONTEXT}

**Deep Dive Experience Data:**
${formatJobData()}
`;

export async function askClaude(metadata: any, userQuery: string, history: any[] = []) {
    try {
        // If metadata is provided (e.g. from a specific job card), prepend it for focus.
        let finalQuery = userQuery;
        if (metadata && metadata.role) {
            finalQuery = `[Context: User is asking from the "${metadata.role} at ${metadata.company}" card]. ${userQuery}`;
        }

        // history is already in Anthropic shape: { role: 'user' | 'assistant', content: string }
        const messages = [...history, { role: "user", content: finalQuery }];

        const res = await fetch(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ system: GENERATED_SYSTEM_PROMPT, messages }),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(`Chat service ${res.status}: ${detail}`);
        }

        const data = await res.json();
        return { text: data.text ?? "", error: false };
    } catch (error: any) {
        console.error("Chat Error:", error);
        return {
            text: `AI Error: ${error.message || "Unknown error occurred"}. (Please check the chat service and your connection.)`,
            error: true,
        };
    }
}

// ---------------------------------------------------------------------------
// Fit Assessment — a REAL Claude call (same Worker, same context) that scores a
// pasted job description against Adam's background. Replaces the old client-side
// keyword matcher. Returns structured JSON the UI renders directly.
// ---------------------------------------------------------------------------

export interface FitResult {
    verdict: 'HIGH' | 'MEDIUM' | 'LOW';
    headline: string;
    rationale: string;
    strengths: string[];
    watchouts: string[];
    error?: boolean;
}

const FIT_SYSTEM_PROMPT = `
You are an honest fit-assessment engine. Evaluate whether the pasted job description is a strong match for Adam Hagestedt, using ONLY the context below.

Scoring:
- HIGH: the role's core responsibilities map directly onto Adam's demonstrated experience (AI/data platforms, agentic systems, marketplace economics, large-scale automation, enterprise product/engineering leadership).
- MEDIUM: meaningful overlap but notable gaps or a materially different domain.
- LOW: the role centers on areas outside Adam's background (e.g., pure B2C consumer-social growth, mobile gaming, pure UI maintenance, or junior/IC-only scope).

Be honest. Do NOT force a HIGH. If it is a weak fit, say LOW and explain why.

Respond with ONLY a JSON object — no markdown fences, no preamble:
{
  "verdict": "HIGH" | "MEDIUM" | "LOW",
  "headline": "<= 10 words summarizing the match",
  "rationale": "2-3 sentences, first person as Adam, grounded in the context",
  "strengths": ["2-4 short phrases mapping Adam's real experience to this role"],
  "watchouts": ["0-2 short, honest gaps or open questions; empty array if none"]
}
Keep the entire response under 160 words. Use only facts from the context; never invent experience.

**Context Data:**
${BRIEF_CONTEXT}

${INTERVIEW_CONTEXT}

**Deep Dive Experience Data:**
${formatJobData()}
`;

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
                system: FIT_SYSTEM_PROMPT,
                messages: [{ role: "user", content: `Job description:\n\n${jobDescription}` }],
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
    } catch (error: any) {
        console.error("Fit Error:", error);
        return {
            verdict: 'MEDIUM',
            headline: 'Assessment unavailable',
            rationale: `Couldn't reach the assessment service (${error.message || "unknown error"}). Please try again in a moment.`,
            strengths: [],
            watchouts: [],
            error: true,
        };
    }
}
