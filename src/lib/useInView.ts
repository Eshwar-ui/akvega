import { useEffect, useRef, useState } from 'react'

/**
 * Start in the shown state rather than animating, when animating would be
 * wrong or impossible: a reduced-motion preference, or no observer to trigger
 * on. Content must never depend on the entrance running.
 */
const startShown = () =>
  typeof window === 'undefined' ||
  !('IntersectionObserver' in window) ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Fires once, the first time the element reaches the viewport, then stops
 * observing — an entrance is a first-impression effect, not something to
 * replay on every scroll past.
 *
 * Never gate content on the returned flag: it drives `data-shown`, and
 * `.reveal` / `.draw` are the only things that read it.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(startShown)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      // Trip slightly before the section is fully on screen, so the rise has
      // finished by the time the reader's eye arrives.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.04 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return { ref, inView }
}

/** Stagger helper — keeps the delay ladder identical across sections. */
export function revealDelay(index: number, step = 70, cap = 480) {
  return {
    '--reveal-delay': `${Math.min(index * step, cap)}ms`,
  } as React.CSSProperties
}
