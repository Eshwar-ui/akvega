import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icons'

type ServiceCard = {
  name: string
  status: string
  image: string
  alt: string
  to: string
  position: string
  depth: number
  scrollDirection: number
  imagePosition?: string
}

const serviceCards: ServiceCard[] = [
  {
    name: 'Campaign control',
    status: 'Live',
    image: '/service-ui/campaign-control.png',
    alt: 'Paid media workspace with a creative schedule, campaign budget and performance trends',
    to: '/services#paid-search',
    position:
      'bottom-[32%] left-[-2rem] z-[1] w-[13rem] -rotate-[4deg] 2xl:bottom-[30%] 2xl:left-[1%] 2xl:w-[15rem]',
    depth: 0.72,
    scrollDirection: -0.35,
    imagePosition: 'object-left-top',
  },
  {
    name: 'Search visibility',
    status: 'Tracking',
    image: '/service-ui/search-visibility.png',
    alt: 'SEO and answer visibility workspace showing coverage, indexed pages and audit progress',
    to: '/services#search',
    position:
      'bottom-[10%] left-[2.5rem] z-[3] w-[12.5rem] rotate-[4deg] 2xl:bottom-[9%] 2xl:left-[5%] 2xl:w-[14.5rem]',
    depth: 0.58,
    scrollDirection: 0.7,
    imagePosition: 'object-left-top',
  },
  {
    name: 'Brand system',
    status: 'Approved',
    image: '/service-ui/brand-system.png',
    alt: 'Brand system workspace with logo geometry, colour palette, type scale and approval history',
    to: '/services',
    position:
      'bottom-[-6%] left-[1rem] z-[4] w-[12rem] -rotate-[6deg] 2xl:bottom-[-5%] 2xl:left-[7%] 2xl:w-[14rem]',
    depth: 1,
    scrollDirection: 1,
  },
  {
    name: 'Web engineering',
    status: 'Ready',
    image: '/service-ui/web-engineering.png',
    alt: 'Web engineering workspace with deployment pipeline, automated tests, performance telemetry and release health',
    to: '/services#websites',
    position:
      'bottom-[32%] right-[-2rem] z-[1] w-[13rem] rotate-[4deg] 2xl:bottom-[30%] 2xl:right-[1%] 2xl:w-[15rem]',
    depth: 0.86,
    scrollDirection: -0.35,
  },
  {
    name: 'Mobile delivery',
    status: 'Testing',
    image: '/service-ui/mobile-delivery.png',
    alt: 'Mobile engineering workspace with device previews, build versions, automated tests and release readiness',
    to: '/services#mobile',
    position:
      'bottom-[10%] right-[2.5rem] z-[3] w-[12.5rem] -rotate-[4deg] 2xl:bottom-[9%] 2xl:right-[5%] 2xl:w-[14.5rem]',
    depth: 0.68,
    scrollDirection: 0.7,
  },
  {
    name: 'Systems automation',
    status: 'Healthy',
    image: '/service-ui/systems-automation.png',
    alt: 'Systems automation workspace with API connections, event routing, scheduled jobs and pipeline health',
    to: '/services#custom',
    position:
      'bottom-[-6%] right-[1rem] z-[4] w-[12rem] rotate-[6deg] 2xl:bottom-[-5%] 2xl:right-[7%] 2xl:w-[14rem]',
    depth: 0.96,
    scrollDirection: 1,
  },
]

function Card({ card, compact = false }: { card: ServiceCard; compact?: boolean }) {
  return (
    <Link
      to={card.to}
      aria-label={`Explore ${card.name}`}
      data-pointer-layer
      className={`press group block overflow-hidden border border-white/80 bg-white shadow-[0_3px_8px_rgb(5_17_39/0.07),0_28px_60px_-26px_rgb(5_17_39/0.38)] ${
        compact ? 'rounded-lg' : 'rounded-xl'
      }`}
    >
      <span
        className={`border-b border-hairline px-3 py-2.5 sm:px-4 ${
          compact
            ? 'flex flex-col gap-1'
            : 'flex items-center justify-between gap-3'
        }`}
      >
        <span
          className={`${compact ? 'line-clamp-2' : 'truncate'} text-[11px] font-semibold leading-[1.25] text-ink sm:text-xs`}
        >
          {card.name}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-medium text-ink-muted sm:text-[10px]">
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.1)]" />
          {card.status}
          <Icon
            name="arrowUpRight"
            className="ml-0.5 size-3 text-blue-600 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </span>

      <span className={`block overflow-hidden bg-surface ${compact ? 'aspect-[1.45]' : 'aspect-[1.5]'}`}>
        <img
          src={card.image}
          alt={card.alt}
          loading={compact ? 'lazy' : 'eager'}
          decoding="async"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 ${
            card.imagePosition ?? 'object-center'
          }`}
        />
      </span>
    </Link>
  )
}

export function HeroServiceCardsDesktop() {
  return (
    <aside
      aria-label="A look inside our service workspaces"
      className="pointer-events-none absolute inset-0 z-0 hidden xl:block"
    >
      {serviceCards.map((card, index) => (
        <div
          key={card.name}
          data-hero-service-card
          data-depth={card.depth}
          data-scroll-direction={card.scrollDirection}
          data-card-index={index}
          className={`pointer-events-auto absolute will-change-transform ${card.position}`}
        >
          <div data-hero-card-enter className="will-change-transform">
            <Card card={card} />
          </div>
        </div>
      ))}
    </aside>
  )
}

export function HeroServiceCardsMobile() {
  return (
    <ul className="mt-[clamp(1.75rem,5vh,3rem)] grid w-full max-w-2xl grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 xl:hidden">
      {serviceCards.map((card, index) => (
        <li
          key={card.name}
          data-hero-service-card
          data-depth={card.depth}
          data-scroll-direction={card.scrollDirection}
          data-card-index={index}
          className="min-w-0 will-change-transform"
        >
          <div data-hero-card-enter className="will-change-transform">
            <Card card={card} compact />
          </div>
        </li>
      ))}
    </ul>
  )
}
