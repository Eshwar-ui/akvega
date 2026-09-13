/**
 * Build guard: fail if any built page still carries a placeholder link.
 *
 * `href="#"` is how the site marked "no real URL yet" — it shipped that way
 * for the social profiles for months. A dead anchor on a live site is a
 * soft signal that the page is unfinished, and on a footer it is on every
 * page. Now that the real profiles exist, a bare `#` is a regression, so
 * the build refuses it. `#main`, `#stack` and other in-page anchors are fine.
 *
 * Also refuses `http://` links to our own origin and any link to the
 * placeholder `example.com`, for the same reason.
 *
 * Runs after `astro build` (see package.json) over dist/**\/*.html.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DIST = path.resolve(process.cwd(), 'dist')

const RULES = [
  { name: 'bare "#" href', pattern: /\bhref=(["'])#\1/g },
  { name: 'empty href', pattern: /\bhref=(["'])\1/g },
  { name: 'example.com placeholder', pattern: /\bhref=(["'])[^"']*example\.com[^"']*\1/g },
  { name: 'insecure link to own origin', pattern: /\bhref=(["'])http:\/\/akvega\.com[^"']*\1/g },
]

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

let failures = 0
let scanned = 0

try {
  for await (const file of htmlFiles(DIST)) {
    scanned += 1
    const html = await readFile(file, 'utf8')
    for (const rule of RULES) {
      const matches = html.match(rule.pattern)
      if (!matches) continue
      failures += matches.length
      console.error(
        `✗ ${path.relative(process.cwd(), file)}: ${matches.length} × ${rule.name}`,
      )
    }
  }
} catch (error) {
  console.error(`check-links: could not read ${DIST} — run \`astro build\` first.`)
  console.error(error)
  process.exit(2)
}

if (scanned === 0) {
  console.error('check-links: no HTML in dist/ — nothing was built.')
  process.exit(2)
}

if (failures > 0) {
  console.error(`\ncheck-links: ${failures} placeholder link(s) in ${scanned} page(s). Fix them in src/lib/site.ts or the page.`)
  process.exit(1)
}

console.log(`check-links: ${scanned} page(s) clean.`)
