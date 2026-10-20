import {
  BrainCircuit,
  Building2,
  Code2,
  Cpu,
  Database,
  HardHat,
  Hammer,
  Handshake,
  KeyRound,
  Landmark,
  LandPlot,
  Megaphone,
  Radar,
  Construction,
  Workflow,
  House,
} from 'lucide-react';

/**
 * Single source of truth for the services-led marketing site.
 * Services = what we build. Solutions = who we build it for.
 */

export const BRAND = {
  promise: 'The data, AI, and growth team behind modern real estate operators.',
  oneLiner:
    'FreshLien is a services company for real estate. We build the data pipelines, AI models, CRM systems, and outreach campaigns that teams usually stitch together from six different vendors, and we hand you the keys.',
};

/** Capabilities that real estate teams usually buy as separate SaaS subscriptions. */
export const CATEGORIES_WE_COVER = [
  { label: 'Parcel & property data', note: 'Parcels, owners, deeds, mortgages, liens' },
  { label: 'Zoning & land use', note: 'Codes, overlays, setbacks, buildable envelope' },
  { label: 'Permits & construction', note: 'Permit feeds, contractors, project signals' },
  { label: 'Deal marketplaces', note: 'On- and off-market sourcing, comps, alerts' },
  { label: 'Predictive AI', note: 'Seller propensity, valuations, document AI' },
  { label: 'CRM & campaigns', note: 'Pipelines, automation, buyer and investor outreach' },
];

export const SERVICES = [
  {
    slug: 'property-data-engineering',
    name: 'Property Data Engineering',
    short: 'County records, parcels, and ownership data, cleaned and delivered where you work.',
    icon: Database,
    category: 'Data',
    headline: 'Your own property data layer, built to your markets.',
    description:
      'We source, clean, and join county records, parcel files, deeds, mortgages, liens, foreclosure and probate filings into one reliable dataset. It refreshes on a schedule and lands in your warehouse, CRM, or app.',
    deliverables: [
      'Scrapers and connectors for county, court, and assessor sources',
      'Parcel and owner normalization with entity resolution (LLCs, trusts, estates)',
      'Address standardization, geocoding, and APN matching',
      'Scheduled pipelines with monitoring and freshness alerts',
      'Delivery to Postgres, Snowflake, BigQuery, S3, or your CRM',
      'Data dictionary and documentation your team can maintain',
    ],
    useCases: [
      'Daily pre-foreclosure, lis pendens, and probate lead feeds',
      'Portfolio and owner lookups across thousands of parcels',
      'Absentee owner, tired landlord, and equity-based lists',
      'A single source of truth for acquisitions and underwriting',
    ],
    stack: ['Python', 'dbt', 'Airflow', 'Postgres', 'Snowflake', 'BigQuery', 'PostGIS'],
    timeline: '3–8 weeks',
  },
  {
    slug: 'zoning-land-use',
    name: 'Zoning & Land-Use Intelligence',
    short: 'Zoning codes turned into structured, searchable rules and feasibility answers.',
    icon: LandPlot,
    category: 'Data',
    headline: 'Know what can be built before you make the offer.',
    description:
      'We digitize zoning ordinances and overlay maps into structured data: permitted uses, setbacks, height, FAR, lot coverage, and parking. Then we build the tools that answer "what can I build here?" in seconds.',
    deliverables: [
      'Zoning district and overlay mapping joined to parcels',
      'Ordinance extraction into structured rules (uses, dimensional standards)',
      'Buildable envelope and unit-count estimates',
      'ADU, lot split, and rezoning opportunity screens',
      'Feasibility reports your team can generate on demand',
      'Change tracking when municipalities amend their codes',
    ],
    useCases: [
      'Land acquisition screening across a metro',
      'Highest-and-best-use analysis for brokers',
      'Entitlement risk checks before underwriting',
      'Finding parcels that are under-built for their zoning',
    ],
    stack: ['PostGIS', 'Mapbox', 'ArcGIS', 'LLM extraction', 'Python'],
    timeline: '4–10 weeks',
  },
  {
    slug: 'permit-construction-intelligence',
    name: 'Permit & Construction Intelligence',
    short: 'Building permit feeds that reveal projects, contractors, and property changes early.',
    icon: HardHat,
    category: 'Data',
    headline: 'See every project in your market as soon as it is permitted.',
    description:
      'We collect and standardize building permit data from city and county portals, classify work types, and connect permits to parcels and contractors. You get a live signal of who is building what, where.',
    deliverables: [
      'Permit ingestion from municipal portals and open-data feeds',
      'Work-type classification (roofing, solar, ADU, new build, remodel)',
      'Contractor profiles with project history and activity',
      'Permit-to-parcel matching with owner and valuation context',
      'Alerts for new permits that match your criteria',
      'Market dashboards for construction activity trends',
    ],
    useCases: [
      'Lead feeds for roofing, solar, HVAC, and pool companies',
      'Tracking new construction pipelines for lenders and suppliers',
      'Spotting renovation-heavy neighborhoods for investors',
      'Contractor sourcing and vetting for developers',
    ],
    stack: ['Python', 'Postgres', 'NLP classification', 'Mapbox'],
    timeline: '3–8 weeks',
  },
  {
    slug: 'deal-sourcing-market-intelligence',
    name: 'Deal Sourcing & Market Intelligence',
    short: 'Off-market and on-market deal flow, comps, and market dashboards in one place.',
    icon: Radar,
    category: 'Data',
    headline: 'More of the right deals, before everyone else sees them.',
    description:
      'We aggregate listings, distressed signals, and off-market indicators into one deal feed, scored against your buy box. Add comps, rent data, and market dashboards, and your team spends time on deals instead of tabs.',
    deliverables: [
      'Listing and auction aggregation across your target markets',
      'Distressed and off-market signal stacking (tax, code, vacancy, liens)',
      'Buy-box scoring and daily deal digests',
      'Comps and rent estimate tooling',
      'Submarket dashboards (pricing, absorption, inventory)',
      'Alerts to email, Slack, or your CRM',
    ],
    useCases: [
      'Daily deal digests for acquisition teams',
      'CRE deal screening by asset class and cap rate',
      'Wholesaler list stacking across signals',
      'Investment committee market reports',
    ],
    stack: ['Python', 'Postgres', 'Looker Studio', 'Power BI', 'Slack'],
    timeline: '3–6 weeks',
  },
  {
    slug: 'ai-predictive-analytics',
    name: 'AI & Predictive Analytics',
    short: 'Seller propensity, valuation models, document AI, and assistants trained on your data.',
    icon: BrainCircuit,
    category: 'AI',
    headline: 'Put AI to work on the parts of the deal that cost you hours.',
    description:
      'We build models and AI workflows that are grounded in your data: who is likely to sell, what a property is worth, what a document says, and what to do next. Practical AI, measured against outcomes you care about.',
    deliverables: [
      'Seller and buyer propensity scoring models',
      'Automated valuation and rent estimate models',
      'Document AI for leases, deeds, title, and offering memos',
      'AI assistants that answer questions over your deals and data',
      'Lead prioritization inside your CRM',
      'Evaluation reports so you can see what the model gets right',
    ],
    useCases: [
      'Ranking a 50,000-owner list down to the 2,000 worth calling',
      'Abstracting hundreds of leases in an acquisition',
      'Instant first-pass underwriting from an OM',
      'An internal assistant for agents and analysts',
    ],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'Claude', 'OpenAI', 'pgvector'],
    timeline: '4–10 weeks',
  },
  {
    slug: 'crm-workflow-automation',
    name: 'CRM & Workflow Automation',
    short: 'CRM builds, migrations, lead routing, and automations that remove manual work.',
    icon: Workflow,
    category: 'Automation',
    headline: 'A CRM your team actually uses, wired to everything else.',
    description:
      'We design, build, or rebuild your CRM around how your team really works. Then we connect your data, lead sources, skip tracing, dialers, and inboxes so leads route themselves and nothing falls through.',
    deliverables: [
      'CRM setup, cleanup, or migration (HubSpot, Salesforce, Follow Up Boss, GoHighLevel, Podio)',
      'Pipeline and deal stage design for acquisitions and dispositions',
      'Lead routing, enrichment, and de-duplication',
      'Skip trace, dialer, and SMS integrations',
      'Automations in Zapier, Make, n8n, or custom code',
      'Team training and written playbooks',
    ],
    useCases: [
      'Moving off spreadsheets into a real pipeline',
      'Consolidating three CRMs after a merger',
      'Auto-assigning leads by market, source, and score',
      'Syncing deals to accounting, docs, and e-sign',
    ],
    stack: ['HubSpot', 'Salesforce', 'Follow Up Boss', 'GoHighLevel', 'Podio', 'n8n', 'Zapier'],
    timeline: '2–6 weeks',
  },
  {
    slug: 'campaigns-outreach',
    name: 'Campaigns & Outreach',
    short: 'Buyer, investor, and seller outreach across email, SMS, and direct mail.',
    icon: Megaphone,
    category: 'Growth',
    headline: 'Put your deal in front of the people who can close it.',
    description:
      'We build targeted audiences of buyers, investors, owners, and partners, then run multi-channel campaigns with messaging written for each segment. You get replies in your inbox and a clear view of what is working.',
    deliverables: [
      'Audience building by asset type, location, and ticket size',
      'Email, SMS, and direct mail campaign setup',
      'Domain, inbox, and deliverability configuration',
      'Segment-specific copy and follow-up sequences',
      'Reply handling workflows and CRM sync',
      'Campaign reporting: sends, replies, interested contacts',
    ],
    useCases: [
      'Finding buyers for a listing or portfolio',
      'Raising LP capital for a development',
      'Seller outreach to motivated owner lists',
      'Re-engaging a dormant database',
    ],
    stack: ['Resend', 'Twilio', 'Instantly', 'Lob', 'HubSpot'],
    timeline: '1–4 weeks to first send',
  },
  {
    slug: 'custom-software-dashboards',
    name: 'Custom Software & Dashboards',
    short: 'Internal tools, map apps, investor portals, and APIs built for your workflow.',
    icon: Code2,
    category: 'Software',
    headline: 'Software built around your process, not the other way round.',
    description:
      'When off-the-shelf tools do not fit, we build the product. Map-based research tools, underwriting apps, investor portals, internal dashboards, and APIs, designed with your team and shipped in weekly increments.',
    deliverables: [
      'Product scoping and UX design with your team',
      'Web apps with maps, search, and filters',
      'Investor and client portals',
      'BI dashboards for operations and leadership',
      'Public or internal APIs over your data',
      'Hosting, security, and handoff documentation',
    ],
    useCases: [
      'An internal property research map for analysts',
      'An investor portal with deal rooms and reporting',
      'An underwriting tool that pulls data automatically',
      'Launching a data product of your own',
    ],
    stack: ['React', 'Node.js', 'Postgres', 'Supabase', 'Mapbox', 'Vercel', 'Retool'],
    timeline: '4–12 weeks',
  },
];

export const SOLUTIONS = [
  {
    slug: 'investors-wholesalers',
    name: 'Investors & Wholesalers',
    short: 'Off-market lead engines, list stacking, and follow-up that converts.',
    icon: KeyRound,
    headline: 'A lead engine that finds motivated sellers before the competition.',
    pains: [
      'Paying for lists everyone else in your market already has',
      'Hours lost cleaning, de-duping, and skip tracing CSVs',
      'Leads going cold because follow-up is manual',
    ],
    builds: [
      'Daily distressed-property feeds from county and court records',
      'Signal stacking and seller propensity scores',
      'CRM pipelines with automated SMS, email, and call tasks',
      'Disposition lists of active cash buyers',
    ],
    services: ['property-data-engineering', 'ai-predictive-analytics', 'crm-workflow-automation', 'campaigns-outreach'],
  },
  {
    slug: 'brokerages-agents',
    name: 'Brokerages & Agent Teams',
    short: 'Listing lead generation, CRM operations, and AI that saves agents time.',
    icon: Handshake,
    headline: 'Give every agent better leads and less admin.',
    pains: [
      'Agents working from different tools and spreadsheets',
      'No visibility into which lead sources actually close',
      'Marketing that does not reach likely sellers',
    ],
    builds: [
      'Likely-to-list models for farm areas and sphere',
      'CRM rollout with routing, nurture, and reporting',
      'Buyer outreach campaigns for new listings',
      'Agent assistants for CMAs, listing copy, and follow-up',
    ],
    services: ['crm-workflow-automation', 'ai-predictive-analytics', 'campaigns-outreach', 'custom-software-dashboards'],
  },
  {
    slug: 'commercial-real-estate',
    name: 'Commercial Real Estate',
    short: 'Deal screening, owner research, document AI, and investor outreach for CRE.',
    icon: Building2,
    headline: 'Screen more deals and reach the right capital faster.',
    pains: [
      'Analysts copying numbers out of offering memos by hand',
      'Owner research that dead-ends at an LLC',
      'Buyer and investor lists that are stale or generic',
    ],
    builds: [
      'Deal feeds scored against your buy box',
      'LLC and ownership unmasking across portfolios',
      'Lease abstraction and OM extraction with AI',
      'Buyer and LP outreach campaigns with reply tracking',
    ],
    services: ['deal-sourcing-market-intelligence', 'property-data-engineering', 'ai-predictive-analytics', 'campaigns-outreach'],
  },
  {
    slug: 'developers-land',
    name: 'Developers & Land Acquisition',
    short: 'Zoning feasibility, site selection, and entitlement intelligence.',
    icon: Construction,
    headline: 'Find buildable sites and know the rules before you bid.',
    pains: [
      'Reading zoning code PDFs parcel by parcel',
      'Missing sites that are under-built for their zoning',
      'Slow feasibility work that delays offers',
    ],
    builds: [
      'Parcel-level zoning and overlay database for your metros',
      'Buildable envelope and unit yield estimates',
      'Site selection maps with ownership and permit context',
      'Capital raise campaigns to qualified investors',
    ],
    services: ['zoning-land-use', 'property-data-engineering', 'custom-software-dashboards', 'campaigns-outreach'],
  },
  {
    slug: 'lenders-servicers',
    name: 'Lenders & Servicers',
    short: 'Collateral monitoring, borrower signals, and portfolio analytics.',
    icon: Landmark,
    headline: 'Watch your collateral and your market without the manual pulls.',
    pains: [
      'No early warning when a borrower or property changes',
      'Portfolio reporting stitched together in spreadsheets',
      'Origination teams prospecting from cold lists',
    ],
    builds: [
      'Lien, foreclosure, permit, and tax event monitoring on your book',
      'Portfolio dashboards with property and market context',
      'Borrower prospecting lists for active investors and builders',
      'Automated valuation refreshes',
    ],
    services: ['property-data-engineering', 'permit-construction-intelligence', 'ai-predictive-analytics', 'custom-software-dashboards'],
  },
  {
    slug: 'proptech-data-companies',
    name: 'PropTech & Data Companies',
    short: 'Engineering capacity to ship data products, pipelines, and AI features.',
    icon: Cpu,
    headline: 'A senior real estate data team, without the hiring cycle.',
    pains: [
      'Roadmap blocked on data acquisition and cleaning',
      'Coverage gaps across counties and municipalities',
      'AI features that need domain knowledge to get right',
    ],
    builds: [
      'New data sources and coverage expansion',
      'Pipelines, QA, and monitoring for production datasets',
      'AI extraction and classification features',
      'APIs and internal tools for your product team',
    ],
    services: ['property-data-engineering', 'zoning-land-use', 'permit-construction-intelligence', 'custom-software-dashboards'],
  },
  {
    slug: 'property-managers-operators',
    name: 'Property Managers & Operators',
    short: 'Owner prospecting, operations dashboards, and resident workflow automation.',
    icon: House,
    headline: 'Grow doors and run them with less busywork.',
    pains: [
      'Finding self-managing owners to pitch',
      'Reporting spread across the PMS, spreadsheets, and email',
      'Repetitive tenant and vendor communication',
    ],
    builds: [
      'Owner prospecting lists for rentals in your markets',
      'Operations dashboards across properties',
      'Automated tenant, vendor, and owner communication',
      'AI assistants for leasing questions and maintenance triage',
    ],
    services: ['property-data-engineering', 'campaigns-outreach', 'crm-workflow-automation', 'custom-software-dashboards'],
  },
  {
    slug: 'builders-home-services',
    name: 'Builders & Home Services',
    short: 'Permit-based lead feeds and outreach for contractors and suppliers.',
    icon: Hammer,
    headline: 'Reach homeowners and builders when the project is happening.',
    pains: [
      'Buying shared leads that five competitors also call',
      'No view of which neighborhoods are actively building',
      'Sales reps prospecting without context',
    ],
    builds: [
      'Permit-triggered lead feeds by work type',
      'Contractor and builder market maps',
      'Automated outreach timed to permit milestones',
      'CRM integration with territory routing',
    ],
    services: ['permit-construction-intelligence', 'campaigns-outreach', 'crm-workflow-automation', 'deal-sourcing-market-intelligence'],
  },
];

export const PROCESS = [
  {
    step: '01',
    title: 'Discovery call',
    duration: '30 minutes',
    body: 'Tell us your markets, your tools, and where time or deals are slipping. We ask a lot of questions and tell you honestly if we are the right fit.',
  },
  {
    step: '02',
    title: 'Blueprint',
    duration: '1–2 weeks',
    body: 'We map your workflow and data, then send a written plan: what to build, in what order, the expected impact, and a fixed quote.',
  },
  {
    step: '03',
    title: 'Build in sprints',
    duration: '2–12 weeks',
    body: 'We build in weekly increments with a live demo every week. You see real data and working software early, and can steer as we go.',
  },
  {
    step: '04',
    title: 'Launch & handoff',
    duration: '1 week',
    body: 'We launch, train your team, and hand over the code, data, credentials, and documentation. Everything we build is yours.',
  },
  {
    step: '05',
    title: 'Operate & improve',
    duration: 'Optional',
    body: 'Keep us on as your embedded data and automation team to run pipelines, add markets, and ship new features each month.',
  },
];

export const ENGAGEMENTS = [
  {
    name: 'Blueprint',
    tagline: 'Start here',
    duration: '1–2 weeks',
    body: 'A paid discovery that maps your workflow, data, and tools, and ends in a build plan with a fixed quote. Credited toward the build if you go ahead.',
    includes: [
      'Stakeholder interviews and workflow mapping',
      'Data source and tool inventory',
      'Prioritized roadmap with expected impact',
      'Fixed-scope proposal for the build',
    ],
    cta: 'Book a blueprint call',
  },
  {
    name: 'Project build',
    tagline: 'Most popular',
    duration: '3–12 weeks',
    body: 'A fixed-scope build of a pipeline, model, CRM, campaign, or app. Weekly demos, clear milestones, and a full handoff at the end.',
    includes: [
      'Dedicated lead engineer and project manager',
      'Weekly demos and written progress notes',
      'Code, data, and documentation handed over',
      '30 days of post-launch support',
    ],
    featured: true,
    cta: 'Scope a project',
  },
  {
    name: 'Embedded team',
    tagline: 'Ongoing',
    duration: 'Monthly',
    body: 'Your own real estate data, AI, and automation team on a monthly retainer. Ideal for running pipelines, adding markets, and shipping continuously.',
    includes: [
      'A set monthly capacity across data, AI, and CRM work',
      'Pipeline monitoring and maintenance',
      'Shared Slack channel and monthly planning',
      'Priority response on issues',
    ],
    cta: 'Talk about a retainer',
  },
];

/**
 * Example engagements describe the kind of work we do. They are illustrative
 * scenarios, not client results. Replace with real case studies as they are approved.
 */
export const EXAMPLE_ENGAGEMENTS = [
  {
    slug: 'multi-county-distress-feed',
    audience: 'Investor & wholesaler',
    title: 'A daily distressed-property feed across 12 counties',
    problem:
      'Acquisitions reps were downloading court and county files by hand each morning, then cleaning and skip tracing them in spreadsheets.',
    built: [
      'Scrapers for lis pendens, NOD, probate, and tax delinquency filings',
      'Owner normalization, skip trace, and de-duplication',
      'Propensity score and auto-assignment in the CRM',
    ],
    outcome: 'New filings land in reps’ queues every morning, scored and ready to call.',
    services: ['property-data-engineering', 'ai-predictive-analytics', 'crm-workflow-automation'],
  },
  {
    slug: 'zoning-feasibility-tool',
    audience: 'Developer',
    title: 'A zoning feasibility map for land acquisition',
    problem:
      'The land team screened sites by reading zoning PDFs for each parcel, which limited them to a few dozen sites a week.',
    built: [
      'Zoning and overlay data joined to every parcel in three metros',
      'Buildable envelope and unit yield estimates',
      'A map tool with filters for under-built parcels',
    ],
    outcome: 'Analysts screen whole submarkets instead of single parcels.',
    services: ['zoning-land-use', 'custom-software-dashboards'],
  },
  {
    slug: 'permit-lead-feed',
    audience: 'Home services',
    title: 'Permit-triggered leads for a roofing and solar company',
    problem:
      'The sales team bought shared leads and had no signal for which homeowners were actively starting projects.',
    built: [
      'Permit ingestion from city portals, classified by work type',
      'Parcel and owner matching with property context',
      'Territory routing and outreach sequences in HubSpot',
    ],
    outcome: 'Reps reach homeowners within days of a permit being filed.',
    services: ['permit-construction-intelligence', 'crm-workflow-automation', 'campaigns-outreach'],
  },
  {
    slug: 'investor-outreach-campaign',
    audience: 'CRE & development',
    title: 'Buyer and LP outreach for a multifamily development',
    problem:
      'The sponsor relied on a small personal network to raise equity and find buyers for completed units.',
    built: [
      'Investor audience built by asset class, geography, and ticket size',
      'Segmented email sequences with deliverability setup',
      'Reply triage and CRM sync with interest tags',
    ],
    outcome: 'A steady flow of qualified investor conversations, tracked in one place.',
    services: ['campaigns-outreach', 'crm-workflow-automation'],
  },
  {
    slug: 'om-extraction',
    audience: 'Commercial real estate',
    title: 'AI extraction for offering memos and rent rolls',
    problem: 'Analysts spent hours retyping numbers from OMs and rent rolls before a deal could be screened.',
    built: [
      'Document AI that extracts financials, unit mix, and rent rolls',
      'Validation checks and a review screen for analysts',
      'Push into the underwriting model and deal pipeline',
    ],
    outcome: 'First-pass screening in minutes, with analysts reviewing rather than retyping.',
    services: ['ai-predictive-analytics', 'custom-software-dashboards'],
  },
  {
    slug: 'crm-consolidation',
    audience: 'Brokerage',
    title: 'One CRM for a brokerage running on four tools',
    problem: 'Agents used different CRMs and spreadsheets, so leadership could not see pipeline or source ROI.',
    built: [
      'Data migration and de-duplication into a single CRM',
      'Lead routing, nurture automations, and agent dashboards',
      'Training sessions and written playbooks',
    ],
    outcome: 'One pipeline, clear source reporting, and less admin for agents.',
    services: ['crm-workflow-automation', 'custom-software-dashboards'],
  },
];

/** Tools we commonly build with or integrate into. Shown as text wordmarks, not client logos. */
export const STACK = [
  'HubSpot',
  'Salesforce',
  'Follow Up Boss',
  'GoHighLevel',
  'Podio',
  'Snowflake',
  'BigQuery',
  'Postgres',
  'Supabase',
  'Mapbox',
  'ArcGIS',
  'dbt',
  'Airflow',
  'Claude',
  'OpenAI',
  'Zapier',
  'Make',
  'n8n',
  'Twilio',
  'Power BI',
  'Looker Studio',
  'Retool',
];

/**
 * Real client or partner names, shown in a "Trusted by" strip when non-empty.
 * Only add companies that have agreed to be listed.
 */
export const TRUSTED_BY = [];

export const PRINCIPLES = [
  {
    title: 'Real estate first',
    body: 'We know the difference between a lis pendens and a NOD, an APN and a PIN, a cap rate and a yield. You will not spend weeks teaching us the business.',
  },
  {
    title: 'You own everything',
    body: 'Code, data, models, and accounts live in your environment. No lock-in, no black box, no per-seat fees on what we build for you.',
  },
  {
    title: 'Fixed scope, weekly demos',
    body: 'You get a written plan and a fixed quote before we start, then working software every week so you always know where things stand.',
  },
  {
    title: 'One team, end to end',
    body: 'Data, AI, CRM, campaigns, and software under one roof. No hand-offs between five vendors who each blame the other.',
  },
];

export const SITE_FAQS = [
  {
    q: 'What does FreshLien actually do?',
    a: 'We are a services company for real estate. We build data pipelines, zoning and permit intelligence, AI models, CRM systems, outreach campaigns, and custom software for investors, brokerages, CRE firms, developers, lenders, and PropTech companies.',
  },
  {
    q: 'How is this different from buying a data or software subscription?',
    a: 'Subscriptions give everyone in your market the same data and the same features. We build around your markets, your buy box, and your workflow, and you own the result. Many clients also use us to connect the subscriptions they already pay for.',
  },
  {
    q: 'Which markets do you cover?',
    a: 'We work across the United States. Coverage is built per engagement: we source from the county, court, assessor, and municipal systems in the markets you care about.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Every engagement starts with a short Blueprint and ends in a fixed quote, so you know the price before the build starts. Cost depends on scope, the number of data sources, and integrations. Book a call and we will give you a realistic range quickly.',
  },
  {
    q: 'How long does it take?',
    a: 'Campaigns can launch in one to four weeks. Most data, CRM, and AI builds take three to ten weeks. You see working software in weekly demos from the first sprint.',
  },
  {
    q: 'Do we own the code and data?',
    a: 'Yes. Everything is built in your accounts or handed over at launch, with documentation. There are no license fees on what we build for you.',
  },
  {
    q: 'Can you work with our existing CRM and tools?',
    a: 'Yes. We work with HubSpot, Salesforce, Follow Up Boss, GoHighLevel, Podio, and most tools with an API. If something does not integrate, we build the bridge.',
  },
  {
    q: 'Can you support us after launch?',
    a: 'Yes. Many clients keep us on an Embedded team retainer to run pipelines, add markets, and keep shipping improvements each month.',
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
export const getSolution = (slug) => SOLUTIONS.find((s) => s.slug === slug);
