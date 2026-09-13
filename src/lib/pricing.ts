/**
 * Pricing. The one file the /pricing page reads.
 *
 * Nobody else in the Hyderabad agency market publishes prices, which is why
 * this page exists — but a published price is a promise, so every number here
 * must be real. Growth marketing is sold as three monthly packages with
 * confirmed prices (September 2026). Build work is priced per project from
 * the diagnostic; a `from` of `null` means "not yet confirmed" and the page
 * renders "Quoted from the diagnostic" in its place rather than a guess.
 *
 * All amounts are INR and exclude GST at 18%, which the page shows alongside
 * each package so the number a client actually pays is on the page too. Ad
 * spend is paid by the client directly to Google, Meta and the other
 * platforms from accounts in the client's name; it is never inside a fee.
 */
import type { FaqItem } from '@/lib/services'

export const PRICING_PUBLISHED = true

export const GST_RATE = 0.18

/** Custom scopes run above the largest package, up to this monthly fee. */
export const GROWTH_CEILING = 100_000

export type Cadence = 'once' | 'month' | 'project'

/**
 * A growth marketing package: one monthly fee, a defined scope, and the
 * client's own ad budget stated separately.
 */
export type Package = {
  slug: string
  /** Named for what the buyer is searching for, not for a tier ladder. */
  name: string
  /** Who it is for, one line. */
  audience: string
  /** Monthly fee in INR, excluding GST. */
  monthly: number
  /** Ad budget the client pays the platforms directly, INR per month. */
  adBudget: { min: number; max: number }
  includes: string[]
  featured?: boolean
}

export const packages: Package[] = [
  {
    slug: 'local-visibility',
    name: 'Local Visibility',
    audience: 'New businesses, local shops and early-stage startups that need to be found in Hyderabad.',
    monthly: 20_000,
    adBudget: { min: 5_000, max: 15_000 },
    includes: [
      'Google Business Profile set-up and optimisation',
      'Local SEO for 5 to 10 keywords',
      'Social media on 2 platforms',
      '8 to 12 posts a month, static and Reels',
      'One paid ad campaign, managed',
      'Monthly performance report',
    ],
  },
  {
    slug: 'search-and-social-growth',
    name: 'Search & Social Growth',
    audience: 'Scaling brands, D2C businesses and growing SMEs buying search and social together.',
    monthly: 40_000,
    adBudget: { min: 20_000, max: 50_000 },
    featured: true,
    includes: [
      'Full SEO, on-page and off-page, for 50 keywords',
      'Google Ads and Meta Ads, fully managed',
      'Social media on 3 to 4 platforms, full suite',
      '20 to 25 posts a month, all formats',
      '2 to 3 influencer collaborations a month',
      'AI chatbot for website lead capture',
      'Fortnightly strategy calls and a live dashboard',
    ],
  },
  {
    slug: 'market-leader',
    name: 'Market Leader',
    audience: 'Market leaders, enterprises and brands that want to own their category in search and AI answers.',
    monthly: 60_000,
    adBudget: { min: 50_000, max: 100_000 },
    includes: [
      'Advanced SEO for 50+ keywords with answer-engine (AEO) and AI-search (GEO) coverage',
      'Google, Meta, LinkedIn and YouTube Ads',
      'All platforms, complete social suite',
      '30 to 40 posts a month plus 1 to 2 brand videos',
      '5 to 10 influencer campaigns a month',
      'Dedicated account manager and weekly calls',
    ],
  },
]

export type PriceTier = {
  /** Matches a `slug` in lib/services.ts so the tier links to its service. */
  slug: string
  name: string
  /** One line on what the money buys, in the site's voice. */
  summary: string
  /** Starting price in INR, or null until confirmed. */
  from: number | null
  cadence: Cadence
  /** What is inside the starting price. */
  includes: string[]
  /** What moves the number up from `from`. */
  scales: string[]
}

/**
 * The diagnostic is the door every engagement walks through, so it has its
 * own shape: one fee, one deliverable, no scaling. The fee is agreed before
 * the audit starts; it is not yet a published number.
 */
export const diagnostic = {
  name: 'The diagnostic',
  from: null as number | null,
  cadence: 'once' as const,
  /** Turnaround from kickoff to handover. */
  duration: '1 to 2 working days',
  summary:
    'A full audit of everything a customer can find about you, handed over with the cost to fix each item. Yours to keep whether or not you continue with us.',
  /** What is audited. */
  audits: [
    'Google Business Profile',
    'Website — speed, search, content and tracking',
    'Design and brand consistency',
    'Instagram and every other social account',
    'Existing ad accounts',
  ],
  includes: [
    'A written audit of your profile, Google Business Profile, website, design and social accounts',
    'Every finding with a plain-language explanation of why it costs you customers',
    'The Akvega cost to fix each item, so the audit doubles as a quote',
    'Handover within 1 to 2 working days of kickoff',
  ],
}

export const buildTiers: PriceTier[] = [
  {
    slug: 'websites',
    name: 'Websites',
    summary:
      'Fast, considered marketing sites built to your identity rather than bent out of a template. Built to rank and to still look like you in two years.',
    from: null,
    cadence: 'project',
    includes: [
      'Design system and every page in scope',
      'Static-first build with Core Web Vitals in the green',
      'Headless CMS where you need to edit',
      'Analytics, schema and search setup on day one',
    ],
    scales: ['Page count and templates', 'CMS and integrations', 'Content and photography needs'],
  },
  {
    slug: 'commerce',
    name: 'Online stores',
    summary:
      'Storefronts built for the way people here actually pay: UPI first, cash-on-delivery as an option, and a checkout that survives a dropped connection.',
    from: null,
    cadence: 'project',
    includes: [
      'Store design and catalogue structure',
      'Payments, shipping and GST-ready invoicing',
      'Conversion tracking through to the order',
      'Launch checklist and handover',
    ],
    scales: ['Catalogue size', 'Marketplace, ERP or logistics integrations', 'Custom checkout logic'],
  },
  {
    slug: 'mobile',
    name: 'Mobile apps',
    summary:
      'iOS and Android from one codebase, with the backend, store listings and analytics that ship alongside the app rather than after it.',
    from: null,
    cadence: 'project',
    includes: [
      'Product design and prototype',
      'Cross-platform build for iOS and Android',
      'Backend, auth and notifications',
      'App Store and Play Store submission',
    ],
    scales: ['Number of screens and user roles', 'Offline, payments and third-party integrations', 'Ongoing releases'],
  },
  {
    slug: 'design',
    name: 'Product design',
    summary:
      'Interfaces designed against real constraints — the data, the devices and the people who will use it every day.',
    from: null,
    cadence: 'project',
    includes: ['Research and flows', 'UI system and components', 'Clickable prototype', 'Handover engineers can build from'],
    scales: ['Number of flows and screens', 'Research depth', 'Design-system scope'],
  },
  {
    slug: 'custom',
    name: 'Custom tools',
    summary:
      'Internal tools, dashboards and integrations built for the process you actually run, not the one the off-the-shelf software assumes.',
    from: null,
    cadence: 'project',
    includes: ['Discovery and data model', 'Build in short, visible cycles', 'Integrations with what you already use', 'Documentation and handover'],
    scales: ['Number of integrations', 'User roles and permissions', 'Data volume and reporting'],
  },
]

/**
 * Facts about the engagement model that hold for every package and tier.
 * These come from the operating model the site already states, not from
 * pricing decisions.
 */
export const alwaysIncluded = [
  {
    title: 'Everything in your name',
    body: 'Repositories, ad accounts, analytics and hosting are set up as yours from day one. Leaving is a decision, not an extraction.',
  },
  {
    title: 'A fixed scope, quoted once',
    body: 'The quote comes out of the diagnostic. You are pricing a defined piece of work with a known end, not a retainer that renews by default.',
  },
  {
    title: 'The same team on both ends',
    body: 'When a campaign needs a landing page or a checkout fix, it ships the same week. No second vendor, no handover tax.',
  },
  {
    title: 'Reporting you can act on',
    body: 'One report a month, written to be read. Numbers tied to revenue, not to impressions.',
  },
]

/** What the fees do not cover, stated once. */
export const excluded = [
  'Ad spend — paid directly to Google, Meta, LinkedIn or YouTube from your own accounts',
  'Third-party subscriptions such as hosting, CMS, email or analytics tools',
  'GST at 18%, shown next to every package',
]

export const pricingFaqs: FaqItem[] = [
  {
    slug: 'why-publish-prices',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Why does Akvega publish its prices?',
    a: 'Because the alternative is a discovery call whose only purpose is to find out whether you can afford us. Published packages let you decide that in a minute, and let the first conversation be about your actual problem.',
  },
  {
    slug: 'what-packages-cost',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'How much does digital marketing cost at Akvega?',
    a: 'Growth marketing packages run from ₹20,000 to ₹60,000 a month plus 18% GST, with custom scopes up to ₹1,00,000 a month. Ad spend is separate and paid by you directly to the platforms.',
  },
  {
    slug: 'what-from-means',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'What does "quoted from the diagnostic" mean for build work?',
    a: 'Websites, stores, apps and tools vary too much for a list price to be honest. The diagnostic scopes your project and returns a fixed quote, so you are pricing a defined piece of work rather than a range.',
  },
  {
    slug: 'is-diagnostic-separate',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Is the diagnostic really separate from the packages?',
    a: 'Yes. It is a paid audit of your Google Business Profile, website, design and social accounts, returned within 1 to 2 working days with the cost to fix each item. You keep it whether or not you continue.',
  },
  {
    slug: 'start-with-one-service',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Can we start with one service instead of a package?',
    a: 'Yes. Most clients start on one track. The reason both tracks sit under one roof is so that when the campaign needs a page or the product needs traffic, the other half is already in the room.',
  },
  {
    slug: 'prices-include-ad-spend',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Do the package prices include ad spend?',
    a: 'No. Each package states the ad budget it is designed for, from ₹5,000 to ₹1,00,000 a month, and you pay that directly to Google, Meta and the other platforms from accounts in your name. Our fee covers strategy, creative, management and reporting.',
  },
  {
    slug: 'gst',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Are the prices inclusive of GST?',
    a: 'No. Every package is listed excluding GST, with the 18% GST and the total you actually pay shown beside it. A ₹20,000 package is ₹23,600 a month all in.',
  },
  {
    slug: 'who-owns-what-we-pay-for',
    published: '2026-09-14',
    modified: '2026-09-14',
    q: 'Who owns what we pay for?',
    a: 'You do, from the first day. Code, designs, ad accounts, analytics and any content Akvega produces are yours, in accounts you control.',
  },
]

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** "₹45,000" — or null when the number is not yet confirmed. */
export function formatFrom(amount: number | null): string | null {
  return amount === null ? null : inr.format(amount)
}

export function formatInr(amount: number): string {
  return inr.format(amount)
}

/** Monthly fee including GST, rounded to the rupee. */
export function withGst(amount: number): number {
  return Math.round(amount * (1 + GST_RATE))
}

export function cadenceLabel(cadence: Cadence): string {
  switch (cadence) {
    case 'month':
      return '/ month'
    case 'project':
      return 'per project'
    case 'once':
      return 'one-off'
  }
}
