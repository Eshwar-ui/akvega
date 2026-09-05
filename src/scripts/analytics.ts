/**
 * The single measurement surface, as one module with no framework attached.
 *
 * WHY NOT A COMPONENT: this was `components/Analytics.tsx`, a React island
 * mounted once in the SPA's RootLayout and driven by `useLocation`. Neither
 * exists here — every route is its own static document — so an island would
 * mean shipping React to pages that otherwise hydrate nothing at all. Same
 * trade as `scripts/reveal.ts` made for the scroll entrance.
 *
 * WHY ONE MODULE: the alternative is an `onclick` on every link in the site,
 * which rots the moment someone adds a sixth CTA and forgets. Everything here
 * is either automatic (scroll depth) or delegated (one document-level click
 * listener that classifies what it caught). A new CTA needs one attribute:
 * `data-cta="some-id"`.
 *
 * NO page_view HERE: GA4 Enhanced Measurement already sends one per document
 * load, and static routing means every navigation is a document load. See
 * lib/analytics.ts.
 *
 * NO TITLE PATCHING EITHER: the SPA had to rewrite `document.title` on
 * navigation because one index.html served five routes. Base.astro now emits
 * each page's own title into static HTML, so there is nothing to correct and
 * `lib/pageMeta.ts` went with it.
 *
 * WHY IT NEVER BLOCKS: no listener can cancel, delay or throw into a user
 * action — all of them are passive/capture observers that read and let go.
 */
import { track } from '@/lib/analytics'
import { loadPerformance } from '@/lib/firebase'

/** Fires once per threshold per page. 90, not 100 — footers rarely bottom out. */
const SCROLL_THRESHOLDS = [25, 50, 75, 90] as const

function locationOf(element: Element): string {
  if (element.closest('header')) return 'header'
  if (element.closest('footer')) return 'footer'
  if (element.closest('form')) return 'form'
  return 'body'
}

/** Trimmed because GA4 truncates parameter values at 100 characters anyway. */
function labelOf(element: Element): string {
  return (element.textContent ?? '').trim().slice(0, 100) || '(no text)'
}

/**
 * Deferred past `load` and then to an idle slot. Loading it during hydration
 * contends with the hero's GSAP intro and leaves it stuck at its from-state
 * (opacity 0) — reproduced on a preview channel, and the reason the intro is
 * the thing that must go first. Nothing is lost by waiting: the page-load
 * trace is reconstructed from buffered PerformanceTimeline entries.
 */
function startPerformanceMonitoring() {
  const schedule =
    window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000))
  schedule(() => void loadPerformance())
}

function schedulePerformanceMonitoring() {
  if (document.readyState === 'complete') startPerformanceMonitoring()
  else window.addEventListener('load', startPerformanceMonitoring, { once: true })
}

function watchScrollDepth() {
  // Per document, not per route: a static navigation is a fresh module, so
  // there is no cross-route reset to get wrong.
  const fired = new Set<number>()

  const measure = () => {
    const scrollable = document.documentElement.scrollHeight
    // A page shorter than the viewport is fully read on arrival; reporting
    // "100% scrolled" for it would inflate every engagement number.
    if (scrollable <= window.innerHeight + 8) return

    const percent = ((window.scrollY + window.innerHeight) / scrollable) * 100

    for (const threshold of SCROLL_THRESHOLDS) {
      if (percent >= threshold && !fired.has(threshold)) {
        fired.add(threshold)
        track('scroll_depth', {
          percent_scrolled: threshold,
          page_path: window.location.pathname,
        })
      }
    }
  }

  window.addEventListener('scroll', measure, { passive: true })
}

function watchClicks() {
  const handleClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const element = target.closest<HTMLElement>('a[href], button, [data-cta]')
    if (!element) return

    const cta = element.dataset.cta
    const href = element.getAttribute('href') ?? ''

    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      track('contact_channel_click', {
        channel: href.startsWith('mailto:') ? 'email' : 'phone',
        location: locationOf(element),
      })
      return
    }

    if (cta) {
      track('cta_click', {
        cta_label: cta,
        cta_location: locationOf(element),
        cta_destination: href || '(button)',
      })
      return
    }

    // Anything left with an absolute URL on another host is a link off the
    // site. Placeholder `#` hrefs and same-site routes fall through to nothing.
    if (!/^https?:\/\//i.test(href)) return

    const url = new URL(href, window.location.href)
    if (url.host === window.location.host) return

    track('outbound_click', {
      link_url: url.href,
      link_domain: url.host,
      link_text: labelOf(element),
    })
  }

  // Capture phase: a component that calls `stopPropagation` in its own click
  // handler must not be able to make the site stop reporting.
  document.addEventListener('click', handleClick, true)
}

export function initAnalytics() {
  schedulePerformanceMonitoring()
  watchScrollDepth()
  watchClicks()
}
