import { Info } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { ExampleCard } from '@/components/site/blocks';
import { ButtonLink, Container, PageHero, Section } from '@/components/site/ui';
import { EXAMPLE_ENGAGEMENTS } from '@/data/siteContent';

export default function CaseStudiesPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Example work',
        description:
          'Examples of the real estate data pipelines, zoning tools, permit lead feeds, AI extraction, CRM builds, and investor campaigns FreshLien builds.',
        path: '/case-studies',
      }}
    >
      <PageHero
        eyebrow="Example work"
        title="Real workflow problems."
        accent="Systems that fix them."
        description="Each one starts with a real bottleneck and ends with a system the team owns."
      >
        <div className="mt-10">
          <ButtonLink to="/book-audit" arrow>
            Discuss your project
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-line bg-paper p-5 text-sm leading-relaxed text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-mute" />
            <p>
              Representative examples. Client names stay private; ask on a call to see work like yours.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {EXAMPLE_ENGAGEMENTS.map((e, i) => (
              <ExampleCard key={e.slug} example={e} index={i} expanded />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Have a workflow like one of these?" accent="Let us map yours." />
    </MarketingPageShell>
  );
}
