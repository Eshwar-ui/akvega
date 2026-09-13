// @ts-check
import path from 'node:path'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import pageDates from './src/lib/page-dates.json' with { type: 'json' }

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
        const dates = pageDates
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
