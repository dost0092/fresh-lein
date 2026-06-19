import { MARKETING_COVERAGE } from '@/data/marketingStats';

export const FAQ_ITEMS = [
  {
    q: 'What is FreshLien?',
    a: 'FreshLien is an AI-driven foreclosure intelligence platform for real estate investors, wholesalers, and proptech teams. We aggregate court-sourced foreclosure filings, map them by property, and surface urgency signals like sale dates, starting bids, and estimated equity.',
  },
  {
    q: 'Where does your data come from?',
    a: 'Our records are sourced from county court and sheriff sale filings — the same public records investors use to research auctions. We normalize addresses, statuses, and sale dates so you can search and filter in one place.',
  },
  {
    q: 'Which counties and states do you cover?',
    a: `FreshLien covers ${MARKETING_COVERAGE.counties} counties across ${MARKETING_COVERAGE.states} states with ${MARKETING_COVERAGE.foreclosureRecords} normalized foreclosure and auction records. We add new counties weekly as we expand official clerk and sheriff-sale integrations. See the homepage data coverage section for the latest figures.`,
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Every account starts on our Free plan — map search, list view, and basic filters in one county with no credit card required. Upgrade to Starter or Pro when you need more counties, exports, and alerts.',
  },
  {
    q: 'Is there a free trial on paid plans?',
    a: 'Yes. When you upgrade to Starter or Pro, you get a 13-day trial with full paid features before your first charge.',
  },
  {
    q: 'What plans do you offer?',
    a: 'We offer Free, Starter, and Pro platform plans for investors, plus API tiers for developers. See our Pricing page for details.',
  },
  {
    q: 'Can I export foreclosure data?',
    a: 'Yes. Pro subscribers can export filtered results to CSV for underwriting, CRM import, or offline analysis.',
  },
  {
    q: 'Do you offer an API?',
    a: 'Yes. Our Foreclosure API delivers normalized case data for integrations, skip-trace workflows, and custom dashboards. API pricing is on the Pricing page under the API tab.',
  },
  {
    q: 'How do county alerts work?',
    a: 'Save counties or search criteria and get notified when new filings match. Alerts help you catch deals the day they hit the docket.',
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
