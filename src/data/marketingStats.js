/**
 * Public coverage numbers. Update liveInventory as county integrations grow.
 */
export const MARKETING_COVERAGE = {
  counties: '250+',
  countiesMin: 250,
  states: '40+',
  statesMin: 40,

  foreclosureFilingsLive: '100K+',
  foreclosureFilingsLiveFull: '100,000+',
  propertiesLinked: '120K+',
  propertiesLinkedFull: '120,000+',

  foreclosureFilingsAnnualUS: '367K+',
  foreclosureFilingsMonthlyPeak: '40K+',
  probateCasesAnnualUS: '2.6M+',
  stateCourtFilingsAnnualUS: '70M+',

  dataRefresh: 'Same-day',
  dataRefreshDetail: 'Same-day on priority counties',

  coverageSubtitle:
    'We pull from county clerk, recorder, and court records, then normalize the data so you can search, set alerts, and export.',
  coverageLead:
    'Right now you can search 100K+ foreclosure filings across 250+ counties. Probate, pre-foreclosure, and more court data are rolling out market by market, with clear live and coming-soon labels.',
};

/** Four coverage stats shown on landing and about (label first, number below). */
export const COVERAGE_DISPLAY_STATS = [
  {
    id: 'foreclosure-indexed',
    label: 'Foreclosure filings in our database',
    value: MARKETING_COVERAGE.foreclosureFilingsLive,
  },
  {
    id: 'counties',
    label: 'Priority counties covered',
    value: MARKETING_COVERAGE.counties,
  },
  {
    id: 'properties-linked',
    label: 'Properties linked to parcels',
    value: MARKETING_COVERAGE.propertiesLinked,
  },
  {
    id: 'states',
    label: 'States with live data',
    value: MARKETING_COVERAGE.states,
  },
];

/** @deprecated Use COVERAGE_DISPLAY_STATS */
export const COVERAGE_HERO_STATS = COVERAGE_DISPLAY_STATS;

/** @deprecated Use COVERAGE_DISPLAY_STATS */
export const COVERAGE_MILESTONE_STATS = COVERAGE_DISPLAY_STATS;

export const COVERAGE_STAT_CARDS = [
  {
    id: 'foreclosure-live',
    value: MARKETING_COVERAGE.foreclosureFilingsLive,
    label: 'Foreclosure filings indexed',
    detail: 'Searchable in the product today',
    status: 'live',
  },
  {
    id: 'counties',
    value: MARKETING_COVERAGE.counties,
    label: 'Priority counties',
    detail: 'Clerk, recorder, and sheriff-sale sources',
    status: 'live',
  },
  {
    id: 'monthly-peak',
    value: MARKETING_COVERAGE.foreclosureFilingsMonthlyPeak,
    label: 'Peak-month filings',
    detail: 'Typical volume when markets are active',
    status: 'live',
  },
  {
    id: 'refresh',
    value: MARKETING_COVERAGE.dataRefresh,
    label: 'County data refresh',
    detail: 'Priority counties update same-day or next business day',
    status: 'live',
  },
];

export const COVERAGE_ROADMAP = [
  {
    id: 'foreclosure-annual',
    category: 'Foreclosure filings',
    freshlienToday: `${MARKETING_COVERAGE.foreclosureFilingsLive} indexed`,
    nationalUniverse: `${MARKETING_COVERAGE.foreclosureFilingsAnnualUS} / year (U.S. est.)`,
    note: 'Adding counties every week',
    status: 'live',
  },
  {
    id: 'probate',
    category: 'Probate cases',
    freshlienToday: 'Building county coverage',
    nationalUniverse: `${MARKETING_COVERAGE.probateCasesAnnualUS} / year (U.S. est.)`,
    note: 'Estate filings tied to parcel data',
    status: 'soon',
  },
  {
    id: 'state-court',
    category: 'State court filings',
    freshlienToday: 'Select counties live',
    nationalUniverse: `${MARKETING_COVERAGE.stateCourtFilingsAnnualUS} / year (U.S. est.)`,
    note: 'Lis pendens, judgments, distress signals',
    status: 'partial',
  },
  {
    id: 'pre-foreclosure',
    category: 'Pre-foreclosure & tax',
    freshlienToday: 'Rolling out by county',
    nationalUniverse: 'Varies by recorder',
    note: 'NOD, tax delinquency, default signals',
    status: 'soon',
  },
];

export function formatCountiesDisplay() {
  return MARKETING_COVERAGE.counties;
}

export function formatForeclosureRecordsDisplay({ compact = false } = {}) {
  return compact
    ? MARKETING_COVERAGE.foreclosureFilingsLive
    : MARKETING_COVERAGE.foreclosureFilingsLiveFull;
}
