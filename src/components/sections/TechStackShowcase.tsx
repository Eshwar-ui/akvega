import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icons'
import { TechIcon } from '@/components/TechStack'
import { renderableMarks, type TechMark } from '@/lib/tech'
import { revealDelay, useInView } from '@/lib/useInView'

/**
 * A two-up layout — pitch on the left, the stack itself on the right — with
 * marks rendered at full brand colour rather than TechStack.tsx's
 * monochrome-until-hover treatment. That restraint is right for a dense
 * grouped list; here the brief was a lively, colourful wall, so it follows
 * the same call PlatformTiles.tsx already made for the hero.
 *
 * The wall sits in its own bordered panel — a window onto the stack, not a
 * bare grid on the page — split into five independent columns that scroll
 * as a vertical marquee (`.marquee`, index.css), alternating direction so it
 * reads as a crisscross rather than one strip sliding past. Each column's
 * track holds its marks twice back to back and animates exactly half its own
 * height, so the loop seam never shows.
 *
 * Mark selection is the same unverified placeholder set TechStack.tsx uses —
 * confirm before launch.
 */
const COLUMN_COUNT = 5

const columns: TechMark[][] = Array.from({ length: COLUMN_COUNT }, (_, i) =>
  renderableMarks.filter((_, index) => index % COLUMN_COUNT === i),
)

const columnDurations = [26, 32, 22, 30, 24]

function StackTile({ mark }: { mark: TechMark }) {
  return (
    <span
      title={mark.title}
      style={{ '--brand': mark.hex } as React.CSSProperties}
      className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-paper shadow-[0_1px_2px_rgb(5_17_39/0.05),0_16px_32px_-18px_rgb(5_17_39/0.3)] sm:size-16 lg:size-[4.75rem]"
    >
      <TechIcon
        mark={mark}
        className="size-4 shrink-0 bg-[var(--brand)] sm:size-8 lg:size-9"
      />
      <span className="sr-only">{mark.title}</span>
    </span>
  )
}

function MarqueeColumn({
  marks,
  reverse,
  duration,
}: {
  marks: TechMark[]
  reverse: boolean
  duration: number
}) {
  const track = [...marks, ...marks]

  return (
    <div className="h-full overflow-hidden">
      <div
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
        className={`marquee flex flex-col gap-2 sm:gap-4 ${reverse ? 'marquee-reverse' : ''}`}
      >
        {track.map((mark, i) => (
          <StackTile key={`${mark.id}-${i}`} mark={mark} />
        ))}
      </div>
    </div>
  )
}

export default function TechStackShowcase() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
      id="tech-stack"
      className="mx-auto max-w-site px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
        <div>
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
            <Icon name="layers" className="size-3.5 text-signal" />
            Our tech stack
          </span>

          <h2 className="reveal type-section-title mt-6 max-w-[15ch]">
            Key technologies, chosen deliberately.
          </h2>

          <p
            style={revealDelay(1)}
            className="reveal type-body mt-5 max-w-[46ch] text-ink-muted"
          >
            We choose the smallest proven combination for the product, then
            keep design, engineering and measurement connected — not the
            longest list of logos we can fit on a page.
          </p>

          <Link
            to="/services#stack"
            style={revealDelay(2)}
            className="press reveal mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_10px_30px_-12px_var(--color-signal)] hover:shadow-[0_16px_36px_-12px_var(--color-signal)]"
          >
            Explore the full stack
            <Icon name="arrowUpRight" className="size-4" />
          </Link>
        </div>

        <div
          style={revealDelay(2)}
          className="reveal relative h-[380px] overflow-hidden rounded-2xl border border-hairline bg-surface/60 p-3 sm:h-[440px] sm:p-6 lg:h-[520px]"
        >
          <div className="grid h-full grid-cols-5 gap-2 sm:gap-4">
            {columns.map((marks, i) => (
              <MarqueeColumn
                key={i}
                marks={marks}
                reverse={i % 2 === 1}
                duration={columnDurations[i]}
              />
            ))}
          </div>

          {/* Fade the wall into the panel edges rather than cutting it off flat. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-surface to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
