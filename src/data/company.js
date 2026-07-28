export const COMPANY = {
  name: 'FreshLien',
  tagline: 'Data engineering, automation, and AI for real estate',
  description:
    'FreshLien offers data engineering, automation, and AI services for real estate teams. Cleaner leads, CRM workflows, follow-up, and offers from county records and property files.',
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
