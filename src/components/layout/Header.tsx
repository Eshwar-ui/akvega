import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogoFull } from '@/components/Logo'
import TextRoll from '@/components/TextRoll'
import { site } from '@/lib/site'

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(location.pathname !== '/')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const updateElevation = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero-stage]')
      const isOverHero =
        location.pathname === '/' &&
        hero !== null &&
        hero.getBoundingClientRect().bottom > 80

      setElevated(!isOverHero)
    }

    updateElevation()
    window.addEventListener('scroll', updateElevation, { passive: true })
    window.addEventListener('resize', updateElevation)

    return () => {
      window.removeEventListener('scroll', updateElevation)
      window.removeEventListener('resize', updateElevation)
    }
  }, [location.pathname])

  useEffect(() => {
    let lastScrollY = window.scrollY
    let frame: number | null = null

    const updateVisibility = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (open || currentScrollY <= 8) {
        setVisible(true)
        lastScrollY = currentScrollY
      } else if (delta > 6) {
        setVisible(false)
        lastScrollY = currentScrollY
      } else if (delta < -6) {
        setVisible(true)
        lastScrollY = currentScrollY
      }

      frame = null
    }

    const handleScroll = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(updateVisibility)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [location.pathname, open])

  return (
    <header
      onFocusCapture={() => setVisible(true)}
      className={`nav-glass sticky top-0 z-50 ${elevated ? 'nav-glass-elevated' : ''} ${visible ? '' : 'nav-scroll-hidden'}`}
    >
      <div className="mx-auto flex h-20 max-w-site items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center text-ink"
          aria-label={`${site.name}, home`}
        >
          <LogoFull className="h-[26px] w-auto sm:h-[28px]" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
          {site.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `type-ui relative py-1 transition-colors duration-200 hover:text-ink ${
                  isActive ? 'text-ink' : 'text-ink-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <TextRoll>{item.label}</TextRoll>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-signal transition-transform duration-300 ease-out-expo ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`mailto:${site.email}`}
            className="type-ui rounded-full px-3 py-2.5 text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            {site.email}
          </a>
          <Link
            to={site.primaryCta.to}
            className="press type-ui rounded-full bg-navy px-5 py-2.5 text-white hover:bg-blue-700"
          >
            {site.primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          className="press -mr-1 grid size-11 place-items-center rounded-full text-ink hover:bg-paper/55 lg:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out-expo ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out-expo ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="nav-glass nav-glass-elevated absolute inset-x-0 top-20 px-5 pb-6 pt-3 sm:px-8 lg:hidden"
      >
        <nav className="flex flex-col">
          {site.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `border-b border-hairline py-4 text-2xl font-medium leading-[1.2] ${
                  isActive ? 'text-blue-700' : 'text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to={site.primaryCta.to}
          onClick={() => setOpen(false)}
          className="press type-ui mt-6 block rounded-full bg-navy px-5 py-3.5 text-center text-white"
        >
          {site.primaryCta.label}
        </Link>
      </div>
    </header>
  )
}
