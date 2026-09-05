/**
 * The event catalogue — the one place that decides what this site reports.
 *
 * TRANSPORT: `src/layouts/Base.astro` already loads GTM (`GTM-MH6MH7F6`) and
 * configures gtag for `G-H4KQL6J5NQ`, so GA4 is tagged in the static HTML of
 * every page before any of this runs. These events ride that tag rather than
 * initialising a second one: loading the Firebase Analytics SDK as well would
 * issue a competing `config` on the same measurement ID and double every
 * number in the property.
 *
 * NOT HERE — `page_view`. GA4 Enhanced Measurement sends it on every document
 * load, and static routing means every navigation is one. Sending our own
 * would double-count. Nothing has to correct `document.title` either: each
 * page carries its own in the HTML Base.astro emits, which is the title GA4
 * reads when it fires.
 *
 * WHY A CATALOGUE: gtag accepts any string, which is how a property rots into
 * `cta-click`, `ctaClick` and `CTA Click` all meaning the same thing. The
 * types below make the event name *and* its parameters a compile error to get
 * wrong, so the reports stay readable.
 *
 * NAMING: GA4's recommended names (`generate_lead`, `select_content`) are used
 * where one fits, because Firebase and GA4 build richer reporting on them.
 * Site-specific events are prefixed so they can never collide with an
 * auto-collected one — Enhanced Measurement already sends `scroll` and
 * `form_start`, so ours are `scroll_depth` and `contact_form_start`.
 *
 * PRIVACY: never put a visitor's name, email or message text in here. What
 * gets sent is shape, not content — that an inquiry happened, not who sent it.
 */

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, unknown>) => void
  }
}

export type TrackedEvents = {
  /** Any element the site is actively asking people to press. */
  cta_click: {
    cta_label: string
    cta_location: string
    cta_destination: string
  }
  /** A link leaving the site. */
  outbound_click: {
    link_url: string
    link_domain: string
    link_text: string
  }
  /** `mailto:` / `tel:` — the low-friction path that skips the form entirely. */
  contact_channel_click: {
    channel: 'email' | 'phone'
    location: string
  }
  /** First keystroke in the contact form: the top of the inquiry funnel. */
  contact_form_start: {
    form_name: string
  }
  /** Which service track a visitor picked — Technology vs Digital demand. */
  select_content: {
    content_type: string
    item_id: string
  }
  /**
   * A *confirmed* submission — `/api/contact` answered `ok`. The bottom of the
   * funnel; mark it as a conversion in GA4.
   */
  generate_lead: {
    form_name: string
    interest: string
    has_company: boolean
  }
  /**
   * A submission that did not land. Without this, a contact endpoint that has
   * quietly stopped accepting posts is invisible: inquiries just stop
   * arriving, which looks exactly like a quiet week.
   */
  contact_form_error: {
    form_name: string
    reason: string
  }
  /** Fires once per threshold per page — how far a page actually reads. */
  scroll_depth: {
    percent_scrolled: number
    page_path: string
  }
}

/**
 * Fire-and-forget by contract. Measurement must never be able to fail a user
 * action, so every path resolves: no tag on the page, a blocker, a throw
 * inside gtag — the call just returns.
 *
 * Deliberately not gated to production. The tag in `Base.astro` reports from
 * localhost too, so gating only these events would make dev traffic show page
 * views with no interactions — misleading in a way that no data would not be.
 * Exclude local traffic in one place instead: GA4 Admin → Data streams →
 * Configure tag settings → Define internal traffic.
 */
export function track<K extends keyof TrackedEvents>(
  name: K,
  params: TrackedEvents[K],
): void {
  try {
    window.gtag?.('event', name, params)
  } catch {
    // Blocked, or the tag was removed from Base.astro. Not our problem.
  }
}
