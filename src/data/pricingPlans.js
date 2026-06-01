export const PLATFORM_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    description: 'One county, core search and export.',
    features: ['1 county', '500 records/month', 'CSV export', 'Saved properties', 'Email alerts'],
    cta: 'Get Started',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25,
    description: 'Multi-county coverage for active investors.',
    features: ['5 counties', '5,000 records/month', 'Unlimited exports', 'Saved searches', 'Alerts'],
    cta: 'Get Started',
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
      { label: 'Counties included', starter: '1', pro: '5', enterprise: 'Unlimited' },
      { label: 'Records per month', starter: '500', pro: '5,000', enterprise: 'Unlimited' },
      { label: 'Active foreclosure data', starter: true, pro: true, enterprise: true },
      { label: 'Pre-foreclosure (coming soon)', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Search & map',
    items: [
      { label: 'Address / ZIP search', starter: true, pro: true, enterprise: true },
      { label: 'Interactive map explorer', starter: true, pro: true, enterprise: true },
      { label: 'List view + filters', starter: true, pro: true, enterprise: true },
      { label: 'Saved searches', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Export & alerts',
    items: [
      { label: 'CSV export', starter: '200 rows', pro: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Email alerts', starter: '1 county', pro: '5 counties', enterprise: 'Unlimited' },
      { label: 'Saved properties', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { label: 'Analytics dashboard', starter: false, pro: true, enterprise: true },
      { label: 'Team accounts', starter: false, pro: false, enterprise: true },
      { label: 'Priority support', starter: false, pro: false, enterprise: true },
    ],
  },
];

export const API_COMPARE_ROWS = [
  {
    category: 'Access',
    items: [
      { label: 'Monthly API calls', starter: '10,000', pro: '100,000', enterprise: 'Custom' },
      { label: 'REST API (JSON)', starter: true, pro: true, enterprise: true },
      { label: 'API keys', starter: '1', pro: '3', enterprise: 'Unlimited' },
      { label: 'Rate limit', starter: '10/sec', pro: '50/sec', enterprise: 'Custom' },
    ],
  },
  {
    category: 'Endpoints',
    items: [
      { label: 'Foreclosure search', starter: true, pro: true, enterprise: true },
      { label: 'Record by ID', starter: true, pro: true, enterprise: true },
      { label: 'County bulk export', starter: false, pro: true, enterprise: true },
      { label: 'Webhooks (coming soon)', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Data',
    items: [
      { label: 'Same-day court freshness', starter: true, pro: true, enterprise: true },
      { label: 'Lien & equity fields', starter: true, pro: true, enterprise: true },
      { label: 'Custom county packs', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Support',
    items: [
      { label: 'Documentation', starter: true, pro: true, enterprise: true },
      { label: 'Email support', starter: true, pro: true, enterprise: true },
      { label: 'SLA', starter: false, pro: false, enterprise: true },
    ],
  },
];
