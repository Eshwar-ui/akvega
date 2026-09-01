# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Marketing and business decision-makers (founders, CMOs, marketing leads) at
companies that currently buy growth marketing (search, paid search, paid
social, social) and digital build (websites, commerce, mobile, product design)
from two separate vendors, and are evaluating whether to consolidate both
under one partner.

## Product Purpose

Akvega is an independent design studio combining growth marketing and digital
product/engineering under one team, so the campaign and the product it points
to are shipped by the same people. Success on the contact page specifically:
a qualified visitor starts an engagement — via a form inquiry, a direct email,
or booking a call.

## Positioning

Stated directly in the site's own copy (`Approach.tsx`): "We hold both ends.
The team buying the traffic is the team shipping the page it arrives on."
Most competitors split growth and build across two suppliers, which creates a
handoff tax (mismatched tracking, late landing pages, unowned bugs). Akvega's
mechanism is holding both ends under one roof — a neighboring single-discipline
shop could not truthfully copy this claim.

## Operating Context

- Engagements start with a **paid diagnostic**: an audit with scoped findings,
  delivered to the prospect whether or not they continue with Akvega.
- The client owns all deliverables from day one — repositories, ad accounts,
  and analytics are set up in their name. Leaving is meant to be a decision,
  not an extraction.
- Akvega can lead an engagement, embed with an in-house team, or sit behind
  one as the engineering/media bench.

## Capabilities and Constraints

Confirmed via interview for the contact page rebuild:

- The contact page needs three entry points: a **structured inquiry form**, a
  **direct email link**, and a **book-a-call** entry point.
- The form stays **channel-agnostic** — no Growth/Build track selector up
  front; it asks for the project in free text instead.
- Contact info to surface: **email, phone, office location/timezone, and
  social links.** Today only the email is real
  (`hello@akvega.com`, itself marked placeholder in `lib/site.ts`) — phone,
  location, and the social URLs (currently `href: '#'`) do not exist yet and
  must render as clearly-flagged placeholders, in the same "shape-accurate,
  fact-free" convention the rest of the site already uses, not as invented
  real-looking facts.
- **No backend exists for the form yet** — it has nowhere to submit to
  (no CRM, no serverless function, no form service like Formspree). This must
  be wired up before launch; until then the page should make the gap explicit
  in code, not silently no-op.
- **No real scheduling link exists yet** (e.g. Calendly/Cal.com). The
  book-a-call entry point needs one before launch.
- All site copy — services, FAQ, headline, footer tagline, tech stack — is
  explicitly placeholder per the existing project convention (see DESIGN.md's
  Placeholder inventory). The contact page's copy should follow the same rule:
  accurate in shape, not asserted as confirmed fact.

## Brand Commitments

- Name: **Akvega**. Full visual system is recorded in `DESIGN.md`, derived
  from the Akvega Brand Guidelines v1.0/2026 PDF.
- Voice (guidelines 01): modern not futuristic, confident not loud, technical
  not complicated, direct not abrupt, premium not ornamental, adaptive not
  inconsistent.
- Logo assets (`public/logo.svg`, `public/full-logo.svg`) carry their own
  gradient and must never be recoloured, stretched, or rotated.

## Evidence on Hand

No real case studies, client logos, testimonials, or results exist yet. The
`clients` array in `lib/site.ts` is explicitly not rendered for this reason.
**Do not fabricate proof elements** — client names, review quotes, response
times, or outcome metrics — anywhere on the contact page.

## Product Principles

1. **One team, two tracks.** Every surface, including transactional ones like
   a contact form, should read as one team rather than presenting growth and
   build as separate offerings someone has to choose between.
2. **Never fabricate proof.** No invented clients, no phone number or address
   presented as real when it isn't, no manufactured metrics. Mark placeholders
   as placeholders in code, the way the rest of the site already does.
3. **The client owns everything from day one.** This should read through in
   tone wherever the engagement model comes up — no lock-in framing, no
   pressure tactics in form copy or CTAs.
4. **Confident, direct, technical-not-complicated voice** carries through to
   transactional UI copy too — form labels, helper text, error and success
   states — not just marketing headlines.

## Accessibility & Inclusion

WCAG AA is a brand requirement (DESIGN.md), not a nicety. This carries through
to the contact form specifically: labelled fields, visible focus states,
colour-independent error states, and keyboard-operable date/time picking if a
scheduling widget is embedded.
