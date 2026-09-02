/**
 * THESIS: the reference the client pinned proves a page-banner + two-column
 * + map layout can carry a contact page; we build that structure entirely
 * in Akvega's own system rather than the reference's dark, photo-led one.
 * OWN-WORLD: ice/navy/signal, pill CTAs, hairline borders, `.hero-field`'s
 * asset-free gradient standing in for the reference's photo banner.
 * STORY: a visitor lands on a banner that still reads as Akvega, scans the
 * pitch and reach-us details on the left, fills a short form on the right,
 * and sees the (honestly-labelled placeholder) map as a closing beat before
 * the site's own footer.
 * FIRST VIEWPORT: breadcrumb leads directly into the contact content inside a
 * rounded gradient panel, matching the hero stage's material.
 * FORM: layout re-derived from a user-pinned external reference — supersedes
 * the earlier "Diagnostic intake" structural roll (seed key 9ee65736); a
 * pinned reference beats a prior roll by contract.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with
 * the finish review, the verdict, and DESIGN.md.
 */
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/BrandMarks'
import ContactForm from '@/components/contact/ContactForm'
import MapPlaceholder from '@/components/contact/MapPlaceholder'
import { site } from '@/lib/site'
import { revealDelay, useInView } from '@/lib/useInView'

function DetailBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 border-t border-hairline py-5 last:border-b sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-6">
      <p className="type-overline text-ink-muted">{label}</p>
      <div className="text-[16px] font-medium leading-snug tracking-[-0.012em] text-ink sm:text-[18px]">
        {children}
      </div>
    </div>
  )
}

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <>
      {/* Banner — the reference's photo hero, rebuilt on .hero-field so it
          costs no image asset and matches the homepage hero's material. */}
      <div className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="hero-field edge-light relative isolate overflow-hidden rounded-xl border border-hairline sm:rounded-2xl">
          <div className="mx-auto max-w-site px-5 pb-0 pt-10 sm:px-8 sm:pt-14">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
              <Link to="/" className="link-sweep text-ink-muted hover:text-ink">
                Home
              </Link>
              <span aria-hidden="true" className="text-ink-muted">
                /
              </span>
              <span className="font-medium text-ink">Contact</span>
            </nav>
          </div>

          <section
            ref={ref}
            data-shown={inView}
            className="mx-auto max-w-site px-5 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-12"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
              <div>
                <h2 className="reveal type-section-title max-w-[16ch]">
                  We're always ready to help you and answer your questions.
                </h2>
                <p
                  style={revealDelay(1)}
                  className="reveal type-body mt-6 max-w-[46ch] text-ink-muted"
                >
                  Every engagement opens with a paid diagnostic — an audit and a
                  scoped plan, handed over whether or not you continue with us.
                </p>

                <div
                  style={revealDelay(2)}
                  className="reveal mt-12"
                >
                  <DetailBlock label="Reach us">{site.phone}</DetailBlock>
                  <DetailBlock label="Availability">
                    {site.availability}
                  </DetailBlock>
                  <DetailBlock label="Email">
                    <a
                      href={`mailto:${site.email}`}
                      className="link-sweep text-blue-700"
                    >
                      {site.email}
                    </a>
                  </DetailBlock>
                  <DetailBlock label="Social">
                    <ul className="flex flex-wrap gap-3">
                      {site.social.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            aria-label={item.label}
                            className="press grid size-11 place-items-center rounded-xl border border-hairline bg-paper/80 text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                          >
                            <BrandMark name={item.icon} className="size-[18px]" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </DetailBlock>
                </div>
              </div>

              <div style={revealDelay(1)} className="reveal">
                <ContactForm />
              </div>
            </div>

            <div style={revealDelay(3)} className="reveal mt-16 sm:mt-20">
              <MapPlaceholder />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
