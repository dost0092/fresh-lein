import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { EngagementCards } from '@/components/site/blocks';
import { Accordion, CheckList, Container, PageHero, Reveal, Section, SectionHeading } from '@/components/site/ui';
import { SITE_FAQS } from '@/data/siteContent';

const COST_DRIVERS = [
  'Number of markets, counties, or municipalities',
  'Number and type of data sources',
  'Integrations with your CRM and other tools',
  'Custom models or AI features',
  'Volume of campaigns and audiences',
  'Ongoing operation versus one-time build',
];

const ALWAYS_INCLUDED = [
  'Written scope and fixed quote before work starts',
  'Weekly demos and progress notes',
  'Everything built in, or handed over to, your accounts',
  'Documentation and team training',
  '30 days of post-launch support on project builds',
  'No seat licenses or per-record fees on what we build',
];

export default function PricingPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Engagements',
        description:
          'How to work with FreshLien: a short Blueprint discovery, fixed-scope project builds, or an embedded monthly team for real estate data, AI, CRM, and campaigns.',
        path: '/pricing',
      }}
    >
      <PageHero
        eyebrow="Engagements"
        title="Clear scope. Fixed quotes."
        accent="No surprises."
        description="Every engagement starts with a short discovery and ends in a written quote. You know exactly what you are getting and what it costs before we build anything."
      />

      <Section>
        <Container>
          <EngagementCards />
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <SectionHeading eyebrow="What affects cost" title="Every quote is" accent="built from scope." />
              <p className="site-lead mt-6">
                We do not publish a rate card because two projects rarely look the same. Here is what moves the number,
                so you can think about it before the call.
              </p>
              <CheckList items={COST_DRIVERS} className="mt-8" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-[2rem] border border-line bg-white p-8 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Always included</p>
                <h3 className="mt-4 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                  What every engagement comes with
                </h3>
                <CheckList items={ALWAYS_INCLUDED} className="mt-8 !gap-4" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <SectionHeading align="center" eyebrow="FAQ" title="Questions about" accent="working together." />
          <Accordion items={SITE_FAQS.slice(3)} className="mt-12" />
        </Container>
      </Section>

      <CtaBand title="Want a realistic range for your project?" accent="Ask on a 30-minute call." />
    </MarketingPageShell>
  );
}
