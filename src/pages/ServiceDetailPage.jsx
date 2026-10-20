import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import { BASE_URL } from '@/components/seo/Seo';
import CtaBand from '@/components/site/CtaBand';
import { ExampleCard, ProcessSteps, ServiceCard } from '@/components/site/blocks';
import {
  ButtonLink,
  CheckList,
  Container,
  Eyebrow,
  IconTile,
  Reveal,
  Section,
  SectionHeading,
} from '@/components/site/ui';
import { EXAMPLE_ENGAGEMENTS, SERVICES, SOLUTIONS, getService } from '@/data/siteContent';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getService(slug);
  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;
  const audiences = SOLUTIONS.filter((s) => s.services.includes(service.slug));
  const examples = EXAMPLE_ENGAGEMENTS.filter((e) => e.services.includes(service.slug)).slice(0, 3);
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: service.name,
        description: `${service.headline} ${service.short}`,
        path: `/services/${service.slug}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.description,
          provider: { '@type': 'Organization', name: 'FreshLien', url: BASE_URL },
          areaServed: 'US',
          url: `${BASE_URL}/services/${service.slug}`,
        },
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
          <Reveal>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-ink">
              Services <span className="text-ink/25">/</span> <span className="text-ink">{service.name}</span>
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-ink ring-1 ring-line">
                  <Icon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h1 className="site-display mt-8">{service.headline}</h1>
                <p className="site-lead mt-6 max-w-2xl">{service.description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink to={`/book-audit?service=${encodeURIComponent(service.name)}`} arrow>
                    Discuss this service
                  </ButtonLink>
                  <ButtonLink to="/case-studies" variant="secondary">
                    See example work
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
                  <Clock className="h-3.5 w-3.5" /> Typical timeline
                </p>
                <p className="mt-3 font-tight text-3xl font-semibold text-ink">{service.timeline}</p>
                <div className="my-6 h-px bg-line" />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Often built with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.stack.map((t) => (
                    <span key={t} className="site-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Deliverables */}
      <Section>
        <Container>
          <SectionHeading eyebrow="What we deliver" title="Concrete deliverables," accent="not slideware." />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d, i) => (
              <Reveal key={d} delay={(i % 3) * 0.06}>
                <div className="site-card h-full p-7">
                  <span className="font-mono text-sm text-ink-mute">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-6 font-tight text-lg font-semibold leading-snug tracking-[-0.01em] text-ink">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Use cases + who it's for */}
      <Section tone="paper">
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Use cases" title="Where teams" accent="put it to work." />
              <CheckList items={service.useCases} className="mt-10" />
            </div>
            <div>
              <Eyebrow>Who it is for</Eyebrow>
              <div className="mt-6 grid grid-cols-1 gap-3">
                {audiences.map((a) => (
                  <Link
                    key={a.slug}
                    to={`/solutions/${a.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all hover:border-ink/20 hover:shadow-lg"
                  >
                    <IconTile icon={a.icon} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{a.name}</p>
                      <p className="truncate text-sm text-ink-mute">{a.short}</p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-mute transition-colors group-hover:text-ink" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="How it runs" title="A clear path from" accent="call to launch." />
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-ink-soft">
              Our process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14">
            <ProcessSteps />
          </div>
        </Container>
      </Section>

      {examples.length > 0 && (
        <Section tone="paper">
          <Container>
            <SectionHeading eyebrow="Example work" title="What this looks like" accent="in practice." />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {examples.map((e, i) => (
                <ExampleCard key={e.slug} example={e} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <SectionHeading eyebrow="Pairs well with" title="Combine services into" accent="one system." />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title={`Ready to talk about ${service.name}?`} accent="Let us scope it together." />
    </MarketingPageShell>
  );
}
