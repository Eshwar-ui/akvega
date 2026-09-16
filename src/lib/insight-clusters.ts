/**
 * The four content clusters, and the existing page each one hangs off.
 *
 * Posts are not a separate content type — they are single-concept pages that
 * happen to be dated, built on the same skeleton as the service pages. What
 * makes them a programme rather than a blog is this file: every post declares
 * a cluster, and every cluster has a hub page that already exists and already
 * ranks for something. A post that does not link up to a hub does not get
 * written (CONTENT.md §0).
 *
 * No `astro:content` import here on purpose. `src/content.config.ts` imports
 * this file to build its `cluster` enum, so anything this module pulls in is
 * loaded before the collection exists. Keep it pure data.
 */

export type ClusterId = 'cost' | 'buying' | 'ai-search' | 'india'

export type Cluster = {
  id: ClusterId
  /** The code used in CONTENT.md's calendar, so the plan and the site agree. */
  code: 'P1' | 'P2' | 'P3' | 'P4'
  label: string
  /** One line for the index page, in the site's voice. */
  summary: string
  /** The page this cluster points up to. Must be a real route. */
  hub: { label: string; href: string }
  /** Matches the two track accents so the clusters sit inside the palette. */
  accent: 'signal' | 'vega'
}

export const clusters: readonly Cluster[] = [
  {
    id: 'cost',
    code: 'P1',
    label: 'What things cost',
    summary:
      'Real numbers for what marketing, websites and apps cost in this market, from a studio that publishes its prices.',
    hub: { label: 'Pricing', href: '/pricing' },
    accent: 'signal',
  },
  {
    id: 'buying',
    code: 'P2',
    label: 'How to buy an agency',
    summary:
      'What to ask, what to insist on, and what it costs you when the people buying the traffic are not the people building the page.',
    hub: { label: 'One team for growth and build', href: '/one-team-for-growth-and-build' },
    accent: 'vega',
  },
  {
    id: 'ai-search',
    code: 'P3',
    label: 'Search in the AI era',
    summary:
      'How answer engines pick what to cite, how to measure whether they know you exist, and which parts of this are measurable yet.',
    hub: { label: 'SEO, AEO & GEO', href: '/services/search' },
    accent: 'signal',
  },
  {
    id: 'india',
    code: 'P4',
    label: 'Building for the Indian buyer',
    summary:
      'UPI, cash on delivery, GST invoicing and what "fast" means on the phones your customers actually hold.',
    hub: { label: 'Online stores', href: '/services/commerce' },
    accent: 'vega',
  },
] as const

export const CLUSTER_IDS = clusters.map((cluster) => cluster.id) as [ClusterId, ...ClusterId[]]

export function clusterFor(id: ClusterId): Cluster {
  const cluster = clusters.find((entry) => entry.id === id)
  if (!cluster) throw new Error(`insight-clusters: unknown cluster "${id}"`)
  return cluster
}

/**
 * Which clusters each hub page draws its related-reading block from.
 *
 * A cluster's `hub` is where its posts point *up* to; this map is the return
 * journey, and it is wider than the hub list because more than one page
 * deserves the links. The Hyderabad page is the clearest case — it is not any
 * cluster's hub, but a local buyer landing there wants the cost posts.
 *
 * A path that is not listed gets no block, which is why the service route can
 * call this for all ten services and only three of them render anything.
 */
const HUB_CLUSTERS: Record<string, readonly ClusterId[]> = {
  '/pricing': ['cost'],
  '/paid-diagnostic': ['buying', 'cost'],
  '/one-team-for-growth-and-build': ['buying'],
  '/digital-marketing-agency-hyderabad': ['cost', 'india'],
  '/services/search': ['ai-search'],
  '/services/commerce': ['india'],
  '/services/websites': ['india'],
  '/services/paid-search': ['cost'],
  '/services/mobile': ['cost'],
}

export function hubClusters(path: string): readonly ClusterId[] {
  return HUB_CLUSTERS[path] ?? []
}

/** The canonical link for a post. One place, so nothing hand-writes the path. */
export const insightHref = (slug: string) => `/insights/${slug}`

/** The index. Linked from the footer and from every hub's related-reading block. */
export const INSIGHTS_PATH = '/insights'
