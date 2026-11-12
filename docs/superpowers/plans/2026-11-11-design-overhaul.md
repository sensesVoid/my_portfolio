# Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the portfolio's visual design with distinctive typography, scroll animations, upgraded components, custom icons, micro-interactions, and atmospheric background depth.

**Architecture:** Incremental enhancement of existing Astro + Tailwind components. Add font via @fontsource, scroll animations via IntersectionObserver (vanilla JS, no heavy libs), Lucide SVG icons, and CSS-based visual effects. All changes are additive — no structural rewrites.

**Tech Stack:** Astro 5, Tailwind CSS 3.4, @fontsource/space-grotesk, Lucide icons (inline SVG), vanilla JS for scroll animations

**Spec:** `docs/superpowers/specs/2026-11-11-portfolio-design.md` + design discussion above

---

## Global Constraints

- **Dark mode only** — palette: bg `#1A1A24`, elevated `#1E1E2E`, border `#2D2D3E`, text `#E8E8ED`, muted `#8B8BA3`, accent `#1F4A9A`, accent-hover `#2D6BCE`
- **System font fallback** — Space Grotesk for headings, system UI for body
- **No heavy animation libraries** — vanilla IntersectionObserver + CSS transitions
- **WCAG AA** — contrast maintained, focus-visible rings, reduced-motion respected
- **Lighthouse 90+** — font preload, minimal JS, optimized images

---

## Review Focus

| Input / Condition | Expected Behavior |
|-------------------|-------------------|
| `prefers-reduced-motion` | All scroll animations disabled; elements visible immediately |
| Mobile viewport (< 640px) | Animations simpler; no parallax; touch targets 44px+ |
| Slow network (3G) | Font loads with `font-display: swap`; no layout shift |
| Keyboard navigation | All interactive elements have visible focus rings in accent color |
| Screen reader | Animations don't interfere with reading order; `aria-hidden` on decorative elements |

---

## File Structure Map (Changes)

```
src/
├── components/
│   ├── Hero.astro              ← Major redesign: gradient text, scroll reveal, radial glow
│   ├── TrustSignal.astro       ← New: animated metric card component
│   ├── ServiceCard.astro       ← Upgrade: Lucide icons, hover lift, depth
│   ├── ProjectCard.astro       ← Upgrade: Lucide icons, hover depth
│   ├── Icon.astro              ← New: Lucide SVG icon wrapper
│   ├── BackgroundEffects.astro ← New: radial glow + noise texture
│   └── ScrollReveal.astro      ← New: IntersectionObserver wrapper
├── layouts/
│   └── BaseLayout.astro        ← Add font preload, global noise texture
├── styles/
│   └── global.css              ← Add Space Grotesk, animation utilities, noise texture
├── scripts/
│   └── scroll-animations.js    ← Vanilla IntersectionObserver logic
└── pages/
    └── index.astro             ← Integrate new components
```

---

## Task Breakdown

### Task 1: Add Space Grotesk Font & Global Style Updates

**Files:**
- Modify: `package.json` (add @fontsource/space-grotesk)
- Modify: `src/styles/global.css` (font-face, CSS variables, noise texture, animation utilities)
- Modify: `src/layouts/BaseLayout.astro` (font preload, BackgroundEffects)

**Interfaces:**
- Produces: CSS custom properties for font families, noise texture overlay, scroll-reveal utility classes

- [ ] **Step 1: Install @fontsource/space-grotesk**

Run: `npm install @fontsource/space-grotesk`
Expected: Package added to dependencies

- [ ] **Step 2: Update `src/styles/global.css` with font, noise texture, animations**

```css
/* Add to @layer base */
@import '@fontsource/space-grotesk/400.css';
@import '@fontsource/space-grotesk/500.css';
@import '@fontsource/space-grotesk/600.css';
@import '@fontsource/space-grotesk/700.css';

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --noise-opacity: 0.03;
}

@layer base {
  html { @apply scroll-smooth; }
  body {
    @apply bg-brand-bg text-brand-text antialiased font-body;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px;
  }
  .font-display { font-family: var(--font-display); }
  .font-body { font-family: var(--font-body); }
}

@layer utilities {
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: none; }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
  .text-gradient { background: linear-gradient(135deg, #E8E8ED 0%, #1F4A9A 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
}
```

- [ ] **Step 3: Create `src/components/BackgroundEffects.astro`**

```astro
---
---
<style is:global>
  .radial-glow {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31, 74, 154, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 100% 100%, rgba(45, 107, 206, 0.08) 0%, transparent 60%);
  }
  .page-noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
</style>
<div class="radial-glow" aria-hidden="true" />
<div class="page-noise" aria-hidden="true" />
```

- [ ] **Step 4: Update `src/layouts/BaseLayout.astro` to include BackgroundEffects and font preload**

```astro
<head>
  ...
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/space-grotesk-latin-700.woff2" />
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/space-grotesk-latin-600.woff2" />
</head>
<body class="min-h-screen flex flex-col relative">
  <BackgroundEffects />
  <Header />
  ...
</body>
```

- [ ] **Step 5: Run `npm run build` and verify no errors**

Run: `npm run build`
Expected: Build succeeds, fonts copied to dist

- [ ] **Step 6: Commit**

```bash
git add package.json src/styles/global.css src/components/BackgroundEffects.astro src/layouts/BaseLayout.astro
git commit -m "feat: add Space Grotesk font, noise texture, radial glow, scroll-reveal utilities"
```

---

### Task 2: Create ScrollReveal Component & Utility Script

**Files:**
- Create: `src/components/ScrollReveal.astro`
- Create: `public/scroll-animations.js`
- Modify: `src/layouts/BaseLayout.astro` (include script)

**Interfaces:**
- Consumes: `.reveal` utility classes from global.css
- Produces: Reusable `ScrollReveal` wrapper component

- [ ] **Step 1: Create `src/components/ScrollReveal.astro`**

```astro
---
interface Props {
  children: any;
  delay?: number;
  once?: boolean;
  class?: string;
}
const { children, delay = 0, once = true, class: className = '' } = Astro.props;
const delayClass = delay > 0 ? `reveal-delay-${Math.min(delay, 4)}` : '';
---
<script>
  // Register for IntersectionObserver
  document.documentElement.classList.add('has-js');
</script>
<div class={`reveal ${delayClass} ${className}`} data-scroll-reveal data-reveal-once={once}>
  <slot />
</div>
```

- [ ] **Step 2: Create `public/scroll-animations.js`**

```javascript
// Vanilla IntersectionObserver for scroll reveal
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-scroll-reveal]').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.dataset.revealOnce === 'true') {
          observer.unobserve(entry.target);
        }
      } else if (entry.target.dataset.revealOnce !== 'true') {
        entry.target.classList.remove('visible');
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => observer.observe(el));
})();
```

- [ ] **Step 3: Update `src/layouts/BaseLayout.astro` to include script**

```astro
<body ...>
  <BackgroundEffects />
  <Header />
  <main ...>
    <slot />
  </main>
  <Footer />
  <script src="/scroll-animations.js" defer></script>
</body>
```

- [ ] **Step 4: Verify script loads and animations work**

Run: `npm run dev` → check console, scroll page
Expected: Elements with `data-scroll-reveal` animate in

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollReveal.astro public/scroll-animations.js src/layouts/BaseLayout.astro
git commit -m "feat: add ScrollReveal component and IntersectionObserver animation script"
```

---

### Task 3: Redesign Hero Component

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/content/pages/index.mdx` (add gradient text markers)

**Interfaces:**
- Consumes: `ScrollReveal`, `BackgroundEffects`, font-display, text-gradient utilities
- Produces: Striking hero with gradient headline, animated subhead/CTAs

- [ ] **Step 1: Update `src/components/Hero.astro`**

```astro
---
import ScrollReveal from '@/components/ScrollReveal.astro';
interface Props {
  headline: string;
  subhead: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  badge?: string;
}
const { headline, subhead, ctaPrimary, ctaSecondary, badge } = Astro.props;
// Split headline for gradient accent words (marked with ** in content)
const headlineParts = headline.split('**').map((part, i) => i % 2 === 1 ? <span class="text-gradient">{part}</span> : part);
---
<section class="section pt-20 lg:pt-28 relative overflow-hidden" aria-labelledby="hero-heading">
  <div class="container-custom">
    <div class="max-w-3xl relative z-10">
      {badge && (
        <ScrollReveal delay={0} class="mb-6 inline-block">
          <span class="badge badge-available px-4 py-1.5 text-sm">{badge}</span>
        </ScrollReveal>
      )}
      <h1 id="hero-heading" class="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-brand-text mb-6 leading-[1.1]">
        <ScrollReveal delay={1} class="inline-block">{headlineParts[0]}</ScrollReveal>
        {headlineParts[1] && <ScrollReveal delay={1} class="inline-block">{headlineParts[1]}</ScrollReveal>}
        {headlineParts[2] && <ScrollReveal delay={1} class="inline-block">{headlineParts[2]}</ScrollReveal>}
      </h1>
      <ScrollReveal delay={2} class="mb-8">
        <p class="text-lg sm:text-xl text-brand-muted max-w-2xl leading-relaxed">{subhead}</p>
      </ScrollReveal>
      <ScrollReveal delay={3} class="flex flex-col sm:flex-row gap-4">
        <a href={ctaPrimary.href} class="btn-primary w-full sm:w-auto relative overflow-hidden">
          <span class="relative z-10">{ctaPrimary.text}</span>
          <span class="absolute inset-0 bg-brand-accent-hover opacity-0 hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        </a>
        {ctaSecondary && (
          <a href={ctaSecondary.href} class="btn-secondary w-full sm:w-auto"> {ctaSecondary.text} </a>
        )}
      </ScrollReveal>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Update `src/content/pages/index.mdx` headline with gradient markers**

```mdx
hero:
  headline: "Trust & Safety Operations + **AI Automation** for **Early-Stage Startups**"
  ...
```

- [ ] **Step 3: Verify hero renders with gradient text and animations**

Run: `npm run dev` → visit `/`
Expected: Gradient on accent words, staggered reveal animations

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/content/pages/index.mdx
git commit -m "feat: redesign hero with gradient headline, staggered scroll reveal"
```

---

### Task 4: Create Lucide Icon System & TrustSignal Component

**Files:**
- Create: `src/components/Icon.astro`
- Create: `src/components/TrustSignal.astro`
- Modify: `src/pages/index.astro` (use TrustSignal)

**Interfaces:**
- Consumes: Lucide icon paths (inline SVG), brand colors
- Produces: Reusable Icon component, animated TrustSignal cards

- [ ] **Step 1: Create `src/components/Icon.astro` with key Lucide icons**

```astro
---
interface Props {
  name: 'shield' | 'users' | 'cpu' | 'target' | 'trending-up' | 'award' | 'clock' | 'check-circle' | 'external-link' | 'github' | 'linkedin' | 'mail' | 'code' | 'server' | 'database' | 'zap' | 'sparkles';
  size?: number;
  class?: string;
  ariaLabel?: string;
}
const { name, size = 24, class: className = '', ariaLabel } = Astro.props;

const icons = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v2"/><path d="M15 1v2"/><path d="M9 21v2"/><path d="M15 21v2"/><path d="M1 9h2"/><path d="M1 15h2"/><path d="M21 9h2"/><path d="M21 15h2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><path d="M17 18v-6h-6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M9.053 14.166A12 12 0 0 1 12 12.5"/><path d="M5 21v-2a9 9 0 0 1 4-7.5"/><path d="M15 16.5a9 9 0 0 1 4 7.5v2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  sparkles: '<path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
};

const svg = icons[name] || icons.code;
---
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className} aria-hidden="true" role="img" aria-label={ariaLabel || name}>
  <title>{ariaLabel || name}</title>
  {svg}
</svg>
```

- [ ] **Step 2: Create `src/components/TrustSignal.astro`**

```astro
---
import Icon from '@/components/Icon.astro';
import ScrollReveal from '@/components/ScrollReveal.astro';
interface Props {
  label: string;
  value: string;
  icon?: 'shield' | 'users' | 'cpu' | 'target' | 'trending-up' | 'award' | 'clock' | 'check-circle';
  index: number;
}
const { label, value, icon = 'target', index } = Astro.props;
---
<ScrollReveal delay={index + 1} class="px-4">
  <article class="card relative overflow-hidden group text-center p-6 sm:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-brand-accent/10 hover:border-brand-accent/30 hover:-translate-y-1">
    <div class="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
    <div class="relative z-10 flex flex-col items-center">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-accent/10 text-brand-accent mb-4 group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
        <Icon name={icon} size={28} aria-label={label} />
      </div>
      <dt class="font-display text-4xl sm:text-5xl font-bold text-brand-text mb-1">{value}</dt>
      <dd class="text-sm text-brand-muted max-w-xs">{label}</dd>
    </div>
  </article>
</ScrollReveal>
```

- [ ] **Step 3: Update `src/pages/index.astro` to use TrustSignal**

```astro
// Replace trust signals dl with:
<div class="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
  {page.data.trustSignals?.map((signal, i) => (
    <TrustSignal key={signal.label} {...signal} index={i} icon={getIconForSignal(signal.label)} />
  ))}
</div>

// Helper function:
const getIconForSignal = (label: string) => {
  if (label.includes('Years')) return 'award';
  if (label.includes('Quality')) return 'check-circle';
  if (label.includes('Productivity')) return 'trending-up';
  if (label.includes('TPH')) return 'target';
  if (label.includes('CSAT')) return 'users';
  return 'target';
};
```

- [ ] **Step 4: Verify trust signals render with icons, hover effects, staggered animation**

Run: `npm run dev` → visit `/`
Expected: 5 animated cards with icons, hover lift + border glow

- [ ] **Step 5: Commit**

```bash
git add src/components/Icon.astro src/components/TrustSignal.astro src/pages/index.astro
git commit -m "feat: add Lucide icon system and animated TrustSignal cards"
```

---

### Task 5: Upgrade ServiceCard & ProjectCard with Icons & Micro-interactions

**Files:**
- Modify: `src/components/ServiceCard.astro`
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/pages/services.astro` (update icon usage)
- Modify: `src/pages/projects/index.astro` (update icon usage)

**Interfaces:**
- Consumes: `Icon` component, brand colors, hover utilities
- Produces: Elevated cards with custom icons, hover lift, depth shadows

- [ ] **Step 1: Update `src/components/ServiceCard.astro`**

```astro
---
import Icon from '@/components/Icon.astro';
interface Props {
  title: string;
  description: string;
  icon: 'shield' | 'users' | 'cpu' | 'code' | 'server' | 'database' | 'zap' | 'sparkles';
  href: string;
}
const { title, description, icon, href } = Astro.props;
---
<article class="card group h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 hover:border-brand-accent/30">
  <div class="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
  <div class="relative z-10 flex flex-col h-full">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent mb-4 group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
      <Icon name={icon} size={28} aria-hidden="true" />
    </div>
    <h3 class="font-display text-xl font-semibold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{title}</h3>
    <p class="text-brand-muted flex-1 mb-6">{description}</p>
    <a href={href} class="link text-sm font-medium self-start group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
      Learn more
      <Icon name="external-link" size={14} aria-hidden="true" />
    </a>
  </div>
</article>
```

- [ ] **Step 2: Update `src/components/ProjectCard.astro`**

```astro
---
import Icon from '@/components/Icon.astro';
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
<article class={`card group h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 hover:border-brand-accent/30 ${featured ? 'md:col-span-2' : ''}`}>
  <div class="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
  <div class="relative z-10 flex flex-col h-full">
    <div class="flex flex-wrap gap-2 mb-3">
      {tags.slice(0, 3).map(tag => <span key={tag} class="badge bg-brand-accent/20 text-brand-accent border border-brand-accent/30 px-2.5 py-0.5 text-xs font-medium">{tag}</span>)}
    </div>
    <div class="flex items-center gap-2 mb-2">
      <div class="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
        <Icon name="code" size={20} aria-hidden="true" />
      </div>
      <h3 class="font-display text-xl font-semibold text-brand-text group-hover:text-brand-accent transition-colors">{title}</h3>
    </div>
    <p class="text-brand-muted flex-1 mb-4">{description}</p>
    <div class="flex flex-wrap gap-2 text-xs text-brand-muted mb-4">
      {stack.slice(0, 4).map(tech => <span key={tech} class="px-2 py-0.5 rounded bg-brand-border">{tech}</span>)}
    </div>
    <div class="flex items-center gap-4 pt-4 border-t border-brand-border">
      <a href={href} class="link text-sm font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        View Project
        <Icon name="external-link" size={14} aria-hidden="true" />
      </a>
      {github && <a href={github} class="link text-sm inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" size={16} /> GitHub</a> }
      {demo && <a href={demo} class="link text-sm" target="_blank" rel="noopener noreferrer" aria-label="Live Demo">🔗 Demo</a>}
    </div>
  </div>
</article>
```

- [ ] **Step 3: Update `src/pages/services.astro` to use icon names**

```astro
const services = [
  { title: 'Trust & Safety Foundations', ..., icon: 'shield' },
  { title: 'Support Operations & QA', ..., icon: 'users' },
  { title: 'AI Automation & Tooling', ..., icon: 'cpu' },
  { title: 'Fractional QA Lead', ..., icon: 'sparkles' },
];
```

- [ ] **Step 4: Verify cards render with icons, hover lift, depth shadows**

Run: `npm run dev` → visit `/services`, `/projects`
Expected: Elevated cards with custom icons, smooth hover animations

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiceCard.astro src/components/ProjectCard.astro src/pages/services.astro src/pages/projects/index.astro
git commit -m "feat: upgrade ServiceCard and ProjectCard with Lucide icons, hover lift, depth"
```

---

### Task 6: Update Header, Footer, Buttons with Micro-interactions

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/styles/global.css` (button hover states)

**Interfaces:**
- Consumes: `Icon` component, brand colors
- Produces: Polished navigation with icon links, button hover shine

- [ ] **Step 1: Update `src/components/Header.astro`**

```astro
---
import Icon from '@/components/Icon.astro';
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
      <a href="/" class="font-display font-semibold text-brand-text hover:text-brand-accent transition-colors" aria-label="Gerald B. Aton — Home">
        GBA
      </a>
      <div class="hidden md:flex md:items-center md:gap-6">
        {navLinks.map(link => (
          <a href={link.href} class="text-sm text-brand-muted hover:text-brand-accent transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-accent after:transition-width hover:after:w-full">{link.label}</a>
        ))}
        <a href="/contact" class="btn-primary text-sm relative overflow-hidden">
          <span class="relative z-10">Get in Touch</span>
          <span class="absolute inset-0 bg-brand-accent-hover opacity-0 hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        </a>
      </div>
      <button class="md:hidden p-2 rounded-lg hover:bg-brand-elevated transition-colors" aria-label="Toggle menu">
        <Icon name="menu" size={24} />
      </button>
    </div>
  </nav>
</header>
```

- [ ] **Step 2: Update `src/components/Footer.astro`**

```astro
---
import Icon from '@/components/Icon.astro';
const currentYear = new Date().getFullYear();
const socialLinks = [
  { href: 'mailto:geraldaton20@gmail.com', label: 'Email', icon: 'mail' },
  { href: 'https://linkedin.com/in/geraldaton', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://github.com/sensesVoid', label: 'GitHub', icon: 'github' },
];
---
<footer class="border-t border-brand-border bg-brand-elevated relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-t from-brand-bg/50 to-transparent" aria-hidden="true" />
  <div class="container-custom py-12 lg:py-16 relative z-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <p class="text-sm text-brand-muted">© {currentYear} Gerald B. Aton. Built with Astro & Tailwind.</p>
      <div class="flex items-center gap-6">
        {socialLinks.map(link => (
          <a href={link.href} class="text-brand-muted hover:text-brand-accent transition-colors flex items-center gap-2 p-2 rounded-lg hover:bg-brand-bg" aria-label={link.label} target="_blank" rel="noopener noreferrer">
            <Icon name={link.icon} size={20} />
            <span class="hidden sm:inline">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Add button shine effect to `src/styles/global.css`**

```css
@layer utilities {
  .btn-shine {
    position: relative;
    overflow: hidden;
  }
  .btn-shine::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .btn-shine:hover::after {
    transform: translateX(100%);
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-shine::after { display: none; }
  }
}
```

- [ ] **Step 4: Verify header/footer animations work**

Run: `npm run dev` → check nav links underline animation, footer icon hover, button shine

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/styles/global.css
git commit -m "feat: polish header/footer with icon links, underline animation, button shine"
```

---

### Task 7: Final Polish & Build Verification

**Files:**
- Modify: `src/pages/about.astro` (add ScrollReveal to sections)
- Modify: `src/pages/contact.astro` (add ScrollReveal, button shine)
- Run: Full build + Lighthouse check

**Interfaces:**
- Consumes: All new components/utilities
- Produces: Fully polished, animated, accessible portfolio

- [ ] **Step 1: Add ScrollReveal to About page sections**

```astro
// Wrap each section in <ScrollReveal delay={index} class="mb-16">...</ScrollReveal>
```

- [ ] **Step 2: Add ScrollReveal + button shine to Contact page**

```astro
// Wrap form and links sections in ScrollReveal
// Add btn-shine class to submit button
```

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds, all pages generated

- [ ] **Step 4: Run Lighthouse locally (optional)**

Run: `npm run preview` → Lighthouse in Chrome DevTools
Expected: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

- [ ] **Step 5: Deploy to Vercel**

Run: `npx vercel --prod`
Expected: Deployment ready, public URL accessible

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/contact.astro
git commit -m "feat: final polish - ScrollReveal on all pages, contact form shine"
git push
```

---

### Task 8: Cloudflare AI Workers Chatbot Integration

**Files:**
- Create: `wrangler.toml` (Cloudflare Workers config)
- Create: `src/worker/chat.ts` (AI Workers chat endpoint)
- Create: `src/components/Chatbot.astro` (frontend chat UI)
- Create: `public/chat-widget.js` (client-side widget logic)
- Modify: `src/layouts/BaseLayout.astro` (include chat widget)
- Modify: `package.json` (add @cloudflare/workers-types, hono)

**Interfaces:**
- Consumes: Cloudflare Workers AI (Llama-3.1-8B-Instruct or similar), portfolio context
- Produces: Floating chat widget with streaming responses, context-aware answers

**Cloudflare Requirements:**
- Cloudflare account with Workers AI enabled (free tier: 100k requests/day)
- Account ID, API Token (Workers AI permissions)
- `wrangler login` already done
- KV namespace for conversation history (optional, free tier)

- [ ] **Step 1: Install dependencies**

Run: `npm install hono @cloudflare/workers-types --save-dev`
Expected: Packages added

- [ ] **Step 2: Create `wrangler.toml`**

```toml
name = "gerald-aton-portfolio-chatbot"
main = "src/worker/chat.ts"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]

[ai]
binding = "AI"

[vars]
PORTFOLIO_CONTEXT = "Gerald B. Aton — Trust & Safety consultant, 8 years content moderation/QA/US support. Built SQAC (portable LLM memory), Pyralis (sub-1B LLM), Wizky CLI (Rust + llama.cpp). Available for consulting: T&S foundations, Support Ops & QA, AI Automation, Fractional QA Lead."

[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "<KV_NAMESPACE_ID>"  # create via `wrangler kv:namespace create CHAT_HISTORY`
```

- [ ] **Step 3: Create `src/worker/chat.ts` (Hono + Workers AI)**

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from 'hono/streaming';

type Env = {
  AI: Ai;
  CHAT_HISTORY: KVNamespace;
  PORTFOLIO_CONTEXT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: ['https://portfolio-weld-sigma-1l5rpojwjt.vercel.app', 'http://localhost:4321'] }));

app.post('/api/chat', async (c) => {
  const { messages, sessionId } = await c.req.json();
  
  // Retrieve history from KV
  let history: Array<{role: string, content: string}> = [];
  if (sessionId) {
    const stored = await c.env.CHAT_HISTORY.get(`chat:${sessionId}`);
    if (stored) history = JSON.parse(stored);
  }
  
  // Build system prompt with portfolio context
  const systemPrompt = `You are Gerald's AI assistant on his portfolio site. 
  Context: ${c.env.PORTFOLIO_CONTEXT}
  
  Answer questions about Gerald's experience, services, projects (SQAC, Pyralis, Wizky), and consulting offerings. 
  Be helpful, concise, and professional. If unsure, suggest booking a discovery call.`;
  
  const allMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10), // last 10 turns
    ...messages
  ];
  
  // Stream from Workers AI (Llama-3.1-8B-Instruct)
  return streamText(c, async (stream) => {
    let fullResponse = '';
    const response = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: allMessages,
      stream: true,
      max_tokens: 512,
      temperature: 0.7,
    });
    
    for await (const chunk of response as any) {
      const text = chunk.response || chunk;
      if (text) {
        fullResponse += text;
        stream.write(text);
      }
    }
    
    // Save updated history
    const newHistory = [...history, ...messages.slice(-2), { role: 'assistant', content: fullResponse }].slice(-20);
    if (sessionId) {
      await c.env.CHAT_HISTORY.put(`chat:${sessionId}`, JSON.stringify(newHistory), { expirationTtl: 86400 * 7 });
    }
  });
});

app.get('/api/chat/health', (c) => c.json({ status: 'ok' }));

export default app;
```

- [ ] **Step 4: Create `src/components/Chatbot.astro`**

```astro
---
---
<div id="chatbot-root" class="fixed bottom-6 right-6 z-50" aria-hidden="false">
  <button 
    id="chat-toggle" 
    class="btn-primary btn-shine rounded-full w-14 h-14 flex items-center justify-center shadow-2xl shadow-brand-accent/20 hover:shadow-brand-accent/30 transition-all duration-300 hover:scale-105"
    aria-label="Open chat with Gerald's AI assistant"
    aria-expanded="false"
    aria-controls="chat-window"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>
  
  <div 
    id="chat-window" 
    class="hidden absolute bottom-16 right-0 w-96 h-[500px] bg-brand-elevated border border-brand-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    role="dialog"
    aria-label="Chat with Gerald's AI assistant"
  >
    <div class="flex items-center justify-between p-4 border-b border-brand-border bg-brand-bg/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <div>
          <p class="font-display font-semibold text-brand-text">Gerald's AI</p>
          <p class="text-xs text-brand-muted">Portfolio Assistant</p>
        </div>
      </div>
      <button id="chat-close" class="p-2 rounded-lg hover:bg-brand-bg transition-colors" aria-label="Close chat">
        <svg class="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <div class="prose prose-invert max-w-none text-sm text-brand-muted">
          Hi! I'm Gerald's AI assistant. Ask me about his Trust & Safety experience, SQAC, Pyralis, Wizky, or consulting services. How can I help?
        </div>
      </div>
    </div>
    
    <div class="p-4 border-t border-brand-border bg-brand-bg/50">
      <form id="chat-form" class="flex gap-2">
        <input 
          type="text" 
          id="chat-input" 
          placeholder="Ask about SQAC, consulting, experience..." 
          class="flex-1 rounded-lg border border-brand-border bg-brand-bg px-4 py-2 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
          aria-label="Your message"
          autocomplete="off"
        />
        <button type="submit" class="btn-primary btn-shine p-2 rounded-lg" aria-label="Send message">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  #chat-window::-webkit-scrollbar { width: 6px; }
  #chat-window::-webkit-scrollbar-track { background: transparent; }
  #chat-window::-webkit-scrollbar-thumb { background: #2D2D3E; border-radius: 3px; }
  @media (max-width: 640px) {
    #chat-window { width: calc(100vw - 2rem); right: -1rem; bottom: 4rem; height: 60vh; }
  }
</style>
```

- [ ] **Step 5: Create `public/chat-widget.js`**

```javascript
(function() {
  const toggle = document.getElementById('chat-toggle');
  const window = document.getElementById('chat-window');
  const close = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  
  let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
  let isStreaming = false;
  
  toggle.addEventListener('click', () => {
    const open = window.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', !open);
    if (!open) input.focus();
  });
  
  close.addEventListener('click', () => {
    window.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  });
  
  function appendMessage(role, content, streaming = false) {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-3';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        role === 'assistant' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-border text-brand-text'
      }">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
            role === 'assistant' 
              ? 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              : 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          }" />
        </svg>
      </div>
      <div class="prose prose-invert max-w-none text-sm ${role === 'user' ? 'text-brand-text' : 'text-brand-muted'}">${content}</div>
    `;
    if (streaming) div.id = 'streaming-message';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
  
  function updateStreamingMessage(content) {
    let msg = document.getElementById('streaming-message');
    if (!msg) {
      msg = appendMessage('assistant', '', true);
    }
    msg.querySelector('.prose').innerHTML = content;
    messages.scrollTop = messages.scrollHeight;
  }
  
  async function sendMessage(text) {
    if (isStreaming) return;
    isStreaming = true;
    
    appendMessage('user', text);
    input.value = '';
    input.disabled = true;
    toggle.disabled = true;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: text }], 
          sessionId 
        })
      });
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value, { stream: true });
          updateStreamingMessage(fullResponse);
        }
      }
    } catch (e) {
      updateStreamingMessage('Sorry, something went wrong. Try again or <a href="/contact" class="link">book a call</a>.');
    } finally {
      const streamingMsg = document.getElementById('streaming-message');
      if (streamingMsg) streamingMsg.removeAttribute('id');
      isStreaming = false;
      input.disabled = false;
      toggle.disabled = false;
      input.focus();
    }
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text && !isStreaming) sendMessage(text);
  });
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !window.classList.contains('hidden')) {
      window.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
```

- [ ] **Step 6: Update `src/layouts/BaseLayout.astro` to include chat widget**

```astro
<body class="min-h-screen flex flex-col relative">
  <BackgroundEffects />
  <Header />
  <main class="flex-1" id="main-content">
    <slot />
  </main>
  <Footer />
  <Chatbot client:visible />
  <script src="/scroll-animations.js" defer></script>
  <script src="/chat-widget.js" defer></script>
</body>
```

- [ ] **Step 7: Deploy Worker via Wrangler**

```bash
# Create KV namespace
wrangler kv:namespace create CHAT_HISTORY
# Add the returned ID to wrangler.toml

# Deploy
wrangler deploy
# Note the worker URL (e.g., https://gerald-aton-portfolio-chatbot.senses-void.workers.dev)
```

- [ ] **Step 8: Update `vercel.json` to proxy `/api/chat` to Worker**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "functions": {
    "api/contact.ts": { "maxDuration": 10 }
  },
  "rewrites": [
    { "source": "/api/chat", "destination": "https://<your-worker>.workers.dev/api/chat" }
  ]
}
```

- [ ] **Step 9: Verify chatbot works end-to-end**

Run: `npm run dev` → open chat, ask about SQAC
Expected: Streaming response from Workers AI, persists session in KV

- [ ] **Step 10: Commit**

```bash
git add wrangler.toml src/worker/chat.ts src/components/Chatbot.astro public/chat-widget.js src/layouts/BaseLayout.astro vercel.json package.json
git commit -m "feat: add Cloudflare AI Workers chatbot with streaming responses"
git push
npx vercel --prod
```

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-11-11-design-overhaul.md`. Please review the plan. Does it capture what you want?**

**Recommended execution approach: Native (inline)** — because:
- 8 tasks with clear sequential dependencies (font → animations → hero → components → polish → chatbot)
- Visual verification needed at each step
- Mid-tier model handles CSS/JS well with the detailed plan
- Single final review sufficient