/**
 * FreshLien site positioning. Edit here, not in components.
 * REVIEW: legal/compliance claims before publishing absolute guarantees.
 */
export const POSITIONING = {
  name: 'FreshLien',
  promise: 'Cut the busywork between finding a property and talking to a real seller.',
  operatingLayer:
    'FreshLien connects messy real estate records to the workflows your acquisition team already uses.',
  positioning:
    'FreshLien provides data engineering, automation, and AI services for real estate teams. We turn county records and property files into clean leads, CRM activity, follow-up, and offers.',
  fiveSecond:
    'Data engineering, automation, and AI services for real estate: we clean property data and plug it into your CRM and day-to-day workflows.',
  /** Core service pillars shown across the site */
  capabilities: [
    {
      id: 'data-engineering',
      label: 'Data engineering',
      text: 'Collect, clean, match, and structure county, court, and property records so your team can trust the data.',
    },
    {
      id: 'automation',
      label: 'Automation',
      text: 'Wire records into CRM stages, follow-up, routing, offers, and reporting without more spreadsheet work.',
    },
    {
      id: 'ai',
      label: 'AI services',
      text: 'Document extraction, classification, matching support, and review queues where judgment still matters.',
    },
  ],
  capabilitiesLine: 'Data engineering · Automation · AI services',
  capabilitiesShort:
    'We offer data engineering, automation, and AI services for real estate teams. Not a generic agency. Not just a data dump.',
  flow: [
    'Public Records',
    'Property Intelligence',
    'Clean Lead',
    'CRM',
    'Follow-Up',
    'Offer',
    'Deal',
  ],
  heroFlow: [
    'County and public records',
    'Data cleaning',
    'Property and owner matching',
    'CRM',
    'Automated follow-up',
    'Offers and reporting',
  ],
  audiences: [
    'Real estate investors',
    'Wholesalers',
    'Acquisition teams',
    'Disposition teams',
    'Brokerages',
    'Property managers',
    'Commercial real estate teams',
    'Title and closing professionals',
    'Real estate data companies',
  ],
  hero: {
    eyebrow: 'Data engineering · Automation · AI',
    titleBefore: 'From messy property records to',
    titleHighlight: 'seller conversations',
    subtitle:
      'FreshLien offers data engineering, automation, and AI services for real estate teams. We pull public records into clean leads, then connect them to your CRM, follow-up, and offers. Less time in spreadsheets. More time on the phone.',
    audienceLine: 'For investors, wholesalers, acquisition teams, and operators.',
  },
  primaryCta: { label: 'Request a workflow review', href: '/book-audit' },
  secondaryCta: { label: 'How it works', href: '/how-it-works' },
  announcement: {
    text: 'FreshLien offers data engineering, automation, and AI services for real estate teams.',
    href: '/services',
    linkLabel: 'See what we build',
  },
  disclaimer:
    'FreshLien provides data engineering, automation, AI-assisted workflows, and property-information tools. Data may be incomplete, delayed, or inaccurate depending on its source. Customers should verify material information before making legal, financial, marketing, or property decisions.',
  footerDescription:
    'FreshLien offers data engineering, automation, and AI services for real estate. Cleaner leads, connected workflows, clearer results.',
};
