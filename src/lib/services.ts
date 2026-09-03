/**
 * Service architecture. Two tracks, because that is the actual pitch: most
 * companies buy growth and engineering from two different suppliers.
 *
 * Blurbs are written, not final — review with the client before launch.
 */
export type Service = {
  slug: string
  name: string
  /** Compact label for the hero tiles. */
  short: string
  blurb: string
  deliverables: string[]
}

export type Track = {
  id: string
  label: string
  statement: string
  accent: 'signal' | 'vega'
  services: Service[]
}

export const tracks: Track[] = [
  {
    id: 'growth',
    label: 'Growth',
    statement:
      'Demand you can measure. We get you found, get you chosen, and keep the pipeline moving after the launch buzz dies down.',
    accent: 'signal',
    services: [
      {
        slug: 'search',
        short: 'SEO, AEO & GEO',
        name: 'SEO, AEO & GEO',
        blurb:
          'Rank on Google, get quoted by AI answers, and show up in the generative engines now sitting between the two. Technical SEO, answer-engine and generative-engine optimisation run as one programme rather than three disconnected retainers.',
        deliverables: [
          'Technical audits',
          'Content architecture',
          'Schema and entities',
          'AI answer coverage',
        ],
      },
      {
        slug: 'paid-search',
        short: 'Google Ads',
        name: 'Google Ads',
        blurb:
          'Google campaigns built around profit per click, not impressions. We buy intent that is already looking for you, and cut the spend that only looks busy in a dashboard.',
        deliverables: [
          'Account restructure',
          'Keyword and intent mapping',
          'Landing pages',
          'Conversion tracking',
        ],
      },
      {
        slug: 'paid-social',
        short: 'Meta Ads',
        name: 'Meta Ads',
        blurb:
          'Meta creative and media that earns the scroll and converts past it. Creative testing and media buying sit together, so the thing that works gets more budget the same week it proves itself.',
        deliverables: [
          'Creative testing',
          'Audience strategy',
          'Full-funnel campaigns',
          'Attribution',
        ],
      },
      {
        slug: 'social',
        short: 'Social media',
        name: 'Social Media Management',
        blurb:
          'Always-on content, calendar and community management that compounds instead of resetting every quarter. One voice across every channel, held to a standard.',
        deliverables: [
          'Content calendars',
          'Production',
          'Community management',
          'Reporting',
        ],
      },
      {
        slug: 'branding',
        short: 'Branding',
        name: 'Branding',
        blurb:
          'Identity systems — logo, voice and visual language — built to stay coherent across every campaign and product surface, not redrawn for each new channel.',
        deliverables: [
          'Brand strategy',
          'Visual identity',
          'Brand guidelines',
          'Naming and voice',
        ],
      },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    statement:
      'The product behind the promise. Interfaces, storefronts and systems engineered to hold up once real traffic and real people arrive.',
    accent: 'vega',
    services: [
      {
        slug: 'websites',
        short: 'Websites',
        name: 'Websites',
        blurb:
          'Fast, considered marketing sites built to your identity rather than bent out of a template. Designed to load quickly, rank well and still look like you in two years.',
        deliverables: [
          'Design systems',
          'Headless CMS',
          'Core Web Vitals',
          'Analytics',
        ],
      },
      {
        slug: 'commerce',
        short: 'Commerce',
        name: 'Online stores',
        blurb:
          'Storefronts on web and mobile, wired properly into catalogue, payments and fulfilment. Built so the checkout survives your biggest day of the year.',
        deliverables: [
          'Storefront builds',
          'Payments and checkout',
          'Inventory sync',
          'Subscriptions',
        ],
      },
      {
        slug: 'mobile',
        short: 'Mobile apps',
        name: 'Mobile apps',
        blurb:
          'iOS and Android products that feel native, from first build through store release and the releases after it. Cross-platform where it saves you money, native where it does not.',
        deliverables: [
          'iOS and Android',
          'Offline and sync',
          'Push and lifecycle',
          'Store release',
        ],
      },
      {
        slug: 'design',
        short: 'Product design',
        name: 'Product design',
        blurb:
          'Research, flows, interface systems and prototypes that survive contact with engineering. Design handed over as components and tokens, not a folder of screenshots.',
        deliverables: [
          'User research',
          'Wireframes and flows',
          'Interface systems',
          'Prototypes',
        ],
      },
      {
        slug: 'custom',
        short: 'Bespoke systems',
        name: 'Custom tools',
        blurb:
          'Internal tools, integrations and automation for the problems off-the-shelf software refuses to solve. The unglamorous work that quietly removes a department of manual effort.',
        deliverables: [
          'Internal tools',
          'API integrations',
          'Automation',
          'Data pipelines',
        ],
      },
    ],
  },
]

export const process = [
  {
    title: 'Diagnose',
    body: 'Audit, analytics and an honest read on where growth is actually leaking. No proposal until we know the answer.',
  },
  {
    title: 'Plan',
    body: 'Scope, priorities and a roadmap you can hold us to, with the trade-offs written down rather than discovered later.',
  },
  {
    title: 'Build',
    body: 'Design and engineering in short cycles, shipped somewhere you can see it. Progress you can check on a Tuesday.',
  },
  {
    title: 'Compound',
    body: 'Measure, iterate, and put the budget behind whatever is working. The month-twelve result is the point.',
  },
]

/** Placeholder answers — confirm commercial specifics before launch. */
export const faqs = [
  {
    q: 'Can we hire you for growth without the build?',
    a: 'Yes. Most engagements start on one track. The advantage of both under one roof is that when a campaign needs a landing page or a checkout fix, it does not become a two-week negotiation between vendors.',
  },
  {
    q: 'How does an engagement usually start?',
    a: 'With a paid diagnostic. We audit what exists, agree the scope, and you leave with the findings whether or not you continue with us.',
  },
  {
    q: 'How quickly do search and ads show results?',
    a: 'Paid channels give a readable signal within weeks. Search and answer visibility compound over months. Anyone promising otherwise is selling you the first month, not the twelfth.',
  },
  {
    q: 'Do you work alongside our in-house team?',
    a: 'Often. We can lead, embed, or sit behind your team as the engineering and media bench, whichever leaves you least dependent on us.',
  },
  {
    q: 'Who owns the code and the ad accounts?',
    a: 'You do, from day one. Repositories, ad accounts and analytics are set up in your name. Leaving should be a decision, not an extraction.',
  },
]

/** Every service in page order, with the accent of the track it belongs to. */
export const allServices = tracks.flatMap((track) =>
  track.services.map((service) => ({ ...service, accent: track.accent })),
)
