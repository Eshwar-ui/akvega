import { useInView, revealDelay } from '@/lib/useInView'

export default function Approach() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="px-3 sm:px-5">
      <div
        ref={ref}
        data-shown={inView}
        className="edge-light-dark mx-auto max-w-site overflow-hidden rounded-xl bg-navy px-5 py-24 sm:rounded-2xl sm:px-12 sm:py-32 lg:px-16"
      >
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="reveal type-section-title text-balance text-white">
              Most companies buy these from two different suppliers.
            </h2>
            <div
              style={revealDelay(1)}
              className="reveal type-body mt-8 max-w-[52ch] space-y-5 text-blue-200"
            >
              <p>
                An agency runs the campaigns. A development shop builds the
                product. Neither owns the handover, so the landing page lands
                late, the tracking never quite matches, and the thing that
                actually needed fixing sits in someone else’s backlog.
              </p>
              <p className="type-lede text-white">
                We hold both ends. The team buying the traffic is the team
                shipping the page it arrives on.
              </p>
            </div>
          </div>

          {/*
            06 / Graphic language: circular aperture, one dominant diagonal,
            gradient limited to the three brand hues.
          */}
          <div className="relative">
            <svg
              viewBox="0 0 480 260"
              className="w-full"
              role="img"
              aria-label="Growth and build converging into one team"
            >
              <defs>
                <linearGradient id="akv-converge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-energy)" />
                  <stop offset="50%" stopColor="var(--color-signal)" />
                  <stop offset="100%" stopColor="var(--color-vega)" />
                </linearGradient>
              </defs>

              <circle
                cx="240"
                cy="130"
                r="104"
                pathLength="1"
                style={revealDelay(1, 120)}
                className="draw"
                stroke="url(#akv-converge)"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M8 46C120 46 150 104 196 122"
                pathLength="1"
                style={revealDelay(2, 120)}
                className="draw"
                stroke="url(#akv-converge)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M472 214C360 214 330 156 284 138"
                pathLength="1"
                style={revealDelay(2, 120)}
                className="draw"
                stroke="url(#akv-converge)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="240"
                cy="130"
                r="54"
                pathLength="1"
                style={revealDelay(3, 120)}
                className="draw"
                stroke="url(#akv-converge)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M214 156 266 104"
                pathLength="1"
                style={revealDelay(4, 120)}
                className="draw"
                stroke="url(#akv-converge)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="8"
                cy="46"
                r="4"
                fill="var(--color-energy)"
                className="reveal"
                style={revealDelay(4, 120)}
              />
              <circle
                cx="472"
                cy="214"
                r="4"
                fill="var(--color-vega)"
                className="reveal"
                style={revealDelay(4, 120)}
              />

              <text
                x="8"
                y="26"
                className="fill-white text-[12px] font-semibold uppercase tracking-[0.08em]"
              >
                Growth
              </text>
              <text
                x="472"
                y="244"
                textAnchor="end"
                className="fill-white text-[12px] font-semibold uppercase tracking-[0.08em]"
              >
                Build
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
