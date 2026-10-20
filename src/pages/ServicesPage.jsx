import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { EngagementCards } from '@/components/site/blocks';
import { IntegrationsSection } from '@/components/site/Integrations';
import { ButtonLink, CheckList, Container, IconTile, PageHero, Reveal, Section, SectionHeading } from '@/components/site/ui';
import { SERVICES } from '@/data/siteContent';

function ServiceRow({ service, index }) {
  return (
    <Reveal>
      <Link
        to={`/services/${service.slug}`}
        className="group grid grid-cols-1 gap-6 border-t border-line py-10 transition-colors lg:grid-cols-12 lg:gap-10"
      >
        <div className="flex items-start gap-5 lg:col-span-5">
          <span className="pt-1 font-mono text-sm text-ink-mute">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <IconTile icon={service.icon} interactive />
            <h2 className="mt-5 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
              {service.name}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">{service.short}</p>
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">What you get</p>
          <CheckList items={service.deliverables.slice(0, 3)} className="mt-4 !gap-2.5" />
          <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-ink-mute">
            <span className="h-1 w-1 rounded-full bg-ink-faint" aria-hidden />
            Typical timeline: <span className="font-medium text-ink">{service.timeline}</span>
          </p>
        </div>
        <div className="flex items-start justify-end lg:col-span-1">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ServicesPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Services',
        description:
          'Real estate data engineering, zoning and land-use intelligence, permit data, deal sourcing, AI and predictive analytics, CRM automation, campaigns, and custom software. Scoped to your markets.',
        path: '/services',
      }}
    >
      <PageHero
        eyebrow="Services"
        title="Everything you need."
        accent="One team."
        description="Pick one service or combine them. You own everything we build."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/book-audit" arrow>
            Book a strategy call
          </ButtonLink>
          <ButtonLink to="/solutions" variant="secondary">
            Find your solution
          </ButtonLink>
        </div>
      </PageHero>

      <Section className="!pt-16">
        <Container>
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.slug} service={s} index={i} />
          ))}
          <div className="border-t border-line" />
        </Container>
      </Section>

      <IntegrationsSection />

      <Section tone="paper">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Engagements"
            title="Start small or"
            accent="go all in."
          />
          <div className="mt-14">
            <EngagementCards />
          </div>
        </Container>
      </Section>

      <CtaBand title="Not sure what you need?" accent="That is what the call is for." />
    </MarketingPageShell>
  );
}
