import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/Logo'
import { useInView, revealDelay } from '@/lib/useInView'
import { site } from '@/lib/site'

export default function CallToAction() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="px-3 pb-6 sm:px-5 sm:pb-8">
      <div
        ref={ref}
        data-shown={inView}
        className="relative isolate mx-auto max-w-site edge-light-dark overflow-hidden rounded-xl bg-navy px-5 py-20 text-center sm:rounded-2xl sm:px-8 sm:py-36"
      >
        {/* Cropped aperture, echoing the mark. 06: crop motifs boldly. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 w-[520px] opacity-25 sm:-right-16"
        >
          <defs>
            <linearGradient id="akv-cta" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-energy)" />
              <stop offset="100%" stopColor="var(--color-vega)" />
            </linearGradient>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="150"
            pathLength="1"
            className="draw"
            fill="none"
            stroke="url(#akv-cta)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="200"
            r="98"
            pathLength="1"
            style={revealDelay(1, 140)}
            className="draw"
            fill="none"
            stroke="url(#akv-cta)"
            strokeWidth="2"
          />
          <path
            d="M110 290 290 110"
            pathLength="1"
            style={revealDelay(2, 140)}
            className="draw"
            stroke="url(#akv-cta)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <span className="reveal grid size-14 place-items-center rounded-md bg-white">
            <LogoMark className="w-7" />
          </span>

          <h2
            style={revealDelay(1)}
            className="reveal type-section-title mt-9 max-w-[18ch] text-balance text-white">
            Tell us what isn’t{' '}
            <span className="text-energy">moving fast enough.</span>
          </h2>

          <p
            style={revealDelay(2)}
            className="reveal type-lede mt-6 max-w-[48ch] text-blue-200"
          >
            Send the problem, not a brief. We’ll tell you whether it’s a growth
            job, a build job, or neither.
          </p>

          <div
            style={revealDelay(3)}
            className="reveal mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link
              to={site.primaryCta.to}
              className="press type-ui rounded-full bg-white px-7 py-3.5 text-navy"
            >
              {site.primaryCta.label}
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="press type-ui rounded-full border border-white/20 px-7 py-3.5 text-white hover:border-white/50"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
