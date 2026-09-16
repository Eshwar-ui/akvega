/**
 * The monthly-outlay chart for the Hyderabad cost post, generated from
 * lib/pricing.ts rather than drawn by hand.
 *
 *   npm run charts
 *
 * The figures in this chart are the same figures on /pricing. Hand-drawing it
 * would create a third place a price lives, and CONTENT.md §8 is explicit that
 * a wrong published price is a broken promise. So the script reads `packages`
 * and `withGst` from the real file and rewrites the SVG in place, between the
 * markers in the Markdown. Change a price, re-run this, and the post is right.
 *
 * Inline SVG rather than an <img>: inside an <img> the chart cannot inherit
 * Inter from the page, and would silently fall back to whatever sans the
 * reader has. Inline, it wears the site's own type.
 *
 * Design decisions follow the dataviz skill:
 * - Form: stacked bar (fee + minimum ad spend) with a whisker to the maximum.
 *   The post's argument is that the fee is not the number that leaves your
 *   account, so fee and spend have to be separable within one total.
 * - Palette: vega #3039e8 and energy #08c8ee, validated — ΔE 30.1 deutan,
 *   29.8 tritan, 35.3 normal vision, both inside the lightness band. The
 *   validator warns that energy is under 3:1 against white; the relief for
 *   that is visible labels and a table view, and this post has both (every
 *   bar is directly labelled and the same numbers sit in a table above).
 * - Marks: 22px bars, 4px rounded data-end, square at the baseline, a 2px
 *   white gap between segments, hairline solid gridlines.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const POST = path.resolve(
  process.cwd(),
  'src/content/insights/digital-marketing-cost-hyderabad.md',
)
const START = '<!-- chart:outlay -->'
const END = '<!-- /chart:outlay -->'

const { packages, withGst } = await import('../src/lib/pricing.ts')

const FEE = '#3039e8'
const SPEND = '#08c8ee'
const INK = '#051127'
const MUTED = '#536078'
const HAIRLINE = '#d9edfe'
const SURFACE = '#ffffff'

/** Indian grouping, the way every other number in the post is written. */
const inr = (n) => `₹${n.toLocaleString('en-IN')}`

const rows = packages.map((pkg) => {
  const fee = withGst(pkg.monthly)
  return {
    name: pkg.name,
    fee,
    min: fee + pkg.adBudget.min,
    max: fee + pkg.adBudget.max,
  }
})

// Round the axis up to a clean number above the largest total.
const STEP = 50_000
const peak = Math.max(...rows.map((r) => r.max))
const AXIS_MAX = Math.ceil(peak / STEP) * STEP

// Sized for the post's 68ch prose measure (~640px), not for a dashboard. The
// viewBox is close to that width on purpose: scale the SVG far down and the
// 13px labels render at 10px, which is the usual way an inline chart becomes
// unreadable on the page it was made for.
const X0 = 0
const PLOT_W = 616
const BAR_H = 22
const GROUP_H = 78
const TOP = 46
const GAP = 2 // the surface gap between stacked segments
const RADIUS = 4

const x = (value) => X0 + (value / AXIS_MAX) * PLOT_W
const axisY = TOP + rows.length * GROUP_H
const HEIGHT = axisY + 34
const WIDTH = 616

/** A rect with its right end rounded and its left end square. */
const dataEnd = (x0, x1, y, h, r = RADIUS) => {
  const w = x1 - x0
  if (w <= 0) return ''
  const rr = Math.min(r, w)
  return `M${x0.toFixed(1)} ${y}h${(w - rr).toFixed(1)}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${h - rr * 2}a${rr} ${rr} 0 0 1 ${-rr} ${rr}h${-(w - rr).toFixed(1)}z`
}

const ticks = []
for (let value = 0; value <= AXIS_MAX; value += STEP) ticks.push(value)

const gridlines = ticks
  .map(
    (value) =>
      `<line x1="${x(value).toFixed(1)}" y1="${TOP - 10}" x2="${x(value).toFixed(1)}" y2="${axisY}" stroke="${HAIRLINE}" stroke-width="1" />`,
  )
  .join('\n    ')

const tickLabels = ticks
  .map(
    (value) =>
      `<text x="${x(value).toFixed(1)}" y="${axisY + 20}" fill="${MUTED}" font-size="12" text-anchor="${value === 0 ? 'start' : value === AXIS_MAX ? 'end' : 'middle'}" style="font-variant-numeric: tabular-nums">${value === 0 ? '₹0' : `₹${(value / 1000).toLocaleString('en-IN')}k`}</text>`,
  )
  .join('\n    ')

const bars = rows
  .map((row, i) => {
    const top = TOP + i * GROUP_H
    const nameY = top + 12
    const barY = top + 24
    const mid = barY + BAR_H / 2

    const feeX = x(row.fee)
    const minX = x(row.min)
    const maxX = x(row.max)

    return `<g>
      <text x="${X0}" y="${nameY}" fill="${INK}" font-size="14" font-weight="500">${row.name}</text>
      <text x="${WIDTH}" y="${nameY}" fill="${MUTED}" font-size="13" text-anchor="end" style="font-variant-numeric: tabular-nums">${inr(row.min)} – ${inr(row.max)}</text>

      <path d="M${X0} ${barY}h${(feeX - X0 - GAP / 2).toFixed(1)}v${BAR_H}h${-(feeX - X0 - GAP / 2).toFixed(1)}z" fill="${FEE}">
        <title>${row.name} — fee including GST: ${inr(row.fee)}</title>
      </path>
      <path d="${dataEnd(feeX + GAP / 2, minX, barY, BAR_H)}" fill="${SPEND}">
        <title>${row.name} — minimum ad budget: ${inr(row.min - row.fee)}</title>
      </path>

      <line x1="${(minX + 6).toFixed(1)}" y1="${mid}" x2="${(maxX - 5).toFixed(1)}" y2="${mid}" stroke="${SPEND}" stroke-width="2" stroke-linecap="round" />
      <circle cx="${maxX.toFixed(1)}" cy="${mid}" r="4.5" fill="${SPEND}" stroke="${SURFACE}" stroke-width="2">
        <title>${row.name} — maximum monthly outlay: ${inr(row.max)}</title>
      </circle>
    </g>`
  })
  .join('\n    ')

const svg = `<figure class="chart">
  <div class="chart-scroll">
  <svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="outlay-title outlay-desc" width="100%">
    <title id="outlay-title">Total monthly outlay by Akvega package</title>
    <desc id="outlay-desc">${rows
      .map((r) => `${r.name}: fee including GST ${inr(r.fee)}, total ${inr(r.min)} to ${inr(r.max)} a month.`)
      .join(' ')}</desc>

    <g>
      <rect x="${X0}" y="0" width="12" height="12" rx="2" fill="${FEE}" />
      <text x="${X0 + 18}" y="10" fill="${MUTED}" font-size="13">Fee, including GST</text>
      <rect x="${X0 + 150}" y="0" width="12" height="12" rx="2" fill="${SPEND}" />
      <text x="${X0 + 168}" y="10" fill="${MUTED}" font-size="13">Ad budget, paid by you (minimum, then range)</text>
    </g>

    ${gridlines}
    ${bars}

    <line x1="${X0}" y1="${axisY}" x2="${(X0 + PLOT_W).toFixed(1)}" y2="${axisY}" stroke="${HAIRLINE}" stroke-width="1" />
    ${tickLabels}
  </svg>
  </div>
  <figcaption>
    What actually leaves your account each month. The solid block is the Akvega fee including
    18% GST; the rest is ad budget you pay directly to Google or Meta. Generated from the same
    figures as the <a href="/pricing">pricing page</a>.
  </figcaption>
</figure>`

/**
 * Markdown's raw-HTML block ends at the first blank line. Leave the blank
 * lines in and everything after the first one is re-parsed as Markdown —
 * and because SVG children are indented four spaces, that means the rest of
 * the chart renders as a code block. Collapse them so the figure stays one
 * uninterrupted HTML block.
 */
const oneBlock = svg.replace(/\n\s*\n/g, '\n')

const raw = await readFile(POST, 'utf8')
const start = raw.indexOf(START)
const end = raw.indexOf(END)
if (start === -1 || end === -1) {
  throw new Error(`chart-outlay: markers ${START} / ${END} not found in ${path.basename(POST)}`)
}

const next = `${raw.slice(0, start + START.length)}\n${oneBlock}\n${raw.slice(end)}`
await writeFile(POST, next, 'utf8')

console.log(`✓ outlay chart written into ${path.relative(process.cwd(), POST)} (axis to ${inr(AXIS_MAX)})`)
