import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import { BASE_URL } from '@/components/seo/Seo';
import HeroVisual from '@/components/site/HeroVisual';
import CtaBand from '@/components/site/CtaBand';
import { LogoMark } from '@/components/site/SiteLogo';
import {
  Accordion,
  ButtonLink,
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeading,
  TextLink,
} from '@/components/site/ui';
import {
  AudienceExplorer,
  EngagementCards,
  ExampleCard,
  ProcessSteps,
  ServiceCard,
  StackMarquee,
} from '@/components/site/blocks';
import { COMPANY } from '@/data/company';
import {
  BRAND,
  CATEGORIES_WE_COVER,
  EXAMPLE_ENGAGEMENTS,
  PRINCIPLES,
  SERVICES,
  SITE_FAQS,
} from '@/data/siteContent';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: COMPANY.name,
  url: BASE_URL,
  logo: `${BASE_URL}/freshlien-logo.png`,
  description: BRAND.oneLiner,
  areaServed: 'US',
  email: COMPANY.contactEmail,
  sameAs: [
    'https://www.linkedin.com/company/freshlien',
    'https://www.facebook.com/people/FreshLien/61590612976427/',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Real estate data, AI, and growth services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.short, url: `${BASE_URL}/services/${s.slug}` },
    })),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SITE_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-leaf-100 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full bg-zest/35 blur-3xl" aria-hidden />

      <Container className="relative pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1 pl-1 pr-3 text-[13px] font-medium text-ink-soft shadow-sm backdrop-blur transition-colors hover:border-ink/20"
              >
                <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-zest">
                  Services
                </span>
                Data · AI · CRM · Campaigns for real estate
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="site-display mt-7">
                The data, AI and growth team <span className="site-accent text-leaf">behind your deals.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="site-lead mt-7 max-w-xl">
                We build the property data pipelines, zoning and permit intelligence, AI models, CRM systems, and
                outreach campaigns real estate teams usually buy from six different vendors. Built around your
                markets. Owned by you.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/book-audit" arrow>
                  Book a strategy call
                </ButtonLink>
                <ButtonLink to="/services" variant="secondary">
                  Explore services
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft">
                {['Fixed-scope quotes', 'Weekly demos', 'You own the code and data'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-leaf" strokeWidth={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

function OneTeam() {
  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="One team, not six vendors"
              title="Everything the real estate data stack does,"
              accent="built for you."
              description="Parcel data, zoning, permits, deal feeds, predictive AI, and campaigns are usually six subscriptions that never talk to each other. We build the same capabilities around your markets and connect them into one system."
            />
            <TextLink to="/services" className="mt-8">
              See all services
            </TextLink>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES_WE_COVER.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-line bg-white p-5 transition-colors hover:border-leaf-300"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute/80 line-through decoration-ink/30">
                      Separate vendor
                    </p>
                    <p className="mt-3 font-tight text-[17px] font-semibold tracking-[-0.01em] text-ink">{c.label}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink-mute">{c.note}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center py-1" aria-hidden>
                <svg width="100%" height="36" viewBox="0 0 600 36" preserveAspectRatio="none" className="max-w-[90%] text-line">
                  <path d="M100 0 V12 Q100 18 106 18 H494 Q500 18 500 12 V0 M300 0 V36" stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-ink p-6 text-white sm:flex-row sm:items-center">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-leaf-500/40 blur-3xl" aria-hidden />
                <LogoMark className="relative h-11 w-11 shrink-0" />
                <div className="relative">
                  <p className="font-tight text-lg font-semibold !text-white">One FreshLien team</p>
                  <p className="mt-1 text-[14px] leading-snug text-white/60">
                    Designed together, connected end to end, and handed over to you.
                  </p>
                </div>
                <Link
                  to="/book-audit"
                  className="relative inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zest hover:text-white sm:ml-auto"
                >
                  Start a project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Services() {
  return (
    <Section tone="paper">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Services"
            title="Eight ways we help real estate teams"
            accent="move faster."
            description="Start with one service or combine them. Every engagement is scoped to your markets, tools, and goals."
          />
          <ButtonLink to="/services" variant="secondary" arrow className="shrink-0">
            All services
          </ButtonLink>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Audiences() {
  return (
    <Section tone="ink" className="overflow-hidden">
      <div className="site-grid-bg-dark site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <SectionHeading
          onDark
          eyebrow="Solutions"
          title="Built for every seat at the"
          accent="real estate table."
          description="Investors, brokerages, CRE firms, developers, lenders, operators, and PropTech teams each need something different. Pick yours."
        />
        <div className="mt-14">
          <AudienceExplorer />
        </div>
      </Container>
    </Section>
  );
}

function HowWeWork() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="How we work"
            title="From first call to working system"
            accent="in weeks."
            description="A clear plan and fixed quote before we start. Working software every week after that."
          />
          <TextLink to="/how-it-works" className="shrink-0">
            Our process in detail
          </TextLink>
        </div>
        <div className="mt-14">
          <ProcessSteps />
        </div>
      </Container>
    </Section>
  );
}

function ExampleWork() {
  return (
    <Section tone="paper">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Example work"
            title="The kinds of systems"
            accent="we build."
            description="Typical engagements across our service lines. Each one starts with a real workflow problem and ends with a system the team owns."
          />
          <ButtonLink to="/case-studies" variant="secondary" arrow className="shrink-0">
            More examples
          </ButtonLink>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_ENGAGEMENTS.slice(0, 3).map((e, i) => (
            <ExampleCard key={e.slug} example={e} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Principles() {
  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Why FreshLien</Eyebrow>
              <p className="mt-6 font-tight text-[2rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
                “Most real estate teams don’t need another subscription.{' '}
                <span className="site-accent text-leaf">They need someone to build the system.</span>”
              </p>
              <p className="mt-6 text-[15px] text-ink-mute">The idea FreshLien was founded on.</p>
            </Reveal>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <span className="font-mono text-sm text-leaf">0{i + 1}</span>
                <h3 className="site-h3 mt-3">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Engagements() {
  return (
    <Section tone="paper">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Engagements"
          title="Three simple ways"
          accent="to work together."
          description="Every engagement is quoted up front after a short discovery. No seat licenses, no surprise invoices."
        />
        <div className="mt-14">
          <EngagementCards />
        </div>
      </Container>
    </Section>
  );
}

function Faq() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Questions," accent="answered." />
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              Something else on your mind?{' '}
              <Link to="/contact" className="font-semibold text-leaf hover:text-ink">
                Ask us directly
              </Link>
              .
            </p>
            <Link
              to="/faq"
              className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-leaf"
            >
              All FAQs <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={SITE_FAQS.slice(0, 6)} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function Landing() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Data, AI, and growth services for real estate',
        description:
          'FreshLien builds property data pipelines, zoning and permit intelligence, AI models, CRM automation, and buyer and investor campaigns for real estate teams. Fixed-scope quotes. You own everything.',
        path: '/',
        jsonLd: [orgSchema, faqSchema],
      }}
    >
      <Hero />
      <StackMarquee />
      <OneTeam />
      <Services />
      <Audiences />
      <HowWeWork />
      <ExampleWork />
      <Principles />
      <Engagements />
      <Faq />
      <CtaBand />
    </MarketingPageShell>
  );
}
