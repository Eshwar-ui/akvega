import { Link } from 'react-router-dom'
import { revealDelay, useInView } from '@/lib/useInView'

/**
 * No real engagements exist yet to show, and PRODUCT.md rules out fabricating
 * proof — a placeholder `clients` wordmark array in lib/site.ts was carried
 * unrendered for exactly that reason, and has since been removed rather than
 * left as dead data. Rather than a placeholder sentence or invented case
 * studies, this is an honest, designed empty state: says plainly that nothing
 * real is here yet, and hands the visitor the two things this page can't —
 * the service list, and a way to become the first real case study.
 *
 * The line motif is the same circular-aperture vocabulary Approach and
 * CallToAction already carry (06), not a new device — drawn at rest as an
 * open, unfinished ring rather than a completed one, which is the actual
 * point being made here.
 */
export default function Work() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <>
      <div className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="hero-field edge-light relative isolate overflow-hidden rounded-xl border border-hairline sm:rounded-2xl">
          <div className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-24">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
              <Link to="/" className="link-sweep text-ink-muted hover:text-ink">
                Home
              </Link>
              <span aria-hidden="true" className="text-ink-muted">
                /
              </span>
              <span className="font-medium text-ink">Work</span>
            </nav>
            <p className="type-overline mt-7 text-ink-muted">Selected work</p>
            <h1 className="type-page-title mt-3 max-w-[18ch]">
              The work that proves it.
            </h1>
          </div>
        </div>
      </div>

      <section
        ref={ref}
        data-shown={inView}
        className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="relative isolate overflow-hidden rounded-2xl border border-hairline bg-surface/60 px-6 py-20 text-center sm:px-12 sm:py-28">
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]"
          >
            <defs>
              <linearGradient id="akv-work-empty" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-energy)" />
                <stop offset="50%" stopColor="var(--color-signal)" />
                <stop offset="100%" stopColor="var(--color-vega)" />
              </linearGradient>
            </defs>
            {/* An open ring, not a closed one — the incompleteness is the
                point being made, not an accident of the motif. */}
            <circle
              cx="200"
              cy="200"
              r="150"
              pathLength="1"
              strokeDasharray="0.72 0.28"
              className="draw"
              fill="none"
              stroke="url(#akv-work-empty)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <p className="reveal type-overline text-ink-muted">No case studies yet</p>
          <h2
            style={revealDelay(1)}
            className="reveal type-section-title mx-auto mt-6 max-w-[18ch] text-balance"
          >
            Real work, not yet public.
          </h2>
          <p
            style={revealDelay(2)}
            className="reveal type-body mx-auto mt-6 max-w-[46ch] text-ink-muted"
          >
            We're not going to fill this page with stock outcomes and the
            logo swapped out. What lands here will be engagements we've
            actually shipped — with results we can stand behind, not
            metrics we made up for the layout.
          </p>

          <div
            style={revealDelay(3)}
            className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/services"
              className="press type-ui rounded-full bg-navy px-7 py-3.5 text-white"
            >
              See what we do
            </Link>
            <Link
              to="/contact"
              className="press type-ui rounded-full border border-hairline px-7 py-3.5 text-ink hover:border-blue-300"
            >
              Start the first one
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
