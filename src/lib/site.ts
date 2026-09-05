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

  /**
   * This is the homepage H1 — the strongest on-page signal after the title.
   * It used to read "We make brands impossible to ignore.", which named none of
   * the ten things in lib/services.ts and pitched the design studio the site no
   * longer is. The lead/accent split is unchanged: `accent` still renders in
   * the italic display serif, so the type treatment is exactly as designed.
   */
  headline: { lead: 'Growth marketing and digital build,', accent: 'one team.' },
  /**
   * Read by the hero AND by `Organization.description` / `WebSite.description`
   * in lib/schema.ts, which is why this had to change. It described a studio
   * working across "brand identity, digital product, and motion" — three things
   * that appear nowhere in lib/services.ts — while every title, description and
   * page on the site sells growth marketing plus digital build. Structured data
   * is the description a search engine and an LLM take as the entity's own
   * account of itself, so the contradiction was being stated in the one place
   * it counts most. Wording follows PRODUCT.md's "Product Purpose".
   */
  subhead:
    'Akvega combines growth marketing and digital build under one team — so the campaign and the product it points to are shipped by the same people.',

  primaryCta: { label: 'Start a project', to: '/contact' },
  secondaryCta: { label: 'See the work', to: '/work' },

  email: 'hello@akvega.com',

  // Real, and published in Organization.contactPoint. (The note that used to
  // sit here still called this an obviously-fake placeholder, which stopped
  // being true once a live number was added — a stale comment telling the next
  // reader to replace a working contact detail.)
  phone: '+91 7032990632',

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
