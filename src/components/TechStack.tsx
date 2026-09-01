import { useInView, revealDelay } from '@/lib/useInView'
import { renderableMarks, techGroups, type TechMark } from '@/lib/tech'

/**
 * Third-party brand marks. These deliberately do NOT live in Icons.tsx: that
 * file is the house icon set — drawn, 2px stroke, one colour (08). These are
 * other people's logos and must not be redrawn to match it.
 *
 * Each mark is masked from public/tech/<id>.svg rather than inlined, so the
 * path data stays out of the bundle and the colour is still ours to set.
 * Simple Icons marks are single-colour silhouettes, so masking loses nothing.
 */
export function TechIcon({
  mark,
  className = '',
}: {
  mark: TechMark
  className?: string
}) {
  // Marks awaiting a vendor asset have no file. Better a gap than a redrawn
  // logo — see the note on the entry in lib/tech.ts.
  if (!mark.asset) return null

  const src = `url(/tech/${mark.id}.svg)`

  return (
    <span
      aria-hidden="true"
      style={{
        maskImage: src,
        WebkitMaskImage: src,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
      className={`block ${className}`}
    />
  )
}

/**
 * The stack, grouped the way the site talks about the work. Marks sit
 * monochrome and take their brand colour on hover — thirty logos at full
 * saturation is what "loud" looks like (01), and the colour then means
 * something when it arrives.
 */
export default function TechStack() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} data-shown={inView} className="space-y-12">
      {techGroups.map((group, gi) => {
        const marks = renderableMarks.filter((m) => m.group === group)
        if (!marks.length) return null

        return (
          <section key={group} className="reveal" style={revealDelay(gi, 60)}>
            <h3 className="type-overline text-[13px] text-ink-muted">
              {group}
            </h3>

            <ul className="mt-5 flex flex-wrap gap-2.5">
              {marks.map((mark) => (
                <li key={mark.id}>
                  <span
                    style={{ '--brand': mark.hex } as React.CSSProperties}
                    className="press group flex items-center gap-2.5 rounded-md border border-hairline bg-paper py-2.5 pl-3 pr-4 shadow-[0_1px_2px_rgb(5_17_39/0.05)] hover:shadow-[0_6px_16px_-6px_rgb(5_17_39/0.2)]"
                  >
                    <TechIcon
                      mark={mark}
                      className="size-[18px] shrink-0 bg-ink-muted transition-colors duration-300 ease-out-expo group-hover:[background-color:var(--brand)]"
                    />
                    <span className="text-[15px] leading-none text-ink">
                      {mark.title}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
