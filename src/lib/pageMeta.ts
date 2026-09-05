/**
 * Per-route `<title>` and description.
 *
 * WHY THIS EXISTS: index.html carries one static title, correct for the first
 * paint and wrong for every client-side navigation after it. That costs twice
 * — link previews and search engines see one title for five pages, and GA4's
 * automatic page_view reads `document.title` at the moment it fires, so the
 * whole Pages report collapses into a single row.
 *
 * The `/` entry is a deliberate byte-for-byte copy of the title and
 * description in index.html: anything else would visibly retitle the homepage
 * a beat after it loads, and would split the homepage across two rows in
 * every report.
 *
 * Copy follows the two-track Growth/Build positioning in index.html and
 * lib/services.ts — not the older "design studio" line still sitting in
 * site.ts's `subhead`, which those meta tags were deliberately moved away from.
 */
import { site } from '@/lib/site'

type PageMeta = { title: string; description: string }

const home: PageMeta = {
  title: `${site.name} — Growth marketing and digital build, one team`,
  description:
    'Akvega runs growth marketing and digital build under one roof — search, ads and social alongside websites, apps and custom systems.',
}

export const pageMeta: Record<string, PageMeta> = {
  '/': home,
  '/about': {
    title: `Studio — ${site.name}`,
    description:
      'One team for growth and build: the people buying the traffic also ship the page it arrives on.',
  },
  '/work': {
    title: `Work — ${site.name}`,
    description:
      'Selected growth and build work — search, ads and social alongside websites, apps and custom systems.',
  },
  '/services': {
    title: `Services — ${site.name}`,
    description:
      'Two tracks. Growth: search, ads and social. Build: websites, commerce, mobile and custom systems.',
  },
  '/contact': {
    title: `Contact — ${site.name}`,
    description:
      'Start with a paid diagnostic — an audit and a scoped plan, handed over whether or not you continue with us.',
  },
}

export function metaForPath(pathname: string): PageMeta {
  // Trailing slashes arrive from external links and hand-typed URLs. They are
  // the same page and must not fork the report.
  const normalised =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  // Unknown paths render NotFound; keeping the homepage copy would tell a
  // search engine a 404 is the homepage.
  return (
    pageMeta[normalised] ?? {
      title: `Page not found — ${site.name}`,
      description: home.description,
    }
  )
}
