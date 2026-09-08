/**
 * Post-build smoke check, run in CI before anything is deployed.
 *
 * `astro build` succeeding only proves the code compiles. The regression this
 * repo was created to fix was a *shipped* one: five routes served from one
 * `index.html`, every page carrying `<link rel="canonical" href="https://akvega.com/">`,
 * which told Google four of the five pages were duplicates of the homepage.
 * A type checker cannot see that. This can.
 *
 * The sitemap is the source of truth on purpose — it is generated from the
 * route table, so adding a page extends these assertions with no edit here.
 *
 * Every URL in the sitemap must:
 *   1. exist as a real file in dist/ (no route promised to crawlers but absent)
 *   2. carry a self-referential canonical (no page claiming to be another)
 *   3. carry a non-empty, unique <title> (no page reusing another's title)
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve(import.meta.dirname, '../dist')
const site = 'https://akvega.com'
const failures = []

function fail(message) {
  failures.push(message)
}

async function read(file) {
  try {
    return await readFile(path.join(dist, file), 'utf8')
  } catch {
    return null
  }
}

/** `/` -> index.html, `/about` -> about.html — matches build.format: 'file'. */
function fileFor(pathname) {
  return pathname === '/' ? 'index.html' : `${pathname.replace(/^\/|\/$/g, '')}.html`
}

function locsIn(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
}

const index = await read('sitemap-index.xml')
if (!index) {
  console.error('dist/sitemap-index.xml is missing — @astrojs/sitemap did not run.')
  process.exit(1)
}

// The index points at child sitemaps; the URLs live one level down.
const urls = []
for (const child of locsIn(index)) {
  const name = child.replace(`${site}/`, '')
  const xml = await read(name)
  if (!xml) {
    fail(`sitemap-index.xml points at ${name}, which is not in dist/`)
    continue
  }
  urls.push(...locsIn(xml))
}

if (urls.length === 0) fail('the sitemap lists no URLs at all')

const titles = new Map()

for (const url of urls) {
  if (!url.startsWith(`${site}/`) && url !== `${site}/`) {
    fail(`${url} is not under ${site} — astro.config.mjs \`site\` and the live origin disagree`)
    continue
  }

  const pathname = new URL(url).pathname
  const file = fileFor(pathname)
  const html = await read(file)
  if (!html) {
    fail(`${pathname} is in the sitemap but dist/${file} does not exist`)
    continue
  }

  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1]
  if (!canonical) fail(`dist/${file} has no canonical link`)
  else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) {
    fail(`dist/${file} claims to be ${canonical} — it is served at ${url}`)
  }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1]?.trim()
  if (!title) fail(`dist/${file} has an empty <title>`)
  else if (titles.has(title)) fail(`dist/${file} reuses the <title> of dist/${titles.get(title)}: "${title}"`)
  else titles.set(title, file)
}

// Not in the sitemap by design — a 404 must never invite indexing — but its
// absence would mean Hosting falls back to its own generic error page.
if (!(await read('404.html'))) fail('dist/404.html is missing')

for (const required of ['robots.txt', 'og.png']) {
  const entries = await readdir(dist).catch(() => [])
  if (!entries.includes(required)) fail(`dist/${required} is missing`)
}

if (failures.length) {
  console.error(`Build check failed (${failures.length}):`)
  for (const message of failures) console.error(`  - ${message}`)
  process.exit(1)
}

console.log(`Build check passed: ${urls.length} routes, each a real file with a self-referential canonical and a unique title.`)
