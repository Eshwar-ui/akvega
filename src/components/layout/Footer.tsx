import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/BrandMarks'
import { Icon } from '@/components/Icons'
import { LogoFull } from '@/components/Logo'
import { tracks } from '@/lib/services'
import { useInView, revealDelay } from '@/lib/useInView'
import { site } from '@/lib/site'

/**
 * The footer is a panel, not a strip — it mirrors the CTA card above it, so the
 * page closes on two aligned rounded surfaces (navy, then ice).
 *
 * Headings are Inter, not the display serif: 07 restricts Instrument Serif to
 * the hero accent line, and this would have been a third context.
 */
function Column({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="type-overline text-[13px] text-ink-muted">
        {heading}
      </h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  )
}

function ColumnLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="link-sweep type-ui text-ink-muted transition-colors duration-200 hover:text-ink"
      >
        {children}
      </Link>
    </li>
  )
}

export default function Footer() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div
        ref={ref}
        data-shown={inView}
        className="relative isolate mx-auto max-w-site overflow-hidden rounded-xl border border-hairline bg-surface sm:rounded-2xl"
      >
        {/* The gradient bloom, rising from the bottom edge to carry the
            lockup. Purely a surface — it sits under everything and takes no
            pointer. */}
        <div
          aria-hidden="true"
          className="footer-field pointer-events-none absolute inset-0 -z-10"
        />
        <div className="px-6 pt-16 sm:px-10 sm:pt-20 lg:px-14">
          {/* The pitch, and the one action. 06: large negative space, one cue. */}
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <p className="reveal type-card-title max-w-[15ch] text-balance text-ink">
              {site.footer.tagline.lead}{' '}
              <span className="text-blue-700">{site.footer.tagline.accent}</span>
            </p>

            <Link
              to={site.footer.cta.to}
              style={revealDelay(1)}
              className="press reveal type-track-title inline-flex shrink-0 items-center self-start rounded-full border border-navy/20 px-8 py-3 text-ink hover:border-navy hover:bg-navy hover:text-white sm:px-10"
            >
              {site.footer.cta.label}
            </Link>
          </div>

          {/* Directory. The two tracks are the architecture — they lead. */}
          <nav
            aria-label="Footer"
            className="mt-20 grid gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-24 lg:grid-cols-4"
          >
            {tracks.map((track) => (
              <Column key={track.id} heading={track.label}>
                {track.services.map((service) => (
                  <ColumnLink key={service.slug} to={`/services#${service.slug}`}>
                    {service.name}
                  </ColumnLink>
                ))}
              </Column>
            ))}

            <Column heading="Explore">
              {site.nav.map((item) => (
                <ColumnLink key={item.to} to={item.to}>
                  {item.label}
                </ColumnLink>
              ))}
            </Column>

            <div>
              <h2 className="type-overline text-[13px] text-ink-muted">
                Say hello
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {site.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="press inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[14px] text-ink-muted shadow-[0_1px_2px_rgb(5_17_39/0.06)] hover:text-ink hover:shadow-[0_4px_12px_-4px_rgb(5_17_39/0.18)]"
                    >
                      <BrandMark name={item.icon} className="size-[18px]" />
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="press inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[14px] text-ink-muted shadow-[0_1px_2px_rgb(5_17_39/0.06)] hover:text-ink hover:shadow-[0_4px_12px_-4px_rgb(5_17_39/0.18)]"
                  >
                    <Icon name="mail" className="size-4" />
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="mt-16 flex flex-col gap-3 border-t border-hairline py-6 text-[14px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              ©{'\u00A0'}{new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <a
              href="#main"
              className="group/top inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-ink"
            >
              Back to top
              <Icon
                name="arrowUpRight"
                className="size-4 transition-transform duration-300 ease-out-expo group-hover/top:-translate-y-0.5 group-hover/top:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/*
         * The lockup closes the page at full width. It is the primary logo at
         * scale — never cropped, stretched or recoloured (04, 05).
         */}
        <Link
          to="/"
          aria-label={`${site.name}, home`}
          style={revealDelay(2)}
          className="reveal block px-6 pb-10 sm:px-10 sm:pb-12 lg:px-14"
        >
          <LogoFull className="w-full" />
        </Link>
      </div>
    </footer>
  )
}
