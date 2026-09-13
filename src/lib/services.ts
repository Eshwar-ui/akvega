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
/**
 * A question with its answer and its own dates. `slug` is the visible anchor
 * (`#faq-<slug>`) and the `@id` in the FAQPage JSON-LD, so a citation can
 * point at one answer. Answers are 30–50 words with the answer first: that is
 * the length answer engines extract whole rather than summarise.
 */
export type FaqItem = {
  slug: string
  q: string
  a: string
  /** YYYY-MM-DD */
  published: string
  /** YYYY-MM-DD — bump when the answer changes, not when the page does. */
  modified: string
}

export const faqs: FaqItem[] = [
  {
    slug: 'growth-without-build',
    q: 'Can we hire Akvega for growth marketing without the build work?',
    a: 'Yes. Most engagements start on one track. The advantage of both under one roof is that when a campaign needs a landing page or a checkout fix, it does not become a two-week negotiation between vendors.',
    published: '2026-09-05',
    modified: '2026-09-14',
  },
  {
    slug: 'how-engagements-start',
    q: 'How does an engagement with Akvega usually start?',
    a: 'With a paid diagnostic. Akvega audits your Google Business Profile, website, design and social accounts within 1 to 2 working days, and you leave with the full findings and the cost to fix each item, whether or not you continue.',
    published: '2026-09-05',
    modified: '2026-09-14',
  },
  {
    slug: 'how-fast-results',
    q: 'How quickly do search and ads show results?',
    a: 'Paid channels give a readable signal within weeks. Search and answer-engine visibility compound over months. Anyone promising otherwise is selling you the first month, not the twelfth.',
    published: '2026-09-05',
    modified: '2026-09-14',
  },
  {
    slug: 'work-with-in-house-team',
    q: 'Does Akvega work alongside an in-house marketing or engineering team?',
    a: 'Often. Akvega can lead the engagement, embed inside your team on your tools and cadence, or sit behind it as the engineering and media bench — whichever leaves you least dependent on us.',
    published: '2026-09-05',
    modified: '2026-09-14',
  },
  {
    slug: 'who-owns-code-and-accounts',
    q: 'Who owns the code, ad accounts and analytics?',
    a: 'The client does, from day one. Repositories, ad accounts and analytics are created in the client’s name, not Akvega’s. Leaving should be a decision, not an extraction.',
    published: '2026-09-05',
    modified: '2026-09-14',
  },
  {
    slug: 'what-is-akvega',
    q: 'What is Akvega?',
    a: 'Akvega is a Hyderabad-based team that runs growth marketing and digital build together: SEO, Google Ads, Meta Ads and social alongside websites, online stores, mobile apps and custom tools, shipped by the same people.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'who-akvega-works-with',
    q: 'Who does Akvega work with?',
    a: 'Founders and marketing leads at Indian SMBs and funded startups, mostly in Hyderabad and wider India, with some clients in the US. Typically businesses that currently buy marketing and development from two separate vendors.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'why-one-team',
    q: 'Why does Akvega run marketing and development as one team?',
    a: 'Because the handover between an agency and a development shop is where work breaks: landing pages land late, tracking never matches, and the real fix sits in someone else’s backlog. One team owns the whole path from click to conversion.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'where-is-akvega-based',
    q: 'Where is Akvega based, and do you work remotely?',
    a: 'Akvega is based in Hyderabad, Telangana, India. Delivery runs remote-first, with in-person meetings across Hyderabad and clients across wider India and the US.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'what-does-the-diagnostic-include',
    q: 'What does the paid diagnostic include?',
    a: 'A full audit of your Google Business Profile, website, design, Instagram and other social accounts, returned within 1 to 2 working days with the cost to fix each item. The findings are yours whether or not you continue with Akvega.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'which-technologies',
    q: 'Which technologies does Akvega build with?',
    a: 'The smallest proven combination for the product. Typically React, Next.js or Astro and TypeScript for the web, Flutter for mobile, Supabase, PostgreSQL or Firebase for data, and Shopify for stores — chosen per project, not by default.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
  {
    slug: 'what-is-aeo-geo',
    q: 'What are AEO and GEO, and does Akvega offer them?',
    a: 'Answer-engine optimisation (AEO) and generative-engine optimisation (GEO) make content citable by AI assistants such as ChatGPT, Gemini and Google AI Overviews. Akvega runs them as one programme with technical SEO rather than as separate retainers.',
    published: '2026-09-14',
    modified: '2026-09-14',
  },
]

/**
 * The canonical link for a service. The Services page anchors every entry by
 * its slug, so the route is derived here rather than hand-written at each call
 * site — which is how the homepage ended up referencing a `to` field that
 * never existed on `Service`.
 */
/**
 * Each service has its own page. The /services hub keeps `id={slug}` anchors
 * for in-page navigation, but every link to a service points at the page:
 * one concept, one URL, which is what search and answer engines cite.
 */
export const serviceHref = (service: Pick<Service, 'slug'>) =>
  `/services/${service.slug}`

/** Every service in page order, with the accent of the track it belongs to. */
export const allServices = tracks.flatMap((track) =>
  track.services.map((service) => ({ ...service, accent: track.accent })),
)

/** Total across both tracks. Never restate this as a literal in page copy. */
export const serviceCount = allServices.length
