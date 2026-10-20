import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import { BASE_URL } from '@/components/seo/Seo';
import HeroVisual from '@/components/site/HeroVisual';
import CtaBand from '@/components/site/CtaBand';
import TrustSection from '@/components/site/TrustSection';
import { ToolStrip } from '@/components/site/Integrations';
import { LogoMark } from '@/components/site/SiteLogo';
import {
  Accordion,
  ButtonLink,
  Container,
  Reveal,
  Section,
  SectionHeading,
  TextLink,
} from '@/components/site/ui';
import {
  AudienceExplorer,
  ExampleCard,
  ProcessSteps,
  ServiceCard,
} from '@/components/site/blocks';
import { COMPANY } from '@/data/company';
import {
  BRAND,
  CATEGORIES_WE_COVER,
  EXAMPLE_ENGAGEMENTS,
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
      <div className="site-grid-bg site-fade-b pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(31,138,85,0.07),transparent)]"
        aria-hidden
      />

      <Container className="relative pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <Link
                to="/book-audit"
                className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/90 py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-ink-soft shadow-hairline backdrop-blur transition-colors hover:border-ink/25 hover:text-ink"
              >
                <span className="relative inline-flex h-2 w-2" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-leaf-500/40 [animation-duration:2.4s]" />
                  <span className="relative h-2 w-2 rounded-full bg-leaf-500" />
                </span>
                Now booking strategy calls
                <span className="h-3.5 w-px bg-line-strong" aria-hidden />
                <span className="text-ink-mute group-hover:text-ink">Free · 30 min</span>
                <ArrowRight className="h-3.5 w-3.5 text-ink-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="site-display mt-7">
                The data, AI and growth team <span className="site-accent-brand">behind your deals.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="site-lead mt-7 max-w-xl">
                Property data, zoning, AI, CRM, and campaigns, built by one team around your markets. You own all
                of it.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/book-audit" arrow className="!h-12 !px-6 !text-[15px]">
                  Book a free strategy call
                </ButtonLink>
                <ButtonLink to="/services" variant="secondary" className="!h-12 !px-6 !text-[15px]">
                  Explore services
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-ink-soft">
                {['Fixed-scope quotes', 'Weekly demos', 'You own the code and data'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-leaf-50 text-leaf-500 ring-1 ring-inset ring-leaf-100">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.25} />
                    </span>
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
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="One team, not six vendors"
              title="Six tools that never talk."
              accent="Replaced by one system."
              description="We build what you would normally rent from six vendors, connected and made for your markets."
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint line-through decoration-ink/30">
                      Separate vendor
                    </p>
                    <p className="mt-3 font-tight text-[16px] font-semibold tracking-[-0.01em] text-ink">{c.label}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink-mute">{c.note}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center py-1" aria-hidden>
                <svg width="100%" height="36" viewBox="0 0 600 36" preserveAspectRatio="none" className="max-w-[90%] text-line">
                  <path d="M100 0 V12 Q100 18 106 18 H494 Q500 18 500 12 V0 M300 0 V36" stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-center">
                <LogoMark className="relative h-11 w-11 shrink-0" />
                <div className="relative">
                  <p className="font-tight text-lg font-semibold text-ink">One FreshLien team</p>
                  <p className="mt-1 text-[14px] leading-snug text-ink-mute">Connected end to end. Handed over to you.</p>
                </div>
                <Link
                  to="/book-audit"
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink hover:text-ink-soft sm:ml-auto"
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
            title="What we build."
            accent="Pick one or combine them."
          />
          <ButtonLink to="/services" variant="secondary" arrow className="shrink-0">
            All services
          </ButtonLink>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Solutions"
          title="Built for your side"
          accent="of real estate."
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
    <Section tone="paper">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="How we work"
            title="From first call to live system."
            accent="In weeks."
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
            title="Real problems."
            accent="Working systems."
          />
          <ButtonLink to="/case-studies" variant="secondary" arrow className="shrink-0">
            More examples
          </ButtonLink>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_ENGAGEMENTS.slice(0, 3).map((e, i) => (
            <ExampleCard key={e.slug} example={e} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Faq() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Quick" accent="answers." />
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              Still curious?{' '}
              <Link to="/contact" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                Ask us directly
              </Link>
              .
            </p>
            <Link
              to="/faq"
              className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-ink-soft"
            >
              All FAQs <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={SITE_FAQS.slice(0, 5)} />
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
      <ToolStrip />
      <OneTeam />
      <Services />
      <Audiences />
      <HowWeWork />
      <ExampleWork />
      <TrustSection />
      <Faq />
      <CtaBand />
    </MarketingPageShell>
  );
}
