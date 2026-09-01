import { useInView, revealDelay } from '@/lib/useInView'
import { process } from '@/lib/services'

export default function Process() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
      className="mx-auto max-w-site px-5 py-28 sm:px-8 sm:py-40"
    >
      <h2 className="reveal type-section-title">
        How the work runs.
      </h2>
      <p
        style={revealDelay(1)}
        className="reveal type-lede mt-6 max-w-[52ch] text-ink-muted"
      >
        Four stages, in this order, whichever track you start on.
      </p>

      {/* The sequence is the content, so the steps are numbered — and they
          arrive in that order too. */}
      <ol className="mt-20 grid gap-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4 lg:gap-10">
        {process.map((step, i) => (
          <li key={step.title} className="reveal relative" style={revealDelay(i + 2, 90)}>
            <div className="flex items-center gap-4">
              <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tabular-nums text-ink/15">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-ink/15 to-transparent"
              />
            </div>
            <h3 className="type-card-title mt-7">
              {step.title}
            </h3>
            <p className="type-body mt-3 max-w-[38ch] text-ink-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
