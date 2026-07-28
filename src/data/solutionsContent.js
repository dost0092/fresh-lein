/**
 * Solutions catalog  -  homepage cards + detailed pages.
 */
export const SOLUTIONS = [
  {
    id: 'lead-data-automation',
    slug: 'lead-data-automation',
    name: 'Lead Data Automation',
    href: '/solutions/lead-data-automation',
    description:
      'Turn county records, spreadsheets, vendor files, and property data into clean, categorized, CRM-ready opportunities.',
    features: [
      'Scheduled record collection',
      'Address and owner standardization',
      'Parcel and ownership matching',
      'Duplicate detection',
      'Lead scoring and tagging',
      'CRM and dialer synchronization',
    ],
    cta: 'Explore Lead Data Automation',
    hero: 'Turn messy public records into clean, CRM-ready opportunities.',
  },
  {
    id: 'acquisitions',
    slug: 'acquisitions',
    name: 'Acquisition Automation',
    href: '/solutions/acquisitions',
    description:
      'Give acquisition teams complete property context, structured follow-up, offer calculations, approvals, and performance reporting.',
    features: [
      'Automatic lead assignment',
      'Property research panel',
      'Comparable-sales integrations',
      'Offer calculations',
      'Approval workflows',
      'Offer PDF generation',
      'Stale-lead recovery',
    ],
    cta: 'Explore Acquisition Automation',
    hero: 'Give acquisition teams better information and fewer administrative tasks.',
  },
  {
    id: 'dispositions',
    slug: 'dispositions',
    name: 'Disposition Workflows',
    href: '/solutions/dispositions',
    description:
      'Package deals, match buyers, collect documents, manage access, and track offers without relying on disconnected spreadsheets and group messages.',
    features: [
      'Deal package generation',
      'Buyer segmentation',
      'Buyer-to-deal matching',
      'Proof-of-funds collection',
      'Offer tracking',
      'Buyer-performance history',
    ],
    cta: 'Explore Disposition Workflows',
    hero: 'Move contracted properties from deal package to qualified buyer.',
  },
  {
    id: 'property-research',
    slug: 'property-research',
    name: 'Property Research',
    href: '/solutions/property-research',
    description:
      'Organize property records, zoning, permits, liens, ownership, and source documents into a reviewable property timeline.',
    features: [
      'Ownership research',
      'Zoning summaries',
      'Permit history',
      'Lien and case extraction',
      'Source-linked documents',
      'Due-diligence reporting',
    ],
    cta: 'Explore Property Research',
    hero: 'Organize property research without opening dozens of websites and documents.',
  },
];

export const PAIN_POINTS = [
  {
    title: 'County Records',
    text: 'Download and process fragmented records from different public sources.',
  },
  {
    title: 'Spreadsheet Cleanup',
    text: 'Standardize fields, ownership names, addresses, parcel identifiers, and dates.',
  },
  {
    title: 'Duplicate Leads',
    text: 'Identify repeated owners, properties, phone numbers, and campaign records.',
  },
  {
    title: 'CRM Updates',
    text: 'Create, enrich, tag, assign, and update opportunities automatically.',
  },
  {
    title: 'Follow-Up Gaps',
    text: 'Trigger the correct communication and task when a lead changes status.',
  },
  {
    title: 'Manual Research',
    text: 'Collect zoning, permits, ownership, lien, and property information in one place.',
  },
];

export const CORE_WORKFLOW = [
  {
    step: '1',
    title: 'Collect',
    text: 'Connect approved county, court, vendor, spreadsheet, API, email, and document sources.',
  },
  {
    step: '2',
    title: 'Normalize',
    text: 'Convert inconsistent records into a structured property and owner format.',
  },
  {
    step: '3',
    title: 'Validate',
    text: 'Detect missing values, duplicates, conflicts, and uncertain matches.',
  },
  {
    step: '4',
    title: 'Enrich',
    text: 'Add permitted property, ownership, equity, zoning, permit, and contact information.',
  },
  {
    step: '5',
    title: 'Activate',
    text: 'Push qualified records to the CRM, dialer, mail platform, or internal workflow.',
  },
  {
    step: '6',
    title: 'Measure',
    text: 'Track processing, data quality, responses, offers, and source performance.',
  },
];

export const COMPARISON = {
  vendor: {
    title: 'Traditional Data Vendor',
    points: [
      'Delivers a CSV',
      'Limited workflow integration',
      'Customer performs cleanup',
      'Weak source-to-outcome visibility',
      'Duplicate and stale records remain',
    ],
  },
  agency: {
    title: 'Generic Automation Agency',
    points: [
      'Understands tools but not always real estate data',
      'Requires the customer to explain every property workflow',
      'Builds one-off automations',
      'May lack data-quality controls',
      'Limited reusable industry infrastructure',
    ],
  },
  freshlien: {
    title: 'FreshLien',
    points: [
      'Data engineering, automation, and AI for real estate',
      'Understands real estate public records and parcel data',
      'Normalizes property and ownership information',
      'Connects data to existing CRMs and workflows',
      'Includes validation, monitoring, and exception handling',
      'Supports acquisitions, dispositions, and property research',
      'Measures operational results',
    ],
  },
};

export const BEFORE_AFTER = {
  before: [
    'Employees visit several county websites.',
    'Files are downloaded and renamed manually.',
    'A VA cleans columns and addresses.',
    'Duplicate owners remain across campaigns.',
    'Lists are imported into the CRM late.',
    'Follow-up depends on individual memory.',
    'Managers assemble reports manually.',
  ],
  after: [
    'Sources run on a documented schedule.',
    'Records follow a consistent property schema.',
    'Duplicate and uncertain matches are flagged.',
    'Qualified leads arrive in the correct CRM stage.',
    'Follow-up tasks and messages trigger automatically.',
    'Managers see processing and acquisition performance.',
    'Employees focus on conversations and decisions.',
  ],
};

export const METRIC_CATEGORIES = [
  'Administrative hours removed',
  'Records processed',
  'Duplicate rate',
  'Data-completeness rate',
  'Source-to-CRM processing time',
  'Follow-up coverage',
  'Offer-production time',
  'Workflow exceptions',
  'Source-to-contract performance',
];

export const USE_CASES = [
  {
    title: 'Foreclosure record to CRM',
    problem: 'County filings sit in downloads until someone cleans and imports them.',
    workflow: 'Scheduled collection, normalize, match, dedupe, tag, sync.',
    result: 'Faster source-to-CRM delivery with clearer ownership of each record.',
  },
  {
    title: 'Tax-delinquent list normalization',
    problem: 'Tax lists arrive with inconsistent parcels, names, and statuses.',
    workflow: 'Standardize fields, validate parcels, flag conflicts, stage for outreach.',
    result: 'Campaign-ready lists with fewer import errors.',
  },
  {
    title: 'Code-violation lead pipeline',
    problem: 'Violation notices are scattered across PDFs and portals.',
    workflow: 'Extract, categorize, enrich address/owner, push to CRM stages.',
    result: 'More consistent intake for distress categories your team works.',
  },
  {
    title: 'Probate document extraction',
    problem: 'Teams re-key case details from scanned documents.',
    workflow: 'Document intake, field extraction, human-review queue, CRM update.',
    result: 'Less re-keying and better source linkage.',
  },
  {
    title: 'Absentee-owner campaign preparation',
    problem: 'Mailing and phone lists mix owners, tenants, and stale contacts.',
    workflow: 'Owner matching, duplicate checks, segmentation, export or CRM sync.',
    result: 'Cleaner campaign cohorts with fewer wasted touches.',
  },
  {
    title: 'Multi-source duplicate removal',
    problem: 'The same property and owner appear across vendors and markets.',
    workflow: 'Cross-source matching, conflict flags, suppress or merge rules.',
    result: 'Lower duplicate rate across campaigns and CRM records.',
  },
  {
    title: 'Acquisition lead routing',
    problem: 'Leads sit unassigned or go to the wrong specialist.',
    workflow: 'Rules-based assignment, SLA tasks, status triggers.',
    result: 'Faster first contact and clearer ownership.',
  },
  {
    title: 'Automated seller follow-up',
    problem: 'Follow-up depends on memory and personal spreadsheets.',
    workflow: 'Status-based sequences, tasks, and opt-out handling.',
    result: 'Higher follow-up coverage without more admin time.',
  },
  {
    title: 'Offer PDF generation',
    problem: 'Offers are rebuilt manually from templates and notes.',
    workflow: 'Merge property, owner, and offer fields into approved templates.',
    result: 'Faster offer production with consistent documents.',
  },
  {
    title: 'Buyer matching and dispositions',
    problem: 'Buyer lists live in chats and outdated sheets.',
    workflow: 'Criteria matching, package share, document collection, offer tracking.',
    result: 'More organized disposition process with approval before blast sends.',
  },
  {
    title: 'Permit and zoning research',
    problem: 'Researchers hop between portals and PDFs for one property.',
    workflow: 'Property workspace with sourced zoning/permit history and notes.',
    result: 'Faster due diligence with a reviewable timeline.',
  },
  {
    title: 'Property-management document tracking',
    problem: 'Leases, notices, and repairs are hard to find when needed.',
    workflow: 'Document intake, property linkage, status and reminder workflows.',
    result: 'Fewer missing files and clearer operational handoffs.',
  },
];

export const PROCESS_PHASES = [
  {
    title: 'Discover',
    text: 'Review the people, tools, data, documents, and decisions in the current workflow.',
  },
  {
    title: 'Map',
    text: 'Document every input, output, handoff, delay, and recurring failure.',
  },
  {
    title: 'Pilot',
    text: 'Automate one narrow, high-value workflow before expanding.',
  },
  {
    title: 'Validate',
    text: 'Run quality checks, review exceptions, and compare the automated process with the existing process.',
  },
  {
    title: 'Scale',
    text: 'Add sources, teams, markets, workflows, reporting, and ongoing monitoring.',
  },
];

export const TRUST_FEATURES = [
  'Source-linked records where available',
  'Data-quality checks',
  'Human-review queues',
  'Logging and monitoring',
  'Role-based access',
  'Documented workflows',
  'Error and retry handling',
  'Customer-controlled outreach rules',
  'Clear source and processing history',
];

export const INTEGRATIONS = {
  crm: ['GoHighLevel', 'Podio', 'REsimpli', 'InvestorFuse', 'Salesforce', 'HubSpot', 'Custom CRM'],
  communication: ['Gmail', 'Outlook', 'SMS providers', 'Dialers', 'Direct-mail platforms'],
  data: [
    'County websites',
    'Court records',
    'CSV',
    'Excel',
    'APIs',
    'Property-data vendors',
    'Internal databases',
  ],
  documents: [
    'PDF',
    'Scanned forms',
    'Email attachments',
    'Contracts',
    'Offer documents',
    'Closing documents',
  ],
};

export const SITE_FAQS = [
  {
    q: 'What does FreshLien offer?',
    a: 'FreshLien offers data engineering, automation, and AI services for real estate teams. That includes public-record collection, cleanup, property and owner matching, CRM updates, lead assignment, follow-up, offer generation, document processing, and reporting.',
  },
  {
    q: 'What does FreshLien automate?',
    a: 'Recurring real estate data and operational workflows: public-record collection, spreadsheet cleanup, property and owner matching, CRM updates, lead assignment, follow-up actions, offer generation, document processing, and reporting.',
  },
  {
    q: 'Are you a generic software agency?',
    a: 'No. FreshLien focuses on real estate data engineering, workflow automation, and AI-assisted processing. We work this data ourselves through a live foreclosure data product, then build the same class of systems for client teams.',
  },
  {
    q: 'Does FreshLien replace our CRM?',
    a: 'Not necessarily. FreshLien can connect to and improve the CRM your team already uses. When appropriate, it can also provide custom workflow interfaces around existing systems.',
  },
  {
    q: 'Can FreshLien collect data from every county?',
    a: 'County systems, formats, access rules, and licensing requirements vary. FreshLien evaluates each source before confirming availability, permitted use, update frequency, and implementation scope.',
  },
  {
    q: 'Is the data always accurate?',
    a: 'No property-data source is perfect. FreshLien preserves source information where possible, applies validation rules, identifies conflicts, and can route uncertain records for human review. Customers should verify material information before acting.',
  },
  {
    q: 'Can you automate our entire business?',
    a: 'FreshLien normally starts with one measurable bottleneck. After the pilot is validated, the system can expand into additional sources, teams, markets, and workflows.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Timing depends on source access, integrations, record volume, workflow complexity, and customer availability. A narrow pilot is generally faster and safer than attempting to replace an entire operation at once.',
  },
  {
    q: 'Do you provide custom development?',
    a: 'Yes. FreshLien provides custom real estate data, integration, document-processing, and workflow systems when standard modules do not fully meet the requirement.',
  },
  {
    q: 'Who owns our data?',
    a: 'Data ownership and retention are defined in your agreement and our privacy policy. In practice, customer operational data remains yours; FreshLien processes it to deliver the contracted workflows. Confirm final language with legal before publishing additional claims.',
  },
];
