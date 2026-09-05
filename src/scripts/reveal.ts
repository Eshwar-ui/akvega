/**
 * The scroll-entrance mechanism, as ~30 lines of vanilla JS.
 *
 * This replaces the `useInView` React hook for static markup. That hook was the
 * only reason most sections had to be React at all — Approach, Process, Faq,
 * Assurance, the whole Services page — so porting it here is what lets those
 * ship as plain HTML with no island and no hydration cost.
 *
 * Contract is unchanged from the hook: flip `data-shown="true"` on a container
 * once, the first time it reaches the viewport, then stop watching it. `.reveal`
 * and `.draw` in index.css are the only things that read it, and content must
 * never depend on the entrance running.
 */
const SELECTOR = '[data-reveal-root]'

function showAll(nodes: Iterable<Element>) {
  for (const node of nodes) node.setAttribute('data-shown', 'true')
}

export function initReveal() {
  const roots = document.querySelectorAll(SELECTOR)
  if (!roots.length) return

  // Start in the shown state when animating would be wrong or impossible — a
  // reduced-motion preference, or no observer to trigger on.
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    showAll(roots)
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-shown', 'true')
        observer.unobserve(entry.target)
      }
    },
    // Trip slightly before the section is fully on screen, so the rise has
    // finished by the time the reader's eye arrives.
    { rootMargin: '0px 0px -10% 0px', threshold: 0.04 },
  )

  for (const root of roots) {
    // Anything already on screen at load (the first section, usually) should
    // not wait for a scroll event that may never come.
    observer.observe(root)
  }
}

/**
 * Stagger helper — the inline-style twin of `revealDelay` in lib/useInView.ts,
 * for Astro templates that cannot call a React helper.
 */
export function revealDelayStyle(index: number, step = 70, cap = 480) {
  return `--reveal-delay: ${Math.min(index * step, cap)}ms`
}
