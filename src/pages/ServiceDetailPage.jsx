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
      navTone="dark"
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
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="site-grid-bg-dark site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-leaf-500/35 blur-[120px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-zest/15 blur-[100px]" aria-hidden />
        <Container className="relative pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
          <Reveal>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
              Services <span className="text-white/30">/</span> <span className="text-white/80">{service.name}</span>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-zest text-ink">
                  <Icon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h1 className="site-display mt-8 !text-white">{service.headline}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{service.description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink to={`/book-audit?service=${encodeURIComponent(service.name)}`} variant="zest" arrow>
                    Discuss this service
                  </ButtonLink>
                  <ButtonLink to="/case-studies" variant="ghostDark">
                    See example work
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zest">
                  <Clock className="h-3.5 w-3.5" /> Typical timeline
                </p>
                <p className="mt-3 font-tight text-3xl font-semibold !text-white">{service.timeline}</p>
                <div className="my-6 h-px bg-white/10" />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Often built with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.stack.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
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
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d, i) => (
              <Reveal key={d} delay={(i % 3) * 0.06}>
                <div className="site-card h-full p-7">
                  <span className="font-mono text-sm text-leaf">{String(i + 1).padStart(2, '0')}</span>
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
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Use cases" title="Where teams" accent="put it to work." />
              <CheckList items={service.useCases} className="mt-10" />
            </div>
            <div>
              <Eyebrow>Who it is for</Eyebrow>
              <div className="mt-6 grid gap-3">
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
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:text-ink">
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
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
