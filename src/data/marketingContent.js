/** Re-export for components that imported COVERAGE_STATS from here */
export { COVERAGE_STAT_CARDS as COVERAGE_STATS, COVERAGE_ROADMAP } from '@/data/marketingStats';

export const BRAND = {
  headline: 'Same-day distressed property data, before the crowd.',
  subheadline:
    'FreshLien pulls county and court records into one place. Search filings, set alerts, export lists, or plug in our API.',
  trustLine: '100K+ filings indexed · 250+ counties · Same-day on priority markets',
  positioning:
    'FreshLien builds real estate automation for distressed deal teams: lead delivery, skip trace, SMS, CRM, offers, and dashboards, backed by our own county-direct data platform with 100K+ filings across 250+ counties.',
};

export const PLATFORM_SURFACES = [
  {
    id: 'crm',
    title: 'Outreach CRM',
    description: 'Import leads, send from your own Gmail, and track every campaign.',
    href: '/crm',
    status: 'live',
  },
  {
    id: 'web',
    title: 'Web app',
    description: 'Search on a map, filter by county, and open full property detail.',
    href: '/dashboard/foreclosures',
    status: 'live',
  },
  {
    id: 'api',
    title: 'REST API',
    description: 'Pull normalized filing data into your CRM, scripts, or internal tools.',
    href: '/api',
    status: 'live',
  },
  {
    id: 'export',
    title: 'Bulk export',
    description: 'Download CSV batches or set up feeds for your team.',
    href: '/pricing',
    status: 'partial',
  },
];

export const CORE_WORKFLOWS = [
  {
    title: 'Outreach',
    description: 'Import leads and send personalized campaigns from your own Gmail inbox.',
    status: 'live',
  },
  {
    title: 'Search',
    description: 'Filter by state, county, ZIP, filing type, auction date, equity, and lien flags.',
    status: 'live',
  },
  {
    title: 'Map view',
    description: 'See pins by urgency so you know where to look first.',
    status: 'live',
  },
  {
    title: 'Property detail',
    description: 'Timeline, owner, liens, auction date, flood zone, and equity in one panel.',
    status: 'live',
  },
  {
    title: 'Alerts',
    description: 'Get notified when new filings hit your counties or match your filters.',
    status: 'live',
  },
  {
    title: 'Export',
    description: 'Download filtered results to CSV for outreach or underwriting.',
    status: 'partial',
  },
  {
    title: 'Portfolio watch',
    description: 'Track distress across a list of properties via API or enterprise tools.',
    status: 'soon',
  },
];

export const DIFFERENTIATORS = [
  {
    title: 'County sources',
    description: 'Data comes from clerk, recorder, and court portals. Not recycled list broker feeds.',
  },
  {
    title: 'Same-day updates',
    description: 'Filings show up the day they hit public record. Many platforms lag weeks behind.',
  },
  {
    title: 'Probate on the roadmap',
    description: 'We are adding estate and probate filings alongside foreclosure, county by county.',
  },
  {
    title: 'Clear coverage labels',
    description: 'Every category shows live, partial, or coming soon. No vague “nationwide” claims.',
  },
  {
    title: 'Built for investors',
    description: 'Map search, exports, and alerts that match how acquisition teams actually work.',
  },
  {
    title: 'API and UI',
    description: 'Same normalized data in the web app and through the API.',
  },
];

export const DATA_CATEGORIES = [
  {
    id: 'pre-foreclosure',
    title: 'Pre-foreclosure',
    filing: 'NOD / Lis Pendens',
    stage: 'Before auction',
    value: 'Highest lead time',
    status: 'soon',
  },
  {
    id: 'active-foreclosure',
    title: 'Active foreclosure',
    filing: 'NTS / Sheriff sale',
    stage: 'Scheduled sale',
    value: 'Time-sensitive',
    status: 'live',
  },
  {
    id: 'reo',
    title: 'REO',
    filing: 'Post-auction deed',
    stage: 'Lender-owned',
    value: 'Negotiable',
    status: 'soon',
  },
  {
    id: 'probate',
    title: 'Probate',
    filing: 'Probate court filing',
    stage: 'Estate selling',
    value: 'Motivated seller',
    status: 'soon',
  },
  {
    id: 'tax-delinquency',
    title: 'Tax delinquency',
    filing: 'County tax records',
    stage: 'Pre-lien',
    value: 'Early signal',
    status: 'soon',
  },
  {
    id: 'mortgage-default',
    title: 'Mortgage default',
    filing: 'Missed payment / HELOC default',
    stage: 'Early warning',
    value: 'Lead time advantage',
    status: 'soon',
  },
  {
    id: 'enrichment',
    title: 'Enrichment',
    filing: 'Flood zone, zoning, AVM',
    stage: 'Risk context',
    value: 'Underwriting support',
    status: 'partial',
  },
];

export const USE_CASES = [
  {
    segment: 'Fix-and-flip investors',
    pain: 'Old lists mean you miss deals before auction.',
    value: 'Same-day filings with equity filters and map search.',
  },
  {
    segment: 'Wholesalers',
    pain: 'Courthouse research takes hours every week.',
    value: 'Filters, bulk export, and territory maps in one tool.',
  },
  {
    segment: 'Real estate attorneys',
    pain: 'Case research jumps between county sites.',
    value: 'One timeline with case numbers and lien holders.',
  },
  {
    segment: 'Mortgage servicers',
    pain: 'Hard to monitor collateral across a portfolio.',
    value: 'API alerts when distress hits a tracked property.',
  },
  {
    segment: 'Hard money lenders',
    pain: 'Collateral problems show up too late.',
    value: 'Filing alerts and risk context on each parcel.',
  },
  {
    segment: 'Hedge funds / PE',
    pain: 'Need custom data pipelines at scale.',
    value: 'API access, bulk feeds, and dedicated support.',
  },
  {
    segment: 'Probate professionals',
    pain: 'Estate deals hide in court records.',
    value: 'Probate alerts linked to property data (rolling out).',
  },
];

export const TRUST_ITEMS = [
  {
    title: 'Where data comes from',
    items: [
      'County recorder and clerk-of-court portals',
      'Sheriff sale and auction calendars',
      'County assessor and tax records',
      'Probate filings in select counties',
    ],
  },
  {
    title: 'How fresh it is',
    items: [
      'Foreclosure filings: same-day or next business day on live counties',
      'Assessor fields: weekly refresh where available',
      'Coverage table updated as new counties go live',
      'Filing date and recording date kept on every record',
    ],
  },
  {
    title: 'Compliance',
    items: [
      'Public records only, used lawfully',
      'No resale of raw county data without license',
      'Security practices aligned with SOC 2 expectations',
      'GDPR-ready handling for EU users',
    ],
  },
];

export const ENTERPRISE_FEATURES = [
  { title: 'API keys', description: 'Dedicated keys, usage dashboards, and custom rate limits.' },
  { title: 'Warehouse feeds', description: 'Deliver to Snowflake, BigQuery, or S3-compatible storage.' },
  { title: 'Bulk delivery', description: 'Scheduled county or state files in CSV, JSON, or Parquet.' },
  { title: 'Custom alerts', description: 'Polygon watch areas, portfolio triggers, webhooks.' },
  { title: 'Portfolio monitoring', description: 'Distress checks across large property lists.' },
  { title: 'Dedicated support', description: 'Slack channel, SLA, and onboarding for your team.' },
];

export const MARKET_INSIGHTS = [
  {
    title: 'Weekly foreclosure pulse',
    description: 'Filing volume by county, week over week.',
    tag: 'Market update',
  },
  {
    title: 'Top distressed ZIPs',
    description: 'ZIPs with the highest filing concentration.',
    tag: 'Research',
  },
  {
    title: 'Auction trends',
    description: 'Upcoming sales, judgment amounts, sold ratios.',
    tag: 'Auction intel',
  },
  {
    title: 'Probate trends',
    description: 'Estate activity by county.',
    tag: 'Probate',
  },
];

export const DASHBOARD_IA = [
  { zone: 'Left sidebar', component: 'Filters', description: 'State, county, ZIP, filing type, dates, equity, liens' },
  { zone: 'Center', component: 'Map', description: 'Pins color-coded by urgency and filing stage' },
  { zone: 'Right drawer', component: 'Property detail', description: 'Timeline, owner, liens, auction, flood, equity' },
  { zone: 'Top bar', component: 'Search', description: 'Address search, view toggle, filters, export' },
  { zone: 'Bottom bar', component: 'Stats', description: 'Result count, averages, auction calendar' },
];

export const ABOUT = {
  mission:
    'FreshLien helps real estate teams automate distressed-deal workflows. We build lead delivery, skip trace, SMS, CRM sync, offer systems, and custom software. Our own county-direct platform (100K+ filings, 250+ counties) is how we prove we know this data.',
  story:
    'We started with county foreclosure data because investors were wasting hours on county sites and stale lists. Teams then asked us to wire that data into skip trace, SMS, CRM, and offer workflows. Today FreshLien delivers those systems as services, with an optional self-serve platform for teams that only need the data.',
  values: [
    {
      title: 'Services first',
      text: 'We scope what you need, then build and hand it off. Clear deliverables, fixed prices.',
    },
    {
      title: 'Build for your stack',
      text: 'Twilio, skip-trace vendors, your CRM, your templates. You keep the accounts. We wire them.',
    },
    {
      title: 'We know this data',
      text: 'We run a live county-direct foreclosure pipeline. Distressed real estate is not new to us.',
    },
    {
      title: 'Fixed scope',
      text: 'Clear proposals, fixed prices, and handoff with training. Optional retainers after launch.',
    },
  ],
};
