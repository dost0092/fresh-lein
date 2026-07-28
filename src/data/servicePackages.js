/**
 * Service packages and starting prices — single source of truth.
 * REVIEW: confirm final prices before production marketing claims.
 */
export const SERVICE_PACKAGES = [
  {
    id: 'workflow-audit',
    name: 'Workflow Audit',
    priceLabel: 'From $750',
    priceNote: 'One-time',
    href: '/book-audit',
    cta: 'Book an Audit',
    description:
      'We map your current process, calculate time loss, identify automation opportunities, and create a prioritized implementation roadmap.',
    deliverables: [
      'Workflow map',
      'Tool and data inventory',
      'Bottleneck analysis',
      'Estimated time and cost loss',
      '30/60/90-day roadmap',
    ],
    bestFor: 'Companies deciding what to automate first',
  },
  {
    id: 'lead-pipeline-sprint',
    name: 'Lead Pipeline Sprint',
    priceLabel: 'From $4,000',
    priceNote: 'Implementation · optional monitoring from $750/mo',
    href: '/contact?topic=Lead%20Pipeline%20Sprint',
    cta: 'Discuss a Lead Pipeline',
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
    name: 'Acquisition Automation System',
    priceLabel: 'From $8,000',
    priceNote: 'Implementation · ongoing plans available',
    href: '/contact?topic=Acquisition%20Automation',
    cta: 'Automate Acquisitions',
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
    name: 'Custom Real Estate Operating System',
    priceLabel: 'Custom scope',
    priceNote: 'Implementation and ongoing platform fee',
    href: '/contact?topic=Custom%20Operating%20System',
    cta: 'Discuss Your Operation',
    description:
      'Build a connected system spanning public records, property data, CRM operations, acquisitions, dispositions, documents, and analytics.',
    deliverables: [
      'Multi-workflow architecture',
      'Integrations across your stack',
      'Reporting and monitoring',
      'Training and handoff',
    ],
    bestFor: 'Multi-market or multi-team operations',
  },
];

export const PRICING_DISCLAIMER =
  'Final pricing depends on data sources, record volume, integrations, workflow complexity, hosting, support requirements, and required customization.';

export const GOOD_FIT = {
  yes: [
    'The company processes recurring property or lead data.',
    'Employees repeat the same steps weekly.',
    'Several systems contain overlapping information.',
    'The company already spends money on data, VAs, marketing, or CRM tools.',
    'A measurable operational result can be defined.',
  ],
  no: [
    'The company has no repeatable workflow.',
    'The request is only for an inexpensive generic website.',
    'There is no internal owner for the project.',
    'The customer expects guaranteed leads or deals.',
    'Required data cannot legally or technically be accessed.',
  ],
};

export const ENGAGEMENT_MODEL = [
  'Paid workflow audit',
  'Defined implementation proposal',
  'Pilot workflow',
  'Validation period',
  'Production deployment',
  'Ongoing care and optimization',
];
