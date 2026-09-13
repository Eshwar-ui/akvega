import { allServices, faqs, tracks, type Service } from '@/lib/services'
import {
  COUNTRY,
  LEGAL_NAME,
  LOCALE,
  LOCALITY,
  PHONE,
  REGION,
  SAME_AS,
  SERVICE_AREA,
  site,
} from '@/lib/site'

/**
 * JSON-LD builders. Every node here is built from the real values in
 * lib/site.ts — the address, phone, profiles and service area — so the
 * structured data, the footer NAP and the contact page cannot disagree.
 *
 * Two deliberate omissions:
 *
 * - No `aggregateRating`. Self-declared ratings without a review source are a
 *   structured-data guideline violation and can draw a manual action. Add it
 *   only once real reviews exist on a platform Google can see.
 * - No `sameAs` on the founder. The LinkedIn URL has not been verified, and an
 *   unverified identifier is worse than none. Add it when confirmed.
 *
 * The Organization is typed as both `Organization` and `ProfessionalService`
 * now that Hyderabad is the confirmed base: the LocalBusiness family needs a
 * real locality to be eligible for anything, and it has one.
 */
type Json = Record<string, unknown>

export const ORG_ID = `${site.url}/#organization`
export const SITE_ID = `${site.url}/#website`
export const LOGO_ID = `${site.url}/#logo`
export const FOUNDER_ID = `${site.url}/#founder`

const ORG_DESCRIPTION =
  'Hyderabad growth marketing and software engineering team — SEO, Google Ads, Meta Ads and social alongside websites, mobile apps and custom systems, shipped by the same people.'

/** Schema.org `areaServed` array, from the one list in lib/site.ts. */
export const areaServed = SERVICE_AREA.map((area) => ({
  '@type': area.type,
  name: area.name,
}))

const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: LOCALITY,
  addressRegion: REGION,
  addressCountry: COUNTRY,
}

export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: site.name,
    legalName: LEGAL_NAME,
    description: ORG_DESCRIPTION,
    url: `${site.url}/`,
    email: site.email,
    telephone: PHONE,
    sameAs: SAME_AS,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: `${site.url}/full-logo.svg`,
      caption: site.name,
    },
    image: { '@id': LOGO_ID },
    address: postalAddress,
    areaServed,
    founder: {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Kalyan Kumar Bedugam',
      jobTitle: 'Founder',
      worksFor: { '@id': ORG_ID },
    },
    knowsAbout: [
      'Search engine optimisation',
      'Answer engine optimisation',
      'Generative engine optimisation',
      'Google Ads management',
      'Meta Ads management',
      'Social media management',
      'Brand identity',
      'Flutter application development',
      'Next.js web development',
      'Astro web development',
      'E-commerce development',
      'Cloud infrastructure and DevOps',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      telephone: PHONE,
      areaServed: ['IN', 'US'],
      availableLanguage: ['en', 'te', 'hi'],
    },
  }
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: ORG_DESCRIPTION,
    publisher: { '@id': ORG_ID },
    inLanguage: LOCALE,
  }
}

/**
 * One `Service` node. Used by the ItemList on /services and by the location
 * page, which lists the same services scoped to Hyderabad.
 */
export function serviceNode(service: Service, trackLabel: string): Json {
  return {
    '@type': 'Service',
    name: service.name,
    description: service.blurb,
    url: `${site.url}/services#${service.slug}`,
    serviceType: trackLabel,
    provider: { '@id': ORG_ID },
    areaServed,
  }
}

/**
 * One `Service` per entry in lib/services.ts, wrapped in the ItemList the
 * /services page actually renders. No rich result exists for Service — this is
 * for entity understanding and for the AI crawlers that read JSON-LD in
 * preference to parsing layout.
 */
export function servicesSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Services offered by ${site.name}`,
    numberOfItems: allServices.length,
    itemListElement: tracks.flatMap((track) =>
      track.services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1 + (track.id === 'build' ? tracks[0].services.length : 0),
        item: serviceNode(service, track.label),
      })),
    ),
  }
}

/**
 * FAQPage for any page that renders a question list. The visible answers and
 * this markup must be the same strings — pass the list the page renders.
 * Defaults to the homepage FAQ from lib/services.ts.
 */
export function faqSchema(items: readonly { q: string; a: string }[] = faqs): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/**
 * The location page's own node. It is a `WebPage` *about* the organization
 * rather than a second LocalBusiness — one business, one entity; a duplicate
 * LocalBusiness with the same NAP would split the signal it is meant to
 * concentrate.
 */
export function locationPageSchema(input: { path: string; name: string; description: string }): Json {
  const url = `${site.url}${input.path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: LOCALE,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: { '@id': ORG_ID },
  }
}
