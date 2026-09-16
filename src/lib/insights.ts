import { getCollection, type CollectionEntry } from 'astro:content'
import { assertIsoDate, type PageDates } from '@/lib/dates'
import { clusterFor, insightHref, type Cluster, type ClusterId } from '@/lib/insight-clusters'

/**
 * Reading the insights collection. Every route and endpoint that lists posts
 * goes through here, so "which posts are live, and in what order" is decided
 * once.
 *
 * Posts are hidden with `draft: true`, not by a future `published` date. The
 * site is statically built and there is no scheduled rebuild (see
 * .github/workflows), so a date-gated post would sit invisible until someone
 * happened to deploy. Write ahead, flip the flag on the publish date.
 */

export type Insight = CollectionEntry<'insights'>

/** Dates in the shape lib/dates.ts and the layout expect. */
export function datesOf(post: Insight): PageDates {
  const { published, modified } = post.data
  assertIsoDate(published, `insight "${post.id}" published`)
  assertIsoDate(modified, `insight "${post.id}" modified`)
  if (modified < published) {
    throw new Error(`insight "${post.id}": modified (${modified}) is before published (${published})`)
  }
  return { published, modified }
}

export function hrefOf(post: Insight): string {
  return insightHref(post.id)
}

export function clusterOf(post: Insight): Cluster {
  return clusterFor(post.data.cluster)
}

/** Every live post, newest first. */
export async function allInsights(): Promise<Insight[]> {
  const posts = await getCollection('insights', ({ data }) => !data.draft)
  return posts.toSorted((a, b) => b.data.published.localeCompare(a.data.published))
}

/** Live posts in one cluster, newest first. */
export async function insightsInCluster(id: ClusterId): Promise<Insight[]> {
  return (await allInsights()).filter((post) => post.data.cluster === id)
}

/**
 * Posts for a hub's related-reading block. Returns an empty array when the
 * cluster has nothing in it yet, which the component treats as "render
 * nothing" — the calendar starts with one post and most hubs stay empty for
 * months.
 */
export async function relatedInsights(options: {
  clusters: readonly ClusterId[]
  /** Omit the post you are already on. */
  exclude?: string
  limit?: number
}): Promise<Insight[]> {
  const { clusters, exclude, limit = 3 } = options
  const wanted = new Set(clusters)
  return (await allInsights())
    .filter((post) => wanted.has(post.data.cluster) && post.id !== exclude)
    .slice(0, limit)
}
