// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import pageDates from './src/lib/page-dates.json' with { type: 'json' }

/**
 * Post dates for sitemap `lastmod`, read straight off the frontmatter.
 *
 * The config cannot import `astro:content` — it runs before the content layer
 * exists — so this reads the files itself. Deliberately dumb: a regex over the
 * frontmatter block, no YAML parser, because the schema in
 * src/content.config.ts has already made these fields mandatory and ISO. If a
 * post ever reaches here without them, the build should stop, not guess a
 * date; a sitemap that reports a wrong `lastmod` is worse than one that omits
 * the page, because it teaches the crawler to distrust every other entry.
 */
function insightDates() {
  const dir = path.resolve(import.meta.dirname, './src/content/insights')
  if (!fs.existsSync(dir)) return {}

  /** @type {Record<string, {published: string, modified: string}>} */
  const dates = {}
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    if (/^draft:\s*true\s*$/m.test(frontmatter)) continue

    /** @param {string} key */
    const read = (key) => frontmatter.match(new RegExp(`^${key}:\\s*'?"?(\\d{4}-\\d{2}-\\d{2})'?"?\\s*$`, 'm'))?.[1]
    const published = read('published')
    const modified = read('modified')
    if (!published || !modified) {
      throw new Error(`astro.config: src/content/insights/${file} has no ISO published/modified date`)
    }
    dates[`/insights/${file.replace(/\.md$/, '')}`] = { published, modified }
  }

  // The index derives its own `modified` from the newest post it lists (see
  // src/pages/insights.astro), so the sitemap has to derive it the same way or
  // the two freshness signals disagree on every publish.
  const newest = Object.values(dates).reduce(
    (latest, entry) => (entry.modified > latest ? entry.modified : latest),
    pageDates['/insights']?.modified ?? '',
  )
  if (newest) dates['/insights'] = { published: pageDates['/insights'].published, modified: newest }

  return dates
}

/** Read once at config load, not once per sitemap entry. */
const INSIGHT_DATES = insightDates()

/**
 * Static output. Every route is a marketing page whose content is known at
 * build time, which is the whole reason for moving off the client-rendered
 * SPA: Googlebot renders JS, but the social scrapers behind link previews and
 * most AI crawlers do not, and they were being served an empty <div id="root">.
 *
 * `site` is what @astrojs/sitemap and every canonical/og:url are built from, so
 * it is the one value here that is wrong in a way that costs something. It must
 * match the live origin exactly — see the note on `url` in src/lib/site.ts.
 */
export default defineConfig({
  site: 'https://akvega.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit /services.html rather than /services/index.html. Firebase Hosting
    // serves both, but `cleanUrls` in firebase.json already strips the
    // extension, and flat files keep the canonical and the served path
    // identical without a redirect hop.
    format: 'file',
  },
  integrations: [
    react(),
    sitemap({
      // The generated sitemap replaces the hand-maintained public/sitemap.xml,
      // which had to be edited by hand every time a route was added and had
      // already drifted once.
      changefreq: 'monthly',
      // Per-page lastmod from the same map that feeds `dateModified` in each
      // page's JSON-LD and the visible "Last updated" line, so the three
      // freshness signals agree. Pages not in the map (service pages carry
      // their own dates) fall back to the build date.
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\.html$/, '').replace(/(.)\/$/, '$1') || '/'
        /** @type {Record<string, {modified: string}>} */
        const dates = { ...pageDates, ...INSIGHT_DATES }
        if (dates[path]) item.lastmod = dates[path].modified
        return item
      },
      // /work is `noindex` in its own head (an honest empty state until real
      // case studies exist) and stays out of the sitemap so the two signals
      // agree. Drop this filter the day it has content.
      filter: (page) => !/\/work(\.html)?$/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    build: {
      target: 'es2022',
    },
  },
})
