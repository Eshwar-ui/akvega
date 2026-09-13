import type { APIRoute } from 'astro'
import { allPageDates } from '@/lib/dates'
import {
  GROWTH_CEILING,
  GST_RATE,
  PRICING_PUBLISHED,
  buildTiers,
  cadenceLabel,
  diagnostic,
  packages,
  withGst,
} from '@/lib/pricing'
import { allServices, serviceHref, tracks } from '@/lib/services'
import {
  COUNTRY_NAME,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  LEGAL_NAME,
  LOCALITY,
  PHONE_DISPLAY,
  REGION,
  SAME_AS,
  SERVICE_AREA,
  SITE_URL,
  site,
} from '@/lib/site'

/**
 * Machine-readable facts about Akvega, at /facts.json.
 *
 * An agent that wants to know what the business is, where it is, what it
 * sells and what it costs can fetch this instead of parsing prose. Every
 * value is built from the same files the pages render from — site.ts,
 * services.ts, pricing.ts, page-dates.json — so it cannot drift from the
 * site. Each fact carries `as_of`, the date the value was last confirmed.
 *
 * Prices appear only once PRICING_PUBLISHED is true. Unconfirmed values are
 * omitted rather than estimated.
 */
export const prerender = true

const AS_OF = '2026-09-14'

export const GET: APIRoute = () => {
  const facts = [
    {
      id: 'what',
      value: `${site.name} is a Hyderabad growth marketing and digital build team: SEO, Google Ads, Meta Ads and social alongside websites, online stores, mobile apps and custom tools, shipped by the same people.`,
      source: `${SITE_URL}/`,
      as_of: AS_OF,
    },
    { id: 'legal_name', value: LEGAL_NAME, source: `${SITE_URL}/`, as_of: AS_OF },
    { id: 'founder', value: `${FOUNDER_NAME}, ${FOUNDER_TITLE}`, source: `${SITE_URL}/about`, as_of: AS_OF },
    {
      id: 'location',
      value: `${LOCALITY}, ${REGION}, ${COUNTRY_NAME}`,
      source: `${SITE_URL}/contact`,
      as_of: AS_OF,
    },
    {
      id: 'service_area',
      value: SERVICE_AREA.map((area) => area.name).join(', '),
      source: `${SITE_URL}/digital-marketing-agency-hyderabad`,
      as_of: AS_OF,
    },
    { id: 'phone', value: PHONE_DISPLAY, source: `${SITE_URL}/contact`, as_of: AS_OF },
    { id: 'email', value: site.email, source: `${SITE_URL}/contact`, as_of: AS_OF },
    {
      id: 'engagement_model',
      value:
        'Every engagement starts with a paid diagnostic — an audit and a scoped plan the client keeps whether or not they continue. The quote for the work comes out of that scope.',
      source: `${SITE_URL}/paid-diagnostic`,
      as_of: AS_OF,
    },
    {
      id: 'ownership',
      value:
        'Repositories, ad accounts, analytics and hosting are set up in the client’s name from day one.',
      source: `${SITE_URL}/about`,
      as_of: AS_OF,
    },
    {
      id: 'languages',
      value: 'English, Telugu, Hindi',
      source: `${SITE_URL}/digital-marketing-agency-hyderabad`,
      as_of: AS_OF,
    },
  ]

  const services = tracks.flatMap((track) =>
    track.services.map((service) => ({
      id: service.slug,
      track: track.label,
      name: service.name,
      summary: service.blurb,
      deliverables: service.deliverables,
      url: `${SITE_URL}${serviceHref(service)}`,
    })),
  )

  const pricing = PRICING_PUBLISHED
    ? {
        currency: 'INR',
        gstRate: GST_RATE,
        excludes: ['ad spend', 'third-party subscriptions', 'GST'],
        diagnostic: {
          from: diagnostic.from,
          cadence: cadenceLabel(diagnostic.cadence),
          duration: diagnostic.duration,
          audits: diagnostic.audits,
        },
        growthPackages: packages.map((pkg) => ({
          id: pkg.slug,
          name: pkg.name,
          monthlyExGst: pkg.monthly,
          monthlyIncGst: withGst(pkg.monthly),
          clientAdBudgetPerMonth: pkg.adBudget,
          includes: pkg.includes,
          url: `${SITE_URL}/pricing#package-${pkg.slug}`,
        })),
        growthCustomScopeUpTo: GROWTH_CEILING,
        buildTiers: buildTiers
          .filter((tier) => tier.from !== null)
          .map((tier) => ({
            id: tier.slug,
            name: tier.name,
            from: tier.from,
            cadence: cadenceLabel(tier.cadence),
            url: `${SITE_URL}/pricing#pricing-${tier.slug}`,
          })),
        source: `${SITE_URL}/pricing`,
        as_of: AS_OF,
      }
    : null

  const pages = allPageDates()
    .filter(({ path }) => path !== '/404' && path !== '/work' && (PRICING_PUBLISHED || path !== '/pricing'))
    .map(({ path, dates }) => ({
      url: `${SITE_URL}${path === '/' ? '/' : path}`,
      published: dates.published,
      modified: dates.modified,
    }))

  const body = {
    page: `${SITE_URL}/facts.json`,
    version: AS_OF,
    lastUpdated: new Date().toISOString(),
    organization: {
      name: site.name,
      url: `${SITE_URL}/`,
      sameAs: SAME_AS,
    },
    facts,
    services: { count: allServices.length, items: services },
    pricing,
    pages,
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
