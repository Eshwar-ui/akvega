import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icons'
import { revealDelay, useInView } from '@/lib/useInView'
import { process } from '@/lib/services'

/**
 * "Studio" in the nav, `/about` in the router — no real team roster, photos
 * or founding story are confirmed, so this page is built entirely from what
 * PRODUCT.md and the brand guidelines already establish as fact: the
 * Growth/Build positioning, the operating model (diagnostic, ownership,
 * lead/embed/bench), and the six personality traits from guideline 01. No
 * invented people, no invented history — see DESIGN.md's placeholder
 * inventory before adding a team section here.
 */
const traits = [
  {
    trait: 'Modern',
    not: 'not futuristic',
    body: "We build with what's proven, not what's trending. No AI theatre, no interface trick a client can't maintain after we leave.",
  },
  {
    trait: 'Confident',
    not: 'not loud',
    body: 'The work should read as sure of itself without needing to shout to prove it.',
  },
  {
    trait: 'Technical',
    not: 'not complicated',
    body: 'Real engineering underneath, explained in plain language on top.',
  },
  {
    trait: 'Direct',
    not: 'not abrupt',
    body: "We'll tell you what isn't working. We won't be rude about it.",
  },
  {
    trait: 'Premium',
    not: 'not ornamental',
    body: 'Quality shows up in the details that hold up under use, not the ones that just look good in a deck.',
  },
  {
    trait: 'Adaptive',
    not: 'not inconsistent',
    body: 'The system flexes per engagement. The standard behind it does not.',
  },
]

const fit = [
  {
    title: 'Lead the engagement',
    body: 'We run it end to end — strategy, delivery and the team behind both.',
    icon: 'target' as const,
  },
  {
    title: 'Embed with yours',
    body: 'Your team sets direction; ours ships inside it, on your tools and cadence.',
    icon: 'layers' as const,
  },
  {
    title: 'Sit behind it as the bench',
    body: 'Your team stays visible to the client or stakeholders; we do the engineering and media work behind them.',
    icon: 'sliders' as const,
  },
]

export default function About() {
  const { ref: valuesRef, inView: valuesInView } = useInView<HTMLDivElement>()
  const { ref: workRef, inView: workInView } = useInView<HTMLDivElement>()
  const { ref: fitRef, inView: fitInView } = useInView<HTMLDivElement>()

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
              <span className="font-medium text-ink">Studio</span>
            </nav>
            <p className="type-overline mt-7 text-ink-muted">Studio</p>
            <h1 className="type-page-title mt-3 max-w-[18ch]">
              One team, built to hold both ends.
            </h1>
            <p className="type-body mt-5 max-w-[52ch] text-ink-muted">
              Akvega runs growth marketing and digital build under one roof —
              not because it's a trend, but because the handoff between two
              vendors is where most of the work actually breaks.
            </p>
          </div>
        </div>
      </div>

      {/* Values — the six personality traits from the brand guidelines
          (01), stated as contrast pairs rather than a generic adjective
          list, since that's the actual documented shape of the brief. */}
      <section
        ref={valuesRef}
        data-shown={valuesInView}
        className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28"
      >
        <p className="reveal type-overline text-ink-muted">How we hold the line</p>
        <h2
          style={revealDelay(1)}
          className="reveal type-section-title mt-5 max-w-[20ch] text-balance"
        >
          Six traits, held as pairs — one to reach for, one to reject.
        </h2>

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 sm:mt-16 lg:grid-cols-3">
          {traits.map((item, i) => (
            <li
              key={item.trait}
              style={revealDelay(i + 2, 70)}
              className="reveal border-t border-hairline pt-6"
            >
              <p className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="type-card-title">{item.trait}</span>
                <span className="text-sm text-ink-muted">{item.not}</span>
              </p>
              <p className="type-body mt-3 text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work — the same four stages Process.tsx carries on the
          homepage, in a plainer form here: the drawn-line spine is that
          section's own device, not one to spread onto a second page. */}
      <section
        ref={workRef}
        data-shown={workInView}
        className="px-3 sm:px-5"
      >
        <div className="edge-light-dark mx-auto max-w-site overflow-hidden rounded-xl bg-navy px-5 py-20 sm:rounded-2xl sm:px-12 sm:py-28 lg:px-16">
          <p className="reveal type-overline text-blue-300">How we work</p>
          <h2
            style={revealDelay(1)}
            className="reveal type-section-title mt-5 max-w-[16ch] text-balance text-white"
          >
            Four stages, in this order.
          </h2>

          <ol className="mt-14 grid gap-10 sm:grid-cols-2 sm:mt-16 lg:grid-cols-4 lg:gap-8">
            {process.map((step, i) => (
              <li
                key={step.title}
                style={revealDelay(i + 2, 80)}
                className="reveal border-t border-white/15 pt-6"
              >
                <span className="text-sm tabular-nums text-blue-300/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-blue-200">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        Where we fit — the engagement-model flexibility PRODUCT.md confirms,
        distinct from Assurance's ownership/diagnostic facts on the homepage
        so the two pages complement rather than repeat. Layout borrowed from
        a client-pinned reference's "Benefits" section: pitch + CTA fixed on
        the left, the fit models as a vertical-accent-bar list on the right,
        rather than the equal-weight three-column grid this used before.
        Signal accent throughout — this applies across both tracks, not one.
      */}
      <section
        ref={fitRef}
        data-shown={fitInView}
        className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <p className="type-overline text-ink-muted">Where we fit</p>
            <h2
              style={revealDelay(1)}
              className="reveal type-section-title mt-5 max-w-[16ch] text-balance"
            >
              Ahead of your team, inside it, or behind it.
            </h2>
            <p
              style={revealDelay(2)}
              className="reveal type-body mt-5 max-w-[38ch] text-ink-muted"
            >
              Whichever shape fits, the diagnostic comes first — you get the
              findings whether or not you continue with us.
            </p>
            <Link
              to="/contact"
              style={revealDelay(3)}
              className="press reveal type-ui mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-white"
            >
              Start a conversation
            </Link>
          </div>

          <ul className="flex flex-col gap-10 sm:gap-11">
            {fit.map((item, i) => (
              <li
                key={item.title}
                style={revealDelay(i + 2, 80)}
                className="reveal border-l-2 border-signal py-0.5 pl-6"
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} className="size-5 shrink-0 text-signal" />
                  <h3 className="text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                </div>
                <p className="type-body mt-2.5 text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
