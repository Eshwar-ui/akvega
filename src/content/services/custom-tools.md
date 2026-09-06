---
title: "Custom internal tools and automation | Akvega"
description: "Internal tools, integrations and automation for the problems off-the-shelf software won't solve — the work that removes a department of manual effort."
heading: "Custom tools for the problems software won't solve"
standfirst: "Internal tools, integrations and automation — the unglamorous work that quietly removes a department of manual effort."
reviewed: false
---

Every company past a certain size runs on a spreadsheet that should not exist. Someone exports a report on Monday, reconciles it against a second system, pastes the result into a third, and sends an email. It works, it is invisible in any budget, and it consumes a person permanently.

This is the least glamorous category of software and often the highest return, because the baseline is not a competitor's product — it is manual effort, and manual effort has a salary attached.

## Where this usually goes wrong

**Automating the process rather than the outcome.** The existing workflow gets encoded step for step, including the steps that only exist because two systems could not talk to each other. The result is a faster version of an unnecessary process.

**Built by whoever had capacity.** An internal tool grows out of one person's scripts, undocumented, running on their machine or their account, and becomes load-bearing before anyone notices. Then they leave.

**No failure design.** Integrations assume the other system responds. Real ones time out, rate-limit, return partial data and change without warning. A pipeline with no retry, no reconciliation and no alert fails silently — and silent failure in a data pipeline is worse than an outage, because the wrong numbers keep flowing.

**A platform where a script would do.** A full internal application, with auth and an admin panel, for something three people run twice a month.

**A script where a platform is needed.** The opposite failure: a critical process on an unversioned script with no audit trail, because it started small.

**No one to hand it to.** Software built without documentation or a maintenance path becomes a liability the moment the people who built it move on.

## How we run it

We start with where the time actually goes, which is usually not where the request says it is. The ask is often to automate a report; the finding is that the report exists because two systems disagree, and reconciling them removes the report entirely.

Then we size the solution honestly. Some problems are a scheduled script; some are an integration; some genuinely need an interface with permissions and an audit trail. Building the wrong size in either direction is the most common way this work wastes money.

Integrations are built for the failure cases — retries, idempotency, reconciliation and alerting — because an internal tool that fails quietly is worse than no tool at all.

Everything is built to be handed over: documented, in your repositories, on infrastructure in your accounts, with a maintenance path that does not require us.

## What you get

- **Internal tools** — interfaces for the work that needs one, with permissions and an audit trail.
- **API integrations** — built for the failure cases, not just the documented path.
- **Automation** — the recurring manual work, removed.
- **Data pipelines** — reconciled and monitored, so wrong numbers surface as alerts.

## The part most agencies cannot do

Much of this work sits exactly on the seam between marketing operations and engineering — a lead-routing rule, an attribution pipeline, a feed that has to satisfy both a shopping channel and a warehouse, a reporting layer nobody trusts. The marketing team knows what the output should be; the engineering team owns the systems; neither owns the problem.

We hold both ends. The team that understands what the campaign data needs to mean is the team that can build the pipeline producing it — so measurement problems get solved rather than escalated.

See [SEO, AEO and GEO](/services/seo) and [Google Ads](/services/google-ads) for where trustworthy data changes what the marketing work can do, and [Online stores](/services/online-stores) for commerce integrations.

## Who this is for

Custom work is worth it when the manual effort is recurring and measurable — hours per week, every week, that you can point at. One-off pain is rarely worth building for, and we will tell you when the honest answer is a better spreadsheet.

It suits problems where off-the-shelf software genuinely does not fit, not problems where the existing tool was never configured properly. The second case is common and much cheaper to fix.

It also needs an owner. Internal software without someone responsible for it becomes the thing everyone depends on and nobody maintains.

## How this starts

Every engagement opens with a paid diagnostic. For custom work that means mapping where the manual effort actually goes, which systems disagree and why, what should be automated versus removed, and a scoped plan with an estimate — including the honest answer where the right build is a small one.

You keep the audit whether or not you continue with us. Repositories, infrastructure and credentials are in your name from day one, with documentation written for whoever maintains it next.

[Start with a diagnostic](/contact) or see [everything we do](/services).
