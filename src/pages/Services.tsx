import { Link } from 'react-router-dom'
import { Icon, type IconName } from '@/components/Icons'
import TechStack from '@/components/TechStack'
import { serviceCount, tracks, type Track } from '@/lib/services'
import { revealDelay, useInView } from '@/lib/useInView'

/**
 * The definitive services reference — everything `lib/services.ts` knows,
 * with a real anchor per slug (`#search`, `#websites`, …) so the homepage's
 * capability shelf, the footer directory, and any shared link land on the
 * actual service rather than the page top. Those anchors didn't exist before
 * this page had real content (see DESIGN.md's placeholder inventory).
 *
 * Same editorial-row idiom the homepage's Growth list already uses — a card
 * grid and bordered chips were both tried there and "read cheap at this
 * scale" (DESIGN.md), so Build gets the same row treatment here rather than
 * homepage's bento cards. That bento is a homepage-only curated teaser (a
 * different, hand-picked six); this page is the exhaustive, text-first
 * reference, and the row format is what the site already committed to for
 * that job.
 */
const serviceIcons: Record<string, IconName> = {
  search: 'search',
  'paid-search': 'target',
  'paid-social': 'spark',
  social: 'chat',
  branding: 'brand',
  websites: 'browser',
  commerce: 'bag',
  mobile: 'mobile',
  design: 'layers',
  custom: 'sliders',
}

function TrackSection({ track, first }: { track: Track; first: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const accentText = track.accent === 'signal' ? 'text-signal' : 'text-vega'

  return (
    <div
      ref={ref}
      data-shown={inView}
      className={first ? '' : 'mt-24 sm:mt-32'}
    >
      <div className="reveal flex flex-col gap-6 border-t border-ink/12 pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex items-baseline gap-5">
          <h2 className={`type-track-title ${accentText}`}>{track.label}</h2>
          <span className="text-sm tabular-nums text-ink-muted">
            {String(track.services.length).padStart(2, '0')}
          </span>
        </div>
        <p className="type-body max-w-[46ch] text-ink-muted lg:text-right">
          {track.statement}
        </p>
      </div>

      <ul className="mt-4">
        {track.services.map((service, i) => (
          <li
            key={service.slug}
            id={service.slug}
            style={revealDelay(i + 1, 80)}
            className="reveal grid scroll-mt-28 gap-4 border-t border-hairline py-9 sm:py-11 lg:grid-cols-[1fr_1.35fr] lg:gap-16"
          >
            <div className="flex items-start gap-4">
              <Icon
                name={serviceIcons[service.slug]}
                className={`mt-1.5 size-6 shrink-0 sm:mt-2 ${accentText}`}
              />
              <h3 className="type-card-title">{service.name}</h3>
            </div>

            <div>
              <p className="type-body max-w-[60ch] text-ink-muted">
                {service.blurb}
              </p>
              <p className="type-overline mt-5 text-[11px] text-ink-muted">
                {service.deliverables.join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <>
      {/* Banner — same .hero-field panel Contact's banner established, so a
          visitor landing here directly still recognises the hero's material. */}
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
              <span className="font-medium text-ink">Services</span>
            </nav>
            <p className="type-overline mt-7 text-ink-muted">What we run</p>
            <h1 className="type-page-title mt-3 max-w-[20ch]">
              Everything we do, in one place.
            </h1>
            <p className="type-body mt-5 max-w-[52ch] text-ink-muted">
              {serviceCount} services across two tracks. Hire one, or hire
              both — most clients end up wanting both.
            </p>
          </div>
        </div>
      </div>

      <section
        ref={ref}
        data-shown={inView}
        className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28"
      >
        {tracks.map((track, i) => (
          <TrackSection key={track.id} track={track} first={i === 0} />
        ))}
      </section>

      <section
        id="stack"
        className="mx-auto max-w-site scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32"
      >
        <p className="type-overline text-ink-muted">What we build with</p>
        <h2 className="type-section-title mt-5 max-w-[16ch] text-balance">
          Key technologies, chosen deliberately.
        </h2>
        <p className="type-body mt-5 max-w-[52ch] text-ink-muted">
          The smallest proven combination for the product — not the longest
          list of logos we can fit on a page.
        </p>
        {/* Placeholder set — confirm every mark below is a tool Akvega
            actually uses before this page goes live (see DESIGN.md). */}
        <div className="mt-14">
          <TechStack />
        </div>
      </section>
    </>
  )
}
