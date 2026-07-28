import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';

/**
 * Illustrative / reference architectures only — not named customer results.
 * Replace with real case studies when approved (see CONTENT_REVIEW.md).
 */
const CASES = [
  {
    label: 'Illustrative Use Case',
    title: 'County Record to CRM',
    situation: 'An acquisition team downloads county filings weekly and imports them by hand.',
    manual: 'Download → rename → clean columns → dedupe in Excel → CRM import → assign leads.',
    problem: 'Late CRM updates, duplicate owners, and hours of spreadsheet work each week.',
    approach: 'Scheduled collection, normalize, match, deduplicate, tag, sync.',
    architecture: 'Source connector → raw history → property schema → quality flags → CRM stage.',
    metrics: ['Processing time', 'Duplicate rate', 'CRM completeness', 'Weekly hours removed'],
    expansion: 'Add more counties, tax lists, and dialer sync.',
  },
  {
    label: 'Reference Architecture',
    title: 'Lead to Offer',
    situation: 'Acquisition managers rebuild offers from notes and templates.',
    manual: 'Research property → calculate offer → ask for approval → paste into PDF → email → log outcome.',
    problem: 'Slow offer production and inconsistent documents.',
    approach: 'Research panel, offer rules, approval step, PDF generation, outcome logging.',
    architecture: 'CRM opportunity → property workspace → calculator → approval → template → activity log.',
    metrics: ['Offer-production time', 'Approval cycle time', 'Follow-up coverage'],
    expansion: 'Stale-lead recovery and scorecards.',
  },
  {
    label: 'Example Workflow',
    title: 'Contract to Disposition',
    situation: 'Disposition relies on group texts and scattered buyer lists.',
    manual: 'Build package → message buyers → collect POF → track offers in sheets.',
    problem: 'Missed buyers, weak document tracking, no buyer performance history.',
    approach: 'Extract contract details, package, match buyers, notify with approval, track offers.',
    architecture: 'Contract intake → deal package → buyer criteria → match list → document collection → offer tracker.',
    metrics: ['Time to first buyer package', 'Document completeness', 'Offer response rate'],
    expansion: 'Buyer ranking and closing checklist automation.',
  },
];

export default function CaseStudiesPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'Case Studies and Example Workflows',
        description:
          'Illustrative FreshLien workflows for county-to-CRM, lead-to-offer, and contract-to-disposition automation. Not invented customer results.',
        path: '/case-studies',
      }}
    >
      <MarketingPageHero
        eyebrow="Case studies"
        title="Example workflows and"
        titleHighlight="reference architectures"
        description="These examples are labeled as illustrative. They show how FreshLien approaches common operational problems. Named customer results are published only after approval."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="space-y-8">
            {CASES.map((c) => (
              <article key={c.title} className="fl-card p-6 lg:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{c.label}</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{c.title}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    ['Situation', c.situation],
                    ['Manual workflow', c.manual],
                    ['Operational problem', c.problem],
                    ['FreshLien approach', c.approach],
                    ['Workflow architecture', c.architecture],
                    ['Potential expansion', c.expansion],
                  ].map(([label, text]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-foreground">{label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <p className="text-xs font-semibold text-foreground">Metrics to measure</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.metrics.map((m) => (
                      <span key={m} className="rounded-full border border-border/80 bg-fl-subtle px-2.5 py-1 text-xs">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <LandingSectionHeader
              align="center"
              title="Want a workflow mapped for your operation?"
            />
            <Link to="/book-audit" className="fl-btn-primary mt-2 px-6">
              Book a Workflow Audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
