/**
 * Evidence panels, keyed by the page they belong on.
 *
 * Every entry is a measured fact with a method, a source a reader can open,
 * the date it was collected and what it does not prove. A panel is added
 * only when all of those exist — PRODUCT.md's rule against fabricated proof
 * is enforced by the component throwing on a missing field, and by the
 * simpler rule that this file starts empty and grows one real measurement
 * at a time.
 *
 * Refresh cadence: re-measure and re-date every six months at most. The
 * freshness guard warns on the page date, not the panel date, so check the
 * `date` fields here by hand when a page is refreshed.
 */
export type Evidence = {
  id: string
  title: string
  claim: string
  method: string
  source: { label: string; href: string }
  /** YYYY-MM-DD the data was collected. */
  date: string
  limitations: string
}

/** Evidence by page key: a service slug, or a top-level path such as '/'. */
export const evidence: Record<string, Evidence[]> = {
  websites: [
    {
      id: 'evidence-akvega-com-lighthouse-desktop',
      title: 'akvega.com homepage performance, desktop',
      claim:
        'The akvega.com homepage scores 98 out of 100 for performance in Lighthouse on desktop, with Largest Contentful Paint at 1.0 s, Cumulative Layout Shift at 0.004 and Total Blocking Time at 0 ms.',
      method:
        'Lighthouse 12.8.2 run from the command line in headless Chrome against the live https://akvega.com/ with the desktop preset and simulated throttling, single run, from Hyderabad on 14 September 2026.',
      source: {
        label: 'Full Lighthouse report (JSON)',
        href: '/evidence/lighthouse-2026-09-14-desktop.json',
      },
      date: '2026-09-14',
      limitations:
        'One run, one location, simulated throttling — not field data from real visitors. The same page on the mobile preset (simulated slow 4G, mid-range device) scored 68 with Largest Contentful Paint at 7.4 s; that report is published alongside this one and the mobile result is being worked on.',
    },
    {
      id: 'evidence-akvega-com-lighthouse-mobile',
      title: 'akvega.com homepage performance, mobile',
      claim:
        'The akvega.com homepage scores 68 out of 100 for performance in Lighthouse on the mobile preset, with Largest Contentful Paint at 7.4 s, Cumulative Layout Shift at 0 and Total Blocking Time at 10 ms.',
      method:
        'Lighthouse 12.8.2 run from the command line in headless Chrome against the live https://akvega.com/ with the default mobile preset (simulated slow 4G, mid-range device CPU throttling), single run, from Hyderabad on 14 September 2026.',
      source: {
        label: 'Full Lighthouse report (JSON)',
        href: '/evidence/lighthouse-2026-09-14-mobile.json',
      },
      date: '2026-09-14',
      limitations:
        'Published because a performance claim that hides its worst number is not evidence. One simulated run, not field data. The Largest Contentful Paint is the homepage hero; it is being reduced, and this panel will be re-measured and re-dated when it is.',
    },
  ],
}

export function evidenceFor(key: string): Evidence[] {
  return evidence[key] ?? []
}
