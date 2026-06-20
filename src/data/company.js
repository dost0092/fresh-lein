export const COMPANY = {
  name: 'FreshLien',
  tagline: 'Same-day distressed real estate intelligence',
  description:
    'FreshLien delivers county-direct pre-foreclosure, foreclosure, probate, tax lien, and mortgage default intelligence to real estate investors, wholesalers, attorneys, and data teams — through a web app, REST API, and bulk export feeds.',
  contactEmail: 'waqasdostdost0092@gmail.com',
  website: 'https://freshlien.com',
  apiBaseUrl: 'https://freshlien.com/api',
  year: new Date().getFullYear(),
};

export const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/freshlien',
    label: 'Follow FreshLien on LinkedIn',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/FreshLien/61590612976427/',
    label: 'Follow FreshLien on Facebook',
  },
];

export const CONTACT_MAILTO = `mailto:${COMPANY.contactEmail}`;
export const CONTACT_MAILTO_SUBJECT = (subject) =>
  `mailto:${COMPANY.contactEmail}?subject=${encodeURIComponent(subject)}`;
