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
    text: 'Baselines, targets, and operational reporting. AI is used where it helps, with human review where judgment matters.',
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
          'FreshLien offers data engineering, automation, and AI services for real estate teams. We close the gap between property information and action.',
        path: '/about',
      }}
    >
      <MarketingPageHero
        eyebrow="About FreshLien"
        title="Data engineering, automation, and AI"
        titleHighlight="for real estate"
        description="We are not a generic software shop. FreshLien builds the data pipelines, automations, and AI-assisted workflows real estate teams need between receiving property information and acting on it."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="mb-14 grid gap-4 sm:grid-cols-3">
            {POSITIONING.capabilities.map((cap) => (
              <div key={cap.id} className="fl-card p-5">
                <h2 className="text-sm font-semibold text-foreground">{cap.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.text}</p>
              </div>
            ))}
          </div>
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
                Data engineering on public records and property files. Automation into CRM, follow-up,
                and offers. AI for document extraction and matching support, with human review where
                judgment matters.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Our own foreclosure data product indexes {MARKETING_COVERAGE.foreclosureFilingsLiveFull}{' '}
                filings across {MARKETING_COVERAGE.counties} counties. Proof that we work with messy
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
              Request a workflow review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
