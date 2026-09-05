import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HeroServiceCardsDesktop,
  HeroServiceCardsMobile,
} from '@/components/hero/HeroServiceCards'
import PlatformTiles from '@/components/hero/PlatformTiles'
import { site } from '@/lib/site'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stage = root.current?.querySelector<HTMLElement>('[data-hero-stage]')
      if (!stage) return

      const media = gsap.matchMedia()

      media.add(
        {
          animate: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1280px)',
          pointer: '(pointer: fine)',
        },
        (context) => {
          if (!context.conditions?.animate) {
            gsap.set(
              '[data-hero-reveal], [data-hero-card-enter], [data-platform-enter]',
              { clearProps: 'all' },
            )
            return
          }

          const serviceCards = gsap.utils
            .toArray<HTMLElement>('[data-hero-service-card]')
            .filter((element) => element.offsetParent !== null)
          const platformTiles = gsap.utils
            .toArray<HTMLElement>('[data-platform-tile]')
            .filter((element) => element.offsetParent !== null)
          const serviceCardEntrances = gsap.utils
            .toArray<HTMLElement>('[data-hero-card-enter]')
            .filter((element) => element.offsetParent !== null)
          const platformEntrances = gsap.utils
            .toArray<HTMLElement>('[data-platform-enter]')
            .filter((element) => element.offsetParent !== null)
          const reveals = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]')
          const images = serviceCardEntrances.flatMap((card) =>
            Array.from(card.querySelectorAll<HTMLElement>('img')),
          )

          gsap.set(reveals, { autoAlpha: 0, y: 26 })

          const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
          intro
            .fromTo(
              '[data-hero-field]',
              { autoAlpha: 0, scale: 1.1 },
              { autoAlpha: 1, scale: 1, duration: 1.65 },
              0,
            )
            .to(
              reveals,
              { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 },
              0.12,
            )
            .fromTo(
              serviceCardEntrances,
              {
                autoAlpha: 0,
                y: (_index, target) => {
                  const owner = (target as HTMLElement).closest<HTMLElement>(
                    '[data-scroll-direction]',
                  )
                  return Number(owner?.dataset.scrollDirection ?? 1) * 46
                },
                scale: 0.9,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.1,
              },
              0.3,
            )
            .fromTo(
              images,
              { scale: 0.88, filter: 'blur(7px)' },
              {
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.25,
                stagger: 0.07,
              },
              0.36,
            )
            .fromTo(
              platformEntrances,
              { autoAlpha: 0, y: 34, scale: 0.78 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.065,
              },
              0.68,
            )

          if (context.conditions?.desktop) {
            serviceCards.forEach((card) => {
              const depth = Number(card.dataset.depth ?? 0.7)
              const direction = Number(card.dataset.scrollDirection ?? 1)

              gsap.to(card, {
                y: direction * 105 * depth,
                scale: 0.94,
                autoAlpha: 0.28,
                ease: 'none',
                scrollTrigger: {
                  trigger: stage,
                  start: 'top top+=80',
                  end: 'bottom top+=100',
                  scrub: 0.8,
                },
              })
            })

            platformTiles.forEach((tile, index) => {
              gsap.to(tile, {
                y: -48 - index * 7,
                autoAlpha: 0.25,
                ease: 'none',
                scrollTrigger: {
                  trigger: stage,
                  start: 'top top+=80',
                  end: 'bottom top+=120',
                  scrub: 0.9,
                },
              })
            })

            gsap.to('[data-hero-core]', {
              y: -42,
              autoAlpha: 0.58,
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top top+=80',
                end: 'bottom top+=120',
                scrub: 0.9,
              },
            })
          }

          if (context.conditions?.desktop && context.conditions?.pointer) {
            const pointerLayers = gsap.utils
              .toArray<HTMLElement>('[data-pointer-layer]')
              .filter((element) => element.offsetParent !== null)
              .map((element) => {
                const owner = element.closest<HTMLElement>('[data-depth]')
                const depth = Number(owner?.dataset.depth ?? 0.35)
                return {
                  x: gsap.quickTo(element, 'x', { duration: 0.8, ease: 'power3.out' }),
                  y: gsap.quickTo(element, 'y', { duration: 0.8, ease: 'power3.out' }),
                  depth,
                }
              })

            const move = (event: PointerEvent) => {
              const bounds = stage.getBoundingClientRect()
              const x = (event.clientX - bounds.left) / bounds.width - 0.5
              const y = (event.clientY - bounds.top) / bounds.height - 0.5

              pointerLayers.forEach((layer) => {
                layer.x(x * 32 * layer.depth)
                layer.y(y * 24 * layer.depth)
              })
            }

            const reset = () => {
              pointerLayers.forEach((layer) => {
                layer.x(0)
                layer.y(0)
              })
            }

            stage.addEventListener('pointermove', move, { passive: true })
            stage.addEventListener('pointerleave', reset)

            return () => {
              stage.removeEventListener('pointermove', move)
              stage.removeEventListener('pointerleave', reset)
            }
          }
        },
      )

      return () => media.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="px-3 pb-6 sm:px-5 sm:pb-8">
      {/* One screen tall: the viewport less the 80px header and this wrapper's
          bottom gutter, so the stage ends exactly where the fold does. `svh`
          rather than `vh` — mobile browser chrome must not crop it. It is a
          minimum, so on short screens the content still pushes the stage
          taller instead of overflowing. */}
      <section
        data-hero-stage
        className="edge-light relative isolate mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-site flex-col overflow-hidden rounded-xl border border-hairline bg-surface [perspective:1600px] sm:min-h-[calc(100svh-7rem)] sm:rounded-2xl"
      >
        {/* Gradient field. Gives the stage material with no asset dependency. */}
        <div
          aria-hidden="true"
          data-hero-field
          className="hero-field pointer-events-none absolute inset-0 -z-20"
        />

        <HeroServiceCardsDesktop />

        <div
          data-hero-core
          data-depth="0.16"
          className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pt-[clamp(1.5rem,4vh,2.25rem)] pb-28 text-center will-change-transform"
        >
          {/* Display runs past the guidelines' 64px ceiling by client direction. */}
          <h1
            data-hero-reveal
            className="type-display text-balance"
          >
            {site.headline.lead}{' '}
            <span className="font-display font-normal italic text-signal">
              {site.headline.accent}
            </span>
          </h1>

          {/* Body / 16–18 */}
          <p
            data-hero-reveal
            className="type-lede mt-[clamp(1rem,2.6vh,1.5rem)] max-w-[48ch] text-pretty text-ink-muted"
          >
            {site.subhead}
          </p>

          <div
            data-hero-reveal
            className="mt-[clamp(1.5rem,4.5vh,2.5rem)] flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <a
              href={site.primaryCta.to}
              data-cta="hero-start-project"
              className="press type-ui rounded-full bg-navy px-7 py-3.5 text-white shadow-[0_10px_30px_-10px_var(--color-signal)] hover:shadow-[0_18px_42px_-12px_var(--color-signal)]"
            >
              {site.primaryCta.label}
            </a>
            <a
              href={site.secondaryCta.to}
              data-cta="hero-see-the-work"
              className="press type-ui rounded-full border border-hairline bg-paper px-7 py-3.5 text-ink hover:border-blue-300 hover:text-blue-700"
            >
              {site.secondaryCta.label}
            </a>
          </div>

          <PlatformTiles />
          <HeroServiceCardsMobile />
        </div>
      </section>
    </div>
  )
}
