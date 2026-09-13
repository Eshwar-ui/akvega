import type { ServicePage } from './types'

export const custom: ServicePage = {
  slug: 'custom',
  title: 'Custom Tools and Automation in Hyderabad | Akvega',
  description:
    'Akvega builds internal tools, API integrations, automation and data pipelines for the process you run, on Node.js, PostgreSQL and React.',
  h1: 'What are custom tools from Akvega, and when do you need one?',
  overview:
    'Akvega’s custom tools are the internal dashboards, API integrations, automations and data pipelines that off-the-shelf software will not bend to the process you actually run. Built in short visible cycles on Node.js, PostgreSQL and React, wired into the systems you already use, documented and handed over in your own accounts, so a department of manual effort quietly disappears.',
  keyFacts: [
    'Akvega builds internal tools, API integrations, automation and data pipelines for problems packaged software does not solve.',
    'An Akvega custom tool is built around the process a business already runs, not the reverse.',
    'Akvega builds custom tools on Node.js, PostgreSQL, Prisma and React, deployed with Docker and GitHub Actions.',
    'Every Akvega custom tool ships in short visible cycles, with working software at the end of each.',
    'Every Akvega custom tools engagement starts with a paid diagnostic returned within 1 to 2 working days.',
    'Akvega clients own the repositories, infrastructure accounts and data of every custom tool from day one.',
    'Akvega documents every custom tool so another engineer can maintain it without Akvega.',
  ],
  included: [
    {
      title: 'Discovery and data model',
      body: 'How the work actually flows today, who touches it, and where it breaks. Written down as a data model and a scope before a line of code, so the tool fits the process rather than the other way round.',
    },
    {
      title: 'Internal tools and dashboards',
      body: 'Admin panels, operations dashboards and approval flows in React and TypeScript, with the roles and permissions your team actually has.',
    },
    {
      title: 'API integrations',
      body: 'The systems you already run, connected: accounting, CRM, payments through Stripe, transactional email through Resend, and whatever else has an API.',
    },
    {
      title: 'Automation and data pipelines',
      body: 'Scheduled jobs, queues on Redis and pipelines into PostgreSQL that replace the spreadsheet someone updates by hand every Monday.',
    },
    {
      title: 'Documentation and handover',
      body: 'A README that says how to run it, deploy it and change it, plus GitHub Actions and Docker so deployment is a push, not a person. Built to be maintained without Akvega.',
    },
  ],
  howItRuns: [
    {
      title: 'Diagnose',
      body: 'A paid diagnostic of the process, the systems it touches and the accounts around it, returned within 1 to 2 working days with a fixed quote.',
    },
    {
      title: 'Model',
      body: 'The data model and integration map agreed with the people who do the work today, with the trade-offs written down rather than discovered later.',
    },
    {
      title: 'Build in cycles',
      body: 'Working software at the end of each short cycle, deployed somewhere you can log in. Progress you can check on a Tuesday.',
    },
    {
      title: 'Hand over',
      body: 'Documentation, deployment pipeline and every account in your name. Akvega stays on for changes if you want, and is not needed if you do not.',
    },
  ],
  faqs: [
    {
      slug: 'what-are-custom-tools',
      q: 'What does Akvega mean by custom tools?',
      a: 'Custom tools are software built for one business’s process: internal dashboards, admin panels, API integrations between systems, automations and data pipelines. Akvega builds them when packaged software will not bend to how the work actually runs, and the cost of the workaround is a person doing it by hand.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'build-or-buy',
      q: 'When should we build a custom tool instead of buying software?',
      a: 'Build when the process is your advantage and packaged software makes you change it, or when several tools and a spreadsheet are being joined by hand. Buy when the need is generic. Akvega says which in the diagnostic, and will recommend buying when that is the honest answer.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'custom-tool-cost',
      q: 'How much does a custom tool cost with Akvega?',
      a: 'Custom tools are quoted from the diagnostic; there is no list price because no two processes are alike. What moves the number: the number of integrations, user roles and permissions, and data volume and reporting. The quote is fixed for a defined scope.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'how-custom-starts',
      q: 'How does a custom tools project with Akvega start?',
      a: 'With a paid diagnostic. Akvega maps the process, the systems it touches and the manual work in between, audits your website, Google Business Profile, design and social accounts, and returns everything within 1 to 2 working days with the cost of each item. The findings are yours to keep.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'custom-tech-stack',
      q: 'What technology does Akvega build custom tools with?',
      a: 'Node.js and TypeScript on the server, PostgreSQL through Prisma or Supabase for data, Redis for queues and caching, and React or Next.js for the interface. Deployment runs through Docker and GitHub Actions to Vercel, Cloudflare or your own infrastructure. The smallest proven combination for the job, chosen per project.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'integrations',
      q: 'Can you integrate with the software we already use?',
      a: 'Yes, if it has an API, and most business software does. Akvega connects accounting, CRM, inventory, payments through Stripe, email through Resend and messaging platforms, and syncs the data both ways where the process needs it. The integration count is one of the things that moves the quote.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'automation',
      q: 'What kind of manual work can Akvega automate?',
      a: 'Anything repeated on a schedule or triggered by an event: the report someone compiles every Monday, the order that gets re-keyed into accounting, the follow-up email sent by hand, the spreadsheet that reconciles two systems. Akvega builds the job, the queue and the alert that fires when it fails.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'who-maintains',
      q: 'Who maintains the tool after Akvega hands it over?',
      a: 'Whoever you choose. Every Akvega custom tool ships with documentation, a deployment pipeline on GitHub Actions and a Docker setup, so your own engineer or another vendor can run and change it. Akvega offers ongoing maintenance in short cycles, and it is an option, not a dependency.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'custom-ownership',
      q: 'Who owns the code and data in a custom tool?',
      a: 'You do, from day one. Repositories, hosting, database and every third-party account are created in your name, not Akvega’s, and the data never sits anywhere you cannot export. If you move the tool to another team, nothing has to be handed back because nothing was ever held.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'custom-tools-hyderabad',
      q: 'Do you build custom software for businesses in Hyderabad?',
      a: 'Yes. Akvega is based in Hyderabad, Telangana, and builds custom tools for businesses across Hyderabad, wider India and the US. Discovery can happen on your floor, watching the process run, in English, Telugu or Hindi, which is where the real workflow tends to differ from the documented one.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'visible-progress',
      q: 'How do we know the build is on track?',
      a: 'Because you can log in and use it. Akvega ships in short visible cycles with working software deployed at the end of each, so progress is something you check on a Tuesday rather than read about in a status report. Scope changes are priced as they arise.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
    {
      slug: 'data-pipelines-reporting',
      q: 'Can you build reporting and dashboards from our data?',
      a: 'Yes. Akvega builds pipelines that pull from the systems you run into a PostgreSQL warehouse in your account, then dashboards on top that answer the questions your team actually asks. Data volume and reporting scope are part of what moves the quote, so they are agreed in the diagnostic.',
      published: '2026-09-14',
      modified: '2026-09-14',
    },
  ],
  related: ['websites', 'commerce', 'mobile'],
}
