import { Icon } from '@/components/Icons'
import { useInView, revealDelay } from '@/lib/useInView'
import { faqs } from '@/lib/services'

export default function Faq() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
      className="mx-auto max-w-site px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
        <h2 className="reveal type-section-title max-w-[12ch] lg:sticky lg:top-28 lg:self-start">
          Questions we get asked.
        </h2>

        <div>
          {faqs.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              style={revealDelay(i, 60)}
              className="reveal group border-b border-hairline first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 sm:py-8 text-left [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4 sm:gap-5">
                  {/* Ties the FAQ into the same numbered-sequence language as
                      Process, rather than the accordion reading as a plain
                      afterthought list. */}
                  <span className="type-overline shrink-0 tabular-nums text-[11px] text-ink-muted/45 sm:text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xl font-medium leading-[1.25] transition-colors duration-300 ease-out-expo group-hover:text-signal sm:text-2xl">
                    {item.q}
                  </span>
                </span>
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-hairline text-ink-muted transition-transform duration-300 ease-out-expo group-open:rotate-45">
                  <Icon name="plus" className="size-4" />
                </span>
              </summary>
              {/* Left offset approximates the numeral + gap above, so the
                  answer reads as continuing under the question, not the
                  index. */}
              <p className="type-body max-w-[65ch] py-1 pb-8 pl-9 pr-12 text-ink-muted sm:pl-11">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
