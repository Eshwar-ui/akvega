# Akvega

Marketing site for Akvega — a studio running growth marketing and digital build
under one roof. Astro 7 (static output) with React islands, TypeScript, Tailwind
CSS v4, GSAP for the homepage motion, deployed to Firebase Hosting.

Every route is prerendered to static HTML at build time. That is an SEO
requirement, not a preference: the site was previously a client-rendered SPA
serving one `index.html` for all five routes, which meant every page shipped the
same title and the same `<link rel="canonical" href="https://akvega.com/">` — a
directive telling Google that four of the five pages were duplicates of the
homepage.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Dev server with HMR                                     |
| `npm run dev:api`   | Local contact API using `functions/.env`                |
| `npm run build`     | Typecheck (`tsc -b`) then production build into `dist/` |
| `npm run typecheck` | Types only, no bundle                                   |
| `npm run lint`      | Oxlint                                                  |
| `npm run preview`   | Serve the built `dist/` locally                         |
| `npm run icons`     | Regenerate the tech-stack marks (see below)             |
| `npm run images`    | Convert new PNG art in `public/` to sized WebP          |
| `npm run deploy`    | Build, then deploy Hosting and the contact function    |
| `npm run test:contact` | Test contact validation and email handling          |

## Contact email (Resend)

The form posts to `/api/contact`. The server submits two emails to Resend:

1. An inquiry to `CONTACT_TO`, with the visitor's address as Reply-To.
2. An acknowledgment to the visitor, with `CONTACT_TO` as Reply-To.

Both messages use a responsive inline-styled HTML template with the Akvega logo
from `https://akvegadigital.web.app/full-logo.svg`, plus a plain-text fallback.
Inquiry fields are HTML-escaped before they are inserted into the template.

The page shows success only after Resend accepts both emails. Inbox delivery is
not tracked; delivery failures and spam filtering can be checked in Resend.
Identical submissions are deduplicated for 24 hours using Resend idempotency keys.

### Environment

Use **`functions/.env`** for both local development and Firebase deployment:

```dotenv
RESEND_API_KEY=your-resend-key
CONTACT_FROM="Akvega <contact@your-verified-domain.com>"
CONTACT_TO=your-team-inbox@example.com
```

The ignored local `.env` is configured with `Akvega <hello@akvega.com>` as
the sender and `hello@akvega.com` as the team inbox. Resend must authorize
sending from the `akvega.com` domain. Do not prefix any of these
names with `VITE_`; they belong only to the server. The checked-in
`functions/.env.example` contains no credentials.

### Run locally

Run `npm run dev:api` and `npm run dev` in separate terminals. Vite proxies
`/api/contact` to the local API on port 5001. Restart `dev:api` after editing
`functions/.env`. No Firebase billing or emulator is required for local use.
Local submissions use real Resend delivery once the addresses are configured.

### Deploy

Run `npm --prefix functions ci`, then `npm run deploy`. Firebase loads
`functions/.env` into the function environment. Firebase Functions still requires
a project with Blaze billing; using `.env` does not remove that requirement.
No Secret Manager setup is used by this implementation.

The endpoint validates input, limits field sizes, checks browser origins, includes
a honeypot, and applies a best-effort per-instance burst limit. That limit resets
when the function restarts; it is not a durable quota or a replacement for CAPTCHA.

`npm run build` fails on a type error rather than shipping one — that is
deliberate, don't route around it with a bare `vite build`.

## Layout

```
src/
  pages/        One .astro file per route. Astro routes from here.
                services/[slug].astro renders one page per service.
  content/      services/*.md — long-form service copy, in Markdown so a
                writer can edit it without opening a .astro file
  layouts/      Base.astro — the only place head metadata is written
  lib/          Content and data. site.ts (copy, nav, contact), services.ts
                (the two tracks and every service), schema.ts (JSON-LD),
                tech.ts (GENERATED), useInView.ts (revealDelay helper)
  scripts/      reveal.ts (scroll-entrance observer) and analytics.ts (the
                delegated click / scroll-depth listeners) — both vanilla
  components/
    layout/     Header.tsx (island), Footer.astro (static)
    hero/       The homepage stage and its floating cards
    sections/   Homepage sections, in the order index.astro renders them
    contact/    Contact form and the map panel
  index.css     Design tokens (@theme), base styles, and every component class
```

Copy lives in `src/lib`, not in components. If a number appears in prose —
"ten services", "four stages" — derive it (`serviceCount`, `process.length`)
rather than typing it; the page said "Nine services" over a list of ten for a
while because it was typed.

### Linting

Oxlint runs the `correctness`, `suspicious` and `perf` categories plus a
`jsx-a11y` set. Four rules are switched off in `.oxlintrc.json` — JSON can't
carry comments, so the reasoning lives here:

- `react/react-in-jsx-scope` — the project uses the automatic JSX runtime
  (`jsx: "react-jsx"`), so React is never in scope by design.
- `jsx-a11y/prefer-tag-over-role` — fires on `<svg role="img" aria-label>`,
  which is the correct pattern for a meaningful inline SVG. An `<img>` tag is
  not a substitute for one.
- `jsx-a11y/no-noninteractive-element-interactions` — the bento grid puts
  pointer handlers on the `<ul>` and `<li>` wrappers, but the interactive
  elements are the `<Link>`s inside them. Event delegation, not an
  unreachable control.
- `react/no-array-index-key` — the marquees and the capability ticker render
  each list twice back to back to hide the loop seam, so the index is the only
  thing that makes a key unique.

### Design tokens

`src/index.css` is the single source for colour, type scale, radius and easing,
all as `@theme` custom properties from the Akvega brand guidelines. Use the
tokens (`text-ink-muted`, `bg-navy`, `ease-out-expo`) — don't introduce raw hex
values in component classes.

## Generated assets

Two directories under `public/` are produced by scripts and should not be
hand-edited.

**Tech marks** — `public/tech/*.svg` and `src/lib/tech.ts` come from
`scripts/build-tech-icons.mjs`, which pulls from Simple Icons (CC0). Edit the
`STACK` array in that script and re-run `npm run icons`. The icons are public
domain; the trademarks are not — check each brand's own guidelines before
putting a mark on a page.

**Raster art** — `public/service-ui/`, `public/service-media/` and
`public/illustration/` hold WebP generated by `scripts/optimize-images.mjs` from
full-resolution PNG exports.
Drop a new PNG in the right folder and run:

```bash
npm i --no-save sharp && npm run images
```

Sharp is not a project dependency because this runs by hand, not on install.
The script writes WebP at the widths those images are actually displayed at and
removes the source PNG. Originals are recoverable from git history:

```bash
git show <commit>:public/service-ui/<name>.png > <name>.png
```

## Deploying

Firebase Hosting, project `akvegadigital`.

```bash
npm run deploy
```

`firebase.json` carries the `/api/contact` rewrite to the contact function,
`cleanUrls`, cache headers, and a short set of security headers. There is **no
SPA catch-all rewrite** any more — the static build emits a real file per route,
and a `**` → `/index.html` rule would swallow `404.html` along with them.

Firebase applies every matching header block and the **last** one wins per
header key, so the order in that file is load-bearing. HTML is
`max-age=0, must-revalidate` — the routes are listed explicitly as well as by
`**/*.html`, because `cleanUrls` serves `/services` from `services.html` and the
extension rule never sees the requested path. Hashed `/_astro/**` output gets a
year and `immutable`; media gets a week. Getting the HTML default wrong is what
once left `/` on Hosting's `max-age=3600`, with a deploy invisible for an hour.

## Measurement

### Who owns the GA4 tag

`src/layouts/Base.astro` loads **GTM (`GTM-MH6MH7F6`)** and configures **gtag** for
`G-H4KQL6J5NQ`. That is the only GA4 tag on the page, and it must stay that
way: initialising the Firebase Analytics SDK as well would issue a second
`config` against the same measurement ID and double every number in the
property. `src/lib/firebase.ts` therefore loads **Performance Monitoring
only** — GTM cannot produce that, so it is purely additive.

`page_view` is **not** sent by this code. GA4 Enhanced Measurement already
sends one per document load, and static routing means every navigation is a
document load. The SPA additionally had to rewrite `document.title` on
navigation, because one `index.html` served five routes; Base.astro emits each
page's own title into static HTML, so `src/lib/pageMeta.ts` is gone.

### Custom events

`src/lib/analytics.ts` is the event catalogue and the only place that decides
what this site reports. Names and parameters are typed, so a typo is a compile
error rather than a second near-identical row in the console.

| Event | Fires when | Answers |
| --- | --- | --- |
| `cta_click` | Any element tagged `data-cta` | Which of the five "Start a project" buttons does the work |
| `contact_channel_click` | A `mailto:` / `tel:` link | How many people skip the form entirely |
| `outbound_click` | A link to another domain | Where the site sends people |
| `contact_form_start` | First keystroke in the contact form | Top of the inquiry funnel |
| `select_content` | Growth vs Build chosen | Which track demand is actually for |
| `generate_lead` | `/api/contact` answered `ok` | Bottom of the funnel — **mark as a conversion in GA4** |
| `contact_form_error` | The submission did not land | Whether the endpoint has quietly stopped working |
| `scroll_depth` | 25 / 50 / 75 / 90% of a page | How far the long pages really read |

`generate_lead` fires only on a **confirmed** success, never on the submit
click — otherwise every failed attempt would be counted as an inquiry.
`contact_form_error` exists because a contact endpoint that stops accepting
posts is otherwise invisible: inquiries just stop arriving, which looks
exactly like a quiet week.

Adding a tracked CTA takes one attribute — no handler, no import:

```html
<a href="/contact" data-cta="pricing-start-project">Start a project</a>
```

`src/scripts/analytics.ts` picks it up from a single delegated click listener
and derives the reported location (`header` / `footer` / `form` / `body`) from
where the element sits. It is a plain module loaded from Base.astro, not a
React island — same trade `scripts/reveal.ts` made for the scroll entrance, so
pages that hydrate nothing stay that way.

**Nothing personal is ever sent.** The contact form reports shape, not
content: that an inquiry happened and which track it was for. Name, email and
message go to `/api/contact` and never to analytics.

### Performance Monitoring

`src/lib/firebase.ts` loads the SDK via dynamic `import()` after first paint,
so it never sits on the critical path. Loading it *is* the integration: it
installs automatic traces for page load, Core Web Vitals (LCP, INP, CLS) and
every outbound request. Nothing calls it directly. The load waits for `load`
and then an idle slot: pulling it in earlier contends with the hero's GSAP
intro and leaves it stuck at opacity 0. Production only — a dev-server bundle's
timings say nothing about production. Data takes up to ~12h to appear the first
time.

Config comes from `.env` (`VITE_FIREBASE_*`, see `.env.example`). Every value
is a **public** identifier that the SDK ships to the browser by design; access
is governed by security rules and API-key restrictions, not by keeping those
strings secret. Never put a real secret behind a `VITE_` prefix — Vite inlines
those into the bundle.

### First-run console setup

Three things can only be done in the console, once:

1. **Analytics → Events → mark `generate_lead` as a conversion**, so inquiries
   are counted as conversions rather than one row among many custom events.
2. **Admin → Data streams → Configure tag settings → Define internal traffic**:
   add your own IP. The tag in `Base.astro` reports from `localhost` too, so
   without this, development traffic sits in the same reports as visitors.
3. **Admin → Custom definitions**: register `cta_label`, `cta_location`,
   `interest`, `reason` and `percent_scrolled` as custom dimensions. GA4
   collects the parameters either way, but no report can be broken down by
   them until they are registered.

## Before launch

The site is built; some of its content is honest placeholder. Each of these is
marked with a comment at the point it appears:

- **Domain.** `site.url`, `public/sitemap.xml`, `public/robots.txt` and the
  canonical/`og:` tags in `index.html` all assume `https://akvega.com`, inferred
  from the contact address. Confirm the real origin and update all four.
- **Phone number.** `site.phone` is a deliberately fake `+1 (000) 000-0000`.
- **Social links.** `site.social` hrefs are all `#`.
- **Share image.** No `og:image` — needs a 1200×630 raster at `public/og.png`.
- **Contact form.** Submits via `mailto:`, not a backend. Swap `buildMailto` in
  `ContactForm.tsx` for a real endpoint when there is one.
- **Tech stack.** The mark set in `build-tech-icons.mjs` is a starting list, not
  a verified one. It is a public claim about what the studio builds with — cut
  anything Akvega doesn't actually use.
- **Case studies.** `/work` is a deliberate empty state. Per `PRODUCT.md`, never
  fill it with fabricated outcomes or metrics.

`DESIGN.md` records why the interface looks the way it does; `PRODUCT.md` holds
the positioning and the rules about what may be claimed. Read both before
changing copy.

## Islands

Astro renders everything to static HTML and hydrates only what is marked with a
`client:*` directive. Five components are islands; nothing else ships JS.

| Component | Directive | Why it needs JS |
| --- | --- | --- |
| `Header` | `client:load` | Mobile menu, scroll-direction hide |
| `Hero` | `client:load` | GSAP intro timeline, above the fold |
| `Capabilities` | `client:visible` | Tab selection state |
| `sections/Services` | `client:visible` | GSAP Flip slot reflow |
| `contact/ContactForm` | `client:visible` | Field state, posts to `/api/contact` |
| `CustomCursor` | `client:idle` | Pointer-follow, pure enhancement |

Everything else — Approach, Assurance, Process, Faq, CallToAction, the whole
Services page, the footer — is static. `/services` ships one island (the header)
and is otherwise plain HTML.

The thing that made that possible was replacing the `useInView` React hook with
`src/scripts/reveal.ts`. That hook was the only reason most sections had to be
React at all. The contract is unchanged: put `data-reveal-root data-shown="false"`
on a container and `.reveal` / `.draw` children animate in once, on first view.
**Content must never depend on the entrance running.**

## SEO

Owned in three places, and they must not drift apart:

- **`src/layouts/Base.astro`** — title, description, canonical, og/twitter, and
  the site-wide `Organization` + `WebSite` JSON-LD. Every page passes its own
  title and description; nothing is hardcoded per route anywhere else.
- **`src/lib/schema.ts`** — JSON-LD builders. Two deliberate omissions are
  documented in that file: `sameAs` (the social hrefs are still `#`) and the use
  of `Organization` rather than `ProfessionalService` (no confirmed address).
- **`src/components/Breadcrumb.astro`** — renders the visible trail *and* its
  `BreadcrumbList` markup from one source, so they cannot disagree.

`@astrojs/sitemap` generates `sitemap-index.xml` at build. There is no
hand-maintained sitemap any more — the old `public/sitemap.xml` had to be edited
per route and had already drifted.

### One page per service

The ten services were anchors on `/services` — `#seo`, `#google-ads` and so on.
An anchor cannot rank on its own, so ten offerings were competing as a single
document with one title and one description, against competitors giving each of
them a page. Each now owns a URL under `/services/<slug>`, with its own title,
description, `Service` schema and breadcrumb.

Copy lives in `src/content/services/*.md` and is validated by
`src/content.config.ts` — a description over 160 characters or a filename that
does not match a slug in `lib/services.ts` fails the build rather than shipping.
The route derives everything else (schema, breadcrumb, sibling links, the
deliverables rail) from `lib/services.ts`, so adding a service is a data entry
plus a Markdown file.

**These pages are drafts.** Every file carries `reviewed: false` in its
frontmatter. The copy was written from the 50-word blurbs in `lib/services.ts`
and describes method rather than results — no client names, no metrics, no
outcomes — but per PRODUCT.md it is still placeholder until someone at Akvega
signs it off. Flip `reviewed` to `true` as each one is approved.

### robots and llms.txt

`public/robots.txt` names the AI crawlers explicitly (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended and others) rather than leaving them to the
wildcard. They were already allowed; naming them means a future `Disallow` has
to be a deliberate decision. Note that Google-Extended does not affect Search at
all — it only governs whether these pages can ground Gemini and AI Overviews.

`public/llms.txt` is the plain-text summary those crawlers read in preference to
parsing layout. It ends with an explicit note that /work is deliberately empty
and that no outcomes should be attributed to Akvega, because an LLM inventing a
case study is the failure mode that matters here.
