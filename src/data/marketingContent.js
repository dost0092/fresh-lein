import { MARKETING_COVERAGE } from '@/data/marketingStats';

/** Central marketing copy aligned with FreshLien Master SaaS Document v1.0 */

export const BRAND = {
  headline: 'Same-day distressed real estate intelligence before the crowd.',
  subheadline:
    'County-direct foreclosure, probate, tax lien, and default intelligence — delivered through a web app, API, and bulk data feeds.',
  trustLine:
    'Same-day freshness · County-direct public records · Export & API access',
  positioning:
    'FreshLien is a B2B SaaS platform that aggregates, normalizes, and delivers same-day distressed real estate intelligence — pre-foreclosure, active foreclosure, probate, tax delinquency, and mortgage default signals — sourced directly from U.S. county recorders, clerk-of-court portals, and official public databases.',
};

export const COVERAGE_STATS = [
  { value: MARKETING_COVERAGE.counties, label: 'Counties covered' },
  { value: MARKETING_COVERAGE.foreclosureRecords, label: 'Filings tracked' },
  { value: '500K+', label: 'Properties indexed' },
  { value: MARKETING_COVERAGE.states, label: 'States live' },
  { value: MARKETING_COVERAGE.dataRefresh, label: 'Data refresh' },
  { value: 'Daily', label: 'Alert delivery' },
];

export const PLATFORM_SURFACES = [
  {
    id: 'web',
    title: 'Web App',
    description: 'Search, filter, and monitor distressed properties on an interactive map with property-level detail.',
    href: '/dashboard/foreclosures',
    status: 'live',
  },
  {
    id: 'api',
    title: 'REST API',
    description: 'Integrate normalized filing data into CRMs, underwriting tools, and custom investor workflows.',
    href: '/api',
    status: 'live',
  },
  {
    id: 'export',
    title: 'Bulk Export & Feeds',
    description: 'CSV exports and warehouse-ready data feeds for teams that need volume, not clicks.',
    href: '/pricing',
    status: 'partial',
  },
];

export const CORE_WORKFLOWS = [
  {
    title: 'Precision search',
    description:
      'Filter by state, county, ZIP, property type, filing type, auction date, equity range, and lien flags.',
    status: 'live',
  },
  {
    title: 'Map view',
    description: 'Clustered pins with urgency colors so you see where action is concentrated at a glance.',
    status: 'live',
  },
  {
    title: 'Property detail',
    description:
      'Timeline, owner, liens, auction info, flood zone, and equity estimates in one property drawer.',
    status: 'live',
  },
  {
    title: 'Alerts & watch areas',
    description: 'Save counties or criteria and get notified when new filings match your investment thesis.',
    status: 'live',
  },
  {
    title: 'Export & skip trace',
    description: 'Download filtered results to CSV or append owner contact data for outreach campaigns.',
    status: 'partial',
  },
  {
    title: 'Portfolio monitoring',
    description: 'Monitor distress signals across a portfolio of parcels via API or enterprise dashboard.',
    status: 'soon',
  },
];

export const DIFFERENTIATORS = [
  {
    title: 'County-direct sourcing',
    description:
      'Records come from official county clerk, recorder, and court portals — not recycled third-party lists.',
  },
  {
    title: 'Same-day freshness',
    description:
      'Filings surface the day they hit public record. Legacy platforms often lag 30–60 days behind.',
  },
  {
    title: 'Probate included',
    description: 'Estate and probate filings alongside foreclosure — a category most competitors skip entirely.',
  },
  {
    title: 'Transparent coverage',
    description: 'We publish what we cover, how fresh it is, and where gaps remain — no black-box data claims.',
  },
  {
    title: 'Built for investors',
    description: 'Map-first UX, export tools, and urgency signals designed for wholesalers and acquisition teams.',
  },
  {
    title: 'API + UI together',
    description: 'One normalized dataset powering both the dashboard and programmatic integrations.',
  },
];

export const DATA_CATEGORIES = [
  {
    id: 'pre-foreclosure',
    title: 'Pre-Foreclosure',
    filing: 'NOD / Lis Pendens',
    stage: 'Before auction',
    value: 'Highest — homeowner still in property',
    status: 'soon',
  },
  {
    id: 'active-foreclosure',
    title: 'Active Foreclosure',
    filing: 'NTS / Sheriff Sale',
    stage: 'Scheduled sale',
    value: 'High — time-sensitive',
    status: 'live',
  },
  {
    id: 'reo',
    title: 'REO',
    filing: 'Post-auction deed',
    stage: 'Lender-owned',
    value: 'Medium — negotiable',
    status: 'soon',
  },
  {
    id: 'probate',
    title: 'Probate',
    filing: 'Probate court filing',
    stage: 'Estate selling',
    value: 'High — motivated seller',
    status: 'soon',
  },
  {
    id: 'tax-delinquency',
    title: 'Tax Delinquency',
    filing: 'County tax records',
    stage: 'Pre-lien',
    value: 'Medium — early signal',
    status: 'soon',
  },
  {
    id: 'mortgage-default',
    title: 'Mortgage Default',
    filing: 'Payment missed / HELOC default',
    stage: 'Early warning',
    value: 'High — lead time advantage',
    status: 'soon',
  },
  {
    id: 'enrichment',
    title: 'Enrichment layers',
    filing: 'Flood zone · Zoning · AVM',
    stage: 'Risk & value context',
    value: 'Underwriting support',
    status: 'partial',
  },
];

export const USE_CASES = [
  {
    segment: 'Fix-and-flip investors',
    pain: 'Stale data means missing the best deals before auction.',
    value: 'Same-day NOD and lis pendens alerts with equity filters.',
  },
  {
    segment: 'Wholesalers',
    pain: 'Manual courthouse research eats 4–6 hours per week.',
    value: '165+ filters, bulk export, and map-based territory planning.',
  },
  {
    segment: 'Real estate attorneys',
    pain: 'Hours spent searching dockets across county portals.',
    value: 'Full property timeline with case numbers and lien holders.',
  },
  {
    segment: 'Mortgage servicers',
    pain: 'No portfolio-level distress monitoring on collateral.',
    value: 'API flags on any parcel in your loan book.',
  },
  {
    segment: 'Hard money lenders',
    pain: 'Hidden collateral distress discovered too late.',
    value: 'Collateral risk scoring and filing alerts.',
  },
  {
    segment: 'Hedge funds / PE',
    pain: 'Nationwide deal sourcing requires custom data pipelines.',
    value: 'Full API access, bulk feeds, and dedicated support.',
  },
  {
    segment: 'Probate professionals',
    pain: 'Estate properties buried in court records.',
    value: 'Probate filing alerts linked to parcel data.',
  },
];

export const TRUST_ITEMS = [
  {
    title: 'Source types',
    items: [
      'County recorder & clerk-of-court portals',
      'Sheriff sale and auction calendars',
      'County assessor & tax records',
      'Probate court filings (select counties)',
    ],
  },
  {
    title: 'Freshness rules',
    items: [
      'Core foreclosure filings: same-day or next business day',
      'Assessor enrichment: weekly refresh',
      'Coverage map updated as new counties go live',
      'Filing date and recording date preserved on every record',
    ],
  },
  {
    title: 'Compliance',
    items: [
      'Lawful use of public records only',
      'No resale of raw county data without license',
      'SOC 2-aligned security practices',
      'GDPR-ready data handling for EU users',
    ],
  },
];

export const ENTERPRISE_FEATURES = [
  { title: 'API keys', description: 'Dedicated keys with custom rate limits and usage dashboards.' },
  { title: 'Data warehouse access', description: 'Direct feeds to Snowflake, BigQuery, or S3-compatible storage.' },
  { title: 'Bulk data feeds', description: 'Scheduled county or state-level delivery in CSV, JSON, or Parquet.' },
  { title: 'Custom alerts', description: 'Polygon watch areas, portfolio triggers, and webhook delivery.' },
  { title: 'Portfolio monitoring', description: 'Distress checks across thousands of parcels in your loan book.' },
  { title: 'Dedicated support', description: 'Slack channel, SLA, and onboarding for your data team.' },
];

export const MARKET_INSIGHTS = [
  {
    title: 'Weekly foreclosure pulse',
    description: 'County-level filing volume and week-over-week trends.',
    tag: 'Market update',
  },
  {
    title: 'Top distressed ZIPs',
    description: 'Highest-concentration ZIP codes by filing type and equity band.',
    tag: 'Research',
  },
  {
    title: 'Auction calendar trends',
    description: 'Upcoming sale dates, average judgment amounts, and sold ratios.',
    tag: 'Auction intel',
  },
  {
    title: 'Probate filing trends',
    description: 'Estate activity by county — a leading indicator for off-market deals.',
    tag: 'Probate',
  },
];

export const DASHBOARD_IA = [
  { zone: 'Left sidebar', component: 'Filters', description: 'State, county, ZIP, filing type, dates, equity, lien flags' },
  { zone: 'Center', component: 'Map view', description: 'Clustered pins color-coded by filing stage and urgency' },
  { zone: 'Right drawer', component: 'Property detail', description: 'Timeline, owner, liens, auction, flood zone, equity' },
  { zone: 'Top bar', component: 'Search & controls', description: 'Address search, view toggle, active filters, export' },
  { zone: 'Bottom bar', component: 'Summary stats', description: 'Result count, avg judgment, auction calendar strip' },
];

export const ABOUT = {
  mission:
    'Real estate investors lose hours jumping between county sites, PDF dockets, and outdated spreadsheets. FreshLien unifies distressed property intelligence into one searchable platform — with map view, alerts, API access, and the context you need to evaluate a deal in minutes.',
  story:
    'We built FreshLien because speed is the product. When a lis pendens hits the docket today, the investor who sees it first contacts the homeowner before anyone else. That first-mover advantage is worth tens of thousands per deal — and it requires county-direct data, not month-old aggregator feeds.',
  values: [
    {
      title: 'Speed is the product',
      text: 'Same-day updates from official county sources. Foreclosure windows are short — your data should keep pace.',
    },
    {
      title: 'Data you can trust',
      text: 'Every record links to case numbers, sale dates, and source portals. Transparent coverage with no black-box claims.',
    },
    {
      title: 'Built for the field',
      text: 'Map-first search, county filters, CSV export, and API access designed for investors who move fast.',
    },
    {
      title: 'Full distress spectrum',
      text: 'Foreclosure, probate, tax delinquency, and default signals in one platform — not siloed point solutions.',
    },
  ],
};
