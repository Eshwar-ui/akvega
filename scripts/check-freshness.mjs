/**
 * Build guard: no page may go stale without someone noticing.
 *
 * Answer engines drop pages that stop changing — the Princeton GEO study puts
 * 95% of citations on content updated within ten months. Every page emits a
 * `dateModified` in its WebPage JSON-LD (from src/lib/dates.ts); this script
 * reads that value back out of dist/ and:
 *
 *   - warns when a page is older than six months (time to plan a refresh)
 *   - fails when a page is older than ten months (the citation cliff)
 *
 * A page with no WebPage node at all also fails: that means it bypassed the
 * layout, and undated pages are the thing this guard exists to prevent.
 *
 * Runs after `astro build` (see package.json).
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DIST = path.resolve(process.cwd(), 'dist')
const WARN_DAYS = 183
const FAIL_DAYS = 304
const DAY = 24 * 60 * 60 * 1000

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

function findWebPageDate(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  let match
  while ((match = re.exec(html))) {
    let node
    try {
      node = JSON.parse(match[1])
    } catch {
      continue
    }
    if (node['@type'] === 'WebPage' && typeof node.dateModified === 'string') {
      return node.dateModified
    }
  }
  return null
}

const now = Date.now()
let failures = 0
let warnings = 0
let scanned = 0

for await (const file of htmlFiles(DIST)) {
  scanned += 1
  const rel = path.relative(process.cwd(), file)
  const modified = findWebPageDate(await readFile(file, 'utf8'))

  if (!modified) {
    failures += 1
    console.error(`✗ ${rel}: no WebPage dateModified — page bypassed the layout?`)
    continue
  }

  const age = Math.floor((now - Date.parse(`${modified}T00:00:00Z`)) / DAY)
  if (Number.isNaN(age)) {
    failures += 1
    console.error(`✗ ${rel}: unparseable dateModified "${modified}"`)
  } else if (age > FAIL_DAYS) {
    failures += 1
    console.error(`✗ ${rel}: last updated ${modified} (${age} days ago) — past the ${FAIL_DAYS}-day limit`)
  } else if (age > WARN_DAYS) {
    warnings += 1
    console.warn(`! ${rel}: last updated ${modified} (${age} days ago) — plan a refresh`)
  }
}

if (scanned === 0) {
  console.error('check-freshness: no HTML in dist/ — nothing was built.')
  process.exit(2)
}

if (failures > 0) {
  console.error(`\ncheck-freshness: ${failures} stale or undated page(s). Refresh the content and bump the date in src/lib/page-dates.json.`)
  process.exit(1)
}

console.log(
  `check-freshness: ${scanned} page(s) dated${warnings ? `, ${warnings} due for a refresh` : ''}.`,
)
