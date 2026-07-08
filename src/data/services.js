import {
  Database,
  LayoutDashboard,
  Workflow,
  Plug,
  Bot,
  AppWindow,
  Search,
  MessageSquare,
  FileText,
  Handshake,
  Users,
} from 'lucide-react';

/**
 * FreshLien services menu — what we build and deliver for clients.
 * The platform is an optional product; services are the main offer.
 */
export const SERVICES = [
  {
    icon: Database,
    id: 'lead-delivery',
    name: 'Distressed lead delivery',
    tagline: 'Your counties, every morning',
    description:
      'We set up daily foreclosure, auction, and distress filings for the markets you care about. CSV, email digest, webhook, or straight into your CRM.',
    includes: [
      'County and court data feeds',
      'CSV, email, or webhook delivery',
      'Owner, case, auction, and bid fields',
      'Filters for your markets',
    ],
  },
  {
    icon: Search,
    id: 'skip-trace',
    name: 'Skip trace and owner contact setups',
    tagline: 'Phones and emails on your leads',
    description:
      'We wire skip-trace providers into your workflow so new leads can get owner phones and emails automatically. You keep your own vendor account and keys.',
    includes: [
      'Skip-trace API integration',
      'Results stored on each lead',
      'Manual fallback when data is thin',
      'Compliance-friendly data flow',
    ],
  },
  {
    icon: MessageSquare,
    id: 'outreach',
    name: 'SMS and email outreach systems',
    tagline: 'Follow-up that runs without babysitting',
    description:
      'We design and build outreach for your team: Twilio SMS, email sequences, templates with merge fields, and STOP opt-out handling. Sequences match how you actually work.',
    includes: [
      'Twilio SMS setup and templates',
      'Email sequences and merge fields',
      'Per-client timing (3-day, 7-day, etc.)',
      'Opt-out and activity logging',
    ],
  },
  {
    icon: Workflow,
    id: 'crm-automation',
    name: 'CRM and pipeline automation',
    tagline: 'Your CRM, fed and kept in sync',
    description:
      'We connect distressed leads into Follow Up Boss, Podio, Pipedrive, GoHighLevel, or Google Sheets. Statuses, tags, dedupe, and sync on every status change.',
    includes: [
      'CRM sync for the tool you already use',
      'Auto-tagging and dedupe',
      'Status updates pushed to CRM',
      'Retry handling when sync fails',
    ],
  },
  {
    icon: LayoutDashboard,
    id: 'acquisition-dashboards',
    name: 'Custom deal-finding dashboards',
    tagline: 'A command center for your team',
    description:
      'Branded map and list dashboards with your counties, filters, logins, and pipeline stages. Built for how your acquisition team actually works.',
    includes: [
      'Map and list views',
      'Lead status pipeline',
      'Team logins and roles',
      'Your branding and domain',
    ],
  },
  {
    icon: FileText,
    id: 'offers',
    name: 'Offer and contract document systems',
    tagline: 'Filled purchase agreements, ready to send',
    description:
      'We build PDF offer generation from your templates using owner name, property address, and offer amount. E-signature (DocuSign or HelloSign) can be added when you are ready.',
    includes: [
      'PDF offers from your template',
      'Merge fields for address and price',
      'Optional e-signature later',
      'Stored with the deal record',
    ],
  },
  {
    icon: Users,
    id: 'buyer-matching',
    name: 'Buyer list and matching systems',
    tagline: 'Right buyers when a deal is ready',
    description:
      'We build buyer lists with your criteria (price, county, property type) and match them when a lead goes under contract. You approve before anything is sent.',
    includes: [
      'Buyer profiles and criteria',
      'Match on under-contract deals',
      'Ready-to-send blast lists',
      'Manual approval before send',
    ],
  },
  {
    icon: Plug,
    id: 'api-integrations',
    name: 'Data and API integrations',
    tagline: 'Distress data inside your own tools',
    description:
      'For proptech, lenders, and data teams. Clean foreclosure and lien data through APIs or scheduled feeds, plugged into your product or internal stack.',
    includes: [
      'REST API and scheduled feeds',
      'Webhooks into your systems',
      'Custom county packs',
      'Hands-on integration help',
    ],
  },
  {
    icon: Bot,
    id: 'ai-automation',
    name: 'AI workflow automation',
    tagline: 'Less busywork on every lead',
    description:
      'Lead scoring, deal summaries, document parsing, and assistants trained on your process. Your team spends time on deals, not copying fields.',
    includes: [
      'Lead scoring and ranking',
      'Auto deal summaries',
      'Document and filing parsing',
      'Assistants tuned to your workflow',
    ],
  },
  {
    icon: AppWindow,
    id: 'custom-software',
    name: 'Custom real estate software',
    tagline: 'Full builds for your operation',
    description:
      'Investor portals, white-label deal finders, underwriting tools, full acquisition systems. Built on the same stack that powers FreshLien, with support after launch.',
    includes: [
      'Web apps and portals',
      'White-label products',
      'Internal tools and reporting',
      'Support retainers if needed',
    ],
  },
  {
    icon: Handshake,
    id: 'end-to-end',
    name: 'End-to-end acquisition systems',
    tagline: 'From filing to closed deal',
    description:
      'One engagement that covers lead intake, skip trace, outreach, CRM, offers, and buyer matching. We build the system your team runs every day.',
    includes: [
      'Full workflow design',
      'All modules under one scope',
      'Training for your team',
      'Launch and handoff',
    ],
  },
];

export const SERVICE_PROCESS = [
  {
    step: '01',
    title: 'Discovery call',
    description: 'Tell us your markets, tools, and where time is getting wasted. Free, about 30 minutes.',
  },
  {
    step: '02',
    title: 'Scope and proposal',
    description: 'Clear deliverables, timeline, and price. Fixed scope so you know what you are getting.',
  },
  {
    step: '03',
    title: 'Build and deliver',
    description: 'We set up vendors, wire data, and build the dashboards and workflows you need.',
  },
  {
    step: '04',
    title: 'Launch and support',
    description: 'Your team goes live with training. Optional retainer for changes and new markets.',
  },
];

export const SERVICE_AUDIENCES = [
  {
    segment: 'Wholesalers and acquisition teams',
    need: 'A full system: daily leads, skip trace, SMS, CRM sync, and offers without hiring a tech team.',
  },
  {
    segment: 'Hard money and private lenders',
    need: 'Auction monitoring, borrower distress signals, and watchlists wired into your existing tools.',
  },
  {
    segment: 'Brokerages and investor-friendly agents',
    need: 'Branded deal tools and listing-side automation for investor clients.',
  },
  {
    segment: 'Proptech and CRM vendors',
    need: 'Foreclosure and lien data feeds, plus integration help inside your product.',
  },
  {
    segment: 'Funds and syndications',
    need: 'Custom underwriting boards and multi-state market screening, built to your process.',
  },
  {
    segment: 'Coaches and communities',
    need: 'White-label deal platforms their members can log into.',
  },
];

/** Short capability chips for the landing page. */
export const SERVICE_CAPABILITIES = [
  'Lead delivery',
  'Skip trace setup',
  'SMS / Twilio',
  'CRM sync',
  'Deal dashboards',
  'Offer PDFs',
  'Buyer matching',
  'AI workflows',
  'Custom software',
];
