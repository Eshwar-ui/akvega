/**
 * Copy and metadata, single source of truth.
 *
 * Voice follows Akvega Brand Guidelines v1.0 / 01: modern not futuristic,
 * confident not loud, technical not complicated, direct not abrupt.
 *
 * All copy here is placeholder: accurate in shape, not in fact. The guidelines
 * suggest the line "Engineered momentum." if the final positioning fits it.
 */
export const site = {
  name: 'Akvega',

  /**
   * Canonical origin, no trailing slash. INFERRED from the contact address
   * below, not confirmed — it is the one value here that is wrong in a way
   * that costs something (canonical tags, sitemap, share previews all point at
   * it). Confirm the live domain before launch and update public/sitemap.xml,
   * public/robots.txt and the meta tags in index.html to match.
   */
  url: 'https://akvega.com',

  headline: { lead: 'We make brands', accent: 'impossible to ignore.' },
  subhead:
    'Akvega is an independent design studio working across brand identity, digital product, and motion.',

  primaryCta: { label: 'Start a project', to: '/contact' },
  secondaryCta: { label: 'See the work', to: '/work' },

  email: 'hello@akvega.com',

  // Placeholder — no real number yet. Obviously-fake shape on purpose, so it
  // reads as unfinished rather than wrong: replace before launch, never with a
  // guessed real one.
  phone: '+1 (000) 000-0000',

  // Placeholder — Akvega has not confirmed a physical base. "Remote-first" is
  // the least specific true-shaped claim available; replace with a real
  // office/timezone line if one gets confirmed.
  availability: 'Remote-first · async across time zones',

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'Studio', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
  ],

  // `icon` must name an entry in components/BrandMarks.tsx.
  social: [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'Dribbble', href: '#', icon: 'dribbble' },
  ],

  /**
   * Footer. The directory columns are generated from lib/services.ts and
   * `nav` above, so only the tagline and the pill label live here.
   */
  footer: {
    tagline: { lead: 'One partner for', accent: 'growth and build.' },
    cta: { label: 'Contact', to: '/contact' },
  },
} as const
