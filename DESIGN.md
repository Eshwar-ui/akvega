# Akvega — visual system

Derived from **Akvega Brand Guidelines v1.0 / 2026**
(`Akvega_Brand_Guidelines.pdf`). This file records how it is implemented in code.

**Authority:** the client's visual direction wins over the PDF where they
conflict, except on accessibility. Every deviation taken so far is listed under
"Approved deviations" below — add to that list rather than silently drifting.

Site mode: **Persuade**. Hero composition follows a pinned reference (quso.ai) —
structure only. Palette, type, radius, and voice are Akvega's.

## Foundation (01)

Personality: modern not futuristic · confident not loud · technical not
complicated · direct not abrupt · premium not ornamental · adaptive not
inconsistent.

The hero headline uses the guidelines' suggested brand line, **"Engineered
momentum."** The PDF flags it *"use only if it fits the final business
positioning"* — positioning is not confirmed, so treat it as provisional.

## Colour (05)

The six named colours are in `@theme` verbatim. Never hand-enter a hex outside it.

| Token | Hex | Role |
|---|---|---|
| `navy` | `#051127` | Structure, body text, `ink` |
| `signal` | `#1487F1` | Primary brand blue |
| `energy` | `#08C8EE` | Highlight accent only — never long-form text on white |
| `vega` | `#3039E8` | Gradient end stop |
| `ice` | `#EFF8FF` | Light surface, `surface` |
| `slate` | `#536078` | Secondary text, `ink-muted` |

A working `blue-50…900` ramp sits alongside them. It exists for one reason:
**Signal Blue reaches only 3.7:1 on white**, which is large-text-only. Anything
filled that carries a label uses `blue-600` (`#0F6ACC`, 5.3:1 with white).
Signal Blue itself is for display type, accents, and rules.

Primary gradient, when used: `#08C8EE → #1487F1 → #3039E8`. Two to three hues,
smooth, never as text fill.

## Type (07)

**Inter** is the workhorse across brand and UI, per the guidelines. The design
detector flags Inter as over-used; the brief overrides it.

**Instrument Serif italic** is the one exception — the hero accent line only, by
client direction. Do not spread it to a third context, and do not add a third
family.

Scale: H1 32–40 · H2 24–28 · Body 16–18, as specified. The hero display runs to
84px, past the PDF's 64px ceiling, by client direction; tracking `-0.04em` there
and `-0.03em` elsewhere.

## Page width

One container token, `--container-site: 95vw`, drives the header, every section,
every panel and the hero stage — so all of them share a single rail and their
edges line up down the page. Client direction: the layout tracks the viewport
rather than stopping at a fixed rail, so wide screens are used rather than
letterboxed.

It is applied as `max-w-site` on elements that still carry their own gutters, so
the container caps the width but never forces it — below roughly 480px the
gutter padding wins and nothing overflows. Do not reintroduce a fixed pixel
width alongside it; change the token instead.

## Radius & spacing (09)

`4 / 8 / 16 / 24` steps and a **12px default radius**, mapped onto `--radius-*`
so `rounded-md` is the brand default. Cards are 16px, the hero stage 24–28px.

**CTAs are pills**, by client direction, and the primary CTA is navy rather than
blue. Everything else keeps the 12px system. Cyan stays reserved for highlights.

## Logo (02–05)

`public/logo.svg` (symbol, 481×286) and `public/full-logo.svg` (primary lockup,
1504×294). Rendered as `<img>` via `LogoMark` / `LogoFull` — they carry their own
gradient and must not be inlined and recoloured.

Hard rules, from 04 and 05:

- Primary lockup minimum **120px** wide. The header renders it at 133px.
- Symbol minimum **24px** wide.
- Symbol-as-avatar keeps **≥18% internal padding**.
- Do not stretch, recolour, add effects to, or **rotate** the mark. This is why
  no floating hero card contains the logo — every card sits on a tilt.

## Landing page structure

`src/pages/Home.tsx` composes six sections, alternating white / ice / navy so
the page has rhythm without decoration:

1. **Hero** — `components/hero/`
2. **Services** — the two tracks, on white
3. **Approach** — the positioning argument, on an ice panel
4. **Process** — four numbered stages, on white
5. **FAQ** — native `<details name="faq">`, exclusive accordion, on white
6. **Call to action** — navy panel, cropped aperture motif

The footer closes the page as a **panel, not a strip** — same card geometry as
the CTA above it (`max-w-site`, matching gutters, `rounded-xl`/`2xl`), on
ice. Composition: pitch line and one oversized pill on the top row, a
four-column directory below, then the primary lockup at full card width.

The two service tracks lead the directory because the split is the pitch — the
columns are generated from `lib/services.ts`, not re-typed. Its headings are
Inter, not Instrument Serif: 07 restricts the serif to the hero accent line, and
the footer would have been a third context.

The closing lockup is `full-logo.svg` at card width (~1100px, well past the
120px minimum). It is never cropped, tilted or recoloured — 04/05 rule out all
three, so the scale carries it instead of a crop.

The colour on the panel is one thing:

**`.footer-field`** — one top-to-bottom ramp through the brand hues, in the
order of the primary gradient: ice, then energy, then signal, then vega at the
bottom edge behind the lockup. Each stop is mixed back into ice rather than used
neat.

That dilution is a contrast requirement, not a taste one. `ink-muted` needs a
background luminance of 0.694 to clear 4.5:1, so the saturated end of the ramp
has to finish below the last line of text. The stop positions are tuned around
the **bottom bar on mobile**, where the panel is ~1370px tall and the copyright
line sits at 88% — the tightest point on the page. Moving the signal stop from
78% to 86% took that line from 4.51:1 to 4.92:1. **Re-measure if anything moves
into the bottom of the panel.**

Measured on the resolved stops, worst case per breakpoint:

| | Panel height | Tightest text | Ratio |
|---|---|---|---|
| Desktop | 915px | copyright, 64% | 5.32:1 |
| Mobile | 1373px | copyright, 88% | 4.92:1 |

The black wordmark against the bottom edge reads 13.5:1, so the deep end has
room to go further if the type above it ever moves up.

The panel carries `border-hairline` on all four sides, matching the hero stage.

A gradient rule ran across the top edge for a while. It was removed by client
direction — the top edge is the plain hairline. Do not put it back.

### Page rhythm

The page alternates light and dark so it has peaks rather than one even tone:
hero (light, gradient field) → services (white) → **approach (navy)** →
process (white) → FAQ (white) → **CTA (navy)**.

Navy is a structural surface, not just the closing panel — guidelines 05 give it
"most text and large surfaces". Two dark panels is the floor; do not flatten the
page back to all-light.

Display scale carries the same idea. Section headings run to 3.5rem, track
labels to 4.5rem, and body to 17–20px. Small, evenly-sized headings across every
section is what made this read flat the first time.

### Service architecture

`src/lib/services.ts` is the single source. Two tracks — **Growth** (search,
paid search, paid social, social presence) and **Build** (websites, commerce,
mobile, product design, bespoke systems) — because that split *is* the pitch:
most companies buy these from two suppliers.

Services render as a two-column editorial row — large name and icon on the left,
blurb and a tracked uppercase deliverables line on the right — separated by
hairlines. Not a card grid, and not bordered chips: both were tried and both
read cheap at this scale. Track accents: Growth = `signal`, Build = `vega`.

Process steps are numbered because the sequence is the content. Do not number
anything where the order carries no information.

## The hero stage

`src/components/hero/` — `Hero.tsx` and `PlatformTiles.tsx`.

Two backdrop layers. `.hero-field` is a restrained three-hue gradient band set
(06), which gives the stage material with no asset dependency. `.hero-backdrop`
layers the **supplied bitmap** at `public/hero-bg.png` over it — its dots and
centre glow are baked in, so do not regenerate either in CSS.

**The stage is one screen tall**, by client direction: `100svh` less the 80px
header and the wrapper's bottom gutter, so it ends exactly at the fold. `svh`
not `vh` — mobile browser chrome must not crop it. It is a *minimum* height and
the column centres inside it, so content never gets clipped; on a very short
viewport (≈640px) the stage grows past the fold instead.

Fitting one screen is what the vertical rhythm is tuned for. The column
padding, the display size and every gap are `clamp()`d against `vh` as
well as `vw`, so the whole composition compresses on short screens rather than
overflowing. Verified exact at 1920×1080, 1440×900, 1280×700, 375×812. If you
add anything to the hero, re-measure those — the fit has no slack.

`PlatformTiles.tsx` carries the accent tiles — white rounded squares, soft drop
shadow, hand-set tilt and vertical offset per the supplied reference. They hold
**one row at every width** (they used to wrap into a cluster on narrow screens);
wrapping cost three rows on mobile, which is the whole reason the hero would not
fit a screen. The tilt and lift keep them scattered rather than gridded.

They originally carried social-channel marks (YouTube, TikTok, Instagram,
LinkedIn, X) and were swapped to tech-stack marks by client direction. Unlike
the channel marks, these come from the same `TechIcon` / `lib/tech.ts`
pipeline as `TechStack.tsx` — real Simple Icons assets, not a drawn
placeholder — but rendered at full brand colour rather than
monochrome-until-hover, since a colourful accent row is the point here.

Guidelines 06 asks for large negative space over decorative density — if the
stage ever feels busy, remove tiles rather than shrinking them.

## Capability cards

`src/components/sections/Capabilities.tsx`, between the hero and Services on
`Home.tsx`. Six cards for the six things clients ask for by name — Google Ads,
Meta Ads, SEO & AEO, Web design, Branding, Analytics — as a lead-in to the
two-track argument below them.

They were first built into the hero and moved out: the hero keeps its platform
tiles, and eleven objects under the CTAs is exactly the density 06 warns
against. On white they are level and evenly spaced — no tilt, no drop shadow, no
hero entrance. They rise on scroll with the same `.reveal` ladder as every other
section.

Each card is mark → accent rule → track eyebrow → name, and links to its
service. The accent rule is the only place the track colour reads (Growth =
`signal`, Build = `vega`). Nothing on a card claims a number — no invented
metrics.

Two mark systems meet on these cards, deliberately: **Google Ads and Meta are
third-party marks** from `BrandMarks.tsx`, in their own colour and never
restroked to the house style; everything we do ourselves uses the `Icon` set
tinted with its track accent. Both new house icons — `brand` (a circle and a
square in composition) and `trend` — follow 08.

**The Google Ads and Meta marks are drawn approximations,** same caveat as the
rest of `BrandMarks.tsx`: each requires its official asset under that platform's
brand guidelines. Swap the real SVGs in before launch.

Branding has no entry in `lib/services.ts`, so its card links to the page rather
than an anchor. Add the service there and point it at the slug.

## Contact page

`src/pages/Contact.tsx`, `src/components/contact/ContactForm.tsx`, and
`src/components/contact/MapPlaceholder.tsx`.

Structure was re-derived from a client-supplied reference (a dark, photo-led
agency template) and rebuilt entirely in Akvega's own system rather than the
reference's: banner with breadcrumb → two-column pitch/details + form → a
map beat → the site's existing footer. This **replaced** an earlier
three-step "diagnostic intake" wizard built from a structural concept roll
(seed key 9ee65736) — a client-pinned reference outranks a prior roll, and
the wizard's step-by-step mechanic didn't survive the swap to a single-card
form. The diagnostic *framing* (copy referencing the paid-diagnostic
positioning) still runs through the headline and form intro; only the
multi-step structure was dropped.

**Banner.** Reuses `.hero-field` — the homepage hero's asset-free gradient —
in a shorter rounded panel, so the "photo hero" beat costs no image asset and
still reads as the same material as the real hero. Breadcrumb, eyebrow, and
`type-page-title` headline sit inside it, on `ink`, matching the homepage
hero's light-background/dark-text pairing rather than the reference's white
text on a dark photo.

**Form (`ContactForm.tsx`).** One card, four fields (name, email, company,
message), one button — a deliberate simplification from the retired wizard.
Inputs are bottom-border-only rather than boxed, the one deliberate borrowing
from the reference's minimal form style; everything else (colour, radius,
type) is Akvega's. No backend exists: "Send a message" builds a `mailto:`
from the fields and hands off to the visitor's mail client — real today, not
a stub. Email gets inline format validation (error state, `role="alert"`),
and the submit button stays disabled until name, a valid email, and a message
are present.

**Details column.** Plain label-plus-value blocks (Reach us / Availability /
Email / Social), not icon-tile cards — icon boxes were tried and read as an
unwanted "icon-heading-text card grid" once repeated four times. `phone` (an
all-zeros number, obviously fake, same convention as the `clients` array) and
`availability` ("Remote-first · async across time zones", the least specific
true-shaped claim available) are placeholder facts in `lib/site.ts`; both
need real values, or removal, before launch. Two new house icons, `phone`,
`clock`, and `pin`, were added to `Icons.tsx` at the same 2px-stroke spec —
`pin` is used only in the map, not the details column.

**Map (`MapPlaceholder.tsx`).** The reference embeds a real Google Map
pinning a physical office; Akvega has confirmed it has none. Rather than
fabricate a working map around an address that doesn't exist, this is an
abstract line-art "map" (a few `currentColor` strokes at `text-ink/10`, a
navy pin) with an honestly-labelled card: "Illustrative map — not a real
location." Replace the whole component with a real embed if a physical
address is ever confirmed; don't wire fake coordinates into this one.

## Header

The header switches to the mobile sheet at `lg`, not `md`: the centred nav plus
the email and CTA collide around 800px.

## Third-party brand marks

`src/components/BrandMarks.tsx` holds the platform glyphs — LinkedIn, Instagram,
Dribbble, X, YouTube, Facebook — in each platform's own outline and colour.

These are deliberately **outside** the Akvega icon system. Guidelines 08 governs
our icons; a third-party mark must not be restroked, recoloured, or outlined to
match a house style, so never route these through `<Icon>`. Hardcoded hex here is
correct and is the one place brand tokens do not apply.

Same caveat as the hero cards: these are drawn from the standard public glyph
outlines, and each platform's guidelines require their official asset. Confirm
before launch.

## Icons (08)

Drawn, 2px stroke at 24px, rounded caps and joins, minimal internal detail. No
emoji, no unicode glyphs. All of them live in `src/components/Icons.tsx` behind
a single `<Icon name="…" />` — add new ones there rather than inlining an SVG.
The header's menu control follows the same spec.

## Tech stack marks

Third-party logos, and a different thing from the house icon set above — they
are other people's marks and must never be redrawn to match our 2px stroke.

`scripts/build-tech-icons.mjs` generates them from **Simple Icons**
(CC0-1.0, a devDependency). One command, two outputs:

```bash
node scripts/build-tech-icons.mjs
```

- `public/tech/<id>.svg` — the marks, in brand colour
- `src/lib/tech.ts` — **metadata only**: title, group, brand hex, source

Both are generated. Edit `STACK` in the script and re-run; never hand-edit
either output. Slugs are Simple Icons slugs — `nodedotjs`, not `nodejs` — and
the script exits non-zero on an unknown one rather than silently leaving a gap.

`TechStack` masks each file rather than inlining its path. That is a measured
decision: inlining all 31 paths cost **35KB raw / 16KB gzipped on the main
bundle, on every page**, for icons that appear on one. Masking costs 2KB
gzipped. Simple Icons marks are single-colour silhouettes, so nothing is lost.

Marks render **monochrome and take their brand colour on hover**. Thirty logos
at full saturation is what "loud" looks like (01); held back, the colour means
something when it arrives.

### AWS, and the other missing marks

**AWS is not in Simple Icons** — Amazon had it removed, as did Microsoft, Slack,
OpenAI, Magento, Klaviyo and VS Code. There is no CC0 source for these.

To add one: get the vendor's own asset (AWS publishes
[Architecture Icons](https://aws.amazon.com/architecture/icons/)), drop it at
`public/tech/<id>.svg`, and flip `asset` on its entry in `VENDOR_SUPPLIED`.
It then renders like any other. **Do not draw a substitute** — an approximated
logo is worse than a missing one, and it is the same rule `PlatformTiles`
already carries.

Simple Icons is CC0, but **the trademarks are not**. Each mark stays its owner's
property and is usable to say "we work with this", nothing more. Check the
brand's own guidelines before putting one on a page.

## Motion

One authored moment: the backdrop blooms outward while the stage settles in, on a
single `--ease-out-expo` curve with a staggered delay ladder. Cards then drift on
a slow, low-amplitude loop. Everything collapses under `prefers-reduced-motion`.

Elevation shadows are neutral navy with real offset and blur. The one coloured
glow is under the primary CTA, an approved deviation — do not spread it.

### Micro-interactions

Four primitives in `index.css`, all on `--ease-out-expo`. Reach for one of
these rather than writing a new hover — a page where every element responds
slightly differently is what "loud" looks like in motion.

| Class | For | Behaviour |
|---|---|---|
| `.press` | buttons, pills, chips, tiles | 2px lift on hover, sink to 0.98 on press |
| `.card-lift` | card surfaces | 4px lift plus real elevation |
| `.link-sweep` | text links | underline sweeps in from the left, on hover **and** focus |
| `.roll` | nav labels | the word rolls up one line to an identical copy |
| `.reveal` | type, rows, panels | rises 14px and fades in, once, on first view |
| `.marquee` | vertical logo-wall columns | continuous scroll, alternating direction per column, starts once the section is in view |

`.roll` is wrapped by `TextRoll`, which draws the label twice in a clipped box
and slides the pair up exactly one line. Three things about it are load-bearing:

- The second copy is `aria-hidden`. Without it a screen reader reads every nav
  item twice.
- `height` and `line-height` are locked together at 1.4. The clip *is* the
  effect, and below about 1.3 it starts eating descenders — verified against
  "Jgpqy", which fits the box exactly.
- Both copies are identical, which is what makes it safe under reduced motion:
  the global collapse makes the slide instant and the reader sees nothing move.

It triggers from `:where(a, button):hover` and `:focus-visible`, so it needs no
`group` class on the link and keyboard users get it too. It is on the header nav;
the footer's directory links use `.link-sweep` instead, so the two navigations
do not compete.

Plus `.draw`, which draws SVG line art in as its section arrives. Every path
carries `pathLength="1"`, so one dash length covers any geometry.

Amplitudes are deliberately small. The press is faster than the lift (80ms
against 280ms) because a click should feel answered immediately, while a hover
can afford to settle.

`.reveal` is an **animation**, not a transition, and that is load-bearing: a
transition would permanently own `transition-property` on the element, so
anything also carrying `.press` — the footer's Contact pill — would lose its
hover response. Do not convert it back.

Entrances are driven by `lib/useInView`, one observer per section, which fires
once and disconnects. Tall sections get an observer per block instead
(`Services` does this per track), or the rows at the bottom spend their
entrance while still off screen. Nothing above the fold uses `.reveal` — the
hero has its own authored moment and two entrances would fight.

The hero moment is implemented in `Hero.tsx` with GSAP and ScrollTrigger.
Entrance, scroll depth, and pointer parallax run on separate nested wrappers so
their transforms never overwrite one another. Desktop cards and platform tiles
move at different depth ratios on pointer movement and scrub away at different
rates on scroll. Motion is disabled through `prefers-reduced-motion`; the hero
then renders immediately in its complete static state.

**Content must never depend on the entrance running.** `useInView` starts in
the shown state when there is no `IntersectionObserver` or the visitor prefers
reduced motion, and `data-shown` is read only by `.reveal` and `.draw`.

The FAQ animates its own height via `::details-content` and
`interpolate-size`. It is inside an `@supports` block: browsers without it
keep the instant toggle, which is why the open state is not styled outside that
block.

## Accessibility (09)

WCAG AA is a brand requirement, not a nicety. Measured on the current hero:
display accent 3.39:1 at 84px (large-text threshold), body 5.9:1, primary button
18.8:1. Focus states are visible and never colour-only. Selection, caret,
scrollbar, and focus ring are all themed from the palette.

## Approved deviations from the PDF

Each was chosen by the client with the conflict named. None affects contrast.

| Deviation | PDF says | Reason |
|---|---|---|
| Hero display at 84px | Display 48–64 | Client preferred the larger scale |
| Instrument Serif italic accent | Single family (Inter) | Client preferred the serif accent line |
| Outfit in the hero | Inter throughout | Selected for the requested hero motion direction; the rest of the site remains Inter |
| Pill CTAs | 12px default radius | Client preferred the pill |
| Navy primary CTA | Blue for primary actions | Follows from the pill treatment; 18.8:1 |
| Coloured glow under the primary CTA | Avoid heavy glow effects | Client preferred it; kept subtle |

Logo on dark: the closing CTA sets the gradient mark on a white tile, per 05
("gradient version on white"). There is no mono-white asset yet — if one is
supplied, use it there instead.

## Placeholder inventory

Shape-accurate, fact-free. Replace before launch.

- `public/hero-bg.png` — **not yet supplied.**
- `public/platforms/*` — official Google Ads and Meta SVGs for the capability
  cards. None supplied yet; both are drawn approximations. (The hero's
  `PlatformTiles` no longer needs this: it moved to tech-stack marks, which
  are real Simple Icons assets already.)
- `src/lib/site.ts` — headline, subhead, CTA labels, availability note, email,
  nav, and socials. The `clients` array is no longer rendered. The footer tagline
  ("One partner for growth and build.") is placeholder in the same way. The guidelines suggest
  "Engineered momentum." as the brand line if the final positioning fits it.
- `src/pages/{About,Work}.tsx` — headings only, no content.
- `src/lib/site.ts`'s `phone` (all-zeros, obviously fake) and `availability`
  ("Remote-first · async across time zones") — added for the Contact page;
  see "Contact page" above.
- `MapPlaceholder.tsx` on the Contact page is an abstract, honestly-labelled
  stand-in — replace it with a real map only if a physical address is ever
  confirmed; see "Contact page" above.
- `src/pages/Services.tsx` — `TechStack` is mounted here because the page was
  empty. **The stack itself is unverified**: it is a public claim about what
  Akvega builds with, chosen to fit `lib/services.ts`, not confirmed with the
  client. Cut anything the studio does not actually use before launch, and move
  the component wherever it earns its place.
- `public/tech/aws.svg` — **not yet supplied.** See "AWS, and the other missing
  marks" above.
  The footer links services as `/services#<slug>`; those anchors do not exist
  yet — add the ids when that page is built out.
- `src/lib/services.ts` — all service blurbs, process copy and FAQ answers are
  written, not verified. The FAQ makes commercial claims (paid diagnostic, client
  owns repos and ad accounts, works alongside in-house teams) — confirm each
  before launch.
