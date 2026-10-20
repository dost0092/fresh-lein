export const COMPANY = {
  name: 'FreshLien',
  tagline: 'Data, AI, and growth services for real estate',
  description:
    'FreshLien is a services company for real estate. We build data pipelines, zoning and permit intelligence, AI models, CRM automation, campaigns, and custom software that clients own.',
  contactEmail: 'waqasdostdost0092@gmail.com',
  website: 'https://freshlien.com',
  apiBaseUrl: 'https://freshlien.com/api',
  /** Prefer FRESHLIEN_LEADS_EMAIL / VITE_LEADS_EMAIL when set for form routing docs. */
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
