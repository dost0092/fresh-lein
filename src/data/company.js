export const COMPANY = {
  name: 'FreshLien',
  tagline: 'Real estate automation consultancy',
  description:
    'FreshLien helps real estate teams automate distressed deals. We consult and build: lead delivery, skip trace, SMS, CRM sync, offer PDFs, dashboards, and custom software, backed by our own county-direct data platform.',
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
