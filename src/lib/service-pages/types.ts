import type { FaqItem } from '@/lib/services'

/**
 * Content for one service page at /services/<slug>.
 *
 * One concept per page, structured for extraction: a question as the H1, a
 * dated overview, a key-facts block of quotable sentences, then the human
 * depth. The `slug` must match an entry in lib/services.ts — that file owns
 * the name, blurb and deliverables; this one owns the page. Dates live in
 * lib/page-dates.json under `/services/<slug>`, with every other page.
 *
 * Rules, enforced by the route and by review:
 * - `keyFacts`: 5–7 sentences, each ≤ 20 words, each complete on its own.
 *   Start with the subject ("Akvega…", "Google Ads…"), never with a pronoun.
 * - `faqs`: 10–15 questions a buyer actually asks, answers 30–50 words with
 *   the answer in the first sentence.
 * - No statistics, percentages, client names, review counts or headcounts
 *   unless the figure is real and sourced. An adjective is better than an
 *   invented number.
 * - No names of other businesses.
 */
export type ServicePage = {
  slug: string
  /** <title>, ≤ 70 characters, ends with " | Akvega". */
  title: string
  /** Meta description, ≤ 160 characters. */
  description: string
  /** The H1, phrased as the buyer's question. */
  h1: string
  /** 40–60 words: what it is, what it covers, why it matters. */
  overview: string
  keyFacts: string[]
  /** What the engagement includes, 4–6 items. */
  included: { title: string; body: string }[]
  /** How it runs, 3–4 steps in order. */
  howItRuns: { title: string; body: string }[]
  faqs: FaqItem[]
  /** Slugs of related services, 2–3. */
  related: string[]
}
