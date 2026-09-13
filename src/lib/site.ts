/**
 * Copy and metadata, single source of truth.
 *
 * Voice follows Akvega Brand Guidelines v1.0 / 01: modern not futuristic,
 * confident not loud, technical not complicated, direct not abrupt.
 *
 * Contact and entity values below are REAL as of the September 2026 SEO plan
 * and are read by the JSON-LD in lib/schema.ts, the
 * footer NAP block and the contact page. Keep the NAP (name, address, phone)
 * identical, character for character, to the Google Business Profile —
 * consistency across the site, GBP and directories is a local-pack ranking
 * input, and every variant string is a weaker entity match.
 */

/** Canonical origin, no trailing slash. Must match `site` in astro.config.mjs. */
export const SITE_URL = 'https://akvega.com'

export const LEGAL_NAME = 'AKVEGA Private Limited'

/** E.164 for `tel:` links and schema. */
export const PHONE = '+917032990632'
/** How the number is shown to people. */
export const PHONE_DISPLAY = '+91 70329 90632'

export const LOCALITY = 'Hyderabad'
export const REGION = 'Telangana'
/** ISO 3166-2 subdivision, for the geo.region meta tag. */
export const REGION_CODE = 'TG'
export const COUNTRY = 'IN'
export const COUNTRY_NAME = 'India'
/** BCP 47 for `<html lang>`; the Open Graph form is derived in the layout. */
export const LOCALE = 'en-IN'

/**
 * Cities and regions the business serves, most specific first. Feeds
 * `areaServed` on the Organization and every Service node.
 */
export const SERVICE_AREA = [
  { type: 'City', name: 'Hyderabad' },
  { type: 'City', name: 'Secunderabad' },
  { type: 'State', name: 'Telangana' },
  { type: 'Country', name: 'India' },
] as const

/**
 * The single location sentence, used verbatim on the contact page, the
 * footer and the location page. It must stay identical to the GBP
 * description's opening line.
 */
export const LOCATION_LINE =
  'Based in Hyderabad, India. We work remote-first with clients across Hyderabad, wider India, and the US.'

export type SocialLink = {
  label: string
  href: string
  /** Must name an entry in components/BrandMarks.tsx. */
  icon: 'linkedin' | 'instagram'
}

/**
 * Verified live profiles only. Never a placeholder: an empty or dead profile
 * in `sameAs` is a negative entity signal, not a neutral one, which is why
 * Dribbble is gone rather than stubbed.
 *
 * Instagram is @akvegadigital, not @akvega — grab the shorter handle if it
 * frees up, and until then keep the *display name* on every platform set to
 * exactly "Akvega", which is what entity matching keys on.
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/akvega/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/akvegadigital/', icon: 'instagram' },
]

/**
 * TODO: replace with the canonical Google Maps place URL once copied from the
 * Business Profile — the full https://www.google.com/maps/place/... form, NOT
 * the share.google short link, which is a redirect and not a stable entity
 * identifier. Left empty it is filtered out of `sameAs` below and the contact
 * page renders no map link.
 */
export const GOOGLE_BUSINESS_URL = ''

/**
 * The founder. Named on every page (components/ReviewedBy.astro) and as a
 * Person node in the JSON-LD, because answer engines credit an individual
 * only when the name sits next to the claim. The LinkedIn URL is empty until
 * verified — an unverified identifier is worse than none.
 */
export const FOUNDER_NAME = 'Kalyan Kumar Bedugam'
export const FOUNDER_TITLE = 'Founder'
/** Confirmed by the founder, September 2026. Shown on the attribution line. */
export const FOUNDER_CREDENTIALS = 'Google Ads and Meta Blueprint certified, three years in growth marketing and digital build'
/** Named certifications for the Person node's `hasCredential`. */
export const FOUNDER_CERTIFICATIONS = [
  { name: 'Google Ads certification', issuer: 'Google' },
  { name: 'Meta Blueprint certification', issuer: 'Meta' },
]
export const FOUNDER_LINKEDIN = ''
export const FOUNDER_SAME_AS: string[] = [FOUNDER_LINKEDIN].filter(Boolean)

export const SAME_AS: string[] = [
  ...SOCIAL_LINKS.map((link) => link.href),
  GOOGLE_BUSINESS_URL,
].filter(Boolean)

export const site = {
  name: 'Akvega',
  url: SITE_URL,

  headline: { lead: 'We make brands', accent: 'impossible to ignore.' },
  subhead:
    'Akvega combines growth marketing and digital build under one team — so the campaign and the product it points to are shipped by the same people. We work with founders and marketing leads at Indian SMBs and funded startups.',

  primaryCta: { label: 'Start a project', to: '/contact' },
  secondaryCta: { label: 'See the work', to: '/work' },

  email: 'hello@akvega.com',
  phone: PHONE,
  phoneDisplay: PHONE_DISPLAY,

  /** Where the work happens. Replaces the old "remote-first, no office" line. */
  location: LOCATION_LINE,
  /** Where the audit-first model is explained. */
  diagnosticPath: '/paid-diagnostic',
  /** Short form for tight UI (footer address, map card title). */
  locationShort: `${LOCALITY}, ${REGION}, ${COUNTRY_NAME}`,

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'Studio', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
  ],

  social: SOCIAL_LINKS,

  /**
   * Footer. The directory columns are generated from lib/services.ts and
   * `nav` above, so only the tagline and the pill label live here.
   */
  footer: {
    tagline: { lead: 'One partner for', accent: 'growth and build.' },
    cta: { label: 'Contact', to: '/contact' },
  },
} as const
