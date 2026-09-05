# Akvega

Marketing site for Akvega — a studio running growth marketing and digital build
under one roof. React 19 + TypeScript on Vite 8, Tailwind CSS v4, GSAP for the
homepage motion, deployed to Firebase Hosting.

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

The key has been moved into the ignored local `.env`. The sender and recipient
must be filled with real addresses before sending. Do not prefix any of these
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
  lib/          Content and data. site.ts (copy, nav, contact), services.ts
                (the two tracks and every service), tech.ts (GENERATED),
                useInView.ts (the scroll-reveal hook)
  components/
    layout/     Header, Footer, RootLayout
    hero/       The homepage stage and its floating cards
    sections/   Homepage sections, in the order Home.tsx renders them
    contact/    Contact form and the map panel
  pages/        One file per route
  router.tsx    Routes. Home and NotFound eager, the rest lazy
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

**Raster art** — `public/service-ui/` and `public/service-media/` hold WebP
generated by `scripts/optimize-images.mjs` from full-resolution PNG exports.
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

`firebase.json` carries the SPA rewrite (every path to `/index.html`, so deep
links like `/services` resolve), the `/api/contact` rewrite to the contact
function, cache headers, and a short set of security headers.

The cache headers are ordered broadest-first on purpose. Firebase applies every
matching block and the **last** one wins per header key, so `**` sets
`no-store` as the default and `/assets/**` overrides it with a year. The
default has to cover `**` rather than `/index.html`: every SPA route is
requested as `/`, `/work`, `/contact` — paths an `/index.html` rule never
matches, which is why `/` was being served with Hosting's default
`max-age=3600` and a deploy stayed invisible for an hour.

## Measurement

### Who owns the GA4 tag

`index.html` loads **GTM (`GTM-MH6MH7F6`)** and configures **gtag** for
`G-H4KQL6J5NQ`. That is the only GA4 tag on the page, and it must stay that
way: initialising the Firebase Analytics SDK as well would issue a second
`config` against the same measurement ID and double every number in the
property. `src/lib/firebase.ts` therefore loads **Performance Monitoring
only** — GTM cannot produce that, so it is purely additive.

`page_view` is **not** sent by this code. GA4 Enhanced Measurement already
sends one on load and on every browser-history change, which React Router
triggers on navigation. What the app does instead is keep `document.title`
correct per route (`src/lib/pageMeta.ts`), because that is the title GA4 reads
at the moment it fires.

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

```tsx
<Link to="/contact" data-cta="pricing-start-project">Start a project</Link>
```

`src/components/Analytics.tsx` picks it up from a single delegated click
listener and derives the reported location (`header` / `footer` / `form` /
`body`) from where the element sits.

**Nothing personal is ever sent.** The contact form reports shape, not
content: that an inquiry happened and which track it was for. Name, email and
message go to `/api/contact` and never to analytics.

### Performance Monitoring

`src/lib/firebase.ts` loads the SDK via dynamic `import()` after first paint,
so it never sits on the critical path. Loading it *is* the integration: it
installs automatic traces for page load, Core Web Vitals (LCP, INP, CLS) and
every outbound request. Nothing calls it directly. Production only — a Vite
dev bundle's timings say nothing about production. Data takes up to ~12h to
appear the first time.

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
   add your own IP. The tag in `index.html` reports from `localhost` too, so
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
