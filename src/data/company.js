export const COMPANY = {
  name: 'FreshLien',
  tagline: 'Real estate data and workflow automation',
  description:
    'FreshLien builds real estate data and automation systems that turn fragmented property records into qualified opportunities, automated workflows, and measurable business results.',
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
