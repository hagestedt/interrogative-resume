export interface Highlight {
    title: string;
    broken: string;
    fixed: string;
    lesson: string;
}

export interface Job {
    company: string;
    role: string;
    period: string;
    tags: string[];
    summary: string;
    highlights: Highlight[];
}

export const PROFILE = {
    name: "Adam Christopher Hagestedt",
    title: "VP of Product Management | AI & Agentic Systems",
    superpowers: [
        "Business + Engineering Bridge (P&L instinct + hands-on build)",
        "Ruthless Prioritization (ships by killing scope)",
        "AI Organizational Transition (Education & Rollout)",
        "Synthesis of Disparate Data (1+1=3)"
    ],
    philosophy: "The End of UI: Fixed interfaces will be replaced by context-aware, agent-generated workflows within 5 years.",
    skills: {
        strong: [
            "Business + Engineering Bridge (Gonzaga MBA + Portland State Finance + hands-on Python/FastAPI/React)",
            "Agentic AI Strategy",
            "SaaS Platform Engineering",
            "Marketplace Economics",
            "Ruthless Scope Discipline",
            "Crisis Management",
            "Synthesis"
        ],
        moderate: ["Traditional UI/UX Design", "Enterprise Ops Transition (Manual -> AI)", "Process Optimization"],
        gaps: ["B2C Product Growth (Consumer Social)", "Mobile Gaming", "Pure B2C Application Building"]
    }
};

// Top-of-page proof for a 6-second scan. Each metric is honesty-framed to match
// messaging-spine.md (Claude rollout = 500+ in a 3,000+ person org; $1.5B owned as
// Group PM; GTC demo built/launched in 2 weeks). "builtAt" lists EMPLOYERS only.
export const HEADLINE = {
    valueProp: "I lead enterprise AI implementations — and ship the production code that proves them.",
    metrics: [
        {
            stat: "0 → 500+",
            label: "active users on Claude Code",
            context: "enterprise rollout across a 3,000+ person org (~17% adoption, ~50% of engineering)",
        },
        {
            stat: "$1.5B",
            label: "profitability lift owned at Amazon",
            context: "as Group PM — read the P&L, built the ML negotiation system with engineering",
        },
        {
            stat: "2 weeks",
            label: "to demo RL environments at NVIDIA GTC",
            context: "agent-powered, live human-in-the-loop demo, externally shown at GTC — now in active RFP with multiple Mag-7 customers",
        },
    ],
    builtAt: ["Apple", "Amazon", "AWS", "Cisco", "Centific"],
};

// Frictionless contact + downloads, surfaced in the nav and footer.
export const CONTACT = {
    email: "hagestedt@gmail.com",
    resumePdf: "/Adam-Hagestedt-Resume-2026.pdf",
    linkedin: "https://www.linkedin.com/in/adam-hagestedt/",
    github: "https://github.com/hagestedt",
};

export interface SelectedWorkItem {
    title: string;
    blurb: string;
    tags: string[];
    kind: 'code' | 'outcome';
    href?: string;
    hrefLabel?: string;
}

// Proof layer: clickable shipped code + checkable outcomes. "code" items link to
// public GitHub; "outcome" items carry no link (confidential artifacts are not
// hosted here — "details on request"). Wording is honesty-framed per messaging-spine.
export const SELECTED_WORK: SelectedWorkItem[] = [
    {
        title: "This résumé is open source",
        blurb: "The site you're reading — an AI-queryable résumé. React 19 + Vite + Tailwind, with Claude wired in through a Cloudflare Worker (API key server-side, per-IP rate limited). Read the code.",
        tags: ["React 19", "Cloudflare Workers", "Claude API"],
        kind: "code",
        href: "https://github.com/hagestedt/interrogative-resume",
        hrefLabel: "View source",
    },
    {
        title: "AI Adoption Radar",
        blurb: "A clean-room, full-stack adoption-observability dashboard on public data: scraper → SQLite → FastAPI → React/D3, plus an MCP server. The same architecture as the internal tooling I build — open and inspectable.",
        tags: ["Python", "FastAPI", "D3", "MCP"],
        kind: "code",
        href: "https://github.com/hagestedt/ai-adoption-radar",
        hrefLabel: "View source",
    },
    {
        title: "First platform subscription at a Mag-7 customer",
        blurb: "Drove the go-to-market that landed Data Canvas's first-ever subscription — a one-year deal that displaced the customer's in-house annotation tooling, with their own teams adopting it for annotation and QA. Recurring-revenue proof for selling the platform, not the labor hours.",
        tags: ["GTM", "Recurring revenue", "Platform PM"],
        kind: "outcome",
    },
    {
        title: "Enterprise AI rollout — 0 → 500+ users",
        blurb: "Selected, deployed, and operationalized Claude Code across a 3,000+ person org via a product-agnostic 3-phase adoption playbook — then built the usage-observability tooling to prove ROI.",
        tags: ["AI adoption", "Change management", "Observability"],
        kind: "outcome",
    },
    {
        title: "The 3-phase enterprise AI adoption playbook",
        blurb: "The product-agnostic playbook behind the 500+ user rollout — prove it on one team, expand along the pull, then operationalize with observability and ROI telemetry. Written to port to any agent platform.",
        tags: ["AI adoption", "Change management", "Playbook"],
        kind: "outcome",
        href: "/playbook.html",
        hrefLabel: "Read the playbook",
    },
    {
        title: "RL environments, demoed at NVIDIA GTC in 2 weeks",
        blurb: "An agent-powered, industry-configurable reinforcement-learning human-in-the-loop demo any account executive can run live with zero setup — shown externally at GTC, now in active RFP with multiple Mag-7 customers.",
        tags: ["Agentic AI", "RL + HITL", "0→1"],
        kind: "outcome",
    },
    {
        title: "Replaced a ~$1M/yr platform in 1.5 weeks",
        blurb: "Killed an expensive third-party annotation tool and shipped a custom replacement decision-to-production in 1.5 weeks — by cutting every non-essential feature, with zero downtime on live projects.",
        tags: ["Build-vs-buy", "Ruthless scope", "Shipping speed"],
        kind: "outcome",
    },
    {
        title: "$1.5B profitability platform at Amazon",
        blurb: "As Group PM, read the P&L unit economics and designed the ML negotiation system that automated 6,000+ long-tail vendors — making un-negotiable segments profitable and killing the ones that didn't pay back.",
        tags: ["P&L", "ML systems", "Scale"],
        kind: "outcome",
    },
];

export const JOBS: Job[] = [
    {
        company: "Centific",
        role: "Senior Director → VP, Product Management",
        period: "2025–Present",
        tags: ["Innovation", "Culture Change", "AI", "Scale"],
        summary: "Function leader for 6 AI product lines across a 3,000+ person company. Direct: 4 SE team leads + ~12 pre-sales/SE ICs; geo-led teams across US, India, China, Singapore, EU.",
        highlights: [
            {
                title: "Claude Code Enterprise — 500+ active users in 3,000+ person org",
                broken: "AI adoption efforts typically stall at proof-of-concept; tools get deployed but never reach scale because there's no playbook for going from license to behavior change.",
                fixed: "Selected, deployed, and operationalized Claude Code across Centific. 500+ active users today (~17% adoption, ~50% engineering penetration) via a 3-phase adoption framework that ports to ChatGPT/Codex/any agent platform.",
                lesson: "Prove the model on your own team first, then make adoption frictionless. Evangelism without proof doesn't scale."
            },
            {
                title: "Data Canvas — Decision to Production in 1.5 Weeks",
                broken: "Reliance on expensive ($1M/yr) 3rd-party annotation software and slow UI dev cycles.",
                fixed: "Killed every non-essential feature and shipped 'Data Canvas' end-to-end in 1.5 weeks via VibeCoding. Established internal agents that generate UIs on-the-fly.",
                lesson: "Shipping speed is a function of what you're willing to cut, not what you're willing to build."
            },
            {
                title: "First Platform Subscription at a Mag-7 Customer",
                broken: "Platform value was priced as labor hours — delivery revenue with no recurring platform line, while the customer ran its own in-house annotation tooling.",
                fixed: "Drove the go-to-market motion that landed Data Canvas's first-ever subscription — a one-year deal that displaced the customer's in-house tooling and put their own teams onto the platform for annotation and QA.",
                lesson: "The strongest proof of a platform thesis is a customer paying for the platform itself — not the hours behind it."
            },
            {
                title: "Anti-Fraud Architecture — Killed the 21-Week Vendor Path",
                broken: "Stalled 21-week vendor VDI negotiation for annotation-workforce anti-fraud — 7+ months in, no agreement, no native clipboard control.",
                fixed: "Authored in-house Chromium-based secure workspace architecture. Phase 1 (copy/paste blocking + analytics) in 6 weeks vs vendor's 21. Evaluated Appen, TELUS, Scale AI, Island.io, Palo Alto Prisma. Killed the vendor path.",
                lesson: "Sunk cost is the cheapest expense if cutting it unlocks a 4x faster path."
            },
            {
                title: "Six Product Lines, One Operator",
                broken: "VP-level portfolio scope dropped on a Senior Director seat; the easy move would have been backfilling departing PMs.",
                fixed: "Absorbed AIDF Platform, Data Canvas, Data Marketplace, One Data, RL Environments-as-a-Service, and OneForma. Downsized PM team through AI automation instead of backfilling. Now VP of Product Management; function leader for geo-led teams across US, India, China, Singapore, EU.",
                lesson: "Headcount is the lazy answer. Automation + ruthless prioritization is the leveraged one."
            },
            {
                title: "Centific Pulse — End-to-End Solo Build",
                broken: "No internal observability for Claude adoption across the org; BI tool would have cost time and licenses.",
                fixed: "Built Pulse solo: scraper → SQLite → FastAPI → React/D3. Internal dashboard for Claude usage across 3,000+ people. No BI dependency, no infrastructure, no license cost.",
                lesson: "A leader who codes ships proof artifacts faster than they can write the spec for someone else to build."
            },
            {
                title: "Agentic-by-Default Ops",
                broken: "Teams were stuck in low-velocity meetings and manual document creation.",
                fixed: "Pioneered internal workflows where agents generate UIs and documents on-the-fly. Built M365 AI Analyst Agent (auto-generated weekly status reports), UX Info Architect Skill for Claude, 'AI for Business Operations' training curriculum, and co-authored the Claude→Jira auto-comment pipeline with an engineering lead.",
                lesson: "Operational empathy means giving people back their time via automation."
            }
        ]
    },
    {
        company: "AWS (Salesforce Success Central)",
        role: "Group PM",
        period: "2023–2024",
        tags: ["Crisis Management", "Security"],
        summary: "Enterprise Buy vs. Build Strategy & Secure AI.",
        highlights: [
            {
                title: "Buy vs. Build Strategy",
                broken: "Internal 'Not Invented Here' culture blocking necessary SaaS adoption of Salesforce.",
                fixed: "Managed pivot to Salesforce while influencing their Einstein AI roadmap to meet Amazon's security standards.",
                lesson: "Operational empathy is required to navigate dogmatic engineering cultures."
            },
            {
                title: "Secure AI (Einstein)",
                broken: "Salesforce's AI roadmap did not meet Amazon's rigorous AppSec/Privacy standards.",
                fixed: "Influenced Salesforce's roadmap to align with Amazon's security posture, enabling enterprise-wide adoption.",
                lesson: "Security is the gateway to Enterprise AI adoption."
            },
            {
                title: "Cultural Transformation",
                broken: "Engineering friction between internal tool teams and external vendor advocates.",
                fixed: "Bridged the gap by demonstrating how external tools allowed engineers to focus on core differentiators.",
                lesson: "Engineers want to build cool stuff, not maintain utility plumbing."
            }
        ]
    },
    {
        company: "Cisco",
        role: "Senior Director, CX SaaS",
        period: "2021–2022",
        tags: ["Customer-Facing", "Culture Change", "Scale"],
        summary: "On-Prem to Cloud customer migrations across the WebEx ecosystem — customer-facing through and through.",
        highlights: [
            {
                title: "WebEx 'Better Together' — Customer Migrations",
                broken: "Disjointed customer contact tools slowing operational velocity; Cisco enterprise customers stuck on-prem while AWS gained share.",
                fixed: "Owned customer-facing on-prem-to-cloud migration of the WebEx contact center ecosystem ('Better Together'). Sat across the table from enterprise customers, understood their needs, and made them comfortable with the move. Drove 30–40% velocity gains through cross-team dependency planning.",
                lesson: "Customers don't want products; they want 'Journey as a Service' — and someone trustworthy on the other side of the table."
            },
            {
                title: "Journey-as-a-Service — Customer-Side AI",
                broken: "Reactive customer service based on tickets rather than intent. Cisco was trusted but seen as non-innovative; needed a differentiator beyond 'reliability.'",
                fixed: "Built AI-driven digital footprint tracking for proactive contact avoidance — directly with enterprise contact center customers. Integrated the IMI pre-contact platform as a unique value prop competitors couldn't match.",
                lesson: "The best customer service interaction is the one that never happens."
            },
            {
                title: "Chief of Staff Synthesis — Across Senior Directors & VPs",
                broken: "Executive decision making slowed by disparate data points across the WebEx org; GM bandwidth-constrained.",
                fixed: "Acted as strategic right-hand to the GM, taking first-round decisions, coordinating across senior directors and VPs, and owning key customer relationships when GM bandwidth was limited.",
                lesson: "Synthesis is a superpower in large organizations — turning many sources into one decision."
            }
        ]
    },
    {
        company: "AWS (Amazon Connect)",
        role: "Group PM, Analytics & AI",
        period: "2019–2021",
        tags: ["Customer-Facing", "Scale", "Innovation"],
        summary: "Global Scale SaaS & AI Operations, with Fortune 500 deal closing.",
        highlights: [
            {
                title: "The Math Engine",
                broken: "Rigid analytics prevented customers from defining their own success metrics.",
                fixed: "Architected an event-based analytics platform allowing customers to define custom multi-modal metrics across voice, chat, and video.",
                lesson: "Empower users to define their own success."
            },
            {
                title: "Contact Lens (AI)",
                broken: "Supervisors relied on random sampling to check call quality (listening to 1% of calls).",
                fixed: "Launched Contact Lens for real-time sentiment analysis and manager 'nudges' on 100% of calls.",
                lesson: "Real-time AI 'nudges' are more valuable than post-mortem dashboards."
            },
            {
                title: "High-Stakes Closing — Fortune 500 Customer-Facing",
                broken: "Top-tier enterprise accounts blocked by specific feature gaps; pre-sales engineering capacity was the rate limiter.",
                fixed: "Ran pre-sales engineering myself and managed critical customer escalations to close Fortune 500 deals.",
                lesson: "Product managers must be able to sell what they build."
            }
        ]
    },
    {
        company: "Amazon (APM)",
        role: "Group PM",
        period: "2015–2019",
        tags: ["Scale", "Automation"],
        summary: "Algorithmic Negotiation & Profitability — read P&L, wrote the algorithmic logic, killed unprofitable long-tail.",
        highlights: [
            {
                title: "$1.5B Profitability Lift — P&L Read Plus ML Build",
                broken: "Thousands of long-tail vendors were unprofitable and impossible to negotiate with manually.",
                fixed: "Read the P&L unit economics, designed the ML system with engineering, and killed long-tail vendor segments that didn't pay back the modeling cost. Automated negotiations for 6,000+ vendors using ML-driven attribute mapping and virtual vendor benchmarking.",
                lesson: "If you can define the variables, machines can handle the negotiation — and the operator who can read both the P&L and the model gets to decide what's worth automating."
            },
            {
                title: "C.R.a.P. Mitigation",
                broken: "Unprofitable items (Can't Realize a Profit) were clogging the fulfillment network.",
                fixed: "Automated identification and 'Ships in Own Container' (SIOC) fixes.",
                lesson: "Profitability at scale requires algorithmic enforcement, not manual review."
            },
            {
                title: "Hands Off the Wheel",
                broken: "Vendor managers spending 80% of time on low-value negotiations.",
                fixed: "Transitioned to 'Hands Off the Wheel' operations, letting humans focus on strategy.",
                lesson: "Automation frees humans to do human work."
            }
        ]
    },
    {
        company: "Apple",
        role: "Global Supply Manager",
        period: "2014–2015",
        tags: ["Crisis Management", "Hardware"],
        summary: "Hardware Supply Chain & Global Logistics — supply chain as financial engineering.",
        highlights: [
            {
                title: "Brazil Tax Strategy — Killed the Import Path",
                broken: "Import taxes in Brazil threatened product margins for lightning cables.",
                fixed: "Launched a local Brazil manufacturing line specifically to optimize tax strategy. Killed the import path entirely as part of the broader iPhone Brazil-manufacture strategy.",
                lesson: "Supply chain strategy is financial engineering."
            },
            {
                title: "Apple Watch Launch",
                broken: "Retail displays for the original Watch required complex tech integration.",
                fixed: "Led rapid prototyping and production of tech-integrated retail displays.",
                lesson: "Hardware deadlines are immutable; move mountains to hit the date."
            },
            {
                title: "Global Logistics",
                broken: "Component shortages threatening production lines.",
                fixed: "Managed global supply logistics to ensure 100% uptime for manufacturing.",
                lesson: "Redundancy is expensive, but downtime is fatal."
            }
        ]
    },
    {
        company: "Amazon Supply",
        role: "Category Leader",
        period: "2011–2014",
        tags: ["Customer-Facing", "B2B", "Scale"],
        summary: "Standing up the B2B flywheel — industrial vendor management and pioneering 'Vendor-as-Carrier' logistics.",
        highlights: [
            {
                title: "200% YoY Growth in Industrial Categories",
                broken: "Amazon's B2C model didn't fit industrial B2B buyers; Safety and Material Handling categories were stalled.",
                fixed: "Scaled Safety and Material Handling categories to 200% YoY growth, outpacing established consumer categories during Amazon Supply's standup (precursor to Amazon Business).",
                lesson: "B2B customers buy differently — meet them where they are, not where the consumer flywheel is comfortable."
            },
            {
                title: "Vendor-as-Carrier Logistics",
                broken: "Heavy machinery (e.g., Genie Terex light towers) couldn't ship via standard LTL — invariably damaged in transit.",
                fixed: "Pioneered 'Vendor-as-Carrier' model where the vendor handled delivery and onsite customer training. Transformed Amazon from a shipper into a service orchestrator.",
                lesson: "When the standard flywheel breaks the customer experience, redesign the flywheel — don't apologize for it."
            },
            {
                title: "Shadow Data Lake — Scaled to 6,000+ Vendor Managers",
                broken: "Vendor managers had no self-serve data access; legacy Oracle reporting required complex SQL no one could write.",
                fixed: "Built scoped MySQL databases with Excel integration, letting 6,000+ VMs globally pull pre-calculated data via 'SELECT *'. Started as a 2-category side project; scaled global; eventually forced the central infrastructure migration off Oracle.",
                lesson: "The best internal product is the one that forces the central team to take it over."
            }
        ]
    }
];
