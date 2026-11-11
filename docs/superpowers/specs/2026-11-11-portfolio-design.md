# Portfolio Website Design

**Date**: 2026-11-11  
**Author**: Gerald B. Aton  
**Status**: Draft — awaiting approval

---

## Intent & Why

Build a static portfolio site that positions Gerald as a **Trust & Safety / Operations consultant** for early-stage startups, with **AI automation (SQAC)** as a technical differentiator. The site should generate inbound consulting inquiries by demonstrating depth in content moderation, QA, and support operations — while signaling ability to build custom AI tooling when needed.

**Why now**: 8 years of operational experience (Tech Mahindra, ECE, Wipro, etc.) + self-directed AI projects (SQAC, Pyralis, Wizky) create a rare combination: someone who knows the *problems* firsthand and can build the *tools* to solve them.

---

## Goals

- **Primary**: Convert visitors into discovery calls for consulting engagements
- **Secondary**: Establish credibility in Trust & Safety / content moderation / QA operations
- **Tertiary**: Showcase SQAC as proof of technical depth (AI memory systems)
- **Future-proof**: Easy to add blog, case studies, interactive demos later

## Non-Goals

- No complex backend, auth, or database
- No job board or application flow
- No client portal or project management features
- Not a personal blog (yet) — content section links out to GitHub/LinkedIn

## Anti-Goals

- ❌ "AI engineer" branding that overshadows T&S operations expertise
- ❌ Generic "full-stack developer" portfolio template
- ❌ Over-designed, slow, or JavaScript-heavy experience
- ❌ Unclear service offering — visitors must understand *what you sell* in 5 seconds

---

## Constraints

| Constraint | Detail |
|------------|--------|
| **Stack** | Astro + Tailwind CSS (decided) |
| **Deploy** | Vercel (free `*.vercel.app` subdomain) |
| **Content source** | Markdown/MDX files in repo (no CMS) |
| **Timeline** | MVP in 1-2 weeks; iterate after launch |
| **Maintenance** | Zero ongoing cost; content updates via git |
| **Accessibility** | WCAG AA baseline (semantic HTML, contrast, focus states) |
| **Performance** | Lighthouse 90+ on all pages |

---

## Approaches Considered

| Approach | Trade-offs | Decision |
|----------|------------|----------|
| **Astro + Tailwind** | ✅ Content-first, MDX native, island architecture for demos, fast builds, easy blog later | **Selected** |
| Next.js (App Router) + Tailwind | ✅ React ecosystem, familiar<br>❌ Heavier, overkill for content site, hydration by default | Rejected |
| Hugo + Tailwind | ✅ Fastest builds<br>❌ Go templates, harder to add React components for interactive demos later | Rejected |

**Why Astro**: Purpose-built for content-rich static sites. MDX lets us write project pages (SQAC, Pyralis, Wizky) with embedded components. Island architecture means we can drop in a live SQAC playground or model card viewer later without rewriting. Tailwind gives design system consistency with minimal CSS.

---

## Design System (from Photo)

### Color Palette

Extracted from `Modern Dark Studio Portrait.png`:

| Role | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Background (dark)** | `#1A1A24` | 26, 26, 36 | Page background, card backgrounds |
| **Background (elevated)** | `#1E1E2E` | 30, 30, 46 | Cards, nav bar, footer |
| **Border** | `#2D2D3E` | 45, 45, 62 | Dividers, input borders |
| **Text (primary)** | `#E8E8ED` | 232, 232, 237 | Headings, body text |
| **Text (muted)** | `#8B8BA3` | 139, 139, 163 | Secondary text, timestamps |
| **Accent (primary)** | `#1F4A9A` | 31, 74, 154 | Primary CTAs, links, focus rings |
| **Accent (hover)** | `#2D6BCE` | 45, 107, 206 | Hover states |
| **Accent (light)** | `#3A7BD8` | 58, 123, 216 | Focus rings, subtle backgrounds |
| **Success** | `#2E7D32` | 46, 125, 50 | Success states |
| **Warning** | `#F57F17` | 245, 127, 23 | Warning states |

### Typography

- **Font stack**: System UI (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — zero font loading, instant render
- **Monospace**: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`
- **Scale**: Tailwind default (base 1rem = 16px)

### Dark Mode Only

The portfolio is dark-mode only (matches photo aesthetic). No light mode toggle needed — reduces complexity, stays on-brand.

---

## Site Architecture

### Pages (MVP)

| Route | Purpose | Content Source |
|-------|---------|----------------|
| `/` | Landing — hero, services preview, featured project (SQAC), trust signals | `src/content/pages/index.mdx` |
| `/services` | Consulting offerings with scope, outcomes, engagement models | `src/content/pages/services.mdx` |
| `/projects` | Index of all projects (SQAC featured, others as cards) | `src/content/projects/*.mdx` |
| `/projects/sqac` | Deep-dive: problem, architecture, results, demo link, repo | `src/content/projects/sqac.mdx` |
| `/projects/pyralis` | Project page | `src/content/projects/pyralis.mdx` |
| `/projects/wizky` | Project page | `src/content/projects/wizky.mdx` |
| `/about` | Narrative bio, timeline, certifications, values | `src/content/pages/about.mdx` |
| `/contact` | Simple form (Vercel Forms/Formspree) + links | `src/content/pages/contact.mdx` |

### Content Collections

- **`projects`** — frontmatter: `title, description, stack, featured, github, demo, tags, startDate, endDate`
- **`pages`** — generic MDX for static pages

### Components

| Component | Purpose |
|-----------|---------|
| `Header` / `Footer` | Navigation, social links (GitHub, LinkedIn, Email) |
| `Hero` | Landing headline, subhead, CTA, featured project teaser |
| `ServiceCard` | Reusable card for `/services` grid |
| `ProjectCard` | Reusable card for `/projects` index |
| `ProjectHero` | Project page header with badges, links, stats |
| `Timeline` | Vertical timeline for `/about` experience |
| `Portrait` | Photo display with accent border glow |
| `SEO` | Meta tags, Open Graph, JSON-LD structured data |

---

## Page Content (from Resume + SQAC Repo)

### `/` — Landing Page

**Hero**
```
Headline: Trust & Safety Operations + AI Automation for Early-Stage Startups
Subhead: 8 years scaling content moderation, QA, and US customer support. I build the tooling your team wishes existed — like SQAC, a portable memory layer for LLMs.
CTA Primary: "Book a Discovery Call" → /contact
CTA Secondary: "View SQAC Project" → /projects/sqac
```

**Trust Signals Bar** (below hero)
- 8 years T&S / Support operations
- 100% site quality score (Wipro knowledge base)
- 20% productivity gain (automation project)
- 115% TPH target (ECE fintech support)
- 95% CSAT / 50% NPS (T-Mobile)

**Featured Project: SQAC**
- Card with logo, one-liner, "Portable memory layer for LLMs — hyperdimensional, file-based, zero training"
- Links: GitHub → `github.com/sensesVoid/sqac` | PyPI → `pip install sqac` | Live Demo (if available)

**Services Preview** (3 cards linking to `/services`)
1. **Trust & Safety Foundations** — Policy frameworks, moderation pipelines, QA programs from scratch
2. **Support Operations & QA** — Fintech/consumer support scaling, productivity optimization, CSAT improvement
3. **AI Automation & Tooling** — Custom agent harnesses, SQAC integration, local-first LLM tooling

**Availability Badge**: "Available for consulting" (green accent pill) in hero

**Footer**: Email, LinkedIn, GitHub, `© 2026 Gerald B. Aton`

---

### `/services` — Consulting Offerings

**Page Header**: "How I Help Early-Stage Startups"

**Service Cards** (expandable details on click or dedicated sections)

| Service | Target | Scope | Outcomes |
|---------|--------|-------|----------|
| **Trust & Safety Foundations** | Pre-seed → Series A | Policy framework design, moderation workflow setup, reviewer QA calibration, escalation paths, tooling selection | Launch-ready T&S ops in 4-6 weeks; measurable quality baseline |
| **Support Operations & QA** | Seed → Series B | Queue design, SLA/SLO definition, QA scorecards, coaching programs, productivity tooling, fintech/telecom domain expertise | 15-30% TPH improvement; CSAT >90%; reduced escalation rate |
| **AI Automation & Tooling** | Any stage | Custom agent workflows (OpenCode, Claude Code, Hermes), SQAC memory integration, local LLM deployment (llama.cpp/GGUF), RAG vs. memory architecture decisions | 50-90% context cost reduction; portable knowledge across models |
| **Fractional QA Lead** | Early-stage | Embedded QA leadership: hiring, calibration, process design, tooling, reporting | Self-sustaining QA function; knowledge transfer to internal hire |

**Engagement Models**
- **Discovery** (free, 30 min) → Scope → **Project** (fixed scope, 4-8 weeks) or **Retainer** (ongoing, monthly)
- Rates: discussed after discovery

---

### `/projects` — Project Index

**Featured: SQAC** (large card, spans 2 columns)
- Title: **SQAC — Symbolic Query Addressable Cartridge**
- Tagline: "Give your LLM a memory it can carry in a file."
- Stack: Python, NumPy, Rust (SIMD), Hyperdimensional Computing (VSA)
- Links: [GitHub](https://github.com/sensesVoid/sqac) • [PyPI](https://libraries.io/pypi/sqac) • [Docs](https://github.com/sensesVoid/sqac#readme)
- Badges: `v0.1.10` • `307 tests passing` • `BSL-1.1 License`

**Other Projects** (link cards pointing to GitHub profile)
- All public work lives at **[github.com/sensesVoid](https://github.com/sensesVoid)** — includes Pyralis (sub-1B LLM), Wizky CLI (Rust + llama.cpp), agent harness workflows, and research repos.

---

### `/projects/sqac` — Deep Dive

**Hero**
- Title: SQAC — Symbolic Query Addressable Cartridge
- Subtitle: Portable, file-based LLM memory on hyperdimensional computing (HDC/VSA). One `.sqac` file. Any LLM. Facts and skills that persist, survive restarts, and swap in milliseconds — no retraining, no database, no GPU.
- Badges: `Python` `Rust` `NumPy` `HDC/VSA` `MCP` `HTTP API` `CLI`
- Links: [GitHub](https://github.com/sensesVoid/sqac) • `pip install sqac` • [PyPI](https://libraries.io/pypi/sqac)

**Try It Yourself**
```bash
# Install
pip install sqac                    # core: numpy only
pip install sqac[mcp]               # + MCP server for Claude Code, OpenCode, etc.
pip install sqac[server]            # + HTTP API server
pip install sqac[simd]              # + Rust SIMD (261x faster fuzzy search)
pip install sqac[all]               # everything

# Auto-build memory from your project
sqac init .

# Search your knowledge
sqac search "deployment target"

# Track changes in real-time
sqac track . --interval 5 --rack .rack
```
> SQAC runs as an MCP server — connect it to Claude Code, OpenCode, Cursor, Zed, or any MCP-compatible client for cross-session memory that follows you across tools.

**Problem**
> Every token you put into an LLM's context costs GPU memory. A 1M-token conversation with Llama-3.1-8B needs ~125,000 MiB of KV cache. Stuffing your entire memory into the context window is the "5M-token fantasy."
>
> SQAC recalls only the top-k relevant exchanges (~135 tokens) at ~0.1ms, reducing KV cache to ~16.9 MiB — a **1,000× (99.9%) reduction**. Your memory stays constant-cost regardless of how much you've stored.

**Core Concepts** (icon grid)
1. **Cartridge** — Single `.sqac` file, plaintext payloads, binary 1024-bit hyperdimensional addresses (XOR + popcount), zero training, hot-swappable
2. **Four Knowledge Kinds** — Facts (what to know), Skills (how to think), Docs (reference), Turns (conversation memory)
3. **Three-Tier Retrieval** — Exact (5μs), Lexical (trigram, 21ms @ 10K), Semantic (paraphrase, ~0.1ms via int8 model)
4. **Thought Injection** — Skill cards with pinned operators → external evaluation → **57% → 95% accuracy** on unit conversion (7B model)

**Key Results**
- 307/307 tests passing
- 261× faster fuzzy search via Rust SIMD (AVX2/NEON)
- 25K entries = 13ms search, 132MB RSS, 12MB disk
- MCP server for cross-CLI continuity (OpenCode, Claude Code, Codex, Cursor, Zed)
- HTTP API server (FastAPI) with auth, rack management, session offloader
- 3D hyperdimensional graph visualization (Three.js)

**Use Cases** (tabs or accordion)
- Team knowledge base
- Skill injection for small models
- Session memory / context offloading
- Project auto-build (`sqac init .` + `sqac track .`)
- Compliance & audit
- Incident playbooks
- Customer support knowledge
- Edge / air-gapped deployment

**Architecture Diagram** (placeholder for Mermaid/Excalidraw)

**Install & Quick Start**
```bash
pip install sqac                    # core: numpy only
pip install sqac[mcp]               # + MCP server
pip install sqac[server]            # + HTTP API server
pip install sqac[simd]              # + Rust SIMD (261x faster)
pip install sqac[all]               # everything

# Auto-build from project
sqac init .
sqac search "deployment target"
sqac track . --interval 5 --rack .rack
```

**License**: BSL-1.1 → Apache 2.0 after Sep 7, 2030

---

### `/projects/pyralis` — Project Page

**Hero**
- Title: Pyralis
- Subtitle: Open-source sub-1B-parameter language model, trained on Kaggle T4 GPUs, deployed in GGUF format.
- Stack: Python, PyTorch, Kaggle, GGUF, llama.cpp
- Status: Research / Experimental
- Link: [github.com/sensesVoid](https://github.com/sensesVoid)

**Sections**: Motivation, Training Setup, Model Card, Quantization, Deployment, Lessons Learned

---

### `/projects/wizky` — Project Page

**Hero**
- Title: Wizky CLI
- Subtitle: Offline-first local AI coding assistant written in Rust with llama.cpp FFI.
- Stack: Rust, llama.cpp, FFI, CLI
- Status: Active Development
- Link: [github.com/sensesVoid](https://github.com/sensesVoid)

**Sections**: Motivation, Architecture, FFI Integration, Current Capabilities, Roadmap

---

### `/about` — Narrative Bio

**Portrait Section** (left/right split on desktop, stacked on mobile)
- Photo: `Modern Dark Studio Portrait.png` — **circle crop** with subtle accent glow border (`box-shadow: 0 0 24px 4px rgba(31, 74, 154, 0.4)`)
- Name: Gerald B. Aton
- Location: Pasay City, Philippines
- Tagline: Content Moderation • US Customer Support • AI Agent & Automation Tooling

**Professional Summary** (from resume)
> Content moderator, quality analyst and customer support professional with 8 years of experience in policy enforcement, US customer support, fintech, telecom and consumer technology. Proven results in quality, productivity and customer satisfaction, including a 20% productivity gain from an automation project and a policy knowledge base that earned a 100% site quality score. Self-directed AI builder, hands-on with AI agent harnesses, coding CLIs and local LLM tooling.

**Timeline** (vertical, reverse chronological)

| Period | Role | Company | Highlights |
|--------|------|---------|------------|
| Sep 2025 – Present | Content Moderator | Tech Mahindra Philippines | Major social platform, US-focused moderation |
| Nov 2023 – Mar 2025 | Email & Text FinTech Support | ECE Philippines | Albert app, 115% TPH, 65% CSAT, 78% quality |
| Aug 2023 – Oct 2023 | Customer Service Rep | Eperformax Philippines | T-Mobile, 95% CSAT, 50% NPS, <20 min AHT |
| 2 years | Quality Analyst | Wipro BPO Philippines | Policy evaluation, **knowledge base → 100% site quality** |
| Apr 2019 – Aug 2023 | Digital Content Specialist | Wipro BPO Philippines | Content review, **automation → 20% productivity gain** |
| Mar–Apr 2019 | Customer Service Rep (Seasonal) | Harte Hanks Philippines | WWE ticket orders, refunds |
| Jul–Nov 2018 | Customer Care Associate I | Conduent Philippines | iPhone troubleshooting, **Top Agent Sep** (105% prod, 98% quality, 90% CSAT) |
| Mar–Jun 2018 | Customer Service Rep | Teleperformance Philippines | Xbox support, refunds |
| Oct 2017 – Jan 2018 | Customer Care Rep I | Startek Philippines | Xfinity phone/internet/gift checks |
| Jun–Sep 2017 | Technical Support Rep | Alorica / West Contact Services | Comcast phone/internet/cable |
| Apr–May 2017 | Customer Service Rep (Seasonal) | SPICRM | Mother's Day flower orders |

**AI Development Period** (Mar–Sep 2025)
- Dedicated career-development period for self-directed AI application development
- SQAC, Pyralis, Wizky, agent harness workflows, independent research

**Core Skills** (tag cloud or categorized)
- Trust & Safety: Content Moderation, Policy Enforcement, Quality Assurance/Analysis
- Customer Support: Email/SMS/Voice, US Support, Fintech, Technical Troubleshooting
- Automation: Workflow Automation, Knowledge Base Development, Process Improvement
- AI Agent Harnesses: Hermes, OpenCode, Claude Code, Codex, Cline, Kilo, Freebuff, Antigravity
- Programming: Python, JavaScript, HTML, CSS, SQL
- Creative: Canva, Adobe Photoshop, Premiere Pro, DaVinci Resolve

**Certifications**
- Data Analyst Associate (SQL, DataCamp)
- NC II Contact Center Servicing (Springboard Career Academy)
- Career Service Professional Eligibility (CSC)
- Career Service Sub-Professional Eligibility (CSC)

**Education**
- B.S. Criminology (undergraduate coursework), Pamantasan ng Lungsod ng Muntinlupa, 2009–2013

---

### `/contact` — Contact Page

**Form** (Vercel Forms — built-in, no extra setup)
- Fields: Name, Email, Company, Service Interest (dropdown: T&S Foundations / Support Ops & QA / AI Automation / Fractional QA Lead / Other), Message
- Submit → "Thanks! I'll respond within 1 business day."

**Direct Links**
- Email: `geraldaton20@gmail.com` (mailto:)
- LinkedIn: `linkedin.com/in/geraldaton`
- GitHub: `github.com/sensesVoid`
- Calendar: Calendly link (if available) or "Reply to my email to book"

**Availability Note**: "Currently accepting new consulting engagements. Based in Philippines (UTC+8), available for async + sync collaboration across US/EU/APAC time zones."

---

## SEO & Analytics

- **Meta**: Title, description, OG image per page (generated from frontmatter)
- **Structured data**: `Person`, `Service`, `Project` JSON-LD
- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **Analytics**: Plausible or Umami (privacy-friendly, no cookie banner) — add post-launch
- **robots.txt**: Allow all, sitemap reference

---

## Deployment Pipeline

1. Push to `main` → GitHub Actions builds Astro site (`npm run build`)
2. Deploy to **Vercel** (free tier, subdomain chosen at setup, e.g., `gerald-aton.vercel.app`)
3. Custom domain: Deferred (use Vercel subdomain for now)
4. Preview deployments on PRs

---

## What's Left to the Builder

| Item | Decision Needed? |
|------|------------------|
| Hero copy refinement (headline, subhead, CTA text) | **Theirs** — approve or tweak above |
| Services page: confirm 4 tiers, no rate hints | **Theirs** — confirmed |
| SQAC project: "Try It Yourself" section with MCP connect instructions | **Builder's call** — format as code block + note |
| Pyralis/Wizky: both link to github.com/sensesVoid | **Confirmed** |
| Contact form: Vercel Forms (built-in) | **Confirmed** |
| Portrait photo: circle crop, subtle blue glow border | **Confirmed** |
| OG image generation (auto from hero?) | **Builder's call** — generate at build time |
| "Available for work" badge on hero | **Confirmed** — green accent pill |
| Vercel subdomain | **Theirs** — choose at account setup |

---

## Approval Checklist

- [x] Design doc approved
- [x] Hero copy finalized
- [x] Services tiers confirmed (4 tiers, no rate hints)
- [x] SQAC project: "Try It Yourself" section with install + MCP connect instructions
- [x] Pyralis/Wizky → github.com/sensesVoid
- [x] Portrait: circle crop, subtle blue glow
- [x] Contact form: Vercel Forms
- [x] "Available for work" badge on hero
- [ ] Vercel account created, subdomain chosen

Once approved, next step: invoke `superpowers:writing-plans` to create implementation plan.