/**
 * Pricing. The one file the /pricing page reads.
 *
 * Nobody else in the Hyderabad agency market publishes prices, which is why
 * this page exists — but a published price is a promise, so every number here
 * must be real. Nothing in this file is a placeholder: a `from` of `null`
 * means "not yet confirmed", and the page renders "Quoted from the diagnostic"
 * in its place rather than a guessed figure.
 *
 * Flip `PRICING_PUBLISHED` to true only once every `from` you intend to show
 * holds a real value. Until then the page is `noindex`, stays out of the
 * sitemap (see astro.config.mjs) and is not linked from the footer.
 *
 * All amounts are INR, exclusive of GST, and exclude ad spend and third-party
 * costs — those are stated once on the page rather than repeated per tier.
 */
export const PRICING_PUBLISHED = false

export type Cadence = 'once' | 'month' | 'project'

export type PriceTier = {
  /** Matches a `slug` in lib/services.ts so the tier links to its service. */
  slug: string
  name: string
  /** One line on what the money buys, in the site's voice. */
  summary: string
  /** Starting price in INR, or null until confirmed. */
  from: number | null
  cadence: Cadence
  /** Shortest commitment, in months. Null for one-off work. */
  minimumTermMonths: number | null
  /** What is inside the starting price. */
  includes: string[]
  /** What moves the number up from `from`. */
  scales: string[]
}

/**
 * The diagnostic is the door every engagement walks through, so it has its
 * own shape: one price, one deliverable, no scaling.
 */
export const diagnostic = {
  name: 'The diagnostic',
  from: null as number | null,
  cadence: 'once' as const,
  /** Working days from kickoff to handover. Null until confirmed. */
  durationDays: null as number | null,
  summary:
    'An audit of what exists and a scoped plan for what should. Yours to keep whether or not you continue with us.',
  includes: [
    'Site, search, analytics and ad-account audit',
    'Where growth is actually leaking, in plain language',
    'A scoped roadmap with the trade-offs written down',
    'A fixed quote for the work, if you want one',
  ],
}

export const growthTiers: PriceTier[] = [
  {
    slug: 'search',
    name: 'SEO, AEO & GEO',
    summary:
      'One programme across Google, AI answers and the generative engines in between — technical, content and entity work run together.',
    from: null,
    cadence: 'month',
    minimumTermMonths: null,
    includes: [
      'Technical audit and fixes shipped, not just listed',
      'Content architecture and a monthly publishing plan',
      'Schema and entity work across the site',
      'Answer-engine and generative-engine coverage tracking',
      'Monthly report you can read in five minutes',
    ],
    scales: [
      'Number of pages and languages in scope',
      'Content produced by us versus by you',
      'Competitiveness of the categories you sell in',
    ],
  },
  {
    slug: 'paid-search',
    name: 'Google Ads',
    summary:
      'Campaigns built around profit per click. We buy intent that is already looking for you and cut the spend that only looks busy.',
    from: null,
    cadence: 'month',
    minimumTermMonths: null,
    includes: [
      'Account restructure and keyword-to-intent mapping',
      'Landing pages built by the same team',
      'Conversion tracking that matches your books',
      'Weekly optimisation, monthly review',
    ],
    scales: [
      'Monthly ad spend under management',
      'Number of campaigns, markets and languages',
      'Landing-page volume',
    ],
  },
  {
    slug: 'paid-social',
    name: 'Meta Ads',
    summary:
      'Creative and media that earn the scroll and convert past it. Testing and buying sit together, so what works gets budget the same week.',
    from: null,
    cadence: 'month',
    minimumTermMonths: null,
    includes: [
      'Audience strategy and full-funnel structure',
      'Creative testing programme',
      'Attribution set up against real revenue',
      'Weekly optimisation, monthly review',
    ],
    scales: ['Monthly ad spend under management', 'Creative volume and formats', 'Number of markets'],
  },
  {
    slug: 'social',
    name: 'Social Media Management',
    summary:
      'Always-on content, calendar and community that compounds instead of resetting every quarter.',
    from: null,
    cadence: 'month',
    minimumTermMonths: null,
    includes: [
      'Monthly content calendar',
      'Production for the channels in scope',
      'Community management within business hours',
      'Monthly reporting',
    ],
    scales: ['Number of channels', 'Posting frequency', 'Video and shoot requirements'],
  },
]

export const buildTiers: PriceTier[] = [
  {
    slug: 'websites',
    name: 'Websites',
    summary:
      'Fast, considered marketing sites built to your identity rather than bent out of a template. Built to rank and to still look like you in two years.',
    from: null,
    cadence: 'project',
    minimumTermMonths: null,
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
    minimumTermMonths: null,
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
    minimumTermMonths: null,
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
    minimumTermMonths: null,
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
    minimumTermMonths: null,
    includes: ['Discovery and data model', 'Build in short, visible cycles', 'Integrations with what you already use', 'Documentation and handover'],
    scales: ['Number of integrations', 'User roles and permissions', 'Data volume and reporting'],
  },
]

/**
 * Facts about the engagement model that hold for every tier. These come from
 * the operating model the site already states, not from pricing decisions.
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

/** What the starting prices do not cover, stated once. */
export const excluded = [
  'Ad spend — paid directly to Google and Meta from your own accounts',
  'Third-party subscriptions such as hosting, CMS, email or analytics tools',
  'GST, added at the prevailing rate',
]

export const pricingFaqs = [
  {
    q: 'Why publish prices at all?',
    a: 'Because the alternative is a discovery call whose only purpose is to find out whether you can afford us. Starting prices let you decide that in a minute, and let us spend the first conversation on your actual problem.',
  },
  {
    q: 'What does "from" mean?',
    a: 'The price of the smallest sensible version of that service. Every tier lists what moves the number up. The diagnostic turns the range into a fixed quote for your scope.',
  },
  {
    q: 'Is the diagnostic really separate?',
    a: 'Yes. It is paid, it is scoped, and you keep the findings whether or not you continue with us. It exists so that the quote is built on what we found, not on what we guessed.',
  },
  {
    q: 'Can we start with one service?',
    a: 'Most clients do. The reason both tracks sit under one roof is so that when the campaign needs a page or the product needs traffic, the other half is already in the room.',
  },
  {
    q: 'Do the prices include ad spend?',
    a: 'No. Media budgets are paid to Google and Meta directly from accounts in your name. Our fee covers the strategy, creative, management and reporting around that spend.',
  },
  {
    q: 'Who owns what we pay for?',
    a: 'You do, from the first day. Code, designs, ad accounts, analytics and any content we produce are yours, in accounts you control.',
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
