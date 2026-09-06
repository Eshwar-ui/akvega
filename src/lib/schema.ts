import { allServices, tracks } from '@/lib/services'
import { site } from '@/lib/site'

/**
 * JSON-LD builders. The site shipped no structured data at all, so search
 * engines and AI crawlers had to infer what Akvega is from prose alone.
 *
 * Two deliberate omissions, both because the honest answer is "we don't know
 * yet" and wrong structured data is worse than none:
 *
 * - `sameAs` is derived, not hand-maintained. It takes verified profile URLs,
 *   and every href in `site.social` is still '#', so today it resolves to
 *   nothing and is omitted. Fill those hrefs in and the property appears on its
 *   own — it is one of the strongest entity-resolution signals there is, and
 *   the derivation means nobody has to remember to come back here.
 * - The type is `Organization`, not `ProfessionalService`. The LocalBusiness
 *   family requires a real postal address to be eligible for anything, and
 *   Akvega is remote-first with no confirmed base. Switch it if that changes.
 */
type Json = Record<string, unknown>

const ORG_ID = `${site.url}/#organization`
const SITE_ID = `${site.url}/#website`

/** Absolute, on this origin. Relative paths are invalid in JSON-LD. */
const abs = (path: string) => new URL(path, site.url).href

/**
 * Placeholder hrefs are '#' and a couple are likely to stay that way for a
 * while. A `sameAs` containing '#' is worse than no `sameAs`: it asks a search
 * engine to resolve the entity against a URL that is not one.
 */
const verifiedProfiles = site.social
  .map((profile) => profile.href)
  .filter((href) => href.startsWith('https://') || href.startsWith('http://'))

export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/full-logo.svg`,
    image: `${site.url}/og.png`,
    email: site.email,
    telephone: site.phone,
    description: site.subhead,
    // Named rather than left implicit: it is the one concrete operating fact
    // the site states about where the work happens.
    areaServed: 'Worldwide',
    knowsAbout: allServices.map((service) => service.name),
    // The contact route stated as data rather than left for a crawler to infer
    // from the contact page's layout.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      telephone: site.phone,
      url: abs('/contact'),
      availableLanguage: 'English',
    },
    ...(verifiedProfiles.length > 0 ? { sameAs: verifiedProfiles } : {}),
  }
}

/**
 * The page-level node, one per route, tying that URL to the site and the
 * organisation. Without it every page carried the same two site-wide nodes and
 * nothing that said what *this* URL is — so the graph described the company
 * five times and the pages zero times.
 *
 * `@type` is narrowed per route (AboutPage, ContactPage, CollectionPage) because
 * those types are what let a crawler tell a contact route from an index of work
 * without reading the copy.
 */
export function webPageSchema(input: {
  type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
  title: string
  description: string
  url: string
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    primaryImageOfPage: abs('/og.png'),
    inLanguage: 'en',
  }
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: site.subhead,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }
}

/**
 * The single-service node for a /services/<slug> page.
 *
 * The ItemList below still describes the whole catalogue on the hub page; this
 * is the same service stated as the subject of its own URL, which is what lets
 * a page rank for its own term rather than borrowing the hub's. `hasOfferCatalog`
 * carries the deliverables — the concrete substance of the offering, and the
 * part an answer engine can actually quote.
 */
export function serviceDetailSchema(input: {
  name: string
  description: string
  url: string
  serviceType: string
  deliverables: readonly string[]
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${input.name} — what's included`,
      itemListElement: input.deliverables.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
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
        item: {
          '@type': 'Service',
          name: service.name,
          description: service.blurb,
          url: abs(`/services/${service.slug}`),
          serviceType: track.label,
          provider: { '@id': ORG_ID },
        },
      })),
    ),
  }
}
