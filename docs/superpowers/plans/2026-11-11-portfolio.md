# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static portfolio site (Astro + Tailwind) deploying to Vercel that positions Gerald as a Trust & Safety / Operations consultant with AI automation (SQAC) as a technical differentiator.

**Architecture:** Astro content-first static site with MDX collections for pages and projects. Component islands for future interactivity. Tailwind for styling with custom dark-mode palette from photo. Vercel Forms for contact. Deployed to Vercel free tier.

**Tech Stack:** Astro 5.x, Tailwind CSS 3.4+, TypeScript, MDX, Vercel (hosting + forms + analytics)

**Spec:** `docs/superpowers/specs/2026-11-11-portfolio-design.md`

---

## Global Constraints

- **Dark mode only** — palette from `Modern Dark Studio Portrait.png`: bg `#1A1A24`, elevated `#1E1E2E`, border `#2D2D3E`, text `#E8E8ED`, muted `#8B8BA3`, accent `#1F4A9A`, accent-hover `#2D6BCE`
- **No light mode toggle** — reduces complexity, stays on-brand
- **System font stack** — zero font loading: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Circle crop portrait** with subtle blue glow: `box-shadow: 0 0 24px 4px rgba(31, 74, 154, 0.4)`
- **WCAG AA baseline** — semantic HTML, contrast ratios, focus-visible rings using accent color
- **Lighthouse 90+** — no unnecessary JS, optimized images, preload critical assets
- **Content via MDX** — `src/content/pages/*.mdx`, `src/content/projects/*.mdx` with frontmatter
- **Vercel Forms** — contact form via `<form action="/api/contact" method="POST">` (Vercel handles)
- **Deploy to Vercel** — GitHub Actions CI → Vercel preview/prod
- **"Available for work" badge** — green accent pill in hero
- **All public projects link to** `github.com/sensesVoid`

---

## Review Focus

| Input / Condition | Expected Behavior |
|-------------------|-------------------|
| Mobile viewport (< 640px) | Hero stacks vertically; portrait above text; nav collapses to hamburger; all cards stack single-column |
| Keyboard navigation | All interactive elements (links, buttons, form fields) have visible `:focus-visible` ring in accent color; tab order logical |
| Screen reader | Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`); alt text on portrait; form labels associated; ARIA labels on icon-only links |
| Slow network (3G) | Critical CSS inlined; images lazy-loaded; LCP < 2.5s; no render-blocking JS |
| Vercel Forms submission | POST to `/api/contact` works; honeypot field prevents spam; redirect to `/contact?success=1` shows toast |
| Missing MDX frontmatter | Build fails with clear error; required fields validated at build time via content layer schema |

---

## File Structure Map

```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── ServiceCard.astro
│   ├── ProjectCard.astro
│   ├── ProjectHero.astro
│   ├── Timeline.astro
│   ├── Portrait.astro
│   ├── SEO.astro
│   ├── Badge.astro
│   └── ThemeScript.astro
├── layouts/
│   └── BaseLayout.astro
├── content/
│   ├── config.ts
│   ├── pages/
│   │   ├── index.mdx
│   │   ├── services.mdx
│   │   ├── about.mdx
│   │   └── contact.mdx
│   └── projects/
│       ├── sqac.mdx
│       ├── pyralis.mdx
│       └── wizky.mdx
├── styles/
│   └── global.css
├── pages/
│   ├── index.astro
│   ├── services.astro
│   ├── projects/
│   │   ├── index.astro
│   │   ├── sqac.astro
│   │   ├── pyralis.astro
│   │   └── wizky.astro
│   ├── about.astro
│   └── contact.astro
└── scripts/
    └── vercel-form.ts (serverless function for form handling)
public/
├── Modern Dark Studio Portrait.png
└── favicon.svg
astro.config.mjs
tailwind.config.mjs
tsconfig.json
package.json
vercel.json
.github/workflows/deploy.yml
```

---

## Task Breakdown

### Task 1: Project Scaffold & Config

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `src/content/config.ts`
- Create: `src/styles/global.css`
- Create: `vercel.json`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: Astro project that runs `npm run dev` and `npm run build` successfully

- [ ] **Step 1: Write `package.json` with dependencies**

```json
{
  "name": "gerald-aton-portfolio",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "format": "prettier --write ."
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^6.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strictNullChecks": true
  }
}
```

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gerald-aton.vercel.app',
  integrations: [mdx(), sitemap(), tailwind()],
  output: 'static',
  trailingSlash: 'always',
});
```

- [ ] **Step 4: Write `tailwind.config.mjs` with custom palette**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1A1A24',
          elevated: '#1E1E2E',
          border: '#2D2D3E',
          text: '#E8E8ED',
          muted: '#8B8BA3',
          accent: '#1F4A9A',
          'accent-hover': '#2D6BCE',
          'accent-light': '#3A7BD8',
          success: '#2E7D32',
          warning: '#F57F17',
          available: '#2E7D32',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'portrait-glow': '0 0 24px 4px rgba(31, 74, 154, 0.4)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Write `src/content/config.ts` with collections schema**

```ts
import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    hero: z.object({
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.object({ text: z.string(), href: z.string() }),
      ctaSecondary: z.object({ text: z.string(), href: z.string() }).optional(),
      badge: z.string().optional(),
    }).optional(),
    trustSignals: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    tags: z.array(z.string()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    hero: z.object({
      subtitle: z.string(),
      badges: z.array(z.string()),
      links: z.array(z.object({ text: z.string(), href: z.string() })),
    }).optional(),
  }),
});

export const collections = { pages, projects };
```

- [ ] **Step 6: Write `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: dark;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-brand-bg text-brand-text antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
  ::selection {
    @apply bg-brand-accent/30 text-brand-text;
  }
  :focus-visible {
    @apply outline-none ring-2 ring-brand-accent ring-offset-2 ring-offset-brand-bg;
  }
}

@layer components {
  .container-custom {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }
  .section {
    @apply py-16 sm:py-24 lg:py-32;
  }
  .card {
    @apply bg-brand-elevated border border-brand-border rounded-xl p-6 transition-shadow hover:shadow-xl hover:shadow-brand-accent/10;
  }
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-lg bg-brand-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-lg border border-brand-border bg-transparent px-6 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-elevated focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg;
  }
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
  }
  .badge-available {
    @apply bg-brand-available/20 text-brand-available border border-brand-available/30;
  }
  .link {
    @apply text-brand-accent hover:text-brand-accent-hover transition-colors underline-offset-2 hover:underline;
  }
}
```

- [ ] **Step 7: Write `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "functions": {
    "src/scripts/vercel-form.ts": {
      "maxDuration": 10
    }
  }
}
```

- [ ] **Step 8: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run check
      - uses: amondnet/vercel-action@v25
        if: github.ref == 'refs/heads/main'
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

- [ ] **Step 9: Run `npm install` and verify `npm run dev` starts**

Run: `npm install && npm run dev`
Expected: Dev server starts at `http://localhost:4321` with no errors

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json astro.config.mjs tailwind.config.mjs src/content/config.ts src/styles/global.css vercel.json .github/workflows/deploy.yml
git commit -m "chore: scaffold Astro + Tailwind project with custom dark theme"
```

---

### Task 2: Base Layout & Shared Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/SEO.astro`
- Create: `src/components/ThemeScript.astro`
- Create: `src/components/Badge.astro`

**Interfaces:**
- Consumes: Tailwind config, global CSS
- Produces: `BaseLayout` with slots for `head`, `header`, `footer`; `SEO` component with JSON-LD; `ThemeScript` for dark-mode persistence

- [ ] **Step 1: Write `src/components/SEO.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}
const { title, description, image, url, type = 'website', jsonLd } = Astro.props;
const canonicalURL = url || Astro.site?.toString() || 'https://gerald-aton.vercel.app';
const ogImage = image || '/og-default.png';
---
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={ogImage} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
<link rel="canonical" href={canonicalURL} />
{jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
```

- [ ] **Step 2: Write `src/components/ThemeScript.astro`**

```astro
---
// Inline script to prevent FOUC - runs before body renders
---
<script is:inline>
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 3: Write `src/components/Header.astro`**

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
---
<header class="sticky top-0 z-40 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-sm">
  <nav class="container-custom" aria-label="Main navigation">
    <div class="flex h-16 items-center justify-between">
      <a href="/" class="font-semibold text-brand-text hover:text-brand-accent transition-colors" aria-label="Gerald B. Aton — Home">
        GBA
      </a>
      <div class="hidden md:flex md:items-center md:gap-8">
        {navLinks.map(link => (
          <a href={link.href} class="text-sm text-brand-muted hover:text-brand-accent transition-colors">{link.label}</a>
        ))}
        <a href="/contact" class="btn-primary text-sm">Get in Touch</a>
      </div>
      <button class="md:hidden" aria-label="Toggle menu" aria-expanded="false">☰</button>
    </div>
  </nav>
</header>
```

- [ ] **Step 4: Write `src/components/Footer.astro`**

```astro
---
const currentYear = new Date().getFullYear();
const socialLinks = [
  { href: 'mailto:geraldaton20@gmail.com', label: 'Email', icon: '✉' },
  { href: 'https://linkedin.com/in/geraldaton', label: 'LinkedIn', icon: '⟶' },
  { href: 'https://github.com/sensesVoid', label: 'GitHub', icon: '⌘' },
];
---
<footer class="border-t border-brand-border bg-brand-elevated">
  <div class="container-custom py-12 lg:py-16">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <p class="text-sm text-brand-muted">
        © {currentYear} Gerald B. Aton. Built with Astro & Tailwind.
      </p>
      <div class="flex items-center gap-6">
        {socialLinks.map(link => (
          <a href={link.href} class="text-sm text-brand-muted hover:text-brand-accent transition-colors flex items-center gap-1" aria-label={link.label} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">{link.icon}</span>
            <span class="hidden sm:inline">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Write `src/components/Badge.astro`**

```astro
---
interface Props {
  children: any;
  variant?: 'default' | 'available' | 'accent';
  class?: string;
}
const { children, variant = 'default', class: className = '' } = Astro.props;
const variants = {
  default: 'badge bg-brand-border text-brand-muted',
  available: 'badge-available',
  accent: 'badge bg-brand-accent/20 text-brand-accent border border-brand-accent/30',
};
---
<span class={`${variants[variant]} ${className}`}>
  <slot />
</span>
```

- [ ] **Step 6: Write `src/layouts/BaseLayout.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, unknown>;
}
const { title, description, image, url, jsonLd } = Astro.props;
---
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />
    <SEO title={title} description={description} image={image} url={url} jsonLd={jsonLd} />
    <ThemeScript />
  </head>
  <body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1" id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 7: Verify components render without errors**

Run: `npm run dev` → visit `http://localhost:4321`
Expected: Page loads with header, footer, no console errors

- [ ] **Step 8: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/*.astro
git commit -m "feat: add base layout, header, footer, SEO, theme script, badge components"
```

---

### Task 3: Home Page (`/`) — Hero, Trust Signals, Featured Project, Services Preview

**Files:**
- Create: `src/content/pages/index.mdx`
- Create: `src/pages/index.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/Portrait.astro` (reusable for about page too)

**Interfaces:**
- Consumes: `BaseLayout`, `Hero`, `Portrait`, `ServiceCard`, `ProjectCard`, `Badge`, page frontmatter
- Produces: Landing page with hero, trust signals bar, SQAC featured card, 3 service preview cards

- [ ] **Step 1: Write `src/content/pages/index.mdx`**

```mdx
---
title: "Gerald B. Aton — Trust & Safety Operations + AI Automation"
description: "8 years scaling content moderation, QA, and US customer support. I build the tooling your team wishes existed — like SQAC, a portable memory layer for LLMs."
hero:
  headline: "Trust & Safety Operations + AI Automation for Early-Stage Startups"
  subhead: "8 years scaling content moderation, QA, and US customer support. I build the tooling your team wishes existed — like SQAC, a portable memory layer for LLMs."
  ctaPrimary:
    text: "Book a Discovery Call"
    href: "/contact"
  ctaSecondary:
    text: "View SQAC Project"
    href: "/projects/sqac"
  badge: "Available for consulting"
trustSignals:
  - label: "Years T&S / Support Ops"
    value: "8"
  - label: "Site Quality Score (Wipro KB)"
    value: "100%"
  - label: "Productivity Gain (Automation)"
    value: "20%"
  - label: "TPH Target (ECE Fintech)"
    value: "115%"
  - label: "CSAT / NPS (T-Mobile)"
    value: "95% / 50%"
---
```

- [ ] **Step 2: Write `src/components/Hero.astro`**

```astro
---
interface Props {
  headline: string;
  subhead: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  badge?: string;
}
const { headline, subhead, ctaPrimary, ctaSecondary, badge } = Astro.props;
---
<section class="section pt-20 lg:pt-28" aria-labelledby="hero-heading">
  <div class="container-custom">
    <div class="max-w-3xl">
      {badge && <Badge variant="available" class="mb-6">{badge}</Badge>}
      <h1 id="hero-heading" class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text mb-6">
        {headline}
      </h1>
      <p class="text-lg sm:text-xl text-brand-muted mb-8 max-w-2xl leading-relaxed">
        {subhead}
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a href={ctaPrimary.href} class="btn-primary w-full sm:w-auto">{ctaPrimary.text}</a>
        {ctaSecondary && (
          <a href={ctaSecondary.href} class="btn-secondary w-full sm:w-auto">{ctaSecondary.text}</a>
        )}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write `src/components/Portrait.astro`**

```astro
---
interface Props {
  src: string;
  alt: string;
  class?: string;
}
const { src, alt, class: className = '' } = Astro.props;
---
<div class={`relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-2 border-brand-accent/30 shadow-portrait-glow ${className}`}>
  <img src={src} alt={alt} class="w-full h-full object-cover" loading="eager" fetchpriority="high" />
</div>
```

- [ ] **Step 4: Write `src/components/ServiceCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  icon?: string;
  href: string;
}
const { title, description, icon, href } = Astro.props;
---
<article class="card group h-full flex flex-col">
  {icon && <div class="text-3xl mb-4" aria-hidden="true">{icon}</div>}
  <h3 class="text-xl font-semibold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{title}</h3>
  <p class="text-brand-muted flex-1 mb-4">{description}</p>
  <a href={href} class="link text-sm font-medium self-start">Learn more →</a>
</article>
```

- [ ] **Step 5: Write `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  tags: string[];
  href: string;
}
const { title, description, stack, github, demo, featured, tags, href } = Astro.props;
---
<article class={`card group h-full flex flex-col ${featured ? 'md:col-span-2' : ''}`}>
  <div class="flex flex-wrap gap-2 mb-3">
    {tags.slice(0, 4).map(tag => <Badge key={tag} variant="accent">{tag}</Badge>)}
  </div>
  <h3 class="text-xl font-semibold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{title}</h3>
  <p class="text-brand-muted flex-1 mb-4">{description}</p>
  <div class="flex flex-wrap gap-2 text-xs text-brand-muted mb-4">
    {stack.map(tech => <span key={tech} class="px-2 py-0.5 rounded bg-brand-border">{tech}</span>)}
  </div>
  <div class="flex items-center gap-4 pt-4 border-t border-brand-border">
    <a href={href} class="link text-sm font-medium">View Project →</a>
    {github && <a href={github} class="link text-sm" target="_blank" rel="noopener noreferrer" aria-label="GitHub">⌘ GitHub</a>}
    {demo && <a href={demo} class="link text-sm" target="_blank" rel="noopener noreferrer" aria-label="Live Demo">🔗 Demo</a>}
  </div>
</article>
```

- [ ] **Step 6: Write `src/pages/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/Hero.astro';
import ServiceCard from '@/components/ServiceCard.astro';
import ProjectCard from '@/components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const page = await getEntry('pages', 'index');
const projects = await getCollection('projects');
const featuredProject = projects.find(p => p.data.featured);
const otherProjects = projects.filter(p => !p.data.featured).slice(0, 3);

const services = [
  { title: 'Trust & Safety Foundations', description: 'Policy frameworks, moderation pipelines, QA programs from scratch', href: '/services', icon: '🛡️' },
  { title: 'Support Operations & QA', description: 'Fintech/consumer support scaling, productivity optimization, CSAT improvement', href: '/services', icon: '📞' },
  { title: 'AI Automation & Tooling', description: 'Custom agent workflows, SQAC integration, local LLM deployment', href: '/services', icon: '🤖' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gerald B. Aton',
  url: 'https://gerald-aton.vercel.app',
  sameAs: [
    'https://linkedin.com/in/geraldaton',
    'https://github.com/sensesVoid',
  ],
  jobTitle: 'Trust & Safety Consultant',
  worksFor: { '@type': 'Organization', name: 'Independent' },
  knowsAbout: ['Content Moderation', 'Quality Assurance', 'Customer Support Operations', 'AI Agent Harnesses', 'LLM Memory Systems'],
};
---

<BaseLayout title={page.data.title} description={page.data.description} jsonLd={jsonLd}>
  <Hero {...page.data.hero} />

  {/* Trust Signals Bar */}
  <section class="section bg-brand-elevated/50 border-y border-brand-border" aria-label="Trust signals">
    <div class="container-custom">
      <dl class="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        {page.data.trustSignals?.map(signal => (
          <div key={signal.label} class="px-4">
            <dt class="text-3xl sm:text-4xl font-bold text-brand-accent">{signal.value}</dt>
            <dd class="text-sm text-brand-muted mt-1">{signal.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>

  {/* Featured Project: SQAC */}
  {featuredProject && (
    <section class="section" aria-labelledby="featured-heading">
      <div class="container-custom">
        <header class="mb-10">
          <h2 id="featured-heading" class="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Featured Project</h2>
          <p class="text-brand-muted">My flagship open-source project — portable memory for LLMs</p>
        </header>
        <ProjectCard {...featuredProject.data} href={`/projects/${featuredProject.slug}`} featured={true} />
      </div>
    </section>
  )}

  {/* Services Preview */}
  <section class="section bg-brand-elevated/50" aria-labelledby="services-preview-heading">
    <div class="container-custom">
      <header class="mb-10 text-center">
        <h2 id="services-preview-heading" class="text-2xl sm:text-3xl font-bold text-brand-text mb-2">How I Help</h2>
        <p class="text-brand-muted max-w-2xl mx-auto">Three engagement areas for early-stage startups building Trust & Safety</p>
      </header>
      <div class="grid md:grid-cols-3 gap-6">
        {services.map(svc => <ServiceCard key={svc.title} {...svc} />)}
      </div>
      <div class="text-center mt-10">
        <a href="/services" class="btn-secondary">View All Services →</a>
      </div>
    </div>
  </section>

  {/* Other Projects */}
  {otherProjects.length > 0 && (
    <section class="section" aria-labelledby="projects-heading">
      <div class="container-custom">
        <header class="mb-10">
          <h2 id="projects-heading" class="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Other Projects</h2>
          <p class="text-brand-muted">All public work at <a href="https://github.com/sensesVoid" class="link">github.com/sensesVoid</a></p>
        </header>
        <div class="grid md:grid-cols-3 gap-6">
          {otherProjects.map(p => <ProjectCard key={p.slug} {...p.data} href={`/projects/${p.slug}`} />)}
        </div>
        <div class="text-center mt-10">
          <a href="/projects" class="btn-secondary">View All Projects →</a>
        </div>
      </div>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 7: Verify home page renders correctly**

Run: `npm run dev` → visit `http://localhost:4321`
Expected: Hero with badge, trust signals, featured SQAC card, 3 service cards, other projects

- [ ] **Step 8: Commit**

```bash
git add src/content/pages/index.mdx src/pages/index.astro src/components/Hero.astro src/components/Portrait.astro src/components/ServiceCard.astro src/components/ProjectCard.astro
git commit -m "feat: implement home page with hero, trust signals, featured project, services preview"
```

---

### Task 4: Services Page (`/services`)

**Files:**
- Create: `src/content/pages/services.mdx`
- Create: `src/pages/services.astro`

**Interfaces:**
- Consumes: `BaseLayout`, page frontmatter
- Produces: Services page with 4 detailed service tiers

- [ ] **Step 1: Write `src/content/pages/services.mdx`**

```mdx
---
title: "Services — How I Help Early-Stage Startups"
description: "Trust & Safety foundations, Support Operations & QA, AI Automation, and Fractional QA Lead engagements for early-stage startups."
hero:
  headline: "How I Help Early-Stage Startups"
  subhead: "Four engagement models — from laying Trust & Safety foundations to embedding AI automation into your operations."
  ctaPrimary:
    text: "Book a Discovery Call"
    href: "/contact"
---
```

- [ ] **Step 2: Write `src/pages/services.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/Hero.astro';
import { getEntry } from 'astro:content';
import Badge from '@/components/Badge.astro';

const page = await getEntry('pages', 'services');

const services = [
  {
    title: 'Trust & Safety Foundations',
    target: 'Pre-seed → Series A',
    scope: 'Policy framework design, moderation workflow setup, reviewer QA calibration, escalation paths, tooling selection',
    outcomes: 'Launch-ready T&S ops in 4-6 weeks; measurable quality baseline',
    icon: '🛡️',
  },
  {
    title: 'Support Operations & QA',
    target: 'Seed → Series B',
    scope: 'Queue design, SLA/SLO definition, QA scorecards, coaching programs, productivity tooling, fintech/telecom domain expertise',
    outcomes: '15-30% TPH improvement; CSAT >90%; reduced escalation rate',
    icon: '📞',
  },
  {
    title: 'AI Automation & Tooling',
    target: 'Any stage',
    scope: 'Custom agent workflows (OpenCode, Claude Code, Hermes), SQAC memory integration, local LLM deployment (llama.cpp/GGUF), RAG vs. memory architecture decisions',
    outcomes: '50-90% context cost reduction; portable knowledge across models',
    icon: '🤖',
  },
  {
    title: 'Fractional QA Lead',
    target: 'Early-stage',
    scope: 'Embedded QA leadership: hiring, calibration, process design, tooling, reporting',
    outcomes: 'Self-sustaining QA function; knowledge transfer to internal hire',
    icon: '👥',
  },
];

const engagementModels = [
  { name: 'Discovery', description: 'Free 30-min call to understand your needs and scope the engagement', price: 'Free' },
  { name: 'Project', description: 'Fixed-scope engagement, typically 4-8 weeks with clear deliverables', price: 'Fixed fee' },
  { name: 'Retainer', description: 'Ongoing monthly engagement for continuous improvement and advisory', price: 'Monthly' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Trust & Safety Consulting',
  provider: { '@type': 'Person', name: 'Gerald B. Aton' },
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Consulting Services',
    itemListElement: services.map((s, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: { '@type': 'Service', name: s.title, description: s.scope },
    })),
  },
};
---

<BaseLayout title={page.data.title} description={page.data.description} jsonLd={jsonLd}>
  <Hero {...page.data.hero} />

  <section class="section" aria-labelledby="services-heading">
    <div class="container-custom">
      <header class="mb-12 text-center">
        <h2 id="services-heading" class="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Consulting Services</h2>
        <p class="text-brand-muted max-w-2xl mx-auto">Each engagement starts with a free discovery call. No rate card — we agree on scope and value first.</p>
      </header>
      <div class="space-y-8">
        {services.map((svc, i) => (
          <article key={svc.title} class="card relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-brand-accent" aria-hidden="true" />
            <div class="grid md:grid-cols-[1fr_2fr_2fr_1fr] gap-6 items-start p-6">
              <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <span class="text-4xl mb-3" aria-hidden="true">{svc.icon}</span>
                <Badge variant="accent" class="mb-3">{svc.target}</Badge>
                <h3 class="text-xl font-semibold text-brand-text">{svc.title}</h3>
              </div>
              <div>
                <h4 class="text-sm font-medium text-brand-accent uppercase tracking-wider mb-2">Scope</h4>
                <p class="text-brand-muted">{svc.scope}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-brand-accent uppercase tracking-wider mb-2">Outcomes</h4>
                <p class="text-brand-text">{svc.outcomes}</p>
              </div>
              <div class="flex items-center justify-center md:justify-end">
                <a href="/contact" class="btn-primary">Discuss This →</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>

  <section class="section bg-brand-elevated/50" aria-labelledby="engagement-heading">
    <div class="container-custom">
      <header class="mb-10 text-center">
        <h2 id="engagement-heading" class="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Engagement Models</h2>
      </header>
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {engagementModels.map(model => (
          <article key={model.name} class="card text-center">
            <h3 class="text-xl font-semibold text-brand-text mb-2">{model.name}</h3>
            <p class="text-brand-muted mb-4">{model.description}</p>
            <div class="text-2xl font-bold text-brand-accent">{model.price}</div>
          </article>
        ))}
      </div>
      <div class="text-center mt-10">
        <a href="/contact" class="btn-primary">Start with a Discovery Call →</a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify services page renders correctly**

Run: `npm run dev` → visit `http://localhost:4321/services`
Expected: Hero, 4 service cards with scope/outcomes, 3 engagement model cards

- [ ] **Step 4: Commit**

```bash
git add src/content/pages/services.mdx src/pages/services.astro
git commit -m "feat: implement services page with 4 tiers and engagement models"
```

---

### Task 5: Projects Index (`/projects`) & Project Pages

**Files:**
- Create: `src/content/projects/sqac.mdx`
- Create: `src/content/projects/pyralis.mdx`
- Create: `src/content/projects/wizky.mdx`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/sqac.astro`
- Create: `src/pages/projects/pyralis.astro`
- Create: `src/pages/projects/wizky.astro`
- Create: `src/components/ProjectHero.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `ProjectHero`, project frontmatter
- Produces: Projects index with SQAC featured + link to GitHub profile; 3 individual project pages

- [ ] **Step 1: Write `src/content/projects/sqac.mdx`**

```mdx
---
title: "SQAC — Symbolic Query Addressable Cartridge"
description: "Portable, file-based LLM memory on hyperdimensional computing (HDC/VSA). One .sqac file. Any LLM. Facts and skills that persist, survive restarts, and swap in milliseconds — no retraining, no database, no GPU."
stack: ["Python", "NumPy", "Rust (SIMD)", "HDC/VSA", "MCP", "FastAPI"]
featured: true
github: "https://github.com/sensesVoid/sqac"
demo: ""
tags: ["LLM Memory", "Hyperdimensional Computing", "MCP", "CLI", "Open Source"]
startDate: "2025-03"
endDate: "Present"
hero:
  subtitle: "Give your LLM a memory it can carry in a file."
  badges: ["Python", "Rust", "NumPy", "HDC/VSA", "MCP", "HTTP API", "CLI"]
  links:
    - text: "GitHub"
      href: "https://github.com/sensesVoid/sqac"
    - text: "PyPI"
      href: "https://libraries.io/pypi/sqac"
    - text: "Docs"
      href: "https://github.com/sensesVoid/sqac#readme"
---
```

- [ ] **Step 2: Write `src/content/projects/pyralis.mdx`**

```mdx
---
title: "Pyralis"
description: "Open-source sub-1B-parameter language model, trained on Kaggle T4 GPUs, deployed in GGUF format."
stack: ["Python", "PyTorch", "Kaggle", "GGUF", "llama.cpp"]
featured: false
github: "https://github.com/sensesVoid"
demo: ""
tags: ["LLM Training", "Small Models", "GGUF", "Kaggle"]
startDate: "2025-03"
endDate: "2025-09"
hero:
  subtitle: "Sub-1B parameter language model trained on Kaggle T4, deployed in GGUF."
  badges: ["Python", "PyTorch", "Kaggle", "GGUF", "llama.cpp"]
  links:
    - text: "GitHub"
      href: "https://github.com/sensesVoid"
---
```

- [ ] **Step 3: Write `src/content/projects/wizky.mdx`**

```mdx
---
title: "Wizky CLI"
description: "Offline-first local AI coding assistant written in Rust with llama.cpp FFI."
stack: ["Rust", "llama.cpp", "FFI", "CLI"]
featured: false
github: "https://github.com/sensesVoid"
demo: ""
tags: ["Local AI", "Rust", "llama.cpp", "Coding Assistant"]
startDate: "2025-03"
endDate: "Present"
hero:
  subtitle: "Offline-first local AI coding assistant in Rust with llama.cpp FFI."
  badges: ["Rust", "llama.cpp", "FFI", "CLI"]
  links:
    - text: "GitHub"
      href: "https://github.com/sensesVoid"
---
```

- [ ] **Step 4: Write `src/components/ProjectHero.astro`**

```astro
---
interface Props {
  title: string;
  subtitle: string;
  badges: string[];
  links: { text: string; href: string }[];
  stack: string[];
}
const { title, subtitle, badges, links, stack } = Astro.props;
---
<header class="mb-12">
  <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mb-4">{title}</h1>
  <p class="text-lg text-brand-muted mb-6 max-w-3xl">{subtitle}</p>
  <div class="flex flex-wrap gap-2 mb-6">
    {badges.map(b => <Badge key={b} variant="accent">{b}</Badge>)}
  </div>
  <div class="flex flex-wrap gap-4 mb-6">
    {links.map(l => <a key={l.href} href={l.href} class="btn-secondary text-sm" target="_blank" rel="noopener noreferrer">{l.text}</a>)}
  </div>
  <div class="flex flex-wrap gap-2 text-xs text-brand-muted">
    {stack.map(tech => <span key={tech} class="px-2 py-0.5 rounded bg-brand-border">{tech}</span>)}
  </div>
</header>
```

- [ ] **Step 5: Write `src/pages/projects/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import ProjectCard from '@/components/ProjectCard.astro';

const projects = await getCollection('projects');
const featured = projects.find(p => p.data.featured);
const others = projects.filter(p => !p.data.featured);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareProject',
      name: p.data.title,
      description: p.data.description,
      url: `https://gerald-aton.vercel.app/projects/${p.slug}`,
      programmingLanguage: p.data.stack,
    },
  })),
};
---

<BaseLayout title="Projects — Gerald B. Aton" description="Open-source projects: SQAC (LLM memory), Pyralis (small LLM), Wizky CLI (local AI), and agent harness workflows." jsonLd={jsonLd}>
  <section class="section pt-20" aria-labelledby="projects-heading">
    <div class="container-custom">
      <header class="mb-10 text-center">
        <h1 id="projects-heading" class="text-3xl sm:text-4xl font-bold text-brand-text mb-2">Projects</h2>
        <p class="text-brand-muted max-w-2xl mx-auto">Open-source tools for LLM memory, small model training, local AI coding, and agent automation.</p>
      </header>

      {featured && (
        <section class="mb-16" aria-labelledby="featured-heading">
          <h2 id="featured-heading" class="sr-only">Featured Project</h2>
          <ProjectCard {...featured.data} href={`/projects/${featured.slug}`} featured={true} />
        </section>
      )}

      <section aria-labelledby="other-heading">
        <h2 id="other-heading" class="text-2xl font-bold text-brand-text mb-6">Other Projects</h2>
        <p class="text-brand-muted mb-8">All public work lives at <a href="https://github.com/sensesVoid" class="link">github.com/sensesVoid</a> — including Pyralis, Wizky, agent harness workflows, and research repos.</p>
        <div class="grid md:grid-cols-3 gap-6">
          {others.map(p => <ProjectCard key={p.slug} {...p.data} href={`/projects/${p.slug}`} />)}
        </div>
      </section>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Write `src/pages/projects/[slug].astro` (dynamic route for all project pages)**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import ProjectHero from '@/components/ProjectHero.astro';
import { getCollection, getEntry } from 'astro:content';
import { Slug } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(p => ({ params: { slug: p.slug }, props: { project: p } }));
}

const { project } = Astro.props;
const { data } = project;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareProject',
  name: data.title,
  description: data.description,
  url: `https://gerald-aton.vercel.app/projects/${project.slug}`,
  programmingLanguage: data.stack,
  codeRepository: data.github,
  dateCreated: data.startDate,
  keywords: data.tags.join(', '),
};
---

<BaseLayout title={`${data.title} — Gerald B. Aton`} description={data.description} jsonLd={jsonLd}>
  <section class="section pt-20" aria-labelledby="project-title">
    <div class="container-custom max-w-4xl">
      <ProjectHero {...data.hero} stack={data.stack} />
      
      <div class="prose prose-invert max-w-none" set:html={data.content || ''} />
      
      {/* SQAC-specific deep-dive content */}
      {project.slug === 'sqac' && (
        <>
          <hr class="my-12 border-brand-border" />
          
          <section aria-labelledby="problem-heading">
            <h2 id="problem-heading" class="text-2xl font-bold text-brand-text mb-4">The Problem</h2>
            <p class="text-brand-muted mb-4">Every token you put into an LLM's context costs GPU memory. A 1M-token conversation with Llama-3.1-8B needs ~125,000 MiB of KV cache. Stuffing your entire memory into the context window is the "5M-token fantasy."</p>
            <p class="text-brand-muted mb-4">SQAC recalls only the top-k relevant exchanges (~135 tokens) at ~0.1ms, reducing KV cache to ~16.9 MiB — a <strong class="text-brand-accent">1,000× (99.9%) reduction</strong>. Your memory stays constant-cost regardless of how much you've stored.</p>
          </section>

          <section aria-labelledby="concepts-heading" class="mt-12">
            <h2 id="concepts-heading" class="text-2xl font-bold text-brand-text mb-4">Core Concepts</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <article class="card">
                <h3 class="text-lg font-semibold text-brand-text mb-2">🗂️ Cartridge</h3>
                <p class="text-brand-muted">Single .sqac file, plaintext payloads, binary 1024-bit hyperdimensional addresses (XOR + popcount), zero training, hot-swappable.</p>
              </article>
              <article class="card">
                <h3 class="text-lg font-semibold text-brand-text mb-2">🧠 Four Knowledge Kinds</h3>
                <p class="text-brand-muted">Facts (what to know), Skills (how to think), Docs (reference), Turns (conversation memory).</p>
              </article>
              <article class="card">
                <h3 class="text-lg font-semibold text-brand-text mb-2">🔍 Three-Tier Retrieval</h3>
                <p class="text-brand-muted">Exact (5μs), Lexical (trigram, 21ms @ 10K), Semantic (paraphrase, ~0.1ms via int8 model).</p>
              </article>
              <article class="card">
                <h3 class="text-lg font-semibold text-brand-text mb-2">⚡ Thought Injection</h3>
                <p class="text-brand-muted">Skill cards with pinned operators → external evaluation → <strong class="text-brand-accent">57% → 95% accuracy</strong> on unit conversion (7B model).</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="results-heading" class="mt-12">
            <h2 id="results-heading" class="text-2xl font-bold text-brand-text mb-4">Key Results</h2>
            <ul class="space-y-3 text-brand-muted">
              <li>✅ 307/307 tests passing</li>
              <li>⚡ 261× faster fuzzy search via Rust SIMD (AVX2/NEON)</li>
              <li>📦 25K entries = 13ms search, 132MB RSS, 12MB disk</li>
              <li>🔌 MCP server for cross-CLI continuity (OpenCode, Claude Code, Codex, Cursor, Zed)</li>
              <li>🌐 HTTP API server (FastAPI) with auth, rack management, session offloader</li>
              <li>🎮 3D hyperdimensional graph visualization (Three.js)</li>
            </ul>
          </section>

          <section aria-labelledby="try-heading" class="mt-12">
            <h2 id="try-heading" class="text-2xl font-bold text-brand-text mb-4">Try It Yourself</h2>
            <p class="text-brand-muted mb-4">SQAC runs as an MCP server — connect it to Claude Code, OpenCode, Cursor, Zed, or any MCP-compatible client for cross-session memory that follows you across tools.</p>
            <pre class="bg-brand-bg border border-brand-border rounded-xl p-4 overflow-x-auto text-sm"><code>{`# Install
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
sqac track . --interval 5 --rack .rack`}</code></pre>
          </section>

          <section aria-labelledby="license-heading" class="mt-12">
            <h2 id="license-heading" class="text-2xl font-bold text-brand-text mb-4">License</h2>
            <p class="text-brand-muted">BSL-1.1 → Apache 2.0 after Sep 7, 2030</p>
          </section>
        </>
      )}
      
      {/* Pyralis/Wizky generic content */}
      {project.slug !== 'sqac' && (
        <div class="mt-8">
          <p class="text-brand-muted">This project is part of my AI development portfolio. View all public work at <a href="https://github.com/sensesVoid" class="link">github.com/sensesVoid</a>.</p>
        </div>
      )}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 7: Verify all project pages render correctly**

Run: `npm run dev` → visit `/projects`, `/projects/sqac`, `/projects/pyralis`, `/projects/wizky`
Expected: Index with featured SQAC + others; deep-dive SQAC page with problem/concepts/results/try-it; Pyralis/Wizky pages link to GitHub profile

- [ ] **Step 8: Commit**

```bash
git add src/content/projects/*.mdx src/pages/projects/index.astro src/pages/projects/[slug].astro src/components/ProjectHero.astro
git commit -m "feat: implement projects index and project pages (SQAC deep-dive, Pyralis, Wizky)"
```

---

### Task 6: About Page (`/about`)

**Files:**
- Create: `src/content/pages/about.mdx`
- Create: `src/pages/about.astro`
- Create: `src/components/Timeline.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `Portrait`, `Timeline`, page frontmatter
- Produces: About page with portrait, narrative bio, timeline, skills, certifications, education

- [ ] **Step 1: Write `src/content/pages/about.mdx`**

```mdx
---
title: "About — Gerald B. Aton"
description: "Content moderator, quality analyst, and customer support professional with 8 years experience. Self-directed AI builder behind SQAC, Pyralis, and Wizky."
hero:
  headline: "Gerald B. Aton"
  subhead: "Content Moderation • US Customer Support • AI Agent & Automation Tooling"
  ctaPrimary:
    text: "Book a Discovery Call"
    href: "/contact"
---
```

- [ ] **Step 2: Write `src/components/Timeline.astro`**

```astro
---
interface TimelineItem {
  period: string;
  role: string;
  company: string;
  highlights: string[];
}
interface Props {
  items: TimelineItem[];
  title: string;
}
const { items, title } = Astro.props;
---
<section aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
  <h2 id={title.toLowerCase().replace(/\s+/g, '-')} class="text-2xl font-bold text-brand-text mb-8">{title}</h2>
  <dl class="space-y-8">
    {items.map((item, i) => (
      <div key={i} class="relative pl-6 border-l-2 border-brand-border">
        <dt class="flex items-baseline gap-3 mb-2">
          <span class="text-lg font-semibold text-brand-text">{item.role}</span>
          <span class="text-brand-muted text-sm">{item.period}</span>
        </dt>
        <dd class="text-brand-accent font-medium mb-2">{item.company}</dd>
        <dd class="space-y-1">
          {item.highlights.map((h, j) => (
            <p key={j} class="text-brand-muted text-sm flex items-start gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" aria-hidden="true" />
              {h}
            </p>
          ))}
        </dd>
      </div>
    ))}
  </dl>
</section>
```

- [ ] **Step 3: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/Hero.astro';
import Portrait from '@/components/Portrait.astro';
import Timeline from '@/components/Timeline.astro';
import Badge from '@/components/Badge.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'about');

const experience = [
  { period: 'Sep 2025 – Present', role: 'Content Moderator', company: 'Tech Mahindra Philippines', highlights: ['Major social platform, US-focused moderation', 'Policy enforcement at scale'] },
  { period: 'Nov 2023 – Mar 2025', role: 'Email & Text FinTech Support', company: 'ECE Philippines', highlights: ['Albert financial technology app', '115% TPH target, 65% CSAT, 78% quality'] },
  { period: 'Aug 2023 – Oct 2023', role: 'Customer Service Representative', company: 'Eperformax Philippines', highlights: ['T-Mobile inbound support', '95% CSAT, 50% NPS, <20 min AHT'] },
  { period: '2 years', role: 'Quality Analyst', company: 'Wipro BPO Philippines', highlights: ['Policy evaluation & QA calibration', 'Knowledge base → 100% site quality score'] },
  { period: 'Apr 2019 – Aug 2023', role: 'Digital Content Specialist', company: 'Wipro BPO Philippines', highlights: ['Content review & policy enforcement', 'Automation project → 20% productivity gain'] },
  { period: 'Mar–Apr 2019', role: 'Customer Service Rep (Seasonal)', company: 'Harte Hanks Philippines', highlights: ['WWE ticket orders & refunds'] },
  { period: 'Jul–Nov 2018', role: 'Customer Care Associate I', company: 'Conduent Philippines', highlights: ['iPhone troubleshooting', 'Top Agent Sep: 105% prod, 98% quality, 90% CSAT'] },
  { period: 'Mar–Jun 2018', role: 'Customer Service Rep', company: 'Teleperformance Philippines', highlights: ['Xbox support & refunds'] },
  { period: 'Oct 2017 – Jan 2018', role: 'Customer Care Rep I', company: 'Startek Philippines', highlights: ['Xfinity phone/internet/gift checks'] },
  { period: 'Jun–Sep 2017', role: 'Technical Support Rep', company: 'Alorica / West Contact Services', highlights: ['Comcast phone/internet/cable'] },
  { period: 'Apr–May 2017', role: 'Customer Service Rep (Seasonal)', company: 'SPICRM', highlights: ['Mother\'s Day flower orders & refunds'] },
];

const aiPeriod = [
  { period: 'Mar–Sep 2025', role: 'AI Development Period', company: 'Self-Directed', highlights: ['SQAC — Portable LLM memory (HDC/VSA)', 'Pyralis — Sub-1B LLM on Kaggle T4', 'Wizky CLI — Rust + llama.cpp FFI', 'Agent harnesses: Hermes, OpenCode, Claude Code, Codex, Cline, Kilo, Freebuff, Antigravity', 'Independent research: Compact neuro-symbolic learning'] },
];

const skills = {
  'Trust & Safety': ['Content Moderation', 'Policy Enforcement', 'Content Review', 'Risk Assessment', 'Quality Assurance', 'Quality Analysis'],
  'Customer Support': ['Email/SMS/Voice Support', 'US Customer Support', 'Fintech Support', 'Technical Troubleshooting', 'Issue Resolution', 'Refund Handling'],
  'Automation & Knowledge': ['Workflow Automation', 'Knowledge Base Development', 'Process Improvement', 'Productivity Optimization'],
  'AI Agent Harnesses': ['Hermes', 'OpenCode', 'Claude Code', 'Codex', 'Cline', 'Kilo', 'Freebuff', 'Antigravity'],
  'Programming & Data': ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL'],
  'Software & Creative': ['Google Workspace', 'Microsoft Office', 'Canva', 'Adobe Photoshop', 'Premiere Pro', 'DaVinci Resolve'],
};

const certifications = [
  'Data Analyst Associate (SQL, DataCamp)',
  'NC II Contact Center Servicing (Springboard Career Academy)',
  'Career Service Professional Eligibility (CSC)',
  'Career Service Sub-Professional Eligibility (CSC)',
];

const education = [
  'B.S. Criminology (undergraduate coursework), Pamantasan ng Lungsod ng Muntinlupa, 2009–2013',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gerald B. Aton',
  url: 'https://gerald-aton.vercel.app',
  image: 'https://gerald-aton.vercel.app/Modern Dark Studio Portrait.png',
  sameAs: ['https://linkedin.com/in/geraldaton', 'https://github.com/sensesVoid'],
  jobTitle: 'Trust & Safety Consultant',
  worksFor: { '@type': 'Organization', name: 'Independent' },
  knowsAbout: ['Content Moderation', 'Quality Assurance', 'Customer Support', 'AI Agent Harnesses', 'LLM Memory Systems', 'Hyperdimensional Computing'],
  alumniOf: { '@type': 'EducationalOrganization', name: 'Pamantasan ng Lungsod ng Muntinlupa' },
};
---

<BaseLayout title={page.data.title} description={page.data.description} jsonLd={jsonLd}>
  <section class="section pt-20 lg:pt-28" aria-labelledby="about-hero">
    <div class="container-custom">
      <div class="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16 items-start">
        {/* Portrait Sidebar */}
        <aside class="lg:sticky lg:top-24 flex flex-col items-center text-center lg:text-left">
          <Portrait src="/Modern Dark Studio Portrait.png" alt="Gerald B. Aton — professional portrait" />
          <div class="mt-6 w-full">
            <h1 class="text-2xl sm:text-3xl font-bold text-brand-text mb-1">Gerald B. Aton</h1>
            <p class="text-brand-muted mb-2">Pasay City, Philippines</p>
            <p class="text-brand-accent text-sm font-medium mb-6">Content Moderation • US Support • AI Tooling</p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-3">
              <a href="mailto:geraldaton20@gmail.com" class="btn-secondary text-sm" aria-label="Email">✉ Email</a>
              <a href="https://linkedin.com/in/geraldaton" class="btn-secondary text-sm" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">⟶ LinkedIn</a>
              <a href="https://github.com/sensesVoid" class="btn-secondary text-sm" target="_blank" rel="noopener noreferrer" aria-label="GitHub">⌘ GitHub</a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div class="space-y-16">
          <Hero {...page.data.hero} />

          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading" class="text-2xl font-bold text-brand-text mb-4">Professional Summary</h2>
            <p class="text-brand-muted leading-relaxed">
              Content moderator, quality analyst and customer support professional with 8 years of experience in policy enforcement, US customer support, fintech, telecom and consumer technology. Proven results in quality, productivity and customer satisfaction, including a 20% productivity gain from an automation project and a policy knowledge base that earned a 100% site quality score. Self-directed AI builder, hands-on with AI agent harnesses, coding CLIs and local LLM tooling.
            </p>
          </section>

          <Timeline title="Professional Experience" items={experience} />
          <Timeline title="AI Development Period (Mar–Sep 2025)" items={aiPeriod} />

          <section aria-labelledby="skills-heading">
            <h2 id="skills-heading" class="text-2xl font-bold text-brand-text mb-6">Core Skills</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <article key={category} class="card">
                  <h3 class="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">{category}</h3>
                  <div class="flex flex-wrap gap-2">
                    {items.map(skill => <Badge key={skill} variant="default">{skill}</Badge>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="certifications-heading" class="space-y-8">
            <h2 id="certifications-heading" class="text-2xl font-bold text-brand-text mb-4">Certifications</h2>
            <ul class="space-y-2">
              {certifications.map((cert, i) => (
                <li key={i} class="flex items-start gap-3 text-brand-muted">
                  <span class="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" aria-hidden="true" />
                  {cert}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="education-heading">
            <h2 id="education-heading" class="text-2xl font-bold text-brand-text mb-4">Education</h2>
            <ul class="space-y-2">
              {education.map((edu, i) => (
                <li key={i} class="flex items-start gap-3 text-brand-muted">
                  <span class="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" aria-hidden="true" />
                  {edu}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify about page renders correctly**

Run: `npm run dev` → visit `http://localhost:4321/about`
Expected: Portrait left (sticky), bio right, timeline, skills grid, certifications, education

- [ ] **Step 5: Commit**

```bash
git add src/content/pages/about.mdx src/pages/about.astro src/components/Timeline.astro
git commit -m "feat: implement about page with portrait, bio, timeline, skills, certifications, education"
```

---

### Task 7: Contact Page (`/contact`) with Vercel Forms

**Files:**
- Create: `src/content/pages/contact.mdx`
- Create: `src/pages/contact.astro`
- Create: `src/scripts/vercel-form.ts`

**Interfaces:**
- Consumes: `BaseLayout`, page frontmatter
- Produces: Contact page with form (Vercel Forms), direct links, availability note

- [ ] **Step 1: Write `src/content/pages/contact.mdx`**

```mdx
---
title: "Contact — Gerald B. Aton"
description: "Get in touch for Trust & Safety consulting, Support Operations & QA, AI Automation, or Fractional QA Lead engagements."
hero:
  headline: "Let's Work Together"
  subhead: "Currently accepting new consulting engagements. Based in Philippines (UTC+8), available for async + sync collaboration across US/EU/APAC time zones."
  ctaPrimary:
    text: "Book a Discovery Call"
    href: "mailto:geraldaton20@gmail.com?subject=Discovery Call Request"
---
```

- [ ] **Step 2: Write `src/pages/contact.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/Hero.astro';
import { getEntry } from 'astro:content';
import Badge from '@/components/Badge.astro';

const page = await getEntry('pages', 'contact');

const serviceOptions = [
  { value: 'trust-safety', label: 'Trust & Safety Foundations' },
  { value: 'support-qa', label: 'Support Operations & QA' },
  { value: 'ai-automation', label: 'AI Automation & Tooling' },
  { value: 'fractional-qa', label: 'Fractional QA Lead' },
  { value: 'other', label: 'Other' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Gerald B. Aton',
  url: 'https://gerald-aton.vercel.app/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Gerald B. Aton',
    email: 'mailto:geraldaton20@gmail.com',
    url: 'https://gerald-aton.vercel.app',
  },
};
---

<BaseLayout title={page.data.title} description={page.data.description} jsonLd={jsonLd}>
  <section class="section pt-20" aria-labelledby="contact-hero">
    <div class="container-custom max-w-3xl">
      <Hero {...page.data.hero} />
      
      <div class="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section aria-labelledby="form-heading">
          <h2 id="form-heading" class="text-2xl font-bold text-brand-text mb-6">Send a Message</h2>
          <form action="/api/contact" method="POST" class="space-y-5" id="contact-form">
            <input type="hidden" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true" />
            
            <div>
              <label for="name" class="block text-sm font-medium text-brand-text mb-1">Name *</label>
              <input type="text" id="name" name="name" required class="w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" placeholder="Your name" />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-brand-text mb-1">Email *</label>
              <input type="email" id="email" name="email" required class="w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" placeholder="you@example.com" />
            </div>
            
            <div>
              <label for="company" class="block text-sm font-medium text-brand-text mb-1">Company</label>
              <input type="text" id="company" name="company" class="w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" placeholder="Your company (optional)" />
            </div>
            
            <div>
              <label for="service" class="block text-sm font-medium text-brand-text mb-1">Service Interest *</label>
              <select id="service" name="service" required class="w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent">
                <option value="">Select a service...</option>
                {serviceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-brand-text mb-1">Message *</label>
              <textarea id="message" name="message" rows="5" required class="w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-y" placeholder="Tell me about your project..."></textarea>
            </div>
            
            <button type="submit" class="btn-primary w-full sm:w-auto" id="submit-btn">
              Send Message
            </button>
            
            <p class="text-xs text-brand-muted">By submitting, you agree to be contacted regarding your inquiry. No spam, ever.</p>
          </form>
          
          {/* Success toast */}
          <div id="form-success" class="hidden mt-4 p-4 rounded-lg bg-brand-success/20 border border-brand-success/30 text-brand-success" role="alert" aria-live="polite">
            Thanks! I'll respond within 1 business day.
          </div>
        </section>

        {/* Direct Links & Availability */}
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" class="text-2xl font-bold text-brand-text mb-6">Or Reach Me Directly</h2>
          
          <div class="space-y-4 mb-8">
            <a href="mailto:geraldaton20@gmail.com?subject=Consulting Inquiry" class="flex items-center gap-4 p-4 card group" aria-label="Email Gerald">
              <span class="text-2xl" aria-hidden="true">✉</span>
              <div>
                <p class="font-medium text-brand-text group-hover:text-brand-accent transition-colors">Email</p>
                <p class="text-sm text-brand-muted">geraldaton20@gmail.com</p>
              </div>
            </a>
            
            <a href="https://linkedin.com/in/geraldaton" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 card group" aria-label="LinkedIn profile">
              <span class="text-2xl" aria-hidden="true">⟶</span>
              <div>
                <p class="font-medium text-brand-text group-hover:text-brand-accent transition-colors">LinkedIn</p>
                <p class="text-sm text-brand-muted">linkedin.com/in/geraldaton</p>
              </div>
            </a>
            
            <a href="https://github.com/sensesVoid" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 card group" aria-label="GitHub profile">
              <span class="text-2xl" aria-hidden="true">⌘</span>
              <div>
                <p class="font-medium text-brand-text group-hover:text-brand-accent transition-colors">GitHub</p>
                <p class="text-sm text-brand-muted">github.com/sensesVoid</p>
              </div>
            </a>
          </div>
          
          <div class="p-4 rounded-lg bg-brand-elevated/50 border border-brand-border">
            <h3 class="font-medium text-brand-text mb-2">Availability</h3>
            <p class="text-brand-muted text-sm">
              Currently accepting new consulting engagements. Based in Philippines (UTC+8), available for async + sync collaboration across US/EU/APAC time zones.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>

  <script is:inline>
    // Handle form submission feedback
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
      form.classList.add('hidden');
      success.classList.remove('hidden');
    }
    
    form?.addEventListener('submit', () => {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    });
  </script>
</BaseLayout>
```

- [ ] **Step 3: Write `src/scripts/vercel-form.ts` (Vercel serverless function)**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, service, message, _gotcha } = req.body;

  // Honeypot spam check
  if (_gotcha) {
    return res.status(200).redirect('/contact?success=1');
  }

  // Basic validation
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // In production, send email via Resend/SendGrid/nodemailer
  // For now, log and redirect success
  console.log('Contact form submission:', { name, email, company, service, message });

  return res.status(200).redirect('/contact?success=1');
}
```

- [ ] **Step 4: Verify contact page renders and form submits**

Run: `npm run dev` → visit `http://localhost:4321/contact`
Expected: Form with validation, direct links, availability note. Form POST works (check network tab)

- [ ] **Step 5: Commit**

```bash
git add src/content/pages/contact.mdx src/pages/contact.astro src/scripts/vercel-form.ts
git commit -m "feat: implement contact page with Vercel Forms and serverless handler"
```

---

### Task 8: Assets, Favicon, OG Image, Final Polish

**Files:**
- Copy: `Modern Dark Studio Portrait.png` → `public/Modern Dark Studio Portrait.png`
- Create: `public/favicon.svg`
- Create: `src/scripts/og-image.ts` (optional, for dynamic OG)
- Modify: `astro.config.mjs` (add image optimization)

**Interfaces:**
- Consumes: Photo file, design system colors
- Produces: Optimized portrait, favicon, OG image generation

- [ ] **Step 1: Copy portrait to public**

```bash
cp "Modern Dark Studio Portrait.png" public/
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1F4A9A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3A7BD8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#grad)" />
  <text x="50" y="62" font-family="system-ui, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">GBA</text>
</svg>
```

- [ ] **Step 3: Update `astro.config.mjs` for image optimization**

```js
// Add to integrations array
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gerald-aton.vercel.app',
  integrations: [mdx(), sitemap(), tailwind()],
  output: 'static',
  trailingSlash: 'always',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
```

- [ ] **Step 4: Verify build succeeds and Lighthouse scores**

Run: `npm run build && npm run preview`
Then run Lighthouse on `http://localhost:4321`
Expected: Build passes, Lighthouse Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

- [ ] **Step 5: Commit**

```bash
git add public/Modern\ Dark\ Studio\ Portrait.png public/favicon.svg astro.config.mjs
git commit -m "feat: add portrait, favicon, image optimization config"
```

---

### Task 9: Vercel Deployment & DNS

**Files:**
- None (configuration via Vercel dashboard)

**Interfaces:**
- Consumes: GitHub repo, Vercel account
- Produces: Live site at `*.vercel.app`

- [ ] **Step 1: Create Vercel account and project**

Manual: Go to vercel.com → Sign up with GitHub → Import `gerald-aton/portfolio` repo

- [ ] **Step 2: Configure environment variables in Vercel**

None required for MVP (Vercel Forms works automatically)

- [ ] **Step 3: Deploy and verify**

Manual: Trigger deploy → Verify `https://gerald-aton.vercel.app` loads correctly

- [ ] **Step 4: Add custom domain (deferred)**

Note: Custom domain can be added later in Vercel dashboard

- [ ] **Step 5: Commit deployment config**

```bash
# No code changes, but document in README
git commit --allow-empty -m "chore: deploy to Vercel at gerald-aton.vercel.app"
```

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-11-11-portfolio.md`. Please review the plan. Does it capture what you want?**

**Recommended execution approach: Subagent-driven** — because:
- 9 independent tasks with clear interfaces
- Each task produces testable deliverable (working page/component)
- Visual verification needed at each step (design fidelity)
- Mistakes in one task (e.g., color palette) cascade to later tasks
- Subagent-driven gives fresh reviewer per task + whole-branch review at end