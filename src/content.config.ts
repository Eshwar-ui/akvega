import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * Long-form service copy lives in Markdown, not in lib/services.ts.
 *
 * lib/services.ts stays the architecture — the two tracks, the slugs, the
 * one-line blurbs the cards and the footer directory render. This collection is
 * the body copy for the page each service now owns, and it is Markdown because
 * that is the format a writer or the client can edit without touching a .astro
 * file or risking a build.
 *
 * `slug` must match a slug in lib/services.ts. The route asserts that, so a
 * typo fails the build rather than shipping a page that no card links to.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    /** Page <title>. Written per service, not templated from the name. */
    title: z.string().max(65),
    description: z.string().min(70).max(160),
    /** H1. May differ from the nav/card name. */
    heading: z.string(),
    /** The one-sentence promise under the H1. */
    standfirst: z.string(),
    /**
     * Marks copy that has not been through client review. PRODUCT.md requires
     * every claim on this site to be shape-accurate rather than asserted fact,
     * and these pages were drafted from 50-word blurbs — so they ship flagged
     * until someone at Akvega signs them off.
     */
    reviewed: z.boolean().default(false),
  }),
})

export const collections = { services }
