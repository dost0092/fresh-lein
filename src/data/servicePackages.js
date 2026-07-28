/**
 * Service offers: details only, no public prices.
 * Commercial terms are discussed after contact / workflow review.
 */
export const SERVICE_PACKAGES = [
  {
    id: 'workflow-audit',
    name: 'Workflow review',
    offerLabel: 'Custom offer',
    offerNote: 'Scoped after a short intake call',
    href: '/book-audit',
    cta: 'Request a review',
    description:
      'We map how you work today, find where time is lost, and give you a clear order of what to automate first.',
    deliverables: [
      'Workflow map',
      'Tool and data inventory',
      'Bottleneck analysis',
      'Estimated time loss',
      '30/60/90-day roadmap',
    ],
    bestFor: 'Teams deciding what to automate first',
  },
  {
    id: 'lead-pipeline-sprint',
    name: 'Lead pipeline sprint',
    offerLabel: 'Custom offer',
    offerNote: 'One source-to-CRM workflow',
    href: '/contact?topic=Lead%20Pipeline%20Sprint',
    cta: 'Discuss this offer',
    description:
      'Automate one high-value lead source from collection through cleaning, qualification, and CRM delivery.',
    deliverables: [
      'One defined data workflow',
      'Cleaning and normalization',
      'Duplicate management',
      'CRM integration',
      'Monitoring and documentation',
    ],
    bestFor: 'One defined source-to-CRM workflow',
  },
  {
    id: 'acquisition-automation',
    name: 'Acquisition automation',
    offerLabel: 'Custom offer',
    offerNote: 'Built around your acquisition process',
    href: '/contact?topic=Acquisition%20Automation',
    cta: 'Discuss this offer',
    description:
      'Connect lead assignment, research, follow-up, offer generation, approvals, and reporting.',
    deliverables: [
      'CRM workflow configuration',
      'Lead routing',
      'Follow-up automation',
      'Offer workflow',
      'KPI dashboard',
      'Team documentation',
    ],
    bestFor: 'Acquisition teams with repeatable lead volume',
  },
  {
    id: 'custom-os',
    name: 'Custom operating system',
    offerLabel: 'Custom offer',
    offerNote: 'Multi-market or multi-team ops',
    href: '/contact?topic=Custom%20Operating%20System',
    cta: 'Discuss this offer',
    description:
      'A connected system across public records, property data, CRM, acquisitions, dispositions, documents, and analytics.',
    deliverables: [
      'Multi-workflow architecture',
      'Integrations across your stack',
      'Reporting and monitoring',
      'Training and handoff',
    ],
    bestFor: 'Multi-market or multi-team operations',
  },
];

export const OFFER_DISCLAIMER =
  'FreshLien offers data engineering, automation, and AI services for real estate. Every engagement is scoped to your data sources, volume, integrations, and workflow. Contact us to discuss fit and terms. There is no self-serve checkout for services.';

/** @deprecated use OFFER_DISCLAIMER */
export const PRICING_DISCLAIMER = OFFER_DISCLAIMER;

export const GOOD_FIT = {
  yes: [
    'You process recurring property or lead data.',
    'Your team repeats the same steps every week.',
    'Several systems hold overlapping information.',
    'You already spend on data, VAs, marketing, or CRM tools.',
    'You can define a measurable operational result.',
  ],
  no: [
    'There is no repeatable workflow.',
    'You only need an inexpensive generic website.',
    'Nobody inside will own the project.',
    'You expect guaranteed leads or deals.',
    'Required data cannot legally or technically be accessed.',
  ],
};

export const ENGAGEMENT_MODEL = [
  'Discovery / workflow review',
  'Defined implementation proposal',
  'Pilot workflow',
  'Validation period',
  'Production deployment',
  'Ongoing care and optimization',
];
