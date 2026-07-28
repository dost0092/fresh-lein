import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';

const CATEGORIES = [
  'Public Records',
  'Lead Operations',
  'CRM Automation',
  'Acquisitions',
  'Dispositions',
  'Property Research',
  'Data Quality',
  'Real Estate AI',
  'Workflow Design',
];

const GUIDES = [
  {
    title: 'How to Move County Property Records Into a CRM',
    summary: 'A practical sequence from raw county files to staged CRM opportunities.',
  },
  {
    title: 'Why Real Estate Lead Lists Accumulate Duplicates',
    summary: 'How multi-source matching and owner conflicts create campaign waste.',
  },
  {
    title: 'How to Calculate the Cost of Manual Lead Preparation',
    summary: 'A simple model for hours, VA cost, and delayed follow-up.',
  },
  {
    title: 'What an Acquisition Automation System Should Include',
    summary: 'Assignment, research, follow-up, offers, approvals, and reporting.',
  },
  {
    title: 'How to Audit a Real Estate Workflow Before Automating It',
    summary: 'What to map first so pilots stay narrow and measurable.',
  },
];

export default function ResourcesPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'Resources for Real Estate Workflow Automation',
        description:
          'Guides and categories for public records automation, CRM workflows, acquisitions, dispositions, and data quality. Full articles publishing over time.',
        path: '/resources',
      }}
    >
      <MarketingPageHero
        eyebrow="Resources"
        title="Operational guides for"
        titleHighlight="real estate automation"
        description="Use these evergreen topics while full articles are added. For live product notes, visit the blog."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <LandingSectionHeader title="Categories" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border/80 bg-fl-subtle px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-12">
            <LandingSectionHeader
              title="Upcoming evergreen guides"
              description="Titles below are planned educational content—not empty fake articles."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <div key={g.title} className="fl-card p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Upcoming
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-foreground">{g.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{g.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/blog" className="fl-btn-primary px-5">
              Visit the blog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/book-audit" className="fl-btn-ghost px-5">
              Book a Workflow Audit
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
