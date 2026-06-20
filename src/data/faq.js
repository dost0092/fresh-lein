import { MARKETING_COVERAGE } from '@/data/marketingStats';

export const FAQ_ITEMS = [
  {
    q: 'What is FreshLien?',
    a: 'FreshLien pulls public county and court records into one searchable product. You get map search, alerts, CSV export, and an API for foreclosure filings and related distress signals.',
  },
  {
    q: 'Where does your data come from?',
    a: 'We pull from county clerks, recorders, sheriff sale calendars, and court portals. These are the same public filings attorneys and investors use in due diligence. We normalize addresses, case numbers, and sale dates into one dataset.',
  },
  {
    q: 'Which counties and states do you cover?',
    a: `Today you can search ${MARKETING_COVERAGE.foreclosureFilingsLiveFull} foreclosure filings across ${MARKETING_COVERAGE.counties} counties in ${MARKETING_COVERAGE.states} states, with ${MARKETING_COVERAGE.propertiesLinkedFull} properties linked. We add counties regularly. Check the coverage section for what is live vs coming soon.`,
  },
  {
    q: 'How fresh is the data?',
    a: `Priority counties refresh ${MARKETING_COVERAGE.dataRefresh.toLowerCase()} or the next business day. Many list brokers still ship data that is weeks old. We focus on speed for the counties we have live.`,
  },
  {
    q: 'What do the coverage numbers mean?',
    a: `Numbers like ${MARKETING_COVERAGE.foreclosureFilingsLive} indexed filings are what you can search right now. Bigger national figures (for example ~${MARKETING_COVERAGE.foreclosureFilingsAnnualUS} foreclosure filings per year in the U.S.) show the size of the market. They are not a claim that we index every filing nationwide.`,
  },
  {
    q: 'Is probate data available?',
    a: `Not everywhere yet. Probate is rolling out county by county. The U.S. sees roughly ${MARKETING_COVERAGE.probateCasesAnnualUS} probate cases per year, and each market is labeled live or coming soon as we connect sources.`,
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Start free with map search, list view, and basic filters in one county. No credit card required. Upgrade when you need more counties, exports, and alerts.',
  },
  {
    q: 'What plans do you offer?',
    a: 'Free, Starter, Pro, and Enterprise for the web app, plus API tiers for developers. See Pricing for county limits and export quotas.',
  },
  {
    q: 'Can I export data?',
    a: 'Yes. Paid plans can export filtered results to CSV for underwriting, CRM import, or offline review.',
  },
  {
    q: 'Do you offer an API?',
    a: 'Yes. Our REST API returns normalized filing data for integrations and custom dashboards. API pricing is on the Pricing page.',
  },
  {
    q: 'How do county alerts work?',
    a: 'Save counties or search criteria and get notified when new filings match. Useful when you want to see deals the day they hit public record.',
  },
  {
    q: 'How do I contact support or sales?',
    a: 'Email waqasdostdost0092@gmail.com or use the Contact page. We usually reply within 1 to 2 business days.',
  },
];
