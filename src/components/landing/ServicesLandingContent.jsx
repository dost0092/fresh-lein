import { Link } from 'react-router-dom';
import { ArrowRight, Check, Gavel, Sparkles, Handshake, Monitor } from 'lucide-react';
import {
  LandingContainer,
  LandingEyebrow,
  LandingSectionHeader,
  highlightMarkStyle,
} from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import {
  SERVICES,
  SERVICE_PROCESS,
  SERVICE_AUDIENCES,
  SERVICE_CAPABILITIES,
} from '@/data/services';
import { MARKETING_COVERAGE } from '@/data/marketingStats';
import { CONTACT_MAILTO_SUBJECT } from '@/data/company';

function ServicesHero() {
  return (
    <section className="border-b border-border/60 bg-fl-subtle">
      <LandingContainer className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <LandingEyebrow className="text-center">Consultancy and custom builds</LandingEyebrow>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            We help real estate teams{' '}
            <span
              className="inline box-decoration-clone rounded-sm px-1.5 py-0.5 text-primary"
              style={highlightMarkStyle}
            >
              automate distressed deals
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            FreshLien is a real estate automation consultancy. We advise your team, then build the
            systems you need: lead delivery, skip trace, SMS, CRM sync, offer PDFs, dashboards, and
            full custom software. You keep the vendors and the process. We make it work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="fl-btn-primary px-6 py-3 text-base">
              Book a free consult <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#services" className="fl-btn-ghost px-6 py-3 text-base">
              See our services
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Backed by our own data platform: {MARKETING_COVERAGE.foreclosureRecords} filings,{' '}
            {MARKETING_COVERAGE.counties} counties, {MARKETING_COVERAGE.dataRefresh.toLowerCase()} refresh
          </p>
        </div>
      </LandingContainer>
    </section>
  );
}

function CapabilitiesStrip() {
  return (
    <section className="border-b border-border/60 bg-white py-8">
      <LandingContainer>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          What we consult on and build for you
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {SERVICE_CAPABILITIES.map((label) => (
            <span
              key={label}
              className="rounded-full border border-border/80 bg-fl-subtle px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function ServicesGrid() {
  return (
    <section id="services" className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Services"
          title="Consultancy and builds for"
          titleHighlight="the full deal workflow"
          description="We do not sell skip-trace or SMS as a SaaS box. We design and build those systems for your team, using the tools and vendors you choose."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, id, name, tagline, description, includes }) => (
            <div key={id} className="fl-card fl-card-hover flex h-full flex-col p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{name}</h3>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary">{tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <ul className="mt-4 flex-1 space-y-1.5">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={CONTACT_MAILTO_SUBJECT(`FreshLien service: ${name}`)}
                className="fl-link mt-5 inline-flex items-center gap-1"
              >
                Ask about this <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function AudiencesSection() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Who we work with"
          title="Teams that need systems,"
          titleHighlight="not another login"
          description="If distressed deal flow is core to your business and you want someone to design and build the automation, talk to us."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_AUDIENCES.map(({ segment, need }) => (
            <div key={segment} className="fl-card p-5">
              <h3 className="text-sm font-semibold text-foreground">{segment}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{need}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="How we work"
          title="Consult first. Build second."
          titleHighlight="Clear every step"
          description="You always know what we recommend, what we will build, when it ships, and what it costs."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_PROCESS.map(({ step, title, description }) => (
            <div key={step} className="fl-card p-6">
              <p className="text-2xl font-bold text-primary/25">{step}</p>
              <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function ProductTeaser() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <div className="fl-card overflow-hidden lg:grid lg:grid-cols-2 lg:items-center">
          <div className="p-8 lg:p-10">
            <LandingEyebrow>Our platform (optional)</LandingEyebrow>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Proof we ship real estate software
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We run our own county-direct platform with {MARKETING_COVERAGE.foreclosureRecords}{' '}
              filings across {MARKETING_COVERAGE.counties} counties. Many client builds start from
              that foundation. You can also use the product on its own if you want self-serve data.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                'Search live county filings on a map',
                'Alerts, exports, and a REST API',
                'Product pricing is separate from custom builds',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/platform" className="fl-btn-primary px-5">
                See the platform <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="fl-btn-ghost px-5">
                Product pricing
              </Link>
            </div>
          </div>
          <div className="hidden h-full items-center justify-center border-l border-border/60 bg-fl-subtle p-10 lg:flex">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Monitor className="h-8 w-8" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { value: MARKETING_COVERAGE.foreclosureRecords, label: 'Filings' },
                  { value: MARKETING_COVERAGE.counties, label: 'Counties' },
                  { value: MARKETING_COVERAGE.states, label: 'States' },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-lg border border-border/70 bg-white px-3 py-3">
                    <p className="text-lg font-bold text-primary">{value}</p>
                    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Optional product at /platform</p>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}

function WhyUsSection() {
  const points = [
    {
      icon: Handshake,
      title: 'Consultancy, not a black-box SaaS sell',
      text: 'We advise first, then build for your process. Skip trace, SMS, CRM sync, and offers are services we deliver into your stack, not features you rent from us forever.',
    },
    {
      icon: Gavel,
      title: 'We already work this data every day',
      text: 'We run a county-direct foreclosure pipeline. You are not paying a generic agency to learn distressed real estate on your invoice.',
    },
    {
      icon: Sparkles,
      title: 'Fixed scope, your vendors',
      text: 'Clear proposals and fixed prices. You keep Twilio, skip-trace, CRM, and DocuSign accounts under your name. We wire them and hand the system off.',
    },
  ];

  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Why FreshLien"
          title="A partner that designs and builds,"
          titleHighlight="then steps aside"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="fl-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="fl-marketing-section-muted border-b-0">
      <LandingContainer innerClassName="text-center">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Tell us what your team needs built
        </h2>
        <p className="mx-auto mt-3 mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
          A short consult is enough to sketch most projects. Skip trace, SMS, CRM, offers, dashboards,
          or a full acquisition system. If we are not the right fit, we will say so.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/contact" className="fl-btn-primary px-6 py-2.5">
            Book a free consult <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={CONTACT_MAILTO_SUBJECT('FreshLien consultancy inquiry')}
            className="fl-btn-ghost px-6 py-2.5"
          >
            Email us instead
          </a>
        </div>
      </LandingContainer>
    </section>
  );
}

export default function ServicesLandingContent({ topSlot = null }) {
  return (
    <div className="fl-app">
      {topSlot}
      <ServicesHero />
      <CapabilitiesStrip />
      <ServicesGrid />
      <AudiencesSection />
      <ProcessSection />
      <ProductTeaser />
      <WhyUsSection />
      <FinalCta />
      <MarketingFooter />
    </div>
  );
}
