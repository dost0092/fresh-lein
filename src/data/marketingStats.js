/** Marketing-facing coverage numbers (display with + suffix). */
export const MARKETING_COVERAGE = {
  counties: '90+',
  countiesMin: 90,
  foreclosureRecords: '2,300+',
  states: '15+',
};

/** Format live county count for display — uses marketing label. */
export function formatCountiesDisplay() {
  return MARKETING_COVERAGE.counties;
}
