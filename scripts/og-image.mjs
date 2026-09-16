/**
 * Render the social preview card for every insights post.
 *
 * Every post needs its own `og:image`. Sharing all of them with the site-wide
 * card means a link to the pricing post and a link to the homepage look
 * identical in a LinkedIn feed or a Slack unfurl, which throws away the one
 * piece of context a preview exists to give.
 *
 * Rendered with the Chromium already installed for scripts/screenshot.mjs
 * rather than drawn by hand in a design tool, for three reasons: the cards
 * stay identical to the site's own type and gradient system because they use
 * the same tokens; a post title change regenerates rather than going stale;
 * and nobody has to open Figma to publish.
 *
 * The layout deliberately mirrors public/og.png — logo, headline, gradient
 * rule, footing — with a cluster overline added, so a post card and the site
 * card read as one family.
 *
 * Usage:
 *   npm run og            # every post
 *   npm run og -- <slug>  # one post
 *
 * Output is committed to public/og/insights/<slug>.png, because the build
 * copies public/ verbatim and the image has to exist before the page that
 * references it is built.
 */
import { mkdir, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const CONTENT = path.resolve(process.cwd(), 'src/content/insights')
const OUT = path.resolve(process.cwd(), 'public/og/insights')
const LOGO = path.resolve(process.cwd(), 'public/full-logo.svg')

const { clusterFor } = await import('../src/lib/insight-clusters.ts')

/**
 * Enough YAML for this frontmatter and no more. The collection schema in
 * src/content.config.ts is what actually validates these files; this only has
 * to read four scalar fields back out of one that already passed.
 */
function frontmatter(raw, file) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]
  if (!block) throw new Error(`${file}: no frontmatter`)

  const scalar = (key) => {
    const line = block.match(new RegExp(`^${key}:[ \\t]*(.+)$`, 'm'))?.[1]
    return line?.trim().replace(/^['"]|['"]$/g, '')
  }

  const data = {
    h1: scalar('h1'),
    cluster: scalar('cluster'),
    modified: scalar('modified'),
    draft: scalar('draft') === 'true',
  }
  for (const key of ['h1', 'cluster', 'modified']) {
    if (!data[key]) throw new Error(`${file}: frontmatter is missing "${key}"`)
  }
  return data
}

const humanDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/**
 * The card. Tokens copied from src/index.css rather than imported — this page
 * is rendered outside the Vite pipeline, so Tailwind is not available to it.
 * If the palette in index.css changes, it changes here too.
 */
function cardHtml({ h1, clusterLabel, modified, logo }) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #051127;
    --signal: #1487f1;
    --energy: #08c8ee;
    --vega: #3039e8;
    --ice: #eff8ff;
    --ink-muted: #536078;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: Inter, system-ui, sans-serif;
    font-optical-sizing: auto;
    background: var(--ice);
    position: relative;
    overflow: hidden;
  }
  /* The hero-field recipe from index.css, at card scale. */
  .field {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(42% 38% at 34% 44%, rgb(255 255 255 / 0.86), transparent 72%),
      radial-gradient(58% 52% at 34% 44%, color-mix(in oklab, var(--energy) 22%, transparent), transparent 72%),
      radial-gradient(46% 42% at 12% 10%, color-mix(in oklab, var(--vega) 14%, transparent), transparent 74%),
      radial-gradient(52% 48% at 88% 82%, color-mix(in oklab, var(--signal) 22%, transparent), transparent 74%);
  }
  /* The concentric rings from the site card, top right. */
  /* Sized explicitly: a zero-height container would place both circles
     from its own right edge and push them off the canvas entirely. */
  .rings { position: absolute; top: -104px; right: -104px; width: 460px; height: 460px; }
  .rings div {
    position: absolute; border: 1.5px solid color-mix(in oklab, var(--signal) 42%, transparent);
    border-radius: 50%;
  }
  .r1 { inset: 0; }
  .r2 { width: 300px; height: 300px; top: 80px; left: 80px; }
  .content {
    position: relative;
    height: 100%;
    padding: 72px 80px;
    display: flex; flex-direction: column;
  }
  .logo { height: 46px; width: auto; }
  .logo svg { height: 46px; width: auto; display: block; }
  .overline {
    margin-top: auto;
    font-size: 17px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--signal);
  }
  h1 {
    margin-top: 20px;
    font-size: 62px; line-height: 1.08; letter-spacing: -0.028em;
    font-weight: 600; color: var(--navy);
    max-width: 17ch; text-wrap: balance;
  }
  /* Long titles must not push the footing off the card. */
  h1.long { font-size: 52px; max-width: 20ch; }
  .rule {
    margin-top: 32px; width: 132px; height: 4px; border-radius: 2px;
    background: linear-gradient(to right, var(--energy), var(--vega));
  }
  .foot {
    margin-top: 26px;
    display: flex; align-items: baseline; gap: 14px;
    font-size: 21px; color: var(--ink-muted);
  }
  .foot .dot { color: color-mix(in oklab, var(--ink-muted) 45%, transparent); }
</style>
</head>
<body>
  <div class="field"></div>
  <div class="rings"><div class="r1"></div><div class="r2"></div></div>
  <div class="content">
    <div class="logo">${logo}</div>
    <p class="overline">${clusterLabel}</p>
    <h1 class="${h1.length > 58 ? 'long' : ''}">${h1}</h1>
    <div class="rule"></div>
    <div class="foot">
      <span>akvega.com</span><span class="dot">·</span><span>Updated ${modified}</span>
    </div>
  </div>
</body>
</html>`
}

const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
const files = (await readdir(CONTENT)).filter((file) => file.endsWith('.md'))

await mkdir(OUT, { recursive: true })
const logo = await readFile(LOGO, 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  // 1200x630 is the spec'd pixel size, so render at 1:1 rather than retina —
  // a 2x card is four times the bytes for no gain in any unfurl that matters.
  deviceScaleFactor: 1,
})

let written = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  if (only.length > 0 && !only.includes(slug)) continue

  const raw = await readFile(path.join(CONTENT, file), 'utf8')
  const data = frontmatter(raw, file)
  if (data.draft) {
    console.log(`– ${slug} (draft, skipped)`)
    continue
  }

  const html = cardHtml({
    h1: data.h1,
    clusterLabel: clusterFor(data.cluster).label,
    modified: humanDate(data.modified),
    logo,
  })

  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const target = path.join(OUT, `${slug}.png`)
  await page.screenshot({ path: target })
  written += 1
  console.log(`✓ ${path.relative(process.cwd(), target)}`)
}

await browser.close()

if (written === 0) {
  console.error('og-image: nothing rendered — check the slug you passed.')
  process.exit(1)
}
console.log(`\n${written} card(s) rendered.`)
