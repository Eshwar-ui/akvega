import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icons'
import { revealDelay } from '@/lib/useInView'

type Capability = {
  name: string
  description: string
  mark: ReactNode
  to: string
}

const markSize = 'size-7 sm:size-8'

const capabilities: Capability[] = [
  {
    name: 'Websites',
    description:
      'Fast, resilient web products engineered for scale, discoverability and real-world traffic.',
    mark: <Icon name="browser" className={`${markSize} text-vega`} />,
    to: '/services/websites',
  },
  {
    name: 'Mobile Apps',
    description:
      'Native and cross-platform apps built from first prototype through store release.',
    mark: <Icon name="mobile" className={`${markSize} text-vega`} />,
    to: '/services/mobile-apps',
  },
  {
    name: 'Custom Tools',
    description:
      'Integrations, internal tools and pipelines that remove repetitive work from operations.',
    mark: <Icon name="sliders" className={`${markSize} text-vega`} />,
    to: '/services/custom-tools',
  },
  {
    name: 'Product Design',
    description:
      'Research, flows and interface systems that move cleanly from prototype to production.',
    mark: <Icon name="layers" className={`${markSize} text-vega`} />,
    to: '/services/product-design',
  },
  {
    name: 'Online Stores',
    description:
      'Storefronts, payments and fulfilment flows engineered for demanding commerce operations.',
    mark: <Icon name="bag" className={`${markSize} text-vega`} />,
    to: '/services/online-stores',
  },
  {
    name: 'Cloud Hosting',
    description:
      'Cloud infrastructure, deployment pipelines and observability built for dependable releases.',
    mark: <Icon name="spark" className={`${markSize} text-vega`} />,
    to: '/services/custom-tools',
  },
]

function KineticRail({ activeIndex }: { activeIndex: number }) {
  const rail = [...capabilities, ...capabilities]

  return (
    <div
      aria-hidden="true"
      className="capability-ticker overflow-hidden border-y border-white/12 py-7 sm:py-9"
    >
      <div className="capability-ticker-track flex w-max items-center">
        {rail.map((capability, index) => {
          const isActive = index % capabilities.length === activeIndex

          return (
            <div
              key={`${capability.name}-${index}`}
              className="flex shrink-0 items-center"
            >
              <span
                className={`whitespace-nowrap px-5 text-[clamp(3rem,7vw,7.25rem)] font-semibold leading-[0.88] tracking-[-0.04em] transition-colors duration-500 sm:px-8 ${
                  isActive ? 'text-white' : 'text-white/22'
                }`}
              >
                {capability.name}
              </span>
              <span
                className="size-2 shrink-0 rounded-full bg-blue-300 sm:size-2.5"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeCapability = capabilities[activeIndex]

  const handleActivate = (index: number) => setActiveIndex(index)

  return (
    <section
      id="capabilities"
      data-reveal-root
data-shown="false"
      aria-labelledby="capabilities-title"
      className="mx-auto max-w-site px-5 pt-24 sm:px-8 sm:pt-32"
    >
      <div className="reveal grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
        <div>
          <p className="type-overline text-ink-muted">What we build</p>
          <h2 id="capabilities-title" className="type-section-title mt-5">
            Technology, built end to end.
          </h2>
        </div>
        <p className="type-lede max-w-[38ch] text-ink-muted lg:justify-self-end lg:text-right">
          From high-performance products to the infrastructure beneath them,
          designed and shipped by one team.
        </p>
      </div>

      <div
        style={revealDelay(1)}
        className="reveal mt-10 overflow-hidden rounded-2xl bg-navy text-white sm:mt-14"
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-7">
          <p className="type-overline text-white/68">Technology index</p>
          <p className="hidden text-sm text-white/58 sm:block">
            Select a discipline to explore
          </p>
        </div>

        <KineticRail activeIndex={activeIndex} />

        {/*
          The selector scrolls horizontally on narrow screens. It was cut off
          mid-word at the panel edge with nothing to say it continued, which
          reads as a layout bug rather than an invitation to swipe — so the
          rail is masked to fade its trailing edge, and scroll-snap makes a
          swipe land on a tab instead of halfway between two.
        */}
        <div className="scroll-rail overflow-x-auto overscroll-x-contain border-b border-white/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-full min-w-max snap-x snap-mandatory">
            {capabilities.map((capability, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={capability.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleActivate(index)}
                  onFocus={() => handleActivate(index)}
                  onPointerEnter={() => handleActivate(index)}
                  className={`relative min-h-14 min-w-36 flex-1 snap-start touch-manipulation border-r border-white/12 px-5 text-left text-sm font-medium transition-colors duration-200 last:border-r-0 sm:min-w-40 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/56 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {capability.name}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-5 bottom-0 h-0.5 origin-left bg-blue-300 transition-transform duration-500 ease-out-expo ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div
          key={activeCapability.name}
          className="capability-detail grid gap-7 px-5 py-8 sm:px-7 sm:py-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-9 lg:px-10 lg:py-12"
        >
          <div className="grid size-16 place-items-center rounded-lg bg-white sm:size-20">
            {activeCapability.mark}
          </div>

          <div>
            <p className="type-overline text-blue-300">Technology capability</p>
            <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
              {activeCapability.name}
            </h3>
            <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-white/68 sm:text-lg">
              {activeCapability.description}
            </p>
          </div>

          <a
            href={activeCapability.to}
            className="press type-ui inline-flex min-h-11 items-center justify-center gap-2 justify-self-start rounded-full bg-white px-5 py-3 text-navy hover:bg-ice md:justify-self-end"
          >
            Explore capability
            <Icon name="arrowUpRight" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
