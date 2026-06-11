export const COMPANY = {
  name: 'FreshLien',
  tagline: 'AI-driven foreclosure intelligence',
  description:
    'FreshLien helps real estate investors discover high-equity foreclosure deals with court-sourced data, map-based search, and AI-powered insights.',
  contactEmail: 'waqasdostdost0092@gmail.com',
  year: new Date().getFullYear(),
};

export const CONTACT_MAILTO = `mailto:${COMPANY.contactEmail}`;
export const CONTACT_MAILTO_SUBJECT = (subject) =>
  `mailto:${COMPANY.contactEmail}?subject=${encodeURIComponent(subject)}`;
