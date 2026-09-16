/**
 * Screenshot built pages against the preview server.
 *
 * The site is heavily animated on scroll — `data-reveal-root` elements start
 * at `data-shown="false"` and are revealed by an IntersectionObserver in
 * scripts/reveal.ts. A naive `fullPage: true` capture therefore photographs a
 * page with most of its content still invisible, which is worse than no
 * screenshot: it looks like a rendering bug that is not there. So every page
 * is scrolled to the bottom first, one viewport at a time, before anything is
 * captured.
 *
 * Also reports horizontal overflow per page. `<main>` carries
 * `overflow-x-hidden`, which means a too-wide child is clipped rather than
 * scrolling — the failure is silent unless something measures it.
 *
 * Usage:
 *   npm run build && npm run preview     # in one terminal
 *   npm run shots                        # every route, both viewports
 *   npm run shots -- /insights /pricing  # only these
 *
 * Output goes to .screenshots/, which is gitignored.
 */
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4321'
const OUT = path.resolve(process.cwd(), '.screenshots')

/** Every route worth a visual check. Add one when you add a page. */
const DEFAULT_ROUTES = [
  '/',
  '/services',
  '/services/search',
  '/insights',
  '/insights/digital-marketing-cost-hyderabad',
  '/pricing',
  '/paid-diagnostic',
  '/one-team-for-growth-and-build',
  '/digital-marketing-agency-hyderabad',
  '/about',
  '/contact',
]

const VIEWPORTS = [
  { tag: 'desktop', width: 1440, height: 900 },
  // The narrow end of what real traffic here uses. If a layout survives this
  // it survives everything above it.
  { tag: 'mobile', width: 390, height: 844 },
]

const routes = process.argv.slice(2).filter((arg) => arg.startsWith('/'))
const targets = routes.length > 0 ? routes : DEFAULT_ROUTES

const fileName = (route) => (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-'))

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
let overflowing = 0

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  for (const route of targets) {
    const response = await page.goto(BASE + route, { waitUntil: 'networkidle' })
    if (!response?.ok()) {
      console.error(`✗ ${route} — HTTP ${response?.status() ?? 'no response'}`)
      continue
    }

    // Confirm this is actually Akvega before believing a single pixel of it.
    // `astro preview` takes the next free port when 4321 is busy, so another
    // project's dev server on the default port will answer happily and every
    // screenshot and overflow check silently describes someone else's site.
    // That has happened; it is not theoretical.
    const isThisSite = await page.evaluate(
      () => document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') === 'Akvega',
    )
    if (!isThisSite) {
      const title = await page.title()
      console.error(
        `✗ ${BASE} is serving a different site ("${title}").\n` +
          '  `astro preview` falls back to another port when 4321 is taken.\n' +
          '  Run `npx astro preview status` and pass the real one:\n' +
          '    PREVIEW_URL=http://localhost:4322 npm run shots',
      )
      process.exit(2)
    }

    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 90))
      }
      window.scrollTo(0, 0)

      // Land every entrance on its final frame. `reveal-rise` runs 760ms with
      // up to 480ms of stagger, so the last section to trip is still fading in
      // well after the scroll finishes — which photographs as an empty card and
      // reads as a bug that is not there. Zeroing the durations is better than
      // sleeping for the worst case: it is deterministic, and `.reveal` already
      // carries `opacity: 1` outside the animation, so nothing stays hidden.
      const settle = document.createElement('style')
      settle.textContent =
        '*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; }'
      document.head.append(settle)
      await new Promise((resolve) => setTimeout(resolve, 150))
    })

    const base = path.join(OUT, `${fileName(route)}-${viewport.tag}`)
    await page.screenshot({ path: `${base}-hero.png`, animations: 'disabled' })

    // Chromium's `fullPage` capture resizes the viewport to the document
    // height and shoots one frame. On a long page the sections furthest from
    // the last painted position can come back blank — the navy CTA card at the
    // foot of /insights did exactly that, while a normal viewport shot of the
    // same element was perfect. Parking the scroll at the bottom first makes
    // that region the freshly painted one.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(250)
    await page.screenshot({ path: `${base}-full.png`, fullPage: true, animations: 'disabled' })
    await page.evaluate(() => window.scrollTo(0, 0))

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (overflow > 0) {
      overflowing += 1
      console.error(`✗ ${route} (${viewport.tag}): ${overflow}px of horizontal overflow`)
    } else {
      console.log(`✓ ${route} (${viewport.tag})`)
    }
  }

  await context.close()
}

await browser.close()

console.log(`\n${targets.length * VIEWPORTS.length} shot(s) in ${path.relative(process.cwd(), OUT)}`)
if (overflowing > 0) {
  console.error(`${overflowing} page/viewport pair(s) overflow horizontally.`)
  process.exit(1)
}
