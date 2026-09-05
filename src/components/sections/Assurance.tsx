import { Icon, type IconName } from '@/components/Icons'
import { revealDelay } from '@/lib/useInView'

/**
 * A compact trust strip between Approach and Process — the "no lock-in"
 * argument (Product Principle 3) pulled forward from where it currently only
 * lives buried in one FAQ accordion answer. No case studies or client logos
 * exist yet (PRODUCT.md — do not fabricate proof), so this stands in as the
 * de-risking beat a decision-maker needs before Process explains the
 * mechanics: every claim here is reused verbatim from lib/services.ts's FAQ
 * answers, not invented for this section.
 *
 * Deliberately light and narrow in scope — three lines, no heading weight —
 * so it reads as a connective reassurance beat, not a competing argument
 * with Approach (navy, just above) or Process (the next full section).
 */
type Point = { icon: IconName; text: string }

const points: Point[] = [
  {
    icon: 'layers',
    text: 'Repositories, ad accounts and analytics are set up in your name — not ours.',
  },
  {
    icon: 'target',
    text: 'Every engagement opens with a paid diagnostic, before any commitment.',
  },
  {
    icon: 'arrowUpRight',
    text: 'Leaving is a decision, not an extraction.',
  },
]

export default function Assurance() {

  return (
    <section
      data-reveal-root
data-shown="false"
      className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="type-overline shrink-0 text-ink-muted">No lock-in</p>
        <p className="type-body max-w-[46ch] text-ink-muted sm:text-right">
          You own everything from the first day, not just the last one.
        </p>
      </div>

      <ul className="mt-10 grid gap-x-10 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-3">
        {points.map((point, i) => (
          <li
            key={point.text}
            style={revealDelay(i + 1, 90)}
            className="reveal flex items-start gap-4"
          >
            <Icon
              name={point.icon}
              className="mt-0.5 size-5 shrink-0 text-signal"
            />
            <p className="type-body text-ink">{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
