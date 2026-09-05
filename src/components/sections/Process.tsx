import { revealDelay } from '@/lib/useInView'
import { process } from '@/lib/services'

export default function Process() {

  return (
    <section
      data-reveal-root
data-shown="false"
      className="mx-auto max-w-site px-5 py-28 sm:px-8 sm:py-40"
    >
      <h2 className="reveal type-section-title">
        How the work runs.
      </h2>
      <p
        style={revealDelay(1)}
        className="reveal type-lede mt-6 max-w-[52ch] text-ink-muted"
      >
        Four stages, in this order, whichever track you start on.
      </p>

      {/* The sequence is the content, so the steps are numbered — and now a
          single drawn line threads all four together before the numbers even
          register. A grid alone says "four things"; a path says "in order."
          Reuses the exact draw + gradient mechanism Approach and CallToAction
          already carry — no new device, just this section's own copy of it.
          Nodes sit at each column's centre (12.5/37.5/62.5/87.5%), which only
          holds at the even lg:grid-cols-4 row, so the spine is lg:-only. */}
      <div className="relative mt-20 lg:mt-28">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 -top-9 hidden h-6 w-full lg:block"
        >
          <defs>
            <linearGradient id="akv-process-path" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-energy)" />
              <stop offset="50%" stopColor="var(--color-signal)" />
              <stop offset="100%" stopColor="var(--color-vega)" />
            </linearGradient>
          </defs>
          <path
            d="M50 12H350"
            pathLength="1"
            style={revealDelay(1, 120)}
            className="draw"
            stroke="url(#akv-process-path)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {[50, 150, 250, 350].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy="12"
              r="4.5"
              style={revealDelay(i + 2, 120)}
              className="reveal"
              fill="var(--color-signal)"
              stroke="var(--color-paper)"
              strokeWidth="2"
            />
          ))}
        </svg>

        <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {process.map((step, i) => (
            <li key={step.title} className="reveal relative" style={revealDelay(i + 2, 90)}>
              <div className="flex items-center gap-4">
                <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tabular-nums text-ink/15">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-ink/15 to-transparent"
                />
              </div>
              <h3 className="type-card-title mt-7">
                {step.title}
              </h3>
              <p className="type-body mt-3 max-w-[38ch] text-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
