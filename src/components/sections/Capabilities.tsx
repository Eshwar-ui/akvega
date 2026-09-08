import { useState } from 'react'
import { Icon, type IconName } from '@/components/Icons'
import { revealDelay } from '@/lib/useInView'

type Capability = {
  name: string
  description: string
  icon: IconName
  to: string
}

const capabilities: Capability[] = [
  {
    name: 'Websites',
    description:
      'Fast, resilient web products engineered for scale, discoverability and real-world traffic.',
    icon: 'browser',
    to: '/services/websites',
  },
  {
    name: 'Mobile Apps',
    description:
      'Native and cross-platform apps built from first prototype through store release.',
    icon: 'mobile',
    to: '/services/mobile-apps',
  },
  {
    name: 'Custom Tools',
    description:
      'Integrations, internal tools and pipelines that remove repetitive work from operations.',
    icon: 'sliders',
    to: '/services/custom-tools',
  },
  {
    name: 'Product Design',
    description:
      'Research, flows and interface systems that move cleanly from prototype to production.',
    icon: 'layers',
    to: '/services/product-design',
  },
  {
    name: 'Online Stores',
    description:
      'Storefronts, payments and fulfilment flows engineered for demanding commerce operations.',
    icon: 'bag',
    to: '/services/online-stores',
  },
  {
    name: 'Cloud Hosting',
    description:
      'Cloud infrastructure, deployment pipelines and observability built for dependable releases.',
    icon: 'spark',
    to: '/services/custom-tools',
  },
]

/*
 * The moving name band. It is decorative and aria-hidden, and it only appears
 * from md up: at phone widths a 48px display face shows fragments of one word
 * rather than a name, which reads as clipped text instead of motion.
 *
 * Dimming the inactive names is what makes the active one legible as a
 * selection — so it only applies at lg, where the selector below it actually
 * exists. Between md and lg there is nothing to select and the names sit at
 * one weight.
 */
function KineticRail({ activeIndex }: { activeIndex: number }) {
  const rail = [...capabilities, ...capabilities]

  return (
    <div
      aria-hidden="true"
      className="capability-ticker hidden overflow-hidden border-y border-white/12 py-8 md:block lg:py-10"
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
                  isActive ? 'text-white' : 'text-white/80 lg:text-white/22'
                }`}
              >
                {capability.name}
              </span>
              <span className="size-2 shrink-0 rounded-full bg-blue-300 sm:size-2.5" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/*
 * Below lg the section is an index, and an index is a list.
 *
 * The tab-plus-detail pattern needs room for six tabs and a pointer; it had
 * neither here. Four of the six scrolled off the panel edge with no affordance
 * that survives a screenshot, selection was driven partly by pointer-enter,
 * which touch never fires, and reaching a service page cost two taps in two
 * different places. These rows carry the same six capabilities and the same
 * copy, all visible, each one a single tap from its own page.
 *
 * Rows, not cards: one hairline between them inside the panel that already
 * exists, rather than six bordered boxes stacked in a column.
 */
function CapabilityIndex() {
  return (
    <ul className="lg:hidden">
      {capabilities.map((capability) => (
        <li
          key={capability.name}
          className="border-b border-white/12 last:border-b-0"
        >
          <a
            href={capability.to}
            className="flex touch-manipulation items-start gap-4 px-5 py-5 transition-colors duration-200 hover:bg-white/[0.06] active:bg-white/[0.09] sm:gap-5 sm:px-7 sm:py-6"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white">
              <Icon
                name={capability.icon}
                className="size-6 text-vega sm:size-7"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-4">
                <span className="text-lg font-semibold leading-snug tracking-[-0.02em] text-white sm:text-xl">
                  {capability.name}
                </span>
                <Icon
                  name="arrowUpRight"
                  className="mt-1 size-4 shrink-0 text-white/50"
                />
              </span>
              <span className="mt-2 block max-w-[52ch] text-base leading-relaxed text-white/68">
                {capability.description}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
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
        {/*
          The strip's second line describes whatever the panel actually does at
          that width — a count for the list, the selection hint for the tabs.
          The count reads off the roster so it cannot drift from it.
        */}
        <div className="flex items-center justify-between gap-4 border-b border-white/12 px-5 py-4 sm:px-7 md:border-b-0">
          <p className="type-overline text-white/68">Technology index</p>
          <p className="text-sm tabular-nums text-white/58 lg:hidden">
            {capabilities.length} disciplines
          </p>
          <p className="hidden text-sm text-white/58 lg:block">
            Select a discipline to explore
          </p>
        </div>

        <KineticRail activeIndex={activeIndex} />

        <CapabilityIndex />

        {/*
          The selector is lg-only, where all six tabs fit the rail. The fade
          mask stays as a guard rather than a fix: if a seventh capability is
          ever added, the row overflows again and a tab cut off at the panel
          edge should read as "there is more this way", not as a clipping bug.
          Scroll-snap makes a drag land on a tab instead of between two.
        */}
        <div className="scroll-rail hidden overflow-x-auto overscroll-x-contain border-b border-white/12 [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden">
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
          className="capability-detail hidden gap-9 px-10 py-12 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center"
        >
          <div className="grid size-20 place-items-center rounded-lg bg-white">
            <Icon
              name={activeCapability.icon}
              className="size-8 text-vega"
            />
          </div>

          <div>
            <p className="type-overline text-blue-300">Technology capability</p>
            <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
              {activeCapability.name}
            </h3>
            <p className="mt-3 max-w-[54ch] text-lg leading-relaxed text-white/68">
              {activeCapability.description}
            </p>
          </div>

          <a
            href={activeCapability.to}
            className="press type-ui inline-flex min-h-11 items-center justify-center gap-2 justify-self-end rounded-full bg-white px-5 py-3 text-navy hover:bg-ice"
          >
            Explore capability
            <Icon name="arrowUpRight" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
