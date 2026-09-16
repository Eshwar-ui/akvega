/**
 * Render the hero panel for every insights post.
 *
 *   npm run hero
 *
 * SVG, written directly rather than rasterised through Chromium like the
 * social cards. Three reasons, and the first is the one that matters:
 *
 * - **Weight.** The hero sits above the fold, so whatever goes there is a
 *   candidate for Largest Contentful Paint. The homepage already cost 7.4s of
 *   LCP once by hiding its H1 behind JavaScript (see AEO.md §0), and putting a
 *   300KB photograph in the same position would undo that fix by another
 *   route. These files are a few kilobytes.
 * - **Crispness.** Vector art is exact at any density; there is no 2x variant
 *   to generate or forget.
 * - **No text.** Nothing here needs a font, which sidesteps the problem that
 *   an <img>-referenced SVG cannot load one.
 *
 * The panel is geometry from the brand system — the navy field, the gradient
 * blooms and the concentric rings from public/og.png — plus an abstract bar
 * motif that echoes how this site draws data. It is deliberately *not* a
 * photograph and not an illustration of the subject: a stock desk-and-laptop
 * shot on a page whose argument is "we publish real numbers and they don't"
 * would undercut the page. It is also not informational, so it is marked
 * decorative and carries an empty alt.
 *
 * The logo is not used here. DESIGN.md forbids recolouring or altering it, and
 * a ghosted watermark is an alteration.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT = path.resolve(process.cwd(), 'src/content/insights')
const OUT = path.resolve(process.cwd(), 'public/hero/insights')

const { clusterFor } = await import('../src/lib/insight-clusters.ts')

const NAVY = '#051127'
const SIGNAL = '#1487f1'
const ENERGY = '#08c8ee'
const VEGA = '#3039e8'

const W = 1200
const H = 900

/**
 * A small deterministic hash, so a slug always produces the same panel. The
 * alternative is random art that changes on every regeneration and shows up as
 * a spurious diff.
 */
function seedOf(slug) {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return () => {
    hash = (hash * 1664525 + 1013904223) >>> 0
    return hash / 0xffffffff
  }
}

function panel(slug, accent) {
  const random = seedOf(slug)
  // The lead hue follows the cluster's accent, so the four clusters read
  // slightly differently without needing four designs.
  const lead = accent === 'signal' ? SIGNAL : VEGA

  // Seven bars, lengths drawn from the seeded sequence. Abstract on purpose —
  // they carry no values and must not look like they do.
  const bars = Array.from({ length: 7 }, (_, i) => {
    const y = 250 + i * 62
    const width = 150 + random() * 620
    const hue = i % 3 === 0 ? ENERGY : i % 3 === 1 ? lead : SIGNAL
    const opacity = (0.28 + random() * 0.5).toFixed(2)
    return `<rect x="150" y="${y}" width="${width.toFixed(0)}" height="26" rx="13" fill="${hue}" opacity="${opacity}" />`
  }).join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="presentation">
  <defs>
    <radialGradient id="bloom-a" cx="18%" cy="14%" r="62%">
      <stop offset="0%" stop-color="${VEGA}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${VEGA}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bloom-b" cx="86%" cy="80%" r="66%">
      <stop offset="0%" stop-color="${ENERGY}" stop-opacity="0.42" />
      <stop offset="100%" stop-color="${ENERGY}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bloom-c" cx="62%" cy="26%" r="52%">
      <stop offset="0%" stop-color="${lead}" stop-opacity="0.34" />
      <stop offset="100%" stop-color="${lead}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ENERGY}" />
      <stop offset="100%" stop-color="${VEGA}" />
    </linearGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="28" /></clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${NAVY}" />
    <rect width="${W}" height="${H}" fill="url(#bloom-a)" />
    <rect width="${W}" height="${H}" fill="url(#bloom-b)" />
    <rect width="${W}" height="${H}" fill="url(#bloom-c)" />

    <g fill="none" stroke="${SIGNAL}" stroke-opacity="0.3" stroke-width="2">
      <circle cx="1010" cy="182" r="300" />
      <circle cx="1010" cy="182" r="212" />
      <circle cx="1010" cy="182" r="124" />
    </g>

    ${bars}

    <rect x="150" y="150" width="132" height="6" rx="3" fill="url(#rule)" />
    <rect width="${W}" height="${H}" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2" />
  </g>
</svg>
`
}

const files = (await readdir(CONTENT)).filter((file) => file.endsWith('.md'))
await mkdir(OUT, { recursive: true })

let written = 0
for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const raw = await readFile(path.join(CONTENT, file), 'utf8')
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  if (/^draft:\s*true\s*$/m.test(block)) {
    console.log(`– ${slug} (draft, skipped)`)
    continue
  }
  const cluster = block.match(/^cluster:[ \t]*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '')
  if (!cluster) throw new Error(`hero-image: ${file} has no cluster`)

  const target = path.join(OUT, `${slug}.svg`)
  await writeFile(target, panel(slug, clusterFor(cluster).accent), 'utf8')
  written += 1
  console.log(`✓ ${path.relative(process.cwd(), target)}`)
}

console.log(`\n${written} hero panel(s) rendered.`)
