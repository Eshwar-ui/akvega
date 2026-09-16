import { allServices, faqs, serviceHref, tracks, type FaqItem, type Service } from '@/lib/services'
import type { PageDates } from '@/lib/dates'
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
 *
 * The Organization is typed as both `Organization` and `ProfessionalService`
 * now that Hyderabad is the confirmed base: the LocalBusiness family needs a
 * real locality to be eligible for anything, and it has one.
 */
type Json = Record<string, unknown>

export const ORG_ID = `${site.url}/#organization`
export const SITE_ID = `${site.url}/#website`
export const LOGO_ID = `${site.url}/#logo`

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


/**
 * The page itself. Emitted by the layout for every route, carrying the
 * dates from lib/dates.ts — the machine-readable half of the freshness
 * signal — and the founder as author and reviewer.
 */
export function webPageSchema(input: {
  url: string
  name: string
  description: string
  dates: PageDates
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: LOCALE,
    datePublished: input.dates.published,
    dateModified: input.dates.modified,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
  }
}

export const BLOG_ID = `${site.url}/insights#blog`

/**
 * The insights index as a `Blog`, and each post as a `BlogPosting` that is
 * `isPartOf` it. Two reasons this is not just another `WebPage`:
 *
 * - `BlogPosting` carries `headline`, `datePublished` and `dateModified` in
 *   the shape Google's article handling and most AI crawlers already parse,
 *   so a post's freshness is legible without inference.
 * - It draws the line between the evergreen service pages and the dated
 *   commentary. A model deciding what Akvega *is* should reach for the
 *   service pages; one answering a question a post covers should reach for
 *   the post.
 *
 * `author` is the Organization. No `Person` node and no named byline appears
 * anywhere on this site, by decision — see the note in AEO.md §3. Named
 * authorship is the usual way an agency site carries expertise, so if that
 * decision is ever revisited, this and the `reviewedBy` beside it are where
 * it changes.
 */
export function blogSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': BLOG_ID,
    url: `${site.url}/insights`,
    name: `${site.name} insights`,
    description:
      'What things cost, how to buy an agency, how answer engines pick what to cite, and what building for an Indian buyer actually requires.',
    inLanguage: LOCALE,
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
  }
}

export function blogPostingSchema(input: {
  url: string
  headline: string
  description: string
  dates: PageDates
  /** The key-facts block, so the quotable sentences are in the markup too. */
  keyFacts?: readonly string[]
  /** The cluster label, which is what this post is about. */
  section?: string
  /** Absolute URL of the post's own social card. */
  image?: string
  /** Body length. A cheap, checkable signal of depth. */
  wordCount?: number
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.url}#blogposting`,
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${input.url}#webpage` },
    headline: input.headline,
    description: input.description,
    inLanguage: LOCALE,
    datePublished: input.dates.published,
    dateModified: input.dates.modified,
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keyFacts?.length ? { abstract: input.keyFacts.join(' ') } : {}),
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    isPartOf: { '@id': BLOG_ID },
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
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
    url: `${site.url}${serviceHref(service)}`,
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
 * Each question carries its own dates and an `@id` matching the visible
 * anchor (`#faq-<slug>`), so a citation can point at one answer.
 * Defaults to the homepage FAQ from lib/services.ts.
 */
export function faqSchema(items: readonly FaqItem[] = faqs, pageUrl?: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      ...(pageUrl ? { '@id': `${pageUrl}#faq-${item.slug}` } : {}),
      name: item.q,
      datePublished: item.published,
      dateModified: item.modified,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

