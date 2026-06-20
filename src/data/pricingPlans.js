export const PLATFORM_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    isFree: true,
    stripePlanId: null,
    description: 'Explore distressed property data. No credit card required.',
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
    description: 'One state, core search, export, and alerts for active investors.',
    features: [
      '1 state coverage',
      '500 record views/month',
      'CSV export (200 rows)',
      '1 watch-area alert',
      'Saved properties & searches',
    ],
    cta: 'Subscribe at $15/mo',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25,
    stripePlanId: 'pro',
    description: 'Multi-state coverage, analytics, and higher export limits.',
    features: [
      '5 states coverage',
      '5,000 record views/month',
      'Unlimited CSV exports',
      '10 watch-area alerts',
      'Analytics dashboard',
      '1,000 API calls/month',
    ],
    cta: 'Subscribe at $25/mo',
    popular: true,
    ctaVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    description: 'Nationwide coverage, portfolio monitoring, and dedicated support.',
    features: [
      'All 50 states',
      'Unlimited records & exports',
      'Portfolio monitoring',
      'Bulk warehouse feeds',
      'Custom alerts & webhooks',
      'Dedicated Slack support',
    ],
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
    description: 'Integrate distressed property data into your app or workflow.',
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
    description: 'Custom limits, SLAs, warehouse feeds, and dedicated infrastructure.',
    features: ['Unlimited calls (fair use)', 'Dedicated API keys', 'Custom county packs', 'SLA & onboarding'],
    cta: 'Contact Sales',
    popular: false,
    ctaVariant: 'green',
  },
];

export const PLATFORM_COMPARE_ROWS = [
  {
    category: 'Coverage',
    items: [
      { label: 'States included', free: '1 county', starter: '1 state', pro: '5 states', enterprise: 'All 50' },
      { label: 'Record views/month', free: '50', starter: '500', pro: '5,000', enterprise: 'Unlimited' },
      { label: 'Active foreclosure data', free: true, starter: true, pro: true, enterprise: true },
      { label: 'Pre-foreclosure', free: false, starter: false, pro: true, enterprise: true },
      { label: 'Probate filings', free: false, starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Search & map',
    items: [
      { label: 'Address / ZIP search', free: true, starter: true, pro: true, enterprise: true },
      { label: 'Interactive map explorer', free: true, starter: true, pro: true, enterprise: true },
      { label: 'List view + 50+ filters', free: 'Basic', starter: true, pro: true, enterprise: true },
      { label: 'Saved searches', free: false, starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Export & alerts',
    items: [
      { label: 'CSV export', free: false, starter: '200 rows', pro: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Watch-area alerts', free: false, starter: '1 area', pro: '10 areas', enterprise: 'Unlimited' },
      { label: 'Skip trace', free: false, starter: false, pro: '$0.25/record', enterprise: '$0.20/record' },
      { label: 'Saved properties', free: '5 max', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { label: 'Analytics dashboard', free: false, starter: false, pro: true, enterprise: true },
      { label: 'API access', free: false, starter: false, pro: '1,000/mo', enterprise: 'Unlimited' },
      { label: 'Portfolio monitoring', free: false, starter: false, pro: false, enterprise: true },
      { label: 'Dedicated support', free: false, starter: 'Email', pro: 'Priority email', enterprise: 'Slack + SLA' },
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
      { label: 'Webhooks', 'api-dev': false, 'api-scale': true, 'api-enterprise': true },
    ],
  },
  {
    category: 'Data',
    items: [
      { label: 'Same-day county freshness', 'api-dev': true, 'api-scale': true, 'api-enterprise': true },
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
