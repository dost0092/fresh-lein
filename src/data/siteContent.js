import {
  GlyphBank,
  GlyphBuilding,
  GlyphChip,
  GlyphCrane,
  GlyphDashboard,
  GlyphDataLayers,
  GlyphHouseKey,
  GlyphNeural,
  GlyphPermit,
  GlyphRadar,
  GlyphRoof,
  GlyphSend,
  GlyphSign,
  GlyphTowers,
  GlyphWorkflow,
  GlyphZoning,
} from '@/components/site/Glyphs';

/**
 * Single source of truth for the services-led marketing site.
 * Services = what we build. Solutions = who we build it for.
 */

export const BRAND = {
  promise: 'Data, AI, and growth systems for real estate teams.',
  oneLiner:
    'FreshLien builds the data, AI, CRM, and outreach systems real estate teams need. One team, and you own everything.',
};

/** Capabilities that real estate teams usually buy as separate SaaS subscriptions. */
export const CATEGORIES_WE_COVER = [
  { label: 'Property data', note: 'Owners, deeds, liens' },
  { label: 'Zoning', note: 'Rules, setbacks, yield' },
  { label: 'Permits', note: 'Projects, contractors' },
  { label: 'Deal sourcing', note: 'On- and off-market' },
  { label: 'Predictive AI', note: 'Scores, valuations' },
  { label: 'CRM & campaigns', note: 'Pipelines, outreach' },
];

export const SERVICES = [
  {
    slug: 'property-data-engineering',
    name: 'Property Data Engineering',
    short: 'County, parcel, and owner data, cleaned and delivered.',
    icon: GlyphDataLayers,
    category: 'Data',
    headline: 'Your own property data, built for your markets.',
    description: 'We collect county, court, and parcel records, clean them, and deliver one reliable dataset. It refreshes on schedule and lands where you work.',
    deliverables: [
      'County and court data connectors',
      'Owner and LLC matching',
      'Geocoding and APN matching',
      'Scheduled updates with alerts',
      'Delivery to your CRM or warehouse',
      'Clear documentation',
    ],
    useCases: [
      'Daily pre-foreclosure and probate leads',
      'Owner lookups across thousands of parcels',
      'One source of truth for acquisitions',
    ],
    stack: ['Python', 'dbt', 'Airflow', 'Postgres', 'Snowflake', 'BigQuery', 'PostGIS'],
    timeline: '3–8 weeks',
  },
  {
    slug: 'zoning-land-use',
    name: 'Zoning & Land-Use Intelligence',
    short: 'Zoning rules turned into clear, searchable answers.',
    icon: GlyphZoning,
    category: 'Data',
    headline: 'Know what you can build before you offer.',
    description: 'We turn zoning codes and maps into structured data, then build tools that answer “what can I build here?” in seconds.',
    deliverables: [
      'Zoning joined to every parcel',
      'Uses, setbacks, height, and FAR as data',
      'Buildable area and unit estimates',
      'ADU and lot-split screens',
      'On-demand feasibility reports',
      'Alerts when codes change',
    ],
    useCases: [
      'Screening land across a whole metro',
      'Highest-and-best-use for brokers',
      'Finding under-built parcels',
    ],
    stack: ['PostGIS', 'Mapbox', 'ArcGIS', 'LLM extraction', 'Python'],
    timeline: '4–10 weeks',
  },
  {
    slug: 'permit-construction-intelligence',
    name: 'Permit & Construction Intelligence',
    short: 'Permit data that shows who is building what, early.',
    icon: GlyphPermit,
    category: 'Data',
    headline: 'See every project the day it is permitted.',
    description: 'We collect permits from city and county portals, sort them by work type, and link them to parcels and contractors.',
    deliverables: [
      'Permit feeds from city portals',
      'Work-type tags: roof, solar, ADU, more',
      'Contractor profiles and history',
      'Permit-to-parcel matching',
      'Alerts on new matching permits',
      'Construction activity dashboards',
    ],
    useCases: [
      'Leads for roofing, solar, and HVAC',
      'Tracking new construction for lenders',
      'Vetting contractors for developers',
    ],
    stack: ['Python', 'Postgres', 'NLP classification', 'Mapbox'],
    timeline: '3–8 weeks',
  },
  {
    slug: 'deal-sourcing-market-intelligence',
    name: 'Deal Sourcing & Market Intelligence',
    short: 'On- and off-market deals, scored against your buy box.',
    icon: GlyphRadar,
    category: 'Data',
    headline: 'More of the right deals, before anyone else.',
    description: 'We pull listings, auctions, and distress signals into one feed, scored against your buy box, with comps and market dashboards.',
    deliverables: [
      'Listing and auction feeds',
      'Distress signal stacking',
      'Buy-box scoring and daily digests',
      'Comps and rent estimates',
      'Submarket dashboards',
      'Alerts to email, Slack, or CRM',
    ],
    useCases: [
      'Daily deal digests for acquisitions',
      'CRE screening by asset class',
      'Market reports for your IC',
    ],
    stack: ['Python', 'Postgres', 'Looker Studio', 'Power BI', 'Slack'],
    timeline: '3–6 weeks',
  },
  {
    slug: 'ai-predictive-analytics',
    name: 'AI & Predictive Analytics',
    short: 'Seller scores, valuations, and document AI on your data.',
    icon: GlyphNeural,
    category: 'AI',
    headline: 'AI that saves hours on every deal.',
    description: 'We build practical AI on your own data: who is likely to sell, what a property is worth, and what a document says.',
    deliverables: [
      'Seller propensity scores',
      'Valuation and rent models',
      'Document AI for leases and OMs',
      'Assistants over your deals and data',
      'Lead ranking inside your CRM',
      'Accuracy reports you can check',
    ],
    useCases: [
      'Cutting 50,000 owners to the 2,000 worth calling',
      'Abstracting hundreds of leases',
      'First-pass underwriting from an OM',
    ],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'Claude', 'OpenAI', 'pgvector'],
    timeline: '4–10 weeks',
  },
  {
    slug: 'crm-workflow-automation',
    name: 'CRM & Workflow Automation',
    short: 'CRM setup and automations that remove manual work.',
    icon: GlyphWorkflow,
    category: 'Automation',
    headline: 'A CRM your team actually uses.',
    description: 'We set up or rebuild your CRM around how your team works, then connect your leads, data, and tools so nothing slips.',
    deliverables: [
      'CRM setup, cleanup, or migration',
      'Pipelines for buying and selling',
      'Lead routing and de-duplication',
      'Skip trace, dialer, and SMS links',
      'Automations in Zapier, Make, or n8n',
      'Team training and playbooks',
    ],
    useCases: [
      'Moving off spreadsheets',
      'Merging several CRMs into one',
      'Auto-assigning leads by score',
    ],
    stack: ['HubSpot', 'Salesforce', 'Follow Up Boss', 'GoHighLevel', 'Podio', 'n8n', 'Zapier'],
    timeline: '2–6 weeks',
  },
  {
    slug: 'campaigns-outreach',
    name: 'Campaigns & Outreach',
    short: 'Email, SMS, and mail campaigns that get replies.',
    icon: GlyphSend,
    category: 'Growth',
    headline: 'Put your deal in front of the right people.',
    description: 'We build targeted lists and run email, SMS, and mail campaigns. Replies land in your inbox, with clear reporting.',
    deliverables: [
      'Audience lists by type and location',
      'Email, SMS, and mail setup',
      'Inbox and deliverability setup',
      'Copy and follow-up sequences',
      'Reply handling and CRM sync',
      'Simple campaign reporting',
    ],
    useCases: [
      'Finding buyers for a listing',
      'Raising capital for a development',
      'Reaching motivated owners',
    ],
    stack: ['Resend', 'Twilio', 'Instantly', 'Lob', 'HubSpot'],
    timeline: '1–4 weeks to first send',
  },
  {
    slug: 'custom-software-dashboards',
    name: 'Custom Software & Dashboards',
    short: 'Maps, portals, dashboards, and APIs built for your team.',
    icon: GlyphDashboard,
    category: 'Software',
    headline: 'Software that fits how you work.',
    description: 'When off-the-shelf tools fall short, we build the product: research maps, portals, dashboards, and APIs, shipped weekly.',
    deliverables: [
      'Product scoping and design',
      'Web apps with maps and search',
      'Investor and client portals',
      'Team dashboards',
      'APIs over your data',
      'Hosting and handoff docs',
    ],
    useCases: [
      'A research map for analysts',
      'An investor portal with reporting',
      'Launching your own data product',
    ],
    stack: ['React', 'Node.js', 'Postgres', 'Supabase', 'Mapbox', 'Vercel', 'Retool'],
    timeline: '4–12 weeks',
  },
];

export const SOLUTIONS = [
  {
    slug: 'investors-wholesalers',
    name: 'Investors & Wholesalers',
    short: 'Off-market leads and follow-up that converts.',
    icon: GlyphHouseKey,
    headline: 'Find motivated sellers first.',
    pains: [
      'Buying the same lists as everyone else',
      'Hours cleaning and skip tracing CSVs',
      'Leads going cold without follow-up',
    ],
    builds: [
      'Daily distress leads from county records',
      'Seller scores to call the right owners',
      'Automated SMS, email, and call tasks',
    ],
    services: ['property-data-engineering', 'ai-predictive-analytics', 'crm-workflow-automation', 'campaigns-outreach'],
  },
  {
    slug: 'brokerages-agents',
    name: 'Brokerages & Agent Teams',
    short: 'Better leads, a cleaner CRM, less agent admin.',
    icon: GlyphSign,
    headline: 'Better leads. Less admin.',
    pains: [
      'Agents on different tools',
      'No idea which lead sources close',
      'Marketing that misses likely sellers',
    ],
    builds: [
      'Likely-to-list models for your farm',
      'One CRM with routing and reporting',
      'AI help for CMAs and listing copy',
    ],
    services: ['crm-workflow-automation', 'ai-predictive-analytics', 'campaigns-outreach', 'custom-software-dashboards'],
  },
  {
    slug: 'commercial-real-estate',
    name: 'Commercial Real Estate',
    short: 'Deal screening, owner research, and document AI.',
    icon: GlyphTowers,
    headline: 'Screen more deals. Reach capital faster.',
    pains: [
      'Retyping numbers from OMs',
      'Owner research stuck at an LLC',
      'Stale buyer and investor lists',
    ],
    builds: [
      'Deal feeds scored to your buy box',
      'LLC and owner unmasking',
      'AI extraction for OMs and leases',
    ],
    services: ['deal-sourcing-market-intelligence', 'property-data-engineering', 'ai-predictive-analytics', 'campaigns-outreach'],
  },
  {
    slug: 'developers-land',
    name: 'Developers & Land Acquisition',
    short: 'Zoning, feasibility, and site selection.',
    icon: GlyphCrane,
    headline: 'Find buildable sites. Know the rules.',
    pains: [
      'Reading zoning PDFs parcel by parcel',
      'Missing under-built sites',
      'Slow feasibility that delays offers',
    ],
    builds: [
      'Parcel-level zoning for your metros',
      'Buildable area and unit estimates',
      'Site maps with owner and permit data',
    ],
    services: ['zoning-land-use', 'property-data-engineering', 'custom-software-dashboards', 'campaigns-outreach'],
  },
  {
    slug: 'lenders-servicers',
    name: 'Lenders & Servicers',
    short: 'Collateral monitoring and portfolio analytics.',
    icon: GlyphBank,
    headline: 'Watch your collateral automatically.',
    pains: [
      'No early warning on borrower changes',
      'Portfolio reports in spreadsheets',
      'Prospecting from cold lists',
    ],
    builds: [
      'Lien, tax, and permit alerts on your book',
      'Portfolio dashboards with market context',
      'Lists of active investors and builders',
    ],
    services: ['property-data-engineering', 'permit-construction-intelligence', 'ai-predictive-analytics', 'custom-software-dashboards'],
  },
  {
    slug: 'proptech-data-companies',
    name: 'PropTech & Data Companies',
    short: 'A senior data team that helps you ship faster.',
    icon: GlyphChip,
    headline: 'A real estate data team, no hiring needed.',
    pains: [
      'Roadmap stuck on data work',
      'Gaps in county coverage',
      'AI that needs domain know-how',
    ],
    builds: [
      'New sources and wider coverage',
      'Production pipelines with QA',
      'AI extraction features and APIs',
    ],
    services: ['property-data-engineering', 'zoning-land-use', 'permit-construction-intelligence', 'custom-software-dashboards'],
  },
  {
    slug: 'property-managers-operators',
    name: 'Property Managers & Operators',
    short: 'Owner prospecting and less busywork.',
    icon: GlyphBuilding,
    headline: 'Grow doors with less busywork.',
    pains: [
      'Finding owners to pitch',
      'Reports scattered everywhere',
      'Repetitive tenant messages',
    ],
    builds: [
      'Owner prospecting lists',
      'One operations dashboard',
      'Automated tenant and vendor updates',
    ],
    services: ['property-data-engineering', 'campaigns-outreach', 'crm-workflow-automation', 'custom-software-dashboards'],
  },
  {
    slug: 'builders-home-services',
    name: 'Builders & Home Services',
    short: 'Permit-based leads for contractors.',
    icon: GlyphRoof,
    headline: 'Reach homeowners as projects start.',
    pains: [
      'Shared leads five rivals also call',
      'No view of who is building',
      'Reps prospecting blind',
    ],
    builds: [
      'Permit-triggered leads by work type',
      'Territory maps for your market',
      'Outreach timed to permit stages',
    ],
    services: ['permit-construction-intelligence', 'campaigns-outreach', 'crm-workflow-automation', 'deal-sourcing-market-intelligence'],
  },
];

export const PROCESS = [
  { step: '01', title: 'Discovery call', duration: '30 minutes', body: 'Share your goals. We tell you honestly if we fit.' },
  { step: '02', title: 'Blueprint', duration: '1–2 weeks', body: 'A written plan, timeline, and fixed quote.' },
  { step: '03', title: 'Build', duration: '2–12 weeks', body: 'Weekly demos on real data. Steer as we go.' },
  { step: '04', title: 'Launch', duration: '1 week', body: 'Training, docs, and a full handover.' },
  { step: '05', title: 'Improve', duration: 'Optional', body: 'Keep us on to run and grow it monthly.' },
];

export const ENGAGEMENTS = [
  {
    name: 'Blueprint',
    tagline: 'Start here',
    duration: '1–2 weeks',
    body: 'Map your workflow and get a build plan with a fixed quote. Credited if you go ahead.',
    includes: ['Workflow and tool review', 'Prioritized roadmap', 'Fixed-scope quote'],
    cta: 'Start with a Blueprint',
  },
  {
    name: 'Project build',
    tagline: 'Most popular',
    duration: '3–12 weeks',
    body: 'A fixed-scope build with weekly demos and a full handoff.',
    includes: ['Dedicated lead engineer', 'Weekly demos', 'Code, data, and docs handed over', '30 days of support'],
    featured: true,
    cta: 'Scope a project',
  },
  {
    name: 'Embedded team',
    tagline: 'Ongoing',
    duration: 'Monthly',
    body: 'Your data, AI, and automation team on a monthly retainer.',
    includes: ['Set monthly capacity', 'Pipeline monitoring', 'Shared Slack and monthly planning'],
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
    problem: 'Reps downloaded and cleaned court files by hand every morning.',
    built: [
      'Filing scrapers for 12 counties',
      'Skip trace and de-duplication',
      'Scores and auto-assignment in the CRM',
    ],
    outcome: 'Scored leads land in reps’ queues every morning.',
    services: ['property-data-engineering', 'ai-predictive-analytics', 'crm-workflow-automation'],
  },
  {
    slug: 'zoning-feasibility-tool',
    audience: 'Developer',
    title: 'A zoning feasibility map for land acquisition',
    problem: 'The land team read zoning PDFs one parcel at a time.',
    built: [
      'Zoning joined to every parcel',
      'Unit yield estimates',
      'Map filters for under-built lots',
    ],
    outcome: 'Analysts screen whole submarkets, not single lots.',
    services: ['zoning-land-use', 'custom-software-dashboards'],
  },
  {
    slug: 'permit-lead-feed',
    audience: 'Home services',
    title: 'Permit-triggered leads for a roofing and solar company',
    problem: 'Sales bought shared leads with no sign of real projects.',
    built: [
      'Permit feeds by work type',
      'Owner matching',
      'Routing and outreach in HubSpot',
    ],
    outcome: 'Reps reach homeowners days after a permit is filed.',
    services: ['permit-construction-intelligence', 'crm-workflow-automation', 'campaigns-outreach'],
  },
  {
    slug: 'investor-outreach-campaign',
    audience: 'CRE & development',
    title: 'Buyer and LP outreach for a multifamily development',
    problem: 'The sponsor raised equity from a small personal network.',
    built: [
      'Investor lists by asset and ticket size',
      'Segmented email sequences',
      'Reply triage synced to the CRM',
    ],
    outcome: 'A steady flow of qualified investor calls.',
    services: ['campaigns-outreach', 'crm-workflow-automation'],
  },
  {
    slug: 'om-extraction',
    audience: 'Commercial real estate',
    title: 'AI extraction for offering memos and rent rolls',
    problem: 'Analysts retyped OMs and rent rolls before every screen.',
    built: [
      'AI extraction of financials and rent rolls',
      'A review screen with checks',
      'Push into the underwriting model',
    ],
    outcome: 'First-pass screening in minutes.',
    services: ['ai-predictive-analytics', 'custom-software-dashboards'],
  },
  {
    slug: 'crm-consolidation',
    audience: 'Brokerage',
    title: 'One CRM for a brokerage running on four tools',
    problem: 'Agents used four CRMs, so nobody saw the full pipeline.',
    built: [
      'Migration into one CRM',
      'Routing and agent dashboards',
      'Training and playbooks',
    ],
    outcome: 'One pipeline and clear source reporting.',
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
  { title: 'Real estate first', body: 'We speak lis pendens, APNs, and cap rates. No ramp-up.' },
  { title: 'You own everything', body: 'Code, data, and accounts live with you. No lock-in.' },
  { title: 'Fixed scope, weekly demos', body: 'A fixed quote up front. Working software every week.' },
  { title: 'One team, end to end', body: 'Data, AI, CRM, and campaigns under one roof.' },
];

export const SITE_FAQS = [
  {
    q: 'What does FreshLien do?',
    a: 'We build data pipelines, AI, CRM systems, campaigns, and custom software for real estate teams.',
  },
  {
    q: 'Why not just buy a subscription?',
    a: 'Subscriptions give everyone the same data. We build around your markets and workflow, and you own the result.',
  },
  {
    q: 'Which markets do you cover?',
    a: 'All of the United States. We source data from the counties and cities you care about.',
  },
  {
    q: 'How much does it cost?',
    a: 'You get a fixed quote before any build starts. Book a call and we will give you a realistic range.',
  },
  {
    q: 'How long does it take?',
    a: 'Campaigns launch in 1–4 weeks. Most builds take 3–10 weeks, with a demo every week.',
  },
  {
    q: 'Do we own the code and data?',
    a: 'Yes. Everything is built in your accounts or handed over with docs. No license fees.',
  },
  {
    q: 'Do you work with our CRM?',
    a: 'Yes. HubSpot, Salesforce, Follow Up Boss, GoHighLevel, Podio, and most tools with an API.',
  },
  {
    q: 'Do you support us after launch?',
    a: 'Yes. Every build includes 30 days of support, and many clients keep us on monthly.',
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
export const getSolution = (slug) => SOLUTIONS.find((s) => s.slug === slug);
