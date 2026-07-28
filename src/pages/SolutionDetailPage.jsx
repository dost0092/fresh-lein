import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { SOLUTIONS } from '@/data/solutionsContent';

const DETAIL = {
  'lead-data-automation': {
    steps: [
      'Connect sources',
      'Preserve raw records',
      'Standardize fields',
      'Match properties and owners',
      'Detect duplicates',
      'Validate uncertain records',
      'Add permitted enrichment',
      'Apply tags and scores',
      'Sync to CRM',
      'Monitor ongoing delivery',
    ],
    sources: [
      'Foreclosure',
      'Pre-foreclosure',
      'Tax delinquency',
      'Liens',
      'Probate',
      'Code violations',
      'Permits',
      'Vacant properties',
      'Absentee owners',
      'Vendor files',
      'Internal spreadsheets',
    ],
    outcomes: [
      'Faster source-to-CRM delivery',
      'Fewer duplicate records',
      'Less spreadsheet work',
      'Better source traceability',
      'More consistent campaign segmentation',
      'Easier expansion into new markets',
    ],
    note: 'Source availability, licensing, frequency, and permitted use vary by jurisdiction and provider.',
  },
  acquisitions: {
    steps: [
      'Lead arrives',
      'Property reviewed',
      'Seller contacted',
      'Follow-up scheduled',
      'Offer calculated',
      'Approval received',
      'Offer sent',
      'Outcome recorded',
    ],
    modules: [
      'Automatic lead assignment',
      'Property context in one workspace',
      'Follow-up sequences',
      'Call and communication summaries',
      'Comparable sales and assumptions',
      'Offer calculations',
      'Manager approvals',
      'Offer document generation',
      'Stale-lead alerts',
      'Acquisition scorecards',
    ],
  },
  dispositions: {
    modules: [
      'Deal package generation',
      'Buyer database organization',
      'Buyer criteria',
      'Market and property-type segmentation',
      'Buyer matching',
      'Proof-of-funds collection',
      'Access scheduling',
      'Offer collection',
      'Buyer ranking',
      'Assignment and closing tracking',
    ],
    note: 'Buyer matching does not guarantee a sale. FreshLien organizes disposition work; outcomes depend on market conditions, pricing, and your team.',
  },
  'property-research': {
    modules: [
      'Parcel and ownership research',
      'Deeds and liens',
      'Cases and public records',
      'Zoning summaries',
      'Permit history',
      'Code violations',
      'Document extraction',
      'Property timelines',
      'Source-linked reporting',
      'Human verification',
    ],
    note: 'Jurisdictional availability varies. FreshLien evaluates each source before confirming what can be automated.',
  },
};

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = SOLUTIONS.find((s) => s.slug === slug);
  if (!solution) return <Navigate to="/solutions" replace />;
  const extra = DETAIL[slug] || {};

  return (
    <MarketingPageShell
      seo={{
        title: `${solution.name} | FreshLien`,
        description: solution.description,
        path: solution.href,
      }}
    >
      <MarketingPageHero
        eyebrow="Solutions"
        title={solution.hero}
        description={solution.description}
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <LandingSectionHeader title="What is included" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {solution.features.map((f) => (
              <li key={f} className="fl-card flex items-start gap-2 p-4 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          {extra.modules && (
            <div className="mt-12">
              <LandingSectionHeader title="Capabilities" />
              <ul className="grid gap-3 sm:grid-cols-2">
                {extra.modules.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {extra.steps && (
            <div className="mt-12">
              <LandingSectionHeader title="Workflow" />
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {extra.steps.map((s, i) => (
                  <li key={s} className="fl-card p-4 text-sm">
                    <span className="text-xs font-bold text-primary/40">{i + 1}</span>
                    <p className="mt-1 font-medium text-foreground">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {extra.sources && (
            <div className="mt-12">
              <LandingSectionHeader title="Supported source categories" />
              <div className="flex flex-wrap gap-2">
                {extra.sources.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border/80 bg-fl-subtle px-3 py-1.5 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {extra.outcomes && (
            <div className="mt-12">
              <LandingSectionHeader title="Operational outcomes" />
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {extra.outcomes.map((o) => (
                  <li key={o} className="fl-card p-4 text-sm text-muted-foreground">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {extra.note && (
            <p className="mt-8 rounded-lg border border-border/70 bg-fl-subtle p-4 text-xs leading-relaxed text-muted-foreground">
              {extra.note}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/book-audit" className="fl-btn-primary px-5">
              Book a Workflow Audit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/solutions" className="fl-btn-ghost px-5">
              All solutions
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
