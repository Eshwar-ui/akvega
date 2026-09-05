import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { track } from '@/lib/analytics'
import { loadPerformance } from '@/lib/firebase'
import { metaForPath } from '@/lib/pageMeta'

/**
 * The single measurement surface. Renders nothing; mounted once in RootLayout.
 *
 * WHY ONE COMPONENT: the alternative is an `onClick={() => track(...)}` on
 * every link in the site, which rots the moment someone adds a sixth CTA and
 * forgets. Everything here is either automatic (titles, scroll depth) or
 * delegated (one document-level click listener that classifies what it
 * caught). A new CTA needs one attribute: `data-cta="some-id"`.
 *
 * NO page_view HERE: GA4 Enhanced Measurement already sends one on load and on
 * every history change. See lib/analytics.ts.
 *
 * WHY IT NEVER BLOCKS: no listener can cancel, delay or throw into a user
 * action — all of them are passive/capture observers that read and let go.
 */

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

export default function Analytics() {
  const location = useLocation()
  const firedThresholds = useRef<Set<number>>(new Set())

  useEffect(() => {
    void loadPerformance()
  }, [])

  /**
   * index.html carries one static title, which is right for the first paint
   * and wrong for every client-side navigation after it. That costs twice:
   * link previews and search engines see one title for five pages, and GA4's
   * automatic page_view reads `document.title` when it fires, collapsing the
   * whole Pages report into a single row.
   */
  useEffect(() => {
    const meta = metaForPath(location.pathname)

    document.title = meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description)

    // Cleared in place rather than reassigned: the scroll effect below holds
    // a reference to this exact Set, so swapping in a new one would leave it
    // reporting against a stale copy and never firing again after the first
    // navigation.
    firedThresholds.current.clear()
  }, [location.pathname])

  useEffect(() => {
    const fired = firedThresholds.current

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
    return () => window.removeEventListener('scroll', measure)
    // Mounted once. The per-route reset is the `clear()` above, not a
    // re-subscription.
  }, [])

  useEffect(() => {
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
      // site. Placeholder `#` hrefs and in-app routes fall through to nothing.
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
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
