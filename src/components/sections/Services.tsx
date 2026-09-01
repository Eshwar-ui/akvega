import { Link } from 'react-router-dom'
import { Icon, type IconName } from '@/components/Icons'
import { tracks, type Track } from '@/lib/services'
import { revealDelay, useInView } from '@/lib/useInView'

type ServiceMedia =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string }

type HomeService = {
  title: string
  description: string
  icon: IconName
  to: string
  media: ServiceMedia
  featured?: boolean
  layout: string
}

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
    featured: true,
    layout: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
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
    layout: 'lg:col-span-5',
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
    layout: 'lg:col-span-5',
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
    layout: 'lg:col-span-4',
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
    layout: 'lg:col-span-4',
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
    layout: 'md:col-span-2 lg:col-span-4',
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

      <ul className="mt-4">
        {growthTrack.services.map((service, index) => (
          <li
            key={service.slug}
            style={revealDelay(index + 1, 80)}
            className="reveal grid gap-4 border-t border-hairline py-9 sm:py-11 lg:grid-cols-[1fr_1.35fr] lg:gap-16"
          >
            <div className="flex items-start gap-4">
              <Icon
                name={growthIcons[service.slug]}
                className="mt-1.5 size-6 shrink-0 text-signal sm:mt-2"
              />
              <h4 className="type-card-title">{service.name}</h4>
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

function ServiceCard({ service, index }: { service: HomeService; index: number }) {
  return (
    <li
      style={revealDelay(index + 1, 75)}
      className={`reveal min-h-[17rem] lg:min-h-0 ${service.layout}`}
    >
      <Link
        to={service.to}
        aria-label={`Explore ${service.title}`}
        className={`group relative isolate flex h-full min-h-[inherit] overflow-hidden rounded-xl border transition-[border-color,box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_60px_-32px_rgb(5_17_39/0.45)] focus-visible:border-blue-400 ${
          service.featured
            ? 'border-navy/10 bg-navy text-white'
            : 'border-blue-200/70 bg-surface text-ink'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 ${
            service.featured
              ? 'scale-100 opacity-100'
              : 'scale-[1.04] opacity-[0.16] grayscale'
          }`}
        >
          <CardMedia media={service.media} />
        </span>

        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${
            service.featured
              ? 'bg-[linear-gradient(90deg,rgb(5_17_39/0.18)_0%,rgb(5_17_39/0.72)_55%,rgb(5_17_39/0.97)_100%)]'
              : 'bg-[linear-gradient(110deg,var(--color-surface)_20%,rgb(239_248_255/0.9)_58%,rgb(239_248_255/0.42)_100%)] group-hover:opacity-0 group-focus-visible:opacity-0'
          }`}
        />

        {!service.featured && (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(0deg,rgb(5_17_39/0.95)_0%,rgb(5_17_39/0.62)_58%,rgb(5_17_39/0.2)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}

        <span
          className={`relative z-10 flex w-full flex-col p-5 sm:p-6 2xl:p-7 ${
            service.featured
              ? 'ml-auto justify-end lg:w-[44%] lg:justify-center lg:p-8 2xl:p-10'
              : 'justify-between'
          }`}
        >
          <span>
            <span
              className={`grid size-10 place-items-center rounded-lg border transition-colors duration-500 ${
                service.featured
                  ? 'border-white/25 bg-white/10 text-white'
                  : 'border-blue-200 bg-white/80 text-signal group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white group-focus-visible:border-white/30 group-focus-visible:bg-white/10 group-focus-visible:text-white'
              }`}
            >
              <Icon name={service.icon} className="size-5" />
            </span>

            <h3
              className={`mt-3 text-[clamp(1.3rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em] transition-colors duration-500 2xl:mt-5 ${
                service.featured
                  ? 'text-white'
                  : 'text-ink group-hover:text-white group-focus-visible:text-white'
              }`}
            >
              {service.title}
            </h3>
            <p
              className={`mt-2 max-w-[34ch] text-[14px] leading-relaxed transition-colors duration-500 2xl:mt-3 2xl:text-[15px] ${
                service.featured
                  ? 'text-white/76'
                  : 'text-ink-muted group-hover:text-white/78 group-focus-visible:text-white/78'
              }`}
            >
              {service.description}
            </p>
          </span>

          <span
            className={`mt-5 flex items-center gap-2 text-sm font-semibold transition-colors duration-500 2xl:mt-8 ${
              service.featured
                ? 'text-blue-300'
                : 'text-blue-700 group-hover:text-blue-200 group-focus-visible:text-blue-200'
            }`}
          >
            Explore service
            <Icon
              name="arrowUpRight"
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </span>
        </span>
      </Link>
    </li>
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

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-[clamp(38rem,92svh,52rem)] lg:grid-cols-12 lg:grid-rows-3 lg:mt-16">
          {homeServices.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
