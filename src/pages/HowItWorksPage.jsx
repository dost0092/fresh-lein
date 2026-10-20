import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { EngagementCards } from '@/components/site/blocks';
import { Accordion, ButtonLink, CheckList, Container, PageHero, Reveal, Section, SectionHeading } from '@/components/site/ui';
import { PRINCIPLES, PROCESS, SITE_FAQS } from '@/data/siteContent';

const STEP_OUTPUTS = {
  '01': ['An honest read on fit', 'A rough timeline and budget'],
  '02': ['A prioritized build plan', 'A fixed quote and milestones'],
  '03': ['Weekly live demos', 'A staging environment to try'],
  '04': ['Team training', 'Code, data, and docs handed over'],
  '05': ['Pipeline monitoring', 'New markets and features'],
};

export default function HowItWorksPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'How we work',
        description:
          'How FreshLien delivers real estate data, AI, CRM, and campaign projects: discovery call, blueprint with a fixed quote, weekly build sprints, launch and handoff, and optional ongoing support.',
        path: '/how-it-works',
      }}
    >
      <PageHero
        eyebrow="How we work"
        title="A clear plan, a fixed quote,"
        accent="and working software every week."
        description="No mystery retainers. No six-month roadmaps. Here is every step."
      >
        <div className="mt-10">
          <ButtonLink to="/book-audit" arrow>
            Start with a call
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container size="narrow">
          <ol className="relative">
            <span className="absolute bottom-6 left-[27px] top-6 w-px bg-line sm:left-[31px]" aria-hidden />
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} as="li" delay={i * 0.04} className="relative pb-14 pl-20 last:pb-0 sm:pl-24">
                <span className="absolute left-0 top-0 inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white font-mono text-sm font-medium text-ink shadow-sm sm:h-16 sm:w-16">
                  {p.step}
                </span>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <h2 className="font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">{p.title}</h2>
                  <span className="rounded-full bg-paper px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-mute">
                    {p.duration}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{p.body}</p>
                <div className="mt-6 rounded-2xl border border-line bg-paper/60 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">You get</p>
                  <CheckList items={STEP_OUTPUTS[p.step]} cols={2} className="mt-4" />
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading eyebrow="Our principles" title="The rules we" accent="work by." />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-white p-7">
                  <span className="font-mono text-sm text-ink-mute">0{i + 1}</span>
                  <h3 className="mt-6 font-tight text-xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading align="center" eyebrow="Engagements" title="Pick the shape" accent="that fits." />
          <div className="mt-14">
            <EngagementCards />
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container size="narrow">
          <SectionHeading align="center" eyebrow="FAQ" title="Common" accent="questions." />
          <Accordion items={SITE_FAQS.slice(3, 7)} className="mt-12" />
        </Container>
      </Section>

      <CtaBand />
    </MarketingPageShell>
  );
}
