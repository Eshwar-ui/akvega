import type { APIRoute } from 'astro'
import { datesFor } from '@/lib/dates'
import { clusters } from '@/lib/insight-clusters'
import { allInsights, hrefOf } from '@/lib/insights'
import { PRICING_PUBLISHED } from '@/lib/pricing'
import { serviceHref, tracks } from '@/lib/services'
import { LOCATION_LINE, PHONE_DISPLAY, SITE_URL, site } from '@/lib/site'

/**
 * /llms.txt — a plain-text index of the site for language models.
 *
 * The convention (llmstxt.org): an H1 with the name, a one-paragraph
 * summary, then sections of links with one-line descriptions. Generated at
 * build time from the same data the pages use, so it never lists a page
 * that does not exist or describes one that changed.
 */
export const prerender = true

export const GET: APIRoute = async () => {
  const line = (label: string, path: string, note: string) => {
    const dates = datesFor(path)
    const stamp = dates ? ` (updated ${dates.modified})` : ''
    return `- [${label}](${SITE_URL}${path}): ${note}${stamp}`
  }

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a Hyderabad, India growth marketing and digital build team. SEO, Google Ads, Meta Ads and social media run alongside websites, online stores, mobile apps and custom tools, shipped by the same people.`,
    '',
    LOCATION_LINE,
    `Phone ${PHONE_DISPLAY}. Email ${site.email}.`,
    '',
    'Every engagement starts with a paid diagnostic — an audit and a scoped plan the client keeps whether or not they continue. Repositories, ad accounts and analytics are set up in the client’s name from day one.',
    '',
    '## Company',
    '',
    line('Home', '/', 'What Akvega does and why growth and build run as one team.'),
    line('Studio', '/about', 'How Akvega works: two tracks, a paid diagnostic first, and three ways to engage.'),
    line('The paid diagnostic', '/paid-diagnostic', 'What the diagnostic audits, what the client receives, and why every engagement starts there.'),
    line('One team for growth and build', '/one-team-for-growth-and-build', 'The handover tax between an agency and a development shop, and why one team removes it.'),
    line('Hyderabad', '/digital-marketing-agency-hyderabad', 'Digital marketing agency in Hyderabad with the build team attached; service area and local FAQ.'),
    ...(PRICING_PUBLISHED
      ? [line('Pricing', '/pricing', 'Starting prices for every service, INR, excluding GST and ad spend.')]
      : []),
    line('Insights', '/insights', 'Single-topic posts on what things cost, how to buy an agency, AI search, and building for Indian buyers.'),
    line('Contact', '/contact', 'Phone, email, location and the inquiry form.'),
    '',
  ]

  for (const track of tracks) {
    lines.push(`## ${track.label} services`, '')
    for (const service of track.services) {
      lines.push(line(service.name, serviceHref(service), service.blurb))
    }
    lines.push('')
  }

  // Insights, grouped by cluster. A post carries its own dates in frontmatter
  // rather than in page-dates.json, so the stamp is read off the entry.
  const posts = await allInsights()
  if (posts.length) {
    lines.push('## Insights', '')
    for (const cluster of clusters) {
      const inCluster = posts.filter((post) => post.data.cluster === cluster.id)
      if (!inCluster.length) continue
      lines.push(`### ${cluster.label}`, '')
      for (const post of inCluster) {
        lines.push(
          `- [${post.data.h1}](${SITE_URL}${hrefOf(post)}): ${post.data.description} (updated ${post.data.modified})`,
        )
      }
      lines.push('')
    }
  }

  lines.push(
    '## Machine-readable',
    '',
    `- [facts.json](${SITE_URL}/facts.json): Structured facts about the business, services and pages, each with an as-of date.`,
    `- [Sitemap](${SITE_URL}/sitemap-index.xml)`,
    '',
  )

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
