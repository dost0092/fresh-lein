import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';
import {
  LandingContainer,
  LandingEyebrow,
  LandingSectionHeader,
  MARKETING_NAV_OFFSET_CLASS,
  highlightMarkStyle,
} from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { COMPANY } from '@/data/company';
import { APP_HOME } from '@/lib/routes';

const MODULES = [
  {
    name: 'Data Hub',
    items: [
      'Source connectors',
      'Scheduled ingestion',
      'Raw-record history',
      'Normalized property schema',
      'Owner and parcel matching',
      'Duplicate management',
      'Change tracking',
      'Data-quality scoring',
    ],
  },
  {
    name: 'Lead Studio',
    items: [
      'Filtering and segmentation',
      'Saved criteria',
      'Distress categories',
      'Ownership indicators',
      'Priority scoring',
      'Campaign tagging',
      'CRM synchronization',
    ],
  },
  {
    name: 'Property Workspace',
    items: [
      'Parcel information',
      'Ownership information',
      'Record timeline',
      'Liens and cases',
      'Zoning and permits',
      'Documents',
      'Notes',
      'Source references',
    ],
  },
  {
    name: 'Workflow Engine',
    items: [
      'Lead assignment',
      'Tasks',
      'Status triggers',
      'Email and SMS actions',
      'Approval steps',
      'Offer generation',
      'Notifications',
      'Webhooks',
    ],
  },
  {
    name: 'Analytics',
    items: [
      'Records processed',
      'Data quality',
      'Lead-source performance',
      'Follow-up coverage',
      'Offers generated',
      'Source-to-contract conversion',
      'Workflow failures',
      'Team activity',
    ],
  },
];

export default function PlatformPage() {
  return (
    <div className="fl-app min-h-screen bg-white">
      <Seo
        title="Platform: the layer between property data and deal execution"
        description="FreshLien platform modules for data engineering, automation, and AI-assisted workflows. Connect records, documents, property intelligence, CRM activity, and team processes."
        path="/platform"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${COMPANY.name} Platform`,
          url: `${BASE_URL}/platform`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description:
            'Operating layer between property data and deal execution for real estate teams.',
        }}
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <section className="border-b border-border/60 bg-white py-16 lg:py-24">
          <LandingContainer>
            <div className="mx-auto max-w-3xl text-center">
              <LandingEyebrow className="text-center">Platform</LandingEyebrow>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                The operating layer between property data and{' '}
                <span className="text-primary" style={highlightMarkStyle}>
                  deal execution
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                FreshLien connects fragmented records, documents, property intelligence, CRM
                activity, and team workflows through one controlled operational system.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/book-audit" className="fl-btn-primary px-6">
                  Request a workflow review <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={APP_HOME} className="fl-btn-ghost px-6">
                  Preview live foreclosure data
                </Link>
              </div>
            </div>
          </LandingContainer>
        </section>

        <section className="fl-marketing-section">
          <LandingContainer>
            <LandingSectionHeader
              title="Platform modules"
              description="FreshLien can work as a complete platform, an integration layer, or a custom operational system around your existing tools."
            />
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {MODULES.map((m) => (
                <div key={m.name} className="fl-card p-6">
                  <h2 className="text-base font-semibold text-foreground">{m.name}</h2>
                  <ul className="mt-4 space-y-1.5">
                    {m.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              FreshLien can work as a complete platform, an integration layer, or a custom
              operational system around your existing tools. Live foreclosure search and map
              coverage remain available for teams that need same-day court data today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/solutions" className="fl-btn-primary px-5">
                Explore solutions <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="fl-btn-ghost px-5">
                See offers
              </Link>
            </div>
          </LandingContainer>
        </section>
        <MarketingFooter />
      </div>
    </div>
  );
}
