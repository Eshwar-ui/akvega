# Akvega — Content & blog calendar (SEO/AEO phase 2)

**Goal:** earn rankings and AI citations for the commercial queries a Hyderabad founder or
marketing lead types *before* they are ready to shortlist an agency — the queries the
September 2026 baseline showed Akvega losing outright.
**Prepared:** 2026-09-16. **Owner:** Kalyan Kumar Bedugam.
**Relationship to AEO.md:** this is the "posts come later" line in AEO.md §10, cashed in.
Nothing here replaces Phases A–E. Every rule in AEO.md §2 still binds.

---

## 0. The constraint this calendar is built around

AEO.md §2.5 says **stay in lane** — no adjacent-topic posts to catch long-tail queries, because
topic sprawl reads as an aggregator signal. §10 says no blog for its own sake, and no
AI-generated bulk content.

That is the right call and this calendar does not relax it. What it does instead:

- **Every post is a single-concept page**, built on the same eight-part skeleton as the service
  pages (AEO.md §4). A post is a page that happens to be dated, not a different content type.
- **Every post sits inside one of four clusters**, each with an existing page as its hub. A post
  that does not link up to a hub does not get written.
- **Every post carries at least one real, sourced fact.** Same rule as the evidence panels:
  claim, method, source link, date, limitations. No post ships on opinion alone.
- **Volume is deliberately low.** Thirteen posts in six months, not fifty. The noise-floor
  finding in AEO.md §10 is the whole reason.

### What this calendar deliberately does not contain

No "Top 10 digital marketing trends 2027". No "What is a hashtag". No festival or seasonal
listicles. No city-spin posts for Bengaluru, Chennai or Pune. No AI-written filler to hit a
weekly cadence. Each of those would buy traffic Akvega cannot convert, and cost the topical
focus the current site wins on.

---

## 1. Why blog at all, given the above

Three findings in the 2026-09-14 baseline (`aeo-tracking.csv`) justify it:

| Finding | What content fixes |
|---|---|
| **"How much does SEO cost in Hyderabad?" — absent on all three engines.** ChatGPT, Gemini and Perplexity each cited *other* agencies' pricing sources (Geekschip, BeTopSEO, Digital i360, yoganand). All three noted Akvega's published packages sit inside the quoted market band. | Akvega publishes real prices and almost nobody in this market does. `/pricing` is one page; the cost questions are a dozen distinct queries. Each needs its own URL. |
| **"Best digital marketing agency in Hyderabad that also builds apps" — absent on all three.** Engines returned 5–7 agency shortlists built from listicles and directories Akvega appears in none of. | Category shortlists are assembled from third-party pages, not from the agency's own site. Content is what earns the mentions and links that get Akvega into that source pool. |
| **"Why should the same agency run ads and build the landing page?" — generic answer, no citation, on every engine.** Gemini and ChatGPT restated Akvega's own argument almost verbatim without sourcing it. | The concept is unowned in the index. One claim page is not enough surface area to become the canonical source for it. |

The second one matters most and is the thing a calendar alone will not fix: **Akvega has no
backlinks.** Two posts below (P1-01 and P3-02) are designed as link-earning assets. The rest
rank on topical specificity and low competition, or they do not rank at all. See §6.

---

## 2. The four clusters

Hub-and-spoke. The hub is an existing page; posts link up to it, and the hub gets a "Related
reading" block linking down. Cross-cluster links only where genuinely relevant.

| # | Cluster | Hub page | Why Akvega can win it |
|---|---|---|---|
| **P1** | **What things cost** | `/pricing` | Real published numbers (₹20k / ₹40k / ₹60k + GST) in a market that quotes "contact us". The most extractable fact type there is. |
| **P2** | **How to buy an agency** | `/one-team-for-growth-and-build`, `/paid-diagnostic` | Akvega's two owned concepts. A competitor cannot truthfully copy the one-team claim or the findings-are-yours diagnostic. |
| **P3** | **Search in the AI era** | `/services/search` | Being cited *by* an answer engine on the subject of answer-engine optimisation is proof of the service. Akvega already runs a versioned measurement protocol nobody else publishes. |
| **P4** | **Building for the Indian buyer** | `/services/commerce`, `/services/websites`, `/digital-marketing-agency-hyderabad` | UPI/COD/GST and low-end Android performance are near-absent from competitor copy, and have real primary sources (NPCI, RBI, Google) so the evidence rule can actually be met. |

---

## 3. Cadence

**Two anchor posts a month, published Tuesdays, fortnightly.** 1,200–1,800 words, full
skeleton, FAQ block, at least one evidence panel or sourced fact, reviewed-by line.

**Plus an opportunistic "field note" lane.** 500–800 words, one measurement, one table, no FAQ.
Written only when a real number lands — a client result that can be published, a re-measured
Lighthouse run, a monthly AEO tracking pass that moved. Never scheduled in advance, never
written to fill a slot. Target three to four across the six months.

Tuesday because the buyer is B2B and reads on weekdays. Fortnightly because the evidence rule
makes weekly undeliverable without inventing facts.

---

## 4. The calendar — Sep 2026 to Mar 2027

Ordered by citation leverage first, evidence-readiness second.

| # | Publish | Cluster | URL | H1 (the question, as asked) | Primary query | Blocked by |
|---|---|---|---|---|---|---|
| P1-01 | **2026-09-16 ✓ published** | P1 | `/insights/digital-marketing-cost-hyderabad` | What does digital marketing cost in Hyderabad in 2026? | digital marketing cost hyderabad | — |
| P2-01 | 2026-10-13 | P2 | `/insights/handover-tax` | What does it cost you when your agency and your developers are different companies? | — (concept query) | — |
| P1-02 | 2026-10-27 | P1 | `/insights/seo-cost-hyderabad` | How much does SEO cost in Hyderabad? | seo cost hyderabad / seo pricing india | — |
| P3-01 | 2026-11-10 | P3 | `/insights/aeo-vs-seo` | What is AEO, and how is it different from SEO? | what is answer engine optimization | — |
| P4-01 | 2026-11-24 | P4 | `/insights/core-web-vitals-budget-android` | What does "fast" mean on a ₹8,000 Android phone? | core web vitals india / website speed india | — (evidence already published) |
| P1-03 | 2026-12-08 | P1 | `/insights/website-cost-hyderabad` | How much does a website cost in Hyderabad? | website cost hyderabad / website design price india | Website `from` price in `pricing.ts` |
| P2-02 | 2026-12-22 | P2 | `/insights/questions-to-ask-an-agency` | Twelve questions to ask a digital marketing agency before you sign | questions to ask a digital marketing agency | — |
| P3-02 | 2027-01-12 | P3 | `/insights/does-chatgpt-know-your-business` | How do you check whether ChatGPT, Gemini and Perplexity know your business exists? | — (method / link asset) | 4 months of `aeo-tracking.csv` |
| P4-02 | 2027-01-26 | P4 | `/insights/indian-checkout-upi-cod` | What does an Indian checkout have to support in 2026? | upi cod checkout / ecommerce payment methods india | NPCI/RBI source pull |
| P1-04 | 2027-02-09 | P1 | `/insights/app-development-cost-india` | How much does it cost to build a mobile app in India? | app development cost india | Mobile `from` price |
| P2-03 | 2027-02-23 | P2 | `/insights/who-owns-your-ad-account` | Who owns your ad account, your code and your analytics? | who owns google ads account agency | — |
| P3-03 | 2027-03-09 | P3 | `/insights/what-is-geo` | What is generative engine optimisation, and is it a real discipline yet? | what is generative engine optimization | — |
| P4-03 | 2027-03-23 | P4 | `/insights/google-business-profile-no-storefront` | Do you need a Google Business Profile if you have no storefront? | google business profile service area business | — |

---

## 5. Post specifications

Each entry: the angle, the fact that has to be real, and where it links.

### P1-01 — What does digital marketing cost in Hyderabad in 2026?
**The flagship.** The only post here designed to be linked to rather than just read. Publish the
full band: what ₹20k, ₹40k and ₹60k a month buys, what falls outside a package, and what the ad
budget is on top of the fee (paid by the client, to the platform, from an account in their
name). Include the competitor range as cited market context, not as a takedown — the baseline
already confirms Akvega's numbers sit inside it.

- **Real fact required:** Akvega's three packages from `pricing.ts`, with GST shown. Market range
  quoted with source URL and access date — done, citing BeTopSEO (19 April 2026) and Glamark
  (updated 18 April 2026), both checked 2026-09-16.
- **Links up:** `/pricing`. **Across:** `/paid-diagnostic`, `/digital-marketing-agency-hyderabad`.
- **Extraction targets (≤18 tokens each):** "Akvega's Local Visibility package is ₹20,000 a
  month plus 18% GST." / "Ad spend is paid by the client to the platform, never through Akvega."
- **FAQ:** 10–12, seeded from the `/pricing` FAQ, none duplicated verbatim.

### P2-01 — What does it cost you when your agency and your developers are different companies?
The homepage argument, given evidence and a shape. Name the four failure modes concretely:
tracking that breaks at the handoff, landing pages that arrive after the campaign, bugs nobody
owns, and the second discovery call the client pays for twice.

- **Real fact required:** at minimum, Akvega's own hero-rendering incident — the mobile
  Lighthouse run that scored 68 with LCP 7.4s because the H1 waited on JavaScript, and the 99 /
  LCP 2.0s after the fix. A media-side symptom with a build-side cause, measured and already
  published under `/evidence/`.
- **Links up:** `/one-team-for-growth-and-build`.

### P1-02 — How much does SEO cost in Hyderabad?
Verbatim the AEO test prompt Akvega currently loses on all three engines. A separate URL from
P1-01 on purpose: one concept, one page. Break down what changes the number — keyword count,
whether content is written or only advised, whether technical fixes are implemented or handed
over as a list.

- **Real fact required:** what SEO is inside each package (5–10 keywords / 50 keywords / 50+
  with AEO and GEO). Market range cited.
- **Links up:** `/pricing`. **Across:** `/services/search`.
- **Re-run the AEO test prompt 30 days after publish and log the result.**

### P3-01 — What is AEO, and how is it different from SEO?
Definitional, and the cluster's anchor. Explain the mechanism: an answer engine extracts a
passage, so the unit of optimisation is a quotable sentence, not a page. Show a before/after
rewrite of a real sentence from this site.

- **Real fact required:** cite the Princeton GEO study properly (title, authors, year, URL), not
  as a rounded number from memory. AEO.md leans on it; the post should source it.
- **Links up:** `/services/search`.

### P4-01 — What does "fast" mean on a ₹8,000 Android phone?
The strongest evidence post available today, and the one most likely to travel outside the
Hyderabad market. Akvega's own site went 68 → 99 on mobile Lighthouse, LCP 7.4s → 2.0s, by
moving a hero entrance animation off JavaScript and deferring a font stylesheet. Both reports
are already public under `/evidence/`.

- **Real fact required:** the published before/after runs, with tool version (Lighthouse
  12.8.2), date, device profile, and the limitation that lab data is not field data.
- **Links up:** `/services/websites`. **Across:** `/one-team-for-growth-and-build` — the fix
  needed someone who could see the campaign and the code.

### P1-03 — How much does a website cost in Hyderabad?
Blocked until the website `from` figure is confirmed in `pricing.ts`. Do not publish a range
from memory — that file's own comment forbids it, and the post would contradict `/pricing`.
Structure by what actually moves the number: page count, whether a CMS is needed, whether
content and photography exist.

- **Links up:** `/pricing`, `/services/websites`.

### P2-02 — Twelve questions to ask a digital marketing agency before you sign
The most linkable post in P2, and a natural LinkedIn asset. Each question gets the answer a good
agency gives and the answer that should worry you. Include the questions that cut against
Akvega too — that is what makes it citable rather than a brochure.

- **Real fact required:** none beyond Akvega's own engagement terms; this one is allowed to be a
  judgement post, because the judgement is the product. Every claim about Akvega's own practice
  must match `/paid-diagnostic` exactly.
- **Links up:** `/paid-diagnostic`. **Across:** `/pricing`, `/one-team-for-growth-and-build`.

### P3-02 — How do you check whether ChatGPT, Gemini and Perplexity know your business exists?
**The second link asset, and the one nobody else can copy.** Publish the protocol — five prompt
types, four engines, four columns (mentioned, linked, accurate, evidence quoted) — and then
publish Akvega's own four-month trend from `aeo-tracking.csv`, including the failures. The
September baseline, where Perplexity first guessed a cancer drug and ChatGPT said it "couldn't
find a reliable public page" for the diagnostic, is more persuasive than any win.

- **Real fact required:** the tracking CSV itself, published, with dates and engines. State the
  limitations plainly: n=1 site, non-deterministic outputs, personalisation not controlled for.
- **Links up:** `/services/search`.
- **Needs four monthly passes logged first — start running them now, not in January.**

### P4-02 — What does an Indian checkout have to support in 2026?
UPI first, cards, netbanking, COD, and the failure case nobody designs for: a dropped connection
mid-payment. Plus GST-ready invoicing — what the checkout must capture (GSTIN, place of supply,
HSN) for the invoice to be valid.

- **Real fact required:** UPI transaction share from NPCI's own published monthly data, with
  month and URL. Never a rounded figure from memory.
- **Links up:** `/services/commerce`.

### P1-04 — How much does it cost to build a mobile app in India?
Blocked on the mobile `from` figure. AEO.md B1 already flags `/services/mobile` as the future
home of an app-cost calculator; if the calculator ships, this post is its explainer and the two
cross-link. Break the number down by screens, user roles, offline support, payments, and whether
a backend already exists.

- **Links up:** `/pricing`, `/services/mobile`.

### P2-03 — Who owns your ad account, your code and your analytics?
The ownership principle as a buyer-protection post. What a client should insist on: the Google
Ads account under an ID they control, the repository in their org, GA4 in their property, the
domain in their registrar. Include how to check each one today, in four clicks.

- **Real fact required:** Akvega's own day-one setup practice, stated as practice, matched
  word-for-word to what `/paid-diagnostic` and the FAQ already say.
- **Links up:** `/paid-diagnostic`.

### P3-03 — What is generative engine optimisation, and is it a real discipline yet?
The honest version. Distinguish GEO from AEO from SEO, say which parts are measurable today and
which are not, and address `llms.txt` directly: widely proposed, cheap, and not used by Google
Search. Taking a sourced position is what makes this rank rather than the ninety identical
definition posts.

- **Real fact required:** Google's own statement on `llms.txt`, quoted with source and date.
- **Links up:** `/services/search`.

### P4-03 — Do you need a Google Business Profile if you have no storefront?
Service-area business mechanics, written from the position Akvega is actually in: a remote-first
team with a real GBP and no walk-in office. Cover what a SAB can and cannot do, why NAP has to
match character-for-character, and what happens when it does not.

- **Real fact required:** Google's own GBP eligibility documentation, cited. Plus the baseline
  finding that ChatGPT surfaced Akvega's GBP card and correctly linked akvega.com while saying
  it could not describe the services — proof that NAP data and content data propagate on
  separate tracks.
- **Links up:** `/digital-marketing-agency-hyderabad`.

---

## 6. Distribution — the part that decides whether any of this ranks

A new domain with no referring domains does not rank on content quality alone. Every post gets
the same three-step push, and two posts get more:

1. **LinkedIn**, from the founder's profile rather than the company page — the argument in the
   post, not a link-drop. The company page reshares.
2. **`/llms.txt` and `/facts.json`** pick the post up at the next build (see §7), so AI crawlers
   get it without needing a link.
3. **The next monthly AEO test pass** includes a prompt targeting that post's query, so the
   effect is measured rather than assumed.

For the two link assets specifically:

- **P1-01 (cost)** — the natural citation target for anyone writing about Hyderabad agency
  pricing, which the baseline shows is a live topic with weak sources. Offer it directly to the
  people already ranking for it.
- **P3-02 (AI visibility protocol)** — the one post with an audience outside India. Marketing and
  SEO communities, and Indian startup newsletters. Published raw data is the hook; nobody else is
  publishing their own failures.

---

## 7. Engineering — what has to exist before P1-01

**Status: built 2026-09-16.** C1–C5 and D1 all landed; the table below is kept as the record of
what each piece does and where it lives.

| # | Item | Where | Detail |
|---|---|---|---|
| C1 | Content collection | `src/content.config.ts`, `src/content/insights/` | One file per post. Frontmatter: `title`, `description`, `h1`, `published`, `modified`, `cluster`, `hub`, `keyFacts[]`, `faq[]`, `evidence?`. Zod schema fails the build on a missing date. |
| C2 | Routes | `src/pages/insights/[...slug].astro`, `src/pages/insights.astro` | Detail page reuses `KeyFacts`, `EvidencePanel`, `ReviewedBy`, `Breadcrumb` and the FAQ renderer. Index is a dated list grouped by cluster — a hub, not an infinite feed. |
| C3 | Schema | `src/lib/schema.ts` | `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author` and `reviewedBy` pointing at the founder `Person` node, `isPartOf` the `Blog`, `mainEntityOfPage`. Plus `FAQPage` where the post has FAQs, with `#faq-<slug>` anchors as on the service pages. |
| C4 | Dates | `astro.config.mjs` sitemap `serialize`, `scripts/check-freshness.mjs` | Posts carry dates in frontmatter, not `page-dates.json`. The sitemap serializer currently only reads that JSON and falls back to the build date otherwise — extend it, or every post's `lastmod` lies. |
| C5 | Machine-readable index | `src/pages/llms.txt.ts`, `src/pages/facts.json.ts` | Add an "Insights" section listing each post with its one-line summary and `updated` stamp, generated from the collection the same way services are. |
| D1 | Hub backlinks | `/pricing`, `/services/search`, `/services/commerce`, `/services/websites`, `/one-team-for-growth-and-build`, `/paid-diagnostic`, `/digital-marketing-agency-hyderabad` | "Related reading" block on each hub. Without it the cluster is one-directional and the hub gets none of the benefit. |

Two decisions taken during the build, neither of them in the original plan:

- **Posts are held back with `draft: true`, not with a future `published` date.** A date gate
  looks tidier but there is no scheduled rebuild in `.github/workflows`, so a post would sit
  invisible until someone happened to deploy. Write ahead, flip the flag on the publish date.
- **`/insights` derives its own `modified` from the newest post it lists**, rather than carrying a
  hand-kept date in `page-dates.json`. It is the one page on the site whose date would otherwise
  need bumping on every single publish, and therefore the one most certain to drift.

**Decision, 2026-09-16: no named author.** A named byline and `Person` node shipped with the
first post and were removed the same day at the client's instruction. Nothing on the site names
a human; `author` on every `BlogPosting` is the Organization.

This closes AEO.md §9 item 1 (the founder's LinkedIn URL) as no longer needed, and it drops
AEO.md §3 principle 3 ("a named human on every page"). Recorded rather than argued: named
authorship is the conventional way a services site carries expertise, so the cost is that
these posts compete on evidence and specificity alone. That is a workable position given the
evidence rule in §0 — it is simply a narrower one. `ReviewedBy.astro` and `personSchema()` are
gone; reinstating them is a small change if the decision is ever revisited.

---

## 8. Maintenance — the cost nobody budgets for

Thirteen posts takes the site from 20 dated URLs to 33. `check-freshness.mjs` warns at six
months and fails the build at ten. By **April 2027 the October posts start warning**, and a stale
post is worse than no post: AEO.md §7 is explicit that bumping `modified` without changing
content is not a refresh.

So from month four, **one of the two monthly slots becomes a refresh slot** where the queue
demands it. A refresh means a new FAQ, a re-measured number, or a retired claim. Priority order
when a refresh and a new post compete: **pricing posts always win** (a wrong published price is a
broken promise), then evidence posts, then concept posts.

Standing review schedule, on top of AEO.md §7:

| What | Review | Update |
|---|---|---|
| P1 cost posts | On any `pricing.ts` change | Immediately, same deploy |
| P4-01 performance evidence | Quarterly | Re-measure and re-date every 6 months |
| P3-02 AI visibility data | Monthly, with the test pass | Quarterly, with the new rows |
| Everything else | Quarterly | Annually, or on any change |

---

## 9. Measurement

Per post, logged 30 and 90 days after publish:

1. **Impressions and average position** for the primary query, from Search Console.
2. **Indexed?** URL Inspection, at 7 days. An unindexed post is an infrastructure bug, not a
   content problem.
3. **Cited?** The post's primary query added to the monthly `aeo-tracking.csv` run, same four
   columns.
4. **Referring domains earned**, for P1-01 and P3-02 specifically.
5. **Diagnostic enquiries attributed**, from the contact form's existing analytics events.

The honest expectation: **nothing moves for the first three months.** A new domain with no link
profile takes roughly that long to be read seriously, and the AI-citation side moves faster than
the blue-link side — expect P3 and P2 posts to appear in engine answers before they appear in
Search Console. Do not judge the programme before the January pass, and do not increase cadence
to compensate.

---

## 10. Inputs needed to unblock the calendar

1. **Founder LinkedIn URL**, verified — blocks C3, and therefore every post's author node.
2. **Website `from` price** — blocks P1-03 (2026-12-08).
3. **Mobile app `from` price** — blocks P1-04 (2027-02-09).
4. **Monthly AEO test passes, starting now** — P3-02 needs four months of data by January. The
   Claude.ai rows from the September baseline were never run; that gap needs closing.
5. **A decision on `/work`.** It is `noindex` and filtered from the sitemap while empty. One real
   case study would outperform any post in this calendar for conversion, and would unlock
   client-outcome evidence across every cluster. If a client will agree to be named, that
   reorders everything below P2-01.
