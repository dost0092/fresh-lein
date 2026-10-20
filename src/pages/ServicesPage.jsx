import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { EngagementCards } from '@/components/site/blocks';
import { IntegrationsSection } from '@/components/site/Integrations';
import { ButtonLink, Container, IconTile, PageHero, Reveal, Section, SectionHeading } from '@/components/site/ui';
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
            <IconTile icon={service.icon} className="transition-colors group-hover:bg-ink group-hover:text-white group-hover:ring-ink" />
            <h2 className="mt-5 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
              {service.name}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">{service.short}</p>
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">What you get</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {service.deliverables.slice(0, 4).map((d) => (
              <li key={d} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.stack.slice(0, 5).map((t) => (
              <span key={t} className="site-chip">
                {t}
              </span>
            ))}
            <span className="site-chip !bg-paper">Typical: {service.timeline}</span>
          </div>
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
        title="Everything your real estate operation needs,"
        accent="built by one team."
        description="Data, AI, automation, outreach, and software. Pick a single service or combine them into one connected system. You own everything we build."
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
            description="Every service can be delivered as a fixed-scope project or as part of an ongoing embedded team."
          />
          <div className="mt-14">
            <EngagementCards />
          </div>
        </Container>
      </Section>

      <CtaBand title="Not sure which service you need?" accent="That is what the first call is for." />
    </MarketingPageShell>
  );
}
