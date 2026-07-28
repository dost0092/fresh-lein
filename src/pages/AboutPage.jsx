import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { POSITIONING } from '@/data/sitePositioning';
import { MARKETING_COVERAGE } from '@/data/marketingStats';

const VALUES = [
  {
    title: 'Useful automation over unnecessary complexity',
    text: 'Start with one measurable bottleneck. Expand only after the pilot is validated.',
  },
  {
    title: 'Measurable outcomes over buzzwords',
    text: 'Baselines, targets, and operational reporting—not vague AI claims.',
  },
  {
    title: 'Source traceability',
    text: 'Preserve where records came from and what changed during processing.',
  },
  {
    title: 'Human review where judgment matters',
    text: 'Uncertain matches and exceptions can be routed for review.',
  },
  {
    title: 'Reliable workflows',
    text: 'Logging, monitoring, retries, and documented handoffs.',
  },
  {
    title: 'Honest data limitations',
    text: 'Public records vary by jurisdiction. Material facts should be verified before decisions.',
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'About FreshLien',
        description:
          'FreshLien was created around a simple observation: real estate companies lose enormous time between receiving property information and acting on it.',
        path: '/about',
      }}
    >
      <MarketingPageHero
        eyebrow="About FreshLien"
        title="Built for the gap between property information and"
        titleHighlight="action"
        description="FreshLien was created around a simple observation: real estate companies lose enormous time between receiving property information and acting on it."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <LandingSectionHeader
                eyebrow="Mission"
                title="Remove repetitive work from"
                titleHighlight="real estate operations"
                description="So teams can focus on judgment, relationships, and transactions."
              />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {POSITIONING.positioning}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {POSITIONING.promise}
              </p>
            </div>
            <div className="fl-card p-6 lg:p-8">
              <p className="text-sm font-semibold text-foreground">What we combine</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                FreshLien brings together experience across real estate data, public records,
                geospatial systems, parcel matching, data engineering, CRM workflows, automation,
                document processing, AI-assisted extraction, and operational analytics.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Our own foreclosure data product indexes {MARKETING_COVERAGE.foreclosureFilingsLiveFull}{' '}
                filings across {MARKETING_COVERAGE.counties} counties—proof that we work with messy
                county and court sources every day.
              </p>
            </div>
          </div>

          <div className="mt-14">
            <LandingSectionHeader title="Values" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="fl-card p-5">
                  <h3 className="text-sm font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {POSITIONING.disclaimer}
          </p>

          <div className="mt-8">
            <Link to="/book-audit" className="fl-btn-primary px-6">
              Book a Workflow Audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
