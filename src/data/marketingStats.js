/** Marketing-facing coverage numbers — B2B positioning (update as live inventory grows). */
export const MARKETING_COVERAGE = {
  counties: '250+',
  countiesMin: 250,
  foreclosureRecords: '100,000+',
  foreclosureRecordsCompact: '100K+',
  propertiesIndexed: '500K+',
  states: '40+',
  statesMin: 40,
  dataRefresh: 'Same-day',
  coverageSubtitle:
    'Distressed property intelligence sourced from county clerk, recorder, and court filings — normalized for search, map, export, and API access.',
};

/** Format county count for display. */
export function formatCountiesDisplay() {
  return MARKETING_COVERAGE.counties;
}

/** Format record count — compact for nav/hero, full for coverage sections. */
export function formatForeclosureRecordsDisplay({ compact = false } = {}) {
  return compact
    ? MARKETING_COVERAGE.foreclosureRecordsCompact
    : MARKETING_COVERAGE.foreclosureRecords;
}
