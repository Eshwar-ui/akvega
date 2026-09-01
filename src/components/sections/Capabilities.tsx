import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/BrandMarks'
import { Icon } from '@/components/Icons'
import { revealDelay, useInView } from '@/lib/useInView'

/**
 * Capability cards — the six things a client actually asks for by name, as a
 * lead-in to the two-track argument in Services below.
 *
 * These started life in the hero and were moved here: the hero keeps its
 * platform tiles, and on white these read better level and evenly spaced than
 * scattered. No tilt, no drop shadow, no hero entrance — they rise on scroll
 * with the same `.reveal` ladder as every other section.
 *
 * Two mark systems meet on these cards, on purpose:
 *  - Google Ads and Meta are third-party marks, in their own colour, from
 *    BrandMarks.tsx. Guidelines 08 does not govern them — never restroke them
 *    to match the house style. Same caveat as the rest of BrandMarks: these are
 *    drawn approximations, and each requires its official asset before launch.
 *  - Everything we do ourselves uses the house icon set, tinted with the accent
 *    of the track it belongs to (Growth = signal, Build = vega).
 */
type Card = {
  /** Track it belongs to, shown as the eyebrow. */
  track: 'Growth' | 'Build'
  name: string
  accent: 'signal' | 'vega'
  mark: ReactNode
  to: string
}

const markSize = 'size-6 sm:size-7'

const cards: Card[] = [
  {
    track: 'Growth',
    name: 'Google Ads',
    accent: 'signal',
    mark: <BrandMark name="googleAds" className={markSize} />,
    to: '/services#paid-search',
  },
  {
    track: 'Growth',
    name: 'Meta Ads',
    accent: 'signal',
    mark: <BrandMark name="meta" className={markSize} />,
    to: '/services#paid-social',
  },
  {
    track: 'Growth',
    name: 'SEO and AEO',
    accent: 'signal',
    mark: <Icon name="search" className={`${markSize} text-signal`} />,
    to: '/services#search',
  },
  {
    track: 'Build',
    name: 'Web design',
    accent: 'vega',
    mark: <Icon name="browser" className={`${markSize} text-vega`} />,
    to: '/services#websites',
  },
  {
    // No branding entry in lib/services.ts yet — this links to the page, not an
    // anchor. Add the service there and point it at the slug.
    track: 'Build',
    name: 'Branding',
    accent: 'vega',
    mark: <Icon name="brand" className={`${markSize} text-vega`} />,
    to: '/services',
  },
  {
    track: 'Growth',
    name: 'Analytics',
    accent: 'signal',
    mark: <Icon name="trend" className={`${markSize} text-signal`} />,
    to: '/services',
  },
]

export default function Capabilities() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
      className="mx-auto max-w-site px-5 pt-24 sm:px-8 sm:pt-32"
    >
      {/* Placeholder label — confirm the wording with the client. */}
      <p className="reveal type-overline text-ink-muted">
        What we run
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        {cards.map((card, i) => (
          <li key={card.name} style={revealDelay(i + 1, 60)} className="reveal">
            <Link
              to={card.to}
              className="press group flex h-full flex-col rounded-lg border border-hairline bg-paper p-4 hover:border-blue-200 hover:shadow-[0_1px_2px_rgb(5_17_39/0.06),0_18px_36px_-20px_rgb(5_17_39/0.28)] sm:p-5"
            >
              <span className="grid size-11 place-items-center rounded-md bg-surface sm:size-12">
                {card.mark}
              </span>

              {/* Accent rule — the one place the track colour reads on the card. */}
              <span
                aria-hidden="true"
                className={`mt-5 h-px w-6 origin-left transition-[scale] duration-500 ease-out-expo group-hover:scale-x-[2.4] ${
                  card.accent === 'signal' ? 'bg-signal' : 'bg-vega'
                }`}
              />

              <span className="type-overline mt-4 text-[10px] text-ink-muted sm:text-[11px]">
                {card.track}
              </span>
              <span className="mt-2 text-[15px] font-medium leading-[1.25] text-ink sm:text-base">
                {card.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
