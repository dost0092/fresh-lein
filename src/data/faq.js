import { MARKETING_COVERAGE } from '@/data/marketingStats';

export const FAQ_ITEMS = [
  {
    q: 'What is FreshLien?',
    a: 'FreshLien is a same-day distressed real estate intelligence platform for investors, wholesalers, attorneys, and data teams. We aggregate county-direct pre-foreclosure, foreclosure, probate, tax lien, and mortgage default filings — then deliver them through a web app, REST API, and bulk export feeds.',
  },
  {
    q: 'Where does your data come from?',
    a: 'Our records are sourced directly from U.S. county recorders, clerk-of-court portals, sheriff sale calendars, and official public databases — the same lawful public records used in professional due diligence. We normalize addresses, case numbers, sale dates, and lien flags so you can search in one place.',
  },
  {
    q: 'Which counties and states do you cover?',
    a: `FreshLien covers ${MARKETING_COVERAGE.counties} counties across ${MARKETING_COVERAGE.states} states with ${MARKETING_COVERAGE.foreclosureRecords} normalized filings and ${MARKETING_COVERAGE.propertiesIndexed} indexed properties. We add new counties weekly. See the coverage section on our homepage for the latest figures.`,
  },
  {
    q: 'How fresh is the data?',
    a: 'Core foreclosure filings are updated same-day or next business day from county sources. Legacy platforms that rely on third-party aggregators often lag 30–60 days. Speed is our core product — investors who see a filing first contact the homeowner before the crowd.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Every account starts on our Free plan — map search, list view, and basic filters in one county with no credit card required. Upgrade to Starter or Pro when you need more counties, exports, alerts, and API access.',
  },
  {
    q: 'What plans do you offer?',
    a: 'We offer Free, Starter, Pro, and Enterprise platform plans for investors, plus API tiers for developers and data teams. See our Pricing page for coverage limits, export quotas, alert zones, and API call allowances.',
  },
  {
    q: 'Can I export data?',
    a: 'Yes. Paid subscribers can export filtered results to CSV for underwriting, CRM import, or offline analysis. Enterprise plans include bulk warehouse feeds and unlimited export volume.',
  },
  {
    q: 'Do you offer an API?',
    a: 'Yes. Our REST API delivers normalized filing data for integrations, portfolio monitoring, and custom dashboards. API pricing is on the Pricing page under the API tab.',
  },
  {
    q: 'How do county alerts work?',
    a: 'Save counties or search criteria and get notified when new filings match. Alerts help you catch deals the day they hit the docket.',
  },
  {
    q: 'What data categories do you cover?',
    a: 'Active foreclosure and sheriff sale data is live today. Pre-foreclosure, probate, REO, tax delinquency, and mortgage default categories are rolling out county by county — all visible in the platform with clear coverage indicators.',
  },
  {
    q: 'How do I contact support or sales?',
    a: 'Email us at waqasdostdost0092@gmail.com or use the Contact page. We typically respond within 1–2 business days.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel your subscription from Billing settings. Access continues through the end of your billing period.',
  },
];
