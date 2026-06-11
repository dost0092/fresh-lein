export const PLATFORM_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    isFree: true,
    stripePlanId: null,
    description: 'Explore foreclosure deals at no cost — no credit card required.',
    features: [
      '1 county',
      '50 record views/month',
      'Map & list search',
      'Basic filters',
      'Save up to 5 properties',
    ],
    cta: 'Get started free',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    stripePlanId: 'starter',
    description: 'One county, core search and export.',
    features: ['1 county', '500 records/month', 'CSV export', 'Saved properties', 'Email alerts'],
    cta: 'Subscribe — $15/mo',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25,
    stripePlanId: 'pro',
    description: 'Multi-county coverage for active investors.',
    features: ['5 counties', '5,000 records/month', 'Unlimited exports', 'Saved searches', 'Alerts'],
    cta: 'Subscribe — $25/mo',
    popular: true,
    ctaVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    description: 'Teams, unlimited counties, and priority support.',
    features: ['Unlimited counties', 'Unlimited records', 'Team accounts', 'Analytics dashboard', 'Priority support'],
    cta: 'Contact Sales',
    popular: false,
    ctaVariant: 'green',
  },
];

export const API_PLANS = [
  {
    id: 'api-dev',
    name: 'Developer',
    price: 49,
    description: 'Integrate foreclosure data into your app or workflow.',
    features: ['10,000 API calls/mo', 'Search & record endpoints', 'JSON responses', 'Standard support'],
    cta: 'Get API Key',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    id: 'api-scale',
    name: 'Scale',
    price: 149,
    description: 'Higher volume for proptech, CRMs, and data teams.',
    features: ['100,000 API calls/mo', 'Bulk county queries', 'Higher rate limits', 'Priority support'],
    cta: 'Get API Key',
    popular: true,
    ctaVariant: 'primary',
  },
  {
    id: 'api-enterprise',
    name: 'Enterprise API',
    price: null,
    description: 'Custom limits, SLAs, and dedicated infrastructure.',
    features: ['Unlimited calls (fair use)', 'Dedicated API keys', 'Custom counties', 'SLA & onboarding'],
    cta: 'Contact Sales',
    popular: false,
    ctaVariant: 'green',
  },
];

export const PLATFORM_COMPARE_ROWS = [
  {
    category: 'Coverage',
    items: [
      { label: 'Counties included', free: '1', starter: '1', pro: '5', enterprise: 'Unlimited' },
      { label: 'Records per month', free: '50 views', starter: '500', pro: '5,000', enterprise: 'Unlimited' },
      { label: 'Active foreclosure data', free: true, starter: true, pro: true, enterprise: true },
      { label: 'Pre-foreclosure (coming soon)', free: false, starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Search & map',
    items: [
      { label: 'Address / ZIP search', free: true, starter: true, pro: true, enterprise: true },
      { label: 'Interactive map explorer', free: true, starter: true, pro: true, enterprise: true },
      { label: 'List view + filters', free: true, starter: true, pro: true, enterprise: true },
      { label: 'Saved searches', free: false, starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Export & alerts',
    items: [
      { label: 'CSV export', free: false, starter: '200 rows', pro: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Email alerts', free: false, starter: '1 county', pro: '5 counties', enterprise: 'Unlimited' },
      { label: 'Saved properties', free: '5 max', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { label: 'Analytics dashboard', free: false, starter: false, pro: true, enterprise: true },
      { label: 'Team accounts', free: false, starter: false, pro: false, enterprise: true },
      { label: 'Priority support', free: false, starter: false, pro: false, enterprise: true },
    ],
  },
];

export const API_COMPARE_ROWS = [
  {
    category: 'Access',
    items: [
      { label: 'Monthly API calls', 'api-dev': '10,000', 'api-scale': '100,000', 'api-enterprise': 'Custom' },
      { label: 'REST API (JSON)', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'API keys', 'api-dev': '1', 'api-scale': '3', 'api-enterprise': 'Unlimited' },
      { label: 'Rate limit', 'api-dev': '10/sec', 'api-scale': '50/sec', 'api-enterprise': 'Custom' },
    ],
  },
  {
    category: 'Endpoints',
    items: [
      { label: 'Foreclosure search', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'Record by ID', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'County bulk export', 'api-dev': false, 'api-scale': true, 'api-enterprise': true },
      { label: 'Webhooks (coming soon)', 'api-dev': false, 'api-scale': true, 'api-enterprise': true },
    ],
  },
  {
    category: 'Data',
    items: [
      { label: 'Same-day court freshness', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'Lien & equity fields', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'Custom county packs', 'api-dev': false, 'api-scale': false, 'api-enterprise': true },
    ],
  },
  {
    category: 'Support',
    items: [
      { label: 'Documentation', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'Email support', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
      { label: 'SLA', 'api-dev': false, 'api-scale': false, 'api-enterprise': true },
    ],
  },
];
