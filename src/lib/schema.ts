import { allServices, tracks } from '@/lib/services'
import { site } from '@/lib/site'

/**
 * JSON-LD builders. The site shipped no structured data at all, so search
 * engines and AI crawlers had to infer what Akvega is from prose alone.
 *
 * Two deliberate omissions, both because the honest answer is "we don't know
 * yet" and wrong structured data is worse than none:
 *
 * - `sameAs` is absent. It takes verified profile URLs, and every href in
 *   `site.social` is still '#'. Add it the moment the real profiles exist —
 *   it is one of the strongest entity-resolution signals there is.
 * - The type is `Organization`, not `ProfessionalService`. The LocalBusiness
 *   family requires a real postal address to be eligible for anything, and
 *   Akvega is remote-first with no confirmed base. Switch it if that changes.
 */
type Json = Record<string, unknown>

const ORG_ID = `${site.url}/#organization`
const SITE_ID = `${site.url}/#website`

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
          url: `${site.url}/services#${service.slug}`,
          serviceType: track.label,
          provider: { '@id': ORG_ID },
        },
      })),
    ),
  }
}
