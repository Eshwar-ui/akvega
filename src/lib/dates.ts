import pageDates from '@/lib/page-dates.json'

/**
 * Page freshness, one source of truth.
 *
 * Answer engines weight recency hard — the Princeton GEO study puts 95% of
 * citations on content updated within ten months — and they read the date
 * from two places: a visible "Last updated" line and `dateModified` in the
 * page's JSON-LD. Both come from here so they cannot disagree.
 *
 * `page-dates.json` is JSON rather than TS so astro.config.mjs can read the
 * same map for sitemap `lastmod`. Pages generated from their own data
 * (service pages) carry their dates on that data and pass them to the
 * layout; everything else is looked up by path. A page with no date fails
 * the build — an undated page is the one thing this file exists to prevent.
 *
 * Bumping `modified` without changing content is not a refresh. Change
 * something real — a new FAQ, a re-measured number, a retired claim — and
 * then bump it.
 */
export type PageDates = { published: string; modified: string }

const map = pageDates as Record<string, PageDates>

/**
 * `build.format: 'file'` reports pathnames as /about.html during the build
 * and /about in dev. Normalise both to the canonical path.
 */
export function normalisePath(pathname: string): string {
  const path = pathname
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/(.)\/$/, '$1')
  return path || '/'
}

export function datesFor(pathname: string): PageDates | undefined {
  return map[normalisePath(pathname)]
}

/** Every dated static page, for llms.txt and facts.json. */
export function allPageDates(): { path: string; dates: PageDates }[] {
  return Object.entries(map).map(([path, dates]) => ({ path, dates }))
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function assertIsoDate(value: string, where: string): void {
  if (!ISO_DATE.test(value)) {
    throw new Error(`${where}: date "${value}" must be YYYY-MM-DD`)
  }
}
