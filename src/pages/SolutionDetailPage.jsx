import { Link, Navigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { ExampleCard, ProcessSteps, ServiceCard } from '@/components/site/blocks';
import { ButtonLink, CheckList, Container, Reveal, Section, SectionHeading } from '@/components/site/ui';
import { EXAMPLE_ENGAGEMENTS, SOLUTIONS, getService, getSolution } from '@/data/siteContent';

/** Slugs from the previous site structure, kept so old links still land somewhere sensible. */
const LEGACY_SLUGS = {
  'lead-data-automation': 'investors-wholesalers',
  acquisitions: 'investors-wholesalers',
  dispositions: 'commercial-real-estate',
  'property-research': 'developers-land',
};

export default function SolutionDetailPage() {
  const { slug } = useParams();
  if (LEGACY_SLUGS[slug]) return <Navigate to={`/solutions/${LEGACY_SLUGS[slug]}`} replace />;
  const sol = getSolution(slug);
  if (!sol) return <Navigate to="/solutions" replace />;

  const Icon = sol.icon;
  const examples = EXAMPLE_ENGAGEMENTS.filter((e) => e.services.some((s) => sol.services.includes(s))).slice(0, 3);
  const others = SOLUTIONS.filter((s) => s.slug !== sol.slug);

  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: `For ${sol.name}`,
        description: `${sol.headline} ${sol.short}`,
        path: `/solutions/${sol.slug}`,
      }}
    >
      <section className="relative overflow-hidden bg-paper">
        <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
          <Reveal>
            <Link to="/solutions" className="inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-ink">
              Solutions <span className="text-ink/25">/</span> <span className="text-ink">{sol.name}</span>
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <Reveal delay={0.05} className="lg:col-span-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                For {sol.name}
              </span>
              <h1 className="site-display mt-8">{sol.headline}</h1>
              <p className="site-lead mt-6 max-w-2xl">{sol.short}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to={`/book-audit?team=${encodeURIComponent(sol.name)}`} arrow>
                  Book a strategy call
                </ButtonLink>
                <ButtonLink to="/case-studies" variant="secondary">
                  See example work
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.12} className="lg:col-span-5">
              <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-48px_rgba(11,26,19,0.4)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Your stack, built by FreshLien</p>
                <ul className="mt-5 space-y-2">
                  {sol.services.map((slug, i) => {
                    const svc = getService(slug);
                    if (!svc) return null;
                    const SvcIcon = svc.icon;
                    return (
                      <li key={slug}>
                        <Link
                          to={`/services/${slug}`}
                          className="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-paper"
                        >
                          <span
                            className={
                              i === 0
                                ? 'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper text-ink ring-1 ring-line'
                                : 'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper text-ink-soft ring-1 ring-line'
                            }
                          >
                            <SvcIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </span>
                          <span className="text-[15px] font-semibold text-ink">{svc.name}</span>
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ink-mute">{svc.timeline}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Reveal className="h-full">
              <div className="h-full rounded-[2rem] border border-line bg-white p-8 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">The problem</p>
                <h2 className="mt-4 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                  What slows teams like yours down
                </h2>
                <ul className="mt-8 space-y-4">
                  {sol.pains.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper text-ink-mute ring-1 ring-line">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <div className="h-full rounded-[2rem] border border-line bg-paper p-8 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">What we build</p>
                <h2 className="mt-4 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                  A system built around your deals
                </h2>
                <CheckList items={sol.builds} className="mt-8 !gap-4" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading eyebrow="Services involved" title="The services behind" accent="this solution." />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sol.services
              .map(getService)
              .filter(Boolean)
              .map((service, i) => (
                <ServiceCard key={service.slug} service={service} index={i} />
              ))}
          </div>
        </Container>
      </Section>

      {examples.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Example work" title="Systems we build for" accent="teams like yours." />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {examples.map((e, i) => (
                <ExampleCard key={e.slug} example={e} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="paper">
        <Container>
          <SectionHeading eyebrow="How we work" title="Plan, build, launch," accent="improve." />
          <div className="mt-14">
            <ProcessSteps />
          </div>
        </Container>
      </Section>

      <Section className="!py-16">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Other solutions</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/solutions/${o.slug}`}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </MarketingPageShell>
  );
}
