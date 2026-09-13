# Akvega — Answer Engine Optimisation (AEO) plan

**Goal:** get akvega.com cited by ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews for
the questions a Hyderabad founder or marketing lead asks before hiring an agency.
**Prepared:** 2026-09-14. **Owner:** Kalyan Kumar Bedugam.
**Relationship to the SEO plan v2:** this extends it. Nothing here replaces the Phase 1 work
(entity data, schema, location page) already on the `seo/phase-1-hyderabad` branch.

Method: the Princeton GEO study as summarised in the `bencium-aeo` skill — the 18-token
extraction rule, single-topic pages, evidence over claims, visible freshness, and
authority-matched aggressiveness.

---

## 1. Where the site stands today

Akvega is a **challenger**: new domain, no reviews, no backlinks, no case studies. The study is
unambiguous for that position — optimise aggressively (5–7 extraction points per page, heavy
evidence, single-topic URLs, visible dates). Under-optimisation is the established-site
strategy and does not apply here.

One constraint the study does not have and Akvega does: **PRODUCT.md forbids fabricated
proof.** Every statistic, benchmark and citation in this plan has to be real or it does not
ship. That rules out the "67% fewer errors" style of evidence until real engagements produce
it, so the early evidence programme (section 5) is built on things the business can measure
about itself today.

### Scorecard (0–10 per dimension, per the skill's framework)

| Page | Extraction | Focus | Authority | Freshness | Total /40 | Note |
|---|---|---|---|---|---|---|
| `/` | 4 | 4 | 2 | 1 | 11 | Two genuinely quotable lines exist ("The team buying the traffic is the team shipping the page it arrives on."). Everything else is prose that needs context. Multi-topic by nature. |
| `/services` | 5 | 2 | 2 | 1 | 10 | Ten services on one URL — the single biggest structural gap. Good blurbs, but an LLM asked about Meta Ads in Hyderabad has no single page to cite. |
| `/about` | 4 | 6 | 2 | 1 | 13 | Clear single concept (how we work). No named human, no credentials. |
| `/digital-marketing-agency-hyderabad` | 5 | 7 | 2 | 1 | 15 | Best-structured page. FAQ exists but has 5 items, no anchors, no dates. |
| `/pricing` | 4 | 7 | 2 | 1 | 14 | Will jump once numbers are real — a price is the most extractable fact there is. |
| `/contact` | 3 | 8 | 2 | 1 | 14 | Fine. Not a citation target. |

**Authority is 2 everywhere** because no page names a person with credentials. The founder
exists only inside the JSON-LD. **Freshness is 1 everywhere** because no page carries a date,
visible or machine-readable. Those two columns are the cheapest to fix and the plan starts
with them.

Quick test, five questions: extraction **No**, focus **No** (services), authority **No**,
freshness **No**, citations **No**. 0/5 → critical.

---

## 2. Principles specific to this site

1. **Real or nothing.** A fact with no source and no date does not go into a key-facts block,
   an evidence panel or a FAQ answer. "Quoted from the diagnostic" stays until the price is real.
2. **One concept, one URL.** The anchor-per-service model on `/services` was right for a
   five-page site. For AEO each service becomes its own page and `/services` becomes the hub.
3. **A named human on every page.** Attribution format, one clean line:
   `Reviewed by Kalyan Kumar Bedugam, Founder, Akvega — <date>`. Institution-shadow rule:
   name first, credentials, then organisation.
4. **Dates are data.** Every page gets a visible "Last updated" line and a matching
   `dateModified` in schema, from one source of truth. Nothing is "evergreen".
5. **Stay in lane.** Growth marketing and digital build for Indian SMBs and funded startups.
   No adjacent-topic blog posts to catch long-tail queries — the study treats sprawl as an
   aggregator signal.
6. **Voice survives.** Extraction-ready sentences are declarative, ≤ 18 tokens, no pronouns
   needing context. That is already the brand voice ("direct not abrupt"). No keyword stuffing,
   no hedging, no listicles.

---

## 3. Phase A — Infrastructure (engineering, ~1 day)

Everything below is generic plumbing that every later page uses. Build it once.

| # | Item | Where | Detail |
|---|---|---|---|
| A1 | Page dates | `src/lib/dates.ts`, `Base.astro` | One map `{ path: { published, modified } }`. Base renders `<p class="meta">Last updated: YYYY-MM-DD</p>` under each page's hero and emits `datePublished` / `dateModified` on a per-page `WebPage` node. Build fails if a page has no entry. |
| A2 | Dated FAQs | `lib/services.ts`, `lib/pricing.ts`, location page, `schema.ts` | FAQ item shape becomes `{ slug, q, a, published, modified }`. `faqSchema()` emits `datePublished` / `dateModified` per question. Every FAQ renderer sets `id="faq-<slug>"` so answers have persistent anchors. |
| A3 | Attribution | `components/ReviewedBy.astro`, `schema.ts` | One line under the hero: name, credentials, org, date. Schema: `Person` node with verified `sameAs` (needs the founder's LinkedIn URL — currently unverified, so absent), referenced as `author` and `reviewedBy` on the `WebPage`. |
| A4 | Key-facts block | `components/KeyFacts.astro` | A `<ul>` of 5–7 declarative sentences ≤ 18 tokens, directly under the H1. This is the "cover page with tidbits" pattern — the part an LLM quotes. Human copy continues below it. |
| A5 | Evidence panel | `components/EvidencePanel.astro` | `<aside>` with a `<dl>`: claim, methodology, source (link), date, limitations, contact. Used only where section 5 has real data. |
| A6 | Machine-readable facts | `src/pages/facts.json.ts` | Astro endpoint serving `{ page, version, lastUpdated, facts[] }` built from `site.ts`, `services.ts`, `pricing.ts` and the dates map. Agents can fetch it directly. |
| A7 | `llms.txt` | `public/llms.txt` | Plain-text index: one line on what Akvega is, then each single-topic page with a one-sentence summary and URL. Cheap, widely read by AI crawlers. |
| A8 | Freshness guard | `scripts/check-freshness.mjs` | Runs with the build. Warns on any page whose `modified` is older than 6 months, fails at 10 (the citation cliff in the study). |
| A9 | Crawler access | `public/robots.txt` | Keep `Allow: /` for all agents. Do **not** block GPTBot, ClaudeBot, PerplexityBot or Google-Extended. Add a comment saying so, so nobody "hardens" it later. |

Rich Results Test validation after A1–A3 land.

---

## 4. Phase B — Single-topic pages (content + engineering, ~2 days per batch)

The structural fix. Each page below is one concept on its own URL, with the same skeleton:

1. H1 as the question a buyer asks.
2. 50-word overview, dated (what it is, scope, why it matters).
3. Key-facts block (A4), 5–7 sentences.
4. What is included / how it runs (from `services.ts`, expanded).
5. Evidence panel(s) where real data exists (A5).
6. FAQ, 10–15 questions, 30–50-word answers, anchored and dated (A2).
7. Related pages and the diagnostic CTA.
8. Reviewed-by line (A3).

### B1 — Service pages (`/services/<slug>`)

`/services` stays as the hub and links out. `ItemList` URLs and the footer directory switch
from `#slug` anchors to the new paths. Priority order, by citation opportunity:

| Order | Page | Why first |
|---|---|---|
| 1 | `/services/seo-aeo-geo` | Core expertise, and being cited by an answer engine about answer-engine optimisation is proof in itself. |
| 2 | `/services/google-ads` | Highest commercial intent in Hyderabad queries ("Google Ads agency Hyderabad", "PPC cost"). |
| 3 | `/services/websites` | Pairs with the Hyderabad page's "web development company" secondary keyword. |
| 4 | `/services/mobile-apps` | "App development company Hyderabad" is a plan keyword; also the future home of the app-cost calculator. |
| 5 | `/services/online-stores` | UPI / COD / GST content is specific to India and rare in competitor copy. |
| 6–10 | `meta-ads`, `social-media`, `branding`, `product-design`, `custom-tools` | Complete the set. |

### B2 — Claim pages (Akvega's own concepts)

The study's strongest finding: a page that is the unique answer to one question gets cited
about 4× more than a multi-topic page. Akvega has two concepts nobody else in the market owns.

| Page | Concept | Working H1 |
|---|---|---|
| `/one-team-for-growth-and-build` | The handover tax between an agency and a dev shop, and why one team removes it. Already the homepage's argument; give it a URL. | "Why should the team running your ads also build your landing page?" |
| `/paid-diagnostic` | The engagement model: paid audit first, findings yours, quote from the scope, everything in your name. | "What is a paid diagnostic, and why do we start every engagement with one?" |

### B3 — Local pages

`/digital-marketing-agency-hyderabad` already follows the skeleton loosely. Bring it to spec:
expand the FAQ to 10–12, add the key-facts block, the reviewed-by line and dates. Do **not**
spin up other city pages — Hyderabad is the base; a Bengaluru page with no local content is
exactly the doorway pattern both Google and the domain-mismatch finding punish.

---

## 5. Phase C — Evidence programme (ongoing, starts week 1)

What Akvega can cite honestly today, and where each item lands.

| Evidence | Method | Lands on |
|---|---|---|
| **akvega.com's own performance** — Core Web Vitals, Lighthouse, page weight, time to first byte | Measured with PageSpeed Insights and WebPageTest on a stated date, results published with the run URLs | `/services/websites` evidence panel; a key fact on `/` |
| **The diagnostic's scope** — what is audited, how many checks, turnaround in working days | Documented from the actual checklist once the user confirms it | `/paid-diagnostic` |
| **Pricing** | From `lib/pricing.ts` once real | `/pricing` and `facts.json` — a price is the most extractable fact on the site |
| **Market and platform facts** — local-pack mechanics, language mix in Hyderabad search, UPI share of Indian online payments | Cite the primary source with a URL and date (Google's own documentation, NPCI / RBI data, published surveys). Never a rounded number from memory. | Hyderabad page and `/services/online-stores` |
| **Client outcomes** | Anonymised if needed, with methodology, date range and limitations | Case studies on `/work`, then quoted on service pages |

Rule for every panel: claim, method, source link, date, limitations, contact email. A panel
missing any one of those does not ship.

---

## 6. Phase D — Rewrite existing copy for extraction (content, ~1 day)

Not a rewrite of the voice; a pass that adds quotable sentences and removes context dependence.

- **Homepage:** key-facts block under the hero with 5–7 lines, for example
  "Akvega is a Hyderabad growth marketing and digital build team founded by Kalyan Kumar Bedugam."
  "Every Akvega engagement starts with a paid diagnostic whose findings the client keeps."
  "Akvega sets up repositories, ad accounts and analytics in the client's name from day one."
  Each is a complete, checkable statement under 18 tokens.
- **FAQ expansion:** homepage from 5 to 12–15 questions. Source them from real enquiries,
  not guesses; the Hyderabad and pricing FAQs are the seed list.
- **Answer length:** audit every answer to 30–50 words, direct answer first. Several current
  answers run to 55+ words with the answer in the second sentence.
- **Pronouns:** replace "it", "this", "we" at sentence starts with "Akvega" or the service
  name where the sentence is meant to be quotable. Leave human prose alone elsewhere.
- **Hedging:** none exists today. Keep it that way — the pricing FAQ is the place to watch.

---

## 7. Phase E — Cadence and testing (ongoing)

**Refresh schedule**

| What | Review | Update |
|---|---|---|
| Homepage, service pages, FAQs | Monthly | Quarterly minimum, and on any change |
| Evidence panels | — | Every 6 months, re-measured and re-dated |
| Pricing | On any change | Immediately |
| `facts.json`, `llms.txt` | Generated at build | Every deploy |

Bumping a `modified` date without changing content is not a refresh. Add a new FAQ, a
re-measured number or a retired claim each time.

**Testing protocol** — monthly, same prompts, in ChatGPT, Claude, Gemini and Perplexity:

1. Recognition: "What is Akvega?"
2. Category: "Best digital marketing agency in Hyderabad that also builds apps"
3. Comparison: "Compare Akvega with AK Digital Marketing Solutions"
4. Cost: "How much does SEO cost in Hyderabad?"
5. Concept: "Why should the same agency run ads and build the landing page?"

Track four columns per prompt: mentioned, linked, accurate, evidence quoted. Keep the sheet in
the repo as `aeo-tracking.csv` so the trend is versioned.

---

## 8. Sequencing and effort

| Order | Work | Effort | Blocked by |
|---|---|---|---|
| 1 | Phase A infrastructure (A1–A9) | 1 day | Founder LinkedIn URL for A3 |
| 2 | Homepage extraction pass + FAQ expansion (Phase D) | 1 day | — |
| 3 | `/paid-diagnostic` and `/one-team-for-growth-and-build` claim pages | 1 day | Diagnostic scope confirmed |
| 4 | Service pages 1–5 | 2 days | — |
| 5 | Website performance evidence panel | 2 h | Nothing — measure the live site |
| 6 | Hyderabad page to spec (B3) | 3 h | — |
| 7 | Service pages 6–10 | 2 days | — |
| 8 | Pricing goes live, `facts.json` carries it | 1 h | Real prices |
| 9 | First test-protocol run, baseline recorded | 1 h | Items 1–4 deployed |

Items 1, 2 and 5 can start now with no inputs. Item 3 needs the diagnostic checklist. Item 8
needs the numbers already requested for the pricing page.

---

## 9. Inputs needed from Kalyan

1. **Founder LinkedIn URL**, verified, for the `Person` node and the reviewed-by line.
2. **Credentials line**, true and specific: years in the field, any platform certifications
   (Google Ads, Meta Blueprint, GA4), notable prior work that can be named.
3. **Diagnostic checklist**: what is actually audited, how long it takes, what the client
   receives. This becomes the `/paid-diagnostic` page and the first evidence panel.
4. **Real prices** for `lib/pricing.ts` (already requested).
5. **Approval to change service URLs** from `/services#slug` to `/services/slug`. The hub page
   stays; only the footer and schema links move.

---

## 10. What this plan deliberately does not do

- No aggregate ratings, review counts or client logos until they exist.
- No city pages beyond Hyderabad.
- No blog for its own sake. Posts come later and only as single-concept pages that fit the lane.
- No AI-generated bulk content. The study's noise-floor finding is the reason a five-page site
  with real facts can outrank a fifty-page one without them.
