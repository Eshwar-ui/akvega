import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '@/components/Icons'
import { tracks, type Track } from '@/lib/services'
import { revealDelay, useInView } from '@/lib/useInView'

gsap.registerPlugin(useGSAP, Flip)

type ServiceMedia =
  | { type: 'image'; src: string; alt: string }
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
      src: '/service-media/web-engineering-real.png',
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
      src: '/service-media/mobile-applications-real.png',
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
      src: '/service-media/systems-automation-real.png',
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
      src: '/service-media/product-design-real.png',
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
      src: '/service-media/commerce-platforms-real.png',
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
      src: '/service-media/cloud-devops-real.png',
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
      src={media.src}
      alt={media.alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )
}

const growthTrack = tracks.find((track) => track.id === 'growth') as Track

const growthIcons: Record<string, IconName> = {
  search: 'search',
  'paid-search': 'target',
  'paid-social': 'spark',
  social: 'chat',
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
        An index, not a list — four rows named up front at full confidence,
        the case for each made only once you ask for it. Build's bento cards
        show; Growth's channels are compared, so this leans into scanning
        instead: reuses FAQ's exact <details name="…"> mechanism (a separate
        group, so opening one doesn't fight the FAQ's own accordion) rather
        than inventing a second interaction model on the same page. A card
        grid and bordered chips were both tried for this row before and read
        cheap at this scale (DESIGN.md) — this keeps the hairline-row
        skeleton that didn't, and asks more of its typography instead.
      */}
      <div className="mt-4">
        {growthTrack.services.map((service, index) => (
          <details
            key={service.slug}
            name="growth-services"
            style={revealDelay(index + 1, 80)}
            className="reveal group border-t border-hairline last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-center gap-5 py-7 text-left [&::-webkit-details-marker]:hidden sm:py-8">
              <span className="text-sm tabular-nums text-ink-muted/50 sm:text-base">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Icon
                name={growthIcons[service.slug]}
                className="size-6 shrink-0 text-signal sm:size-7"
              />
              <h4 className="type-card-title flex-1 transition-colors duration-300 ease-out-expo group-hover:text-signal">
                {service.name}
              </h4>
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline text-ink-muted transition-transform duration-300 ease-out-expo group-open:rotate-45">
                <Icon name="plus" className="size-4" />
              </span>
            </summary>

            <div className="pb-9 pl-12 sm:pb-11 sm:pl-20">
              <p className="type-body max-w-[60ch] text-ink-muted">
                {service.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
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

  return (
    <li
      data-service-card
      data-service-index={index}
      style={revealDelay(index + 1, 75)}
      onFocus={onFocusStart}
      className={`reveal min-h-[17rem] lg:min-h-0 ${slotLayouts[slot]}`}
    >
      <Link
        to={service.to}
        aria-label={`Explore ${service.title}`}
        className={`group relative isolate flex h-full min-h-[inherit] overflow-hidden rounded-xl border transition-[border-color,box-shadow,transform] duration-700 ease-out-expo hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_60px_-32px_rgb(5_17_39/0.45)] focus-visible:border-blue-400 ${
          isFeatured
            ? 'border-navy/10 bg-navy text-white'
            : 'border-blue-200/70 bg-surface text-ink'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 ${
            isFeatured
              ? 'scale-100 opacity-100'
              : 'scale-[1.04] opacity-[0.16] grayscale'
          }`}
        >
          <CardMedia media={service.media} />
        </span>

        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ${
            isFeatured
              ? 'bg-[linear-gradient(90deg,rgb(5_17_39/0.18)_0%,rgb(5_17_39/0.72)_55%,rgb(5_17_39/0.97)_100%)]'
              : 'bg-[linear-gradient(110deg,var(--color-surface)_20%,rgb(239_248_255/0.9)_58%,rgb(239_248_255/0.42)_100%)] group-hover:opacity-0 group-focus-visible:opacity-0'
          }`}
        />

        {!isFeatured && (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(0deg,rgb(5_17_39/0.95)_0%,rgb(5_17_39/0.62)_58%,rgb(5_17_39/0.2)_100%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
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
                  : 'border-blue-200 bg-white/80 text-signal group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white group-focus-visible:border-white/30 group-focus-visible:bg-white/10 group-focus-visible:text-white'
              }`}
            >
              <Icon name={service.icon} className="size-5" />
            </span>

            <h3
              className={`mt-3 text-[clamp(1.3rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em] transition-colors duration-700 2xl:mt-5 ${
                isFeatured
                  ? 'text-white'
                  : 'text-ink group-hover:text-white group-focus-visible:text-white'
              }`}
            >
              {service.title}
            </h3>
            <p
              className={`mt-2 max-w-[34ch] text-[14px] leading-relaxed transition-colors duration-700 2xl:mt-3 2xl:text-[15px] ${
                isFeatured
                  ? 'text-white/76'
                  : 'text-ink-muted group-hover:text-white/78 group-focus-visible:text-white/78'
              }`}
            >
              {service.description}
            </p>
          </span>

          <span
            className={`mt-5 flex items-center gap-2 text-sm font-semibold transition-colors duration-700 2xl:mt-8 ${
              isFeatured
                ? 'text-blue-300'
                : 'text-blue-700 group-hover:text-blue-200 group-focus-visible:text-blue-200'
            }`}
          >
            Explore service
            <Icon
              name="arrowUpRight"
              className="size-4 transition-transform duration-700 ease-out-expo group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </span>
        </span>
      </Link>
    </li>
  )
}

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

  const canReflow = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 1024px)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

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
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
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
            <span className="text-sm tabular-nums text-ink-muted">06</span>
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
