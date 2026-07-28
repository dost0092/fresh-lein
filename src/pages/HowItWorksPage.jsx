import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { PROCESS_PHASES } from '@/data/solutionsContent';

const PHASE_DETAIL = [
  {
    customer: 'Share current tools, sample files, and who owns each step.',
    freshlien: 'Interview stakeholders and inventory systems and data.',
    deliverables: 'Discovery notes and initial opportunity list.',
    acceptance: 'Both sides agree on the primary bottleneck to map.',
    risks: 'Missing stakeholders or incomplete sample data.',
  },
  {
    customer: 'Walk through the live process with real exceptions.',
    freshlien: 'Document inputs, outputs, delays, and failure modes.',
    deliverables: 'Workflow map and time-loss estimate.',
    acceptance: 'Map reflects the actual process, not the ideal one.',
    risks: 'Undocumented tribal knowledge.',
  },
  {
    customer: 'Provide access for one source, one market, one CRM path.',
    freshlien: 'Build a narrow automation with monitoring.',
    deliverables: 'Working pilot and documentation.',
    acceptance: 'Pilot processes agreed sample volume with reviewable exceptions.',
    risks: 'Scope creep into multi-market builds too early.',
  },
  {
    customer: 'Compare automated output with the existing process.',
    freshlien: 'Quality checks, exception review, and tuning.',
    deliverables: 'Validation report and go/no-go recommendation.',
    acceptance: 'Quality and timing meet agreed thresholds.',
    risks: 'Skipping human review on uncertain matches.',
  },
  {
    customer: 'Prioritize next sources and teams.',
    freshlien: 'Expand workflows, reporting, and support model.',
    deliverables: 'Scale plan and production monitoring.',
    acceptance: 'Additional workflows have owners and metrics.',
    risks: 'Adding markets before the pilot is stable.',
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'How FreshLien Implementation Works',
        description:
          'FreshLien starts with one measurable bottleneck: discover, map, pilot, validate, then scale. Sample pilot: one county, one record type, one CRM workflow.',
        path: '/how-it-works',
      }}
    >
      <MarketingPageHero
        eyebrow="How it works"
        title="Start small."
        titleHighlight="Prove it. Then expand."
        description="A typical pilot is one county, one record type, and one CRM workflow. That keeps quality and ownership clear."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="space-y-8">
            {PROCESS_PHASES.map((phase, i) => {
              const d = PHASE_DETAIL[i];
              return (
                <div key={phase.title} className="fl-card p-6 lg:p-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Phase {i + 1}: {phase.title}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{phase.text}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      ['Customer', d.customer],
                      ['FreshLien', d.freshlien],
                      ['Deliverables', d.deliverables],
                      ['Acceptance', d.acceptance],
                      ['Common risks', d.risks],
                    ].map(([label, text]) => (
                      <div key={label}>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-foreground/80">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-xl border border-primary/20 bg-fl-subtle p-6">
            <LandingSectionHeader
              className="mb-0"
              title="Sample pilot"
              description="One county, one record type, one CRM workflow. Validate quality and timing before adding markets or sources."
            />
          </div>

          <div className="mt-10">
            <Link to="/book-audit" className="fl-btn-primary px-6">
              Request a workflow review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
