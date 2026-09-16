import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { CLUSTER_IDS } from './lib/insight-clusters'

/**
 * The insights collection — the content programme in CONTENT.md.
 *
 * Markdown, not MDX: a post is prose plus structured metadata, and adding a
 * second templating language to author copy in would be a dependency bought
 * for nothing.
 *
 * The schema is the enforcement mechanism for the rules that matter. Dates
 * are required and must be ISO, because an undated page is the one thing the
 * freshness guard exists to prevent. `keyFacts` and `faqs` are required and
 * bounded, because a post without quotable sentences and a question list is
 * the multi-topic prose the whole plan is a reaction to. A post that breaks
 * any of this fails the build rather than shipping thin.
 *
 * Relative import above, not the `@/` alias: this file is loaded by Astro
 * before the Vite alias config applies to it.
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'dates must be YYYY-MM-DD')

/**
 * Same shape as `FaqItem` in lib/services.ts, so `faqSchema()` can serialise a
 * post's questions with no adapter. Answers are 30–50 words with the answer in
 * the first sentence — the length answer engines extract whole.
 */
const faqItem = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'faq slug must be kebab-case: it is the #faq-<slug> anchor'),
  q: z.string().min(1),
  a: z.string().min(1),
  published: isoDate,
  modified: isoDate,
})

const insights = defineCollection({
  loader: glob({ base: './src/content/insights', pattern: '**/*.md' }),
  schema: z.object({
    /** <title>, ≤ 70 characters, ends with " | Akvega". */
    title: z.string().max(70),
    /** Meta description, ≤ 160 characters. */
    description: z.string().max(160),
    /** The H1, phrased as the question the buyer actually types. */
    h1: z.string(),
    /** 40–60 words directly under the H1: what this answers, and for whom. */
    overview: z.string(),

    published: isoDate,
    /** Bump only when something real changed. See lib/dates.ts. */
    modified: isoDate,

    /** Which cluster this post belongs to, and therefore which hub it links up to. */
    cluster: z.enum(CLUSTER_IDS),
    /** The one query this post is written to answer. Logged in the monthly AEO pass. */
    primaryQuery: z.string().optional(),

    /**
     * 5–7 declarative sentences under 20 words, each checkable on its own with
     * no surrounding context. This is the part a model quotes.
     */
    keyFacts: z.array(z.string()).min(3).max(8),

    /** 6–15 questions, anchored and dated. Serialised as FAQPage JSON-LD. */
    faqs: z.array(faqItem).min(3).max(15),

    /**
     * Key into lib/evidence.ts. A post claiming a measurement should show the
     * panel that backs it rather than restating the number in prose.
     */
    evidenceKey: z.string().optional(),

    /** Extra in-site pages worth linking, beyond the cluster hub. */
    related: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().startsWith('/', 'related links point at pages on this site'),
        }),
      )
      .default([]),

    /** Keeps a post out of the build entirely while it is being written. */
    draft: z.boolean().default(false),
  }),
})

export const collections = { insights }
