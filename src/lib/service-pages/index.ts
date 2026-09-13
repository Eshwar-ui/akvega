import { allServices } from '@/lib/services'
import { branding } from './branding'
import { commerce } from './commerce'
import { custom } from './custom'
import { design } from './design'
import { mobile } from './mobile'
import { paidSearch } from './paid-search'
import { paidSocial } from './paid-social'
import { search } from './search'
import { social } from './social'
import { websites } from './websites'
import type { ServicePage } from './types'

export type { ServicePage } from './types'

/** Every service page, in the order lib/services.ts lists the services. */
export const servicePages: ServicePage[] = [
  search,
  paidSearch,
  paidSocial,
  social,
  branding,
  websites,
  commerce,
  mobile,
  design,
  custom,
]

// Every service must have a page and every page a service — a missing page
// is a dead link in the footer, a stray page is an orphan. Checked at import
// time so the build fails, not the visitor.
const serviceSlugs = new Set(allServices.map((service) => service.slug))
for (const page of servicePages) {
  if (!serviceSlugs.has(page.slug)) {
    throw new Error(`service-pages: "${page.slug}" has no entry in lib/services.ts`)
  }
}
for (const slug of serviceSlugs) {
  if (!servicePages.some((page) => page.slug === slug)) {
    throw new Error(`service-pages: service "${slug}" has no page`)
  }
}

export function servicePageFor(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug)
}
