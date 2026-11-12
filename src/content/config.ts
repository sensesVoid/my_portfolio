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
    status: z.string().optional(),
    outcome: z.string().optional(),
    hero: z.object({
      subtitle: z.string(),
      badges: z.array(z.string()),
      links: z.array(z.object({ text: z.string(), href: z.string() })),
    }).optional(),
  }),
});

export const collections = { pages, projects };
