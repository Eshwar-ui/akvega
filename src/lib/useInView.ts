/**
 * Stagger helper — keeps the delay ladder identical across sections.
 *
 * The `useInView` hook that used to live here is gone. Its job (flip
 * `data-shown` when a section scrolls into view) is now done by
 * scripts/reveal.ts, which is plain DOM code and therefore works for the
 * static Astro sections that make up most of the site. Only components that
 * are already React islands still need this helper, for inline styles.
 */
export function revealDelay(index: number, step = 70, cap = 480) {
  return {
    '--reveal-delay': `${Math.min(index * step, cap)}ms`,
  } as React.CSSProperties
}
