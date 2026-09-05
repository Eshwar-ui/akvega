import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Icon, type IconName } from '@/components/Icons'
import { serviceHref, tracks, type Track } from '@/lib/services'
import { revealDelay } from '@/lib/useInView'

gsap.registerPlugin(useGSAP, Flip)

/**
 * Bento card art. `name` is the stem of a file in public/service-media, which
 * scripts/optimize-images.mjs emits as `<name>-768.webp` and `<name>-1440.webp`
 * (16:9). The two widths exist because the slots differ enormously: the
 * featured card runs 7 of 12 columns of a 95vw container — around 1060px CSS on
 * a wide screen — while the small slots sit near 400px. One size would either
 * blur the big one or waste most of the bytes on the other five.
 */
const MEDIA_WIDTHS = [768, 1440] as const
const MEDIA_ASPECT = { width: 1440, height: 810 }

// Widest slot is ~7/12 of 95vw; every other slot is well under half that. The
// browser only needs the upper bound per breakpoint to pick correctly.
const MEDIA_SIZES = '(min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw'

const mediaSrcSet = (name: string) =>
  MEDIA_WIDTHS.map((w) => `/service-media/${name}-${w}.webp ${w}w`).join(', ')

type ServiceMedia =
  | { type: 'image'; name: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string }

type HomeService = {
  title: string
  description: string
  icon: IconName
  to: string
  media: ServiceMedia
}

// Layout for each bento slot, in slot order. Slot 0 is the "big box" — on
// desktop, whichever card is hovered/focused swaps into this slot and the
// rest reflow to fill the remaining slots, in original order. Placement on
// lg+ is explicit (col-start/row-start) rather than left to grid auto-flow:
// auto-flow packs by DOM order, which stays fixed as cards swap slots, so a
// span-only class would land wherever the sequential scan happens to be
// rather than in the slot's actual position.
const slotLayouts = [
  'md:col-span-2 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-2',
  'lg:col-start-8 lg:col-span-5 lg:row-start-1',
  'lg:col-start-8 lg:col-span-5 lg:row-start-2',
  'lg:col-start-1 lg:col-span-4 lg:row-start-3',
  'lg:col-start-5 lg:col-span-4 lg:row-start-3',
  'md:col-span-2 lg:col-start-9 lg:col-span-4 lg:row-start-3',
]

const homeServices: HomeService[] = [
  {
    title: 'Web Engineering',
    description:
      'Fast, resilient web products engineered for scale, discoverability and real-world traffic.',
    icon: 'browser',
    to: '/services#websites',
    media: {
      type: 'image',
      name: 'web-engineering-real',
      alt: 'Web engineer working at a dual-monitor workstation in a modern technology studio',
    },
  },
  {
    title: 'Mobile Applications',
    description:
      'Native and cross-platform apps built from first prototype through store release.',
    icon: 'mobile',
    to: '/services#mobile',
    media: {
      type: 'image',
      name: 'mobile-applications-real',
      alt: 'Mobile application engineer testing an app across phones and a tablet',
    },
  },
  {
    title: 'Systems & Automation',
    description:
      'Integrations, internal tools and pipelines that remove repetitive work from operations.',
    icon: 'sliders',
    to: '/services#custom',
    media: {
      type: 'image',
      name: 'systems-automation-real',
      alt: 'Infrastructure automation engineer reviewing workflows in an operations room',
    },
  },
  {
    title: 'Product Design',
    description:
      'Research, flows and interface systems that move cleanly from prototype to production.',
    icon: 'layers',
    to: '/services#design',
    media: {
      type: 'image',
      name: 'product-design-real',
      alt: 'Product designers collaborating over interface wireframes and a tablet prototype',
    },
  },
  {
    title: 'Commerce Platforms',
    description:
      'Storefronts, payments and fulfilment flows engineered for demanding commerce operations.',
    icon: 'bag',
    to: '/services#commerce',
    media: {
      type: 'image',
      name: 'commerce-platforms-real',
      alt: 'Commerce technology team reviewing an online storefront beside unbranded products',
    },
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Cloud infrastructure, deployment pipelines and observability built for dependable releases.',
    icon: 'spark',
    to: '/services#custom',
    media: {
      type: 'image',
      name: 'cloud-devops-real',
      alt: 'Cloud and DevOps engineer inspecting deployment health in a modern operations studio',
    },
  },
]

function CardMedia({ media }: { media: ServiceMedia }) {
  if (media.type === 'video') {
    return (
      <video
        aria-label={media.alt}
        autoPlay
        loop
        muted
        playsInline
        poster={media.poster}
        preload="metadata"
        className="h-full w-full object-cover"
      >
        <source src={media.src} />
      </video>
    )
  }

  return (
    <img
      src={`/service-media/${media.name}-${MEDIA_WIDTHS.at(-1)}.webp`}
      srcSet={mediaSrcSet(media.name)}
      sizes={MEDIA_SIZES}
      alt={media.alt}
      width={MEDIA_ASPECT.width}
      height={MEDIA_ASPECT.height}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )
}

// Fail at module load with a readable message rather than `as Track`, which
// would have let a renamed/removed track surface as a null-deref deep in JSX.
function requireTrack(id: string): Track {
  const track = tracks.find((t) => t.id === id)
  if (!track) throw new Error(`Unknown service track: ${id}`)
  return track
}

const growthTrack = requireTrack('growth')

// Bento rows are conceptually 3-wide (2-wide at the sm breakpoint); a
// partial last row would otherwise leave a gap (5 services = 3 full-width
// cards, then 2 stranded at a third width each on lg, or 1 stranded at half
// width on sm). Grid runs on 6 columns at lg instead of 3, so the last row's
// cards can stretch to fill it evenly, however many are left over — 3
// columns each for 2 leftover cards, 6 for a single one, unchanged 2-of-6 (a
// plain third) when the count divides evenly. sm gets the same treatment at
// 2-wide: a lone odd-one-out spans both columns instead of sitting stranded
// at half width with a gap beside it.
function bentoColSpan(index: number, total: number) {
  const classes: string[] = []

  if (total % 2 === 1 && index === total - 1) {
    classes.push('sm:col-span-2')
  }

  const fullRows = Math.floor(total / 3)
  const remainder = total - fullRows * 3
  const inLastRow = remainder > 0 && index >= fullRows * 3
  classes.push(
    inLastRow ? (remainder === 1 ? 'lg:col-span-6' : 'lg:col-span-3') : 'lg:col-span-2',
  )

  return classes.join(' ')
}

const growthIcons: Record<string, IconName> = {
  search: 'search',
  'paid-search': 'target',
  'paid-social': 'spark',
  social: 'chat',
  branding: 'brand',
}

function GrowthServices() {
  return (
    <div className="mt-20 sm:mt-28">
      <div className="reveal flex flex-col gap-6 border-t border-ink/12 pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex items-baseline gap-5">
          <h3 className="type-track-title text-signal">Growth</h3>
          <span className="text-sm tabular-nums text-ink-muted">
            {String(growthTrack.services.length).padStart(2, '0')}
          </span>
        </div>
        <p className="type-body max-w-[46ch] text-ink-muted lg:text-right">
          {growthTrack.statement}
        </p>
      </div>

      {/*
        Bento feature cards, from a client-pinned reference — that pin
        outranks the card-grid/bordered-chips attempts DESIGN.md already
        logged as having read cheap here before (same precedent the Contact
        rebuild set: a pinned reference beats a prior call). Structure only,
        not the reference's own visual system — no fake dashboard numbers:
        the reference's card previews show invented metrics, and PRODUCT.md
        rules that out everywhere on this site. Each card's preview panel
        renders the service's real deliverables instead, styled like a small
        UI block rather than a plain tag list, so the slot the reference used
        for fabricated proof is doing something true instead.

        Flat `surface` fill with no border (not `bg-paper` + hairline) and a
        nested white "device" card for the preview, shadowed off the flat
        background — the reference's own card treatment, reproduced in the
        site's tokens. `card-lift`'s hover motion is what signals
        interactivity now that there's no border to shift colour on hover.
      */}
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6">
        {growthTrack.services.map((service, index) => (
          <li
            key={service.slug}
            style={revealDelay(index + 1, 80)}
            className={`reveal ${bentoColSpan(index, growthTrack.services.length)}`}
          >
            <a
              href={serviceHref(service)}
              className="card-lift group flex h-full flex-col rounded-2xl bg-surface p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="type-card-title text-[1.25rem]">
                  {service.name}
                </h4>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-signal shadow-[0_1px_2px_rgb(5_17_39/0.06),0_6px_16px_-8px_rgb(5_17_39/0.25)]">
                  <Icon name={growthIcons[service.slug]} className="size-5" />
                </span>
              </div>
              <p className="type-body mt-2.5 text-[14px] text-ink-muted">
                {service.blurb}
              </p>

              {/* The preview slot — real deliverables, laid out like a
                  small interface rather than a plain inline tag row. */}
              <div className="mt-6 flex-1 rounded-xl bg-paper p-4 shadow-[0_1px_2px_rgb(5_17_39/0.05),0_16px_32px_-18px_rgb(5_17_39/0.3)]">
                <p className="type-overline text-[10px] text-ink-muted/70">
                  Included
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors duration-300 group-hover:text-signal">
                Explore service
                <Icon
                  name="arrowUpRight"
                  className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServiceCard({
  service,
  index,
  slot,
  onFocusStart,
}: {
  service: HomeService
  index: number
  slot: number
  onFocusStart: () => void
}) {
  const isFeatured = slot === 0

  /*
   * The ghosted state — a 16%-opacity greyscale photo behind ink-on-ice text —
   * is the *resting* half of a hover pair, and the reveal that completes it is
   * gated behind `:hover`. The slot-swapping reflow that drives it is lg-and-
   * pointer-only (see `canReflow`), so below lg five of the six cards had no
   * way to ever reach the revealed state: they sat permanently half-faded, with
   * a dead gap where the image should read. That is not a smaller version of
   * the desktop design, it is the design's loading state, frozen.
   *
   * So below lg every card renders in the revealed treatment — full-bleed
   * photo, dark scrim, light type — which is what the hover was always
   * arriving at. `lg:` restores the paired resting/hover behaviour on pointer
   * screens, where it works.
   *
   * Every variant below is written out in full: Tailwind scans source for
   * literal class strings, so a composed `${prefix}opacity-0` would never make
   * it into the stylesheet.
   */
  return (
    <li
      data-service-card
      data-service-index={index}
      style={revealDelay(index + 1, 75)}
      onFocus={onFocusStart}
      className={`reveal min-h-[17rem] lg:min-h-0 ${slotLayouts[slot]}`}
    >
      <a
        href={service.to}
        aria-label={`Explore ${service.title}`}
        className={`group relative isolate flex h-full min-h-[inherit] overflow-hidden rounded-xl border transition-[border-color,box-shadow,transform] duration-700 ease-out-expo hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_60px_-32px_rgb(5_17_39/0.45)] focus-visible:border-blue-400 ${
          isFeatured
            ? 'border-navy/10 bg-navy text-white'
            : 'border-navy/10 bg-navy text-white lg:border-blue-200/70 lg:bg-surface lg:text-ink'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 ${
            isFeatured
              ? 'scale-100 opacity-100'
              : 'scale-100 opacity-100 lg:scale-[1.04] lg:opacity-[0.16] lg:grayscale'
          }`}
        >
          <CardMedia media={service.media} />
        </span>

        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ${
            isFeatured
              ? 'bg-[linear-gradient(90deg,rgb(5_17_39/0.18)_0%,rgb(5_17_39/0.72)_55%,rgb(5_17_39/0.97)_100%)]'
              : 'lg:bg-[linear-gradient(110deg,var(--color-surface)_20%,rgb(239_248_255/0.9)_58%,rgb(239_248_255/0.42)_100%)] lg:group-hover:opacity-0 lg:group-focus-visible:opacity-0'
          }`}
        />

        {!isFeatured && (
          /*
           * Two scrims, not one. The lg gradient is bottom-weighted because on
           * desktop it only ever appears under a hover, where the eye is
           * already on the card and the copy sits low. Below lg it is the
           * card's permanent background and the copy runs top to bottom across
           * whatever the photo happens to be doing there, so the mobile ramp
           * stays much heavier through the middle — the light patches in the
           * server-room and workshop shots ate `text-white/76` otherwise.
           */
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(0deg,rgb(5_17_39/0.96)_0%,rgb(5_17_39/0.86)_45%,rgb(5_17_39/0.66)_100%)] opacity-100 transition-opacity duration-700 lg:bg-[linear-gradient(0deg,rgb(5_17_39/0.95)_0%,rgb(5_17_39/0.62)_58%,rgb(5_17_39/0.2)_100%)] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
          />
        )}

        <span
          className={`relative z-10 flex w-full flex-col p-5 sm:p-6 2xl:p-7 ${
            isFeatured
              ? 'ml-auto justify-end lg:w-[44%] lg:justify-center lg:p-8 2xl:p-10'
              : 'justify-between'
          }`}
        >
          <span>
            <span
              className={`grid size-10 place-items-center rounded-lg border transition-colors duration-700 ${
                isFeatured
                  ? 'border-white/25 bg-white/10 text-white'
                  : 'border-white/25 bg-white/10 text-white lg:border-blue-200 lg:bg-white/80 lg:text-signal lg:group-hover:border-white/30 lg:group-hover:bg-white/10 lg:group-hover:text-white lg:group-focus-visible:border-white/30 lg:group-focus-visible:bg-white/10 lg:group-focus-visible:text-white'
              }`}
            >
              <Icon name={service.icon} className="size-5" />
            </span>

            <h3
              className={`mt-3 text-[clamp(1.3rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em] transition-colors duration-700 2xl:mt-5 ${
                isFeatured
                  ? 'text-white'
                  : 'text-white lg:text-ink lg:group-hover:text-white lg:group-focus-visible:text-white'
              }`}
            >
              {service.title}
            </h3>
            <p
              className={`mt-2 max-w-[34ch] text-[14px] leading-relaxed transition-colors duration-700 2xl:mt-3 2xl:text-[15px] ${
                isFeatured
                  ? 'text-white/76'
                  : 'text-white/76 lg:text-ink-muted lg:group-hover:text-white/78 lg:group-focus-visible:text-white/78'
              }`}
            >
              {service.description}
            </p>
          </span>

          <span
            className={`mt-5 flex items-center gap-2 text-sm font-semibold transition-colors duration-700 2xl:mt-8 ${
              isFeatured
                ? 'text-blue-300'
                : 'text-blue-300 lg:text-blue-700 lg:group-hover:text-blue-200 lg:group-focus-visible:text-blue-200'
            }`}
          >
            Explore service
            <Icon
              name="arrowUpRight"
              className="size-4 transition-transform duration-700 ease-out-expo group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </span>
        </span>
      </a>
    </li>
  )
}

/**
 * The slot-swapping reflow is a pointer affordance on a wide layout: below lg
 * the cards stack, and on touch there is no hover to express it with. Checked
 * per call rather than held in state — it depends only on the viewport, and a
 * resize between calls should be honoured immediately.
 */
const canReflow = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1024px)').matches &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

function BuildServiceGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const flipStateRef = useRef<Flip.FlipState | null>(null)
  // Reflow moves the featured card out from under the cursor, and the
  // browser re-hit-tests whatever slides in underneath — reacting to that
  // (rather than to genuine pointer movement) would chase the cursor
  // indefinitely as cards keep swapping places. Lock out new triggers (and
  // pointer events entirely, so :hover styling doesn't jump either) until
  // the current Flip settles; anything requested mid-flight is queued and
  // re-checked once it completes, rather than dropped.
  const isAnimatingRef = useRef(false)
  const pendingTargetRef = useRef<number | null>(null)
  const hasPendingTargetRef = useRef(false)
  // A cursor merely passing over a card on its way elsewhere shouldn't
  // trigger a full reflow — only commit once it actually rests.
  const hoverTimeoutRef = useRef<number | null>(null)

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const order =
    hoveredIndex === null
      ? homeServices.map((_, i) => i)
      : [
          hoveredIndex,
          ...homeServices.map((_, i) => i).filter((i) => i !== hoveredIndex),
        ]

  const slotForService: number[] = []
  order.forEach((serviceIndex, slot) => {
    slotForService[serviceIndex] = slot
  })

  const captureFlipState = () => {
    if (!listRef.current) return
    const cards = gsap.utils.toArray<HTMLElement>(
      '[data-service-card]',
      listRef.current,
    )
    flipStateRef.current = Flip.getState(cards)
  }

  // `target` is a service index to feature, or null to return to default.
  // Only ever called from a real pointer/focus event — never re-derived
  // from "what's visually under the cursor right now" — so settling
  // content can't retrigger itself.
  const requestHoverState = (target: number | null) => {
    if (!canReflow() || target === hoveredIndex) return

    if (isAnimatingRef.current) {
      pendingTargetRef.current = target
      hasPendingTargetRef.current = true
      return
    }

    clearHoverTimeout()
    hoverTimeoutRef.current = window.setTimeout(() => {
      hoverTimeoutRef.current = null
      captureFlipState()
      setHoveredIndex(target)
    }, 100)
  }

  const handlePointerMove = (event: ReactMouseEvent<HTMLUListElement>) => {
    const cardEl = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-service-card]',
    )
    if (!cardEl) return
    requestHoverState(Number(cardEl.dataset.serviceIndex))
  }

  const handleFocusStart = (index: number) => requestHoverState(index)

  // The Flip animation's own layout churn (elements briefly going
  // position:absolute mid-transition) can fire a native mouseleave on this
  // container even though the cursor never actually left it. Trust the
  // event's own coordinates over its mere occurrence.
  const handleGridLeave = (event: ReactMouseEvent<HTMLUListElement>) => {
    const rect = listRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = event
      const stillInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      if (stillInside) return
    }
    requestHoverState(null)
  }

  useGSAP(
    () => {
      if (!flipStateRef.current) return
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      isAnimatingRef.current = true
      if (listRef.current) listRef.current.style.pointerEvents = 'none'

      Flip.from(flipStateRef.current, {
        duration: reduced ? 0 : 0.85,
        ease: 'power2.inOut',
        absolute: true,
        overwrite: true,
        onComplete: () => {
          isAnimatingRef.current = false
          if (listRef.current) listRef.current.style.pointerEvents = ''
          if (hasPendingTargetRef.current) {
            const pending = pendingTargetRef.current
            pendingTargetRef.current = null
            hasPendingTargetRef.current = false
            requestHoverState(pending)
          }
        },
      })
      flipStateRef.current = null
    },
    { dependencies: [hoveredIndex], scope: listRef },
  )

  return (
    <ul
      ref={listRef}
      data-cursor-none
      onMouseMove={handlePointerMove}
      onMouseLeave={handleGridLeave}
      className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-[clamp(38rem,92svh,52rem)] lg:grid-cols-12 lg:grid-rows-3 lg:mt-16"
    >
      {homeServices.map((service, index) => (
        <ServiceCard
          key={service.title}
          service={service}
          index={index}
          slot={slotForService[index]}
          onFocusStart={() => handleFocusStart(index)}
        />
      ))}
    </ul>
  )
}

export default function Services() {

  return (
    <section
      data-reveal-root
data-shown="false"
      id="services"
      className="mx-auto max-w-site px-5 py-28 sm:px-8 sm:py-40"
    >
      <div className="reveal max-w-5xl">
        <p className="type-overline text-signal">What we do</p>
        <h2 className="type-section-title mt-5 text-balance">
          We do two things well.
        </h2>
        <p className="type-lede mt-6 max-w-[56ch] text-ink-muted">
          One team for the demand, and for the technology the demand lands on.
          Hire either half; most clients end up wanting both.
        </p>
      </div>

      <GrowthServices />

      <div className="mt-24 sm:mt-36">
        <div className="reveal flex flex-col gap-6 border-t border-ink/12 pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex items-baseline gap-5">
            <h3 className="type-track-title text-vega">Build</h3>
            <span className="text-sm tabular-nums text-ink-muted">
              {String(homeServices.length).padStart(2, '0')}
            </span>
          </div>
          <p className="type-body max-w-[46ch] text-ink-muted lg:text-right">
            Real products, platforms and infrastructure designed to hold up
            when real traffic and real teams arrive.
          </p>
        </div>

        <div className="reveal mt-12 max-w-4xl sm:mt-16">
          <p className="type-overline text-vega">Technology services</p>
          <h2 className="type-section-title mt-5 text-balance">
            Technology, built end to end.
          </h2>
          <p className="type-lede mt-6 max-w-[56ch] text-ink-muted">
            Hover a service to see the people, tools and environments behind
            the work.
          </p>
        </div>

        <BuildServiceGrid />
      </div>
    </section>
  )
}
