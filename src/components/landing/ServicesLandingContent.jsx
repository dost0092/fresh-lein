import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, CheckCircle2, Gavel, Sparkles, Handshake, Monitor,
} from 'lucide-react';
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
import { COMPANY, CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { cn } from '@/lib/utils';

const HERO_PIPELINE = [
  { label: 'Lead delivery', status: 'Live', tone: 'bg-emerald-500' },
  { label: 'Skip trace', status: 'Wired', tone: 'bg-emerald-500' },
  { label: 'SMS outreach', status: 'In build', tone: 'bg-amber-400' },
  { label: 'CRM sync', status: 'Scoped', tone: 'bg-primary' },
  { label: 'Offer PDFs', status: 'Next', tone: 'bg-gray-300' },
];

function ServicesSystemPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </div>
          <div className="mx-auto flex h-7 min-w-0 max-w-[260px] flex-1 items-center justify-center rounded-md bg-white px-3 text-[11px] text-gray-400">
            freshlien.com — client system
          </div>
        </div>

        <div className="bg-fl-subtle p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Engagement
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">Atlantic Acquisition OS</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Scope → build → handoff</p>
            </div>
            <span className="shrink-0 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white">
              In progress
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { v: MARKETING_COVERAGE.foreclosureFilingsLive, l: 'Filings' },
              { v: MARKETING_COVERAGE.counties, l: 'Counties' },
              { v: MARKETING_COVERAGE.dataRefresh, l: 'Refresh' },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-gray-200/80 bg-white px-3 py-2.5">
                <p className="text-base font-semibold tabular-nums text-gray-900 sm:text-lg">{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-3 py-2">
              <p className="text-[11px] font-semibold text-gray-700">Services we deliver</p>
            </div>
            {HERO_PIPELINE.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-gray-50 px-3 py-2.5 last:border-0"
              >
                <p className="text-[11px] font-medium text-gray-900">{row.label}</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className={cn('h-1.5 w-1.5 rounded-full', row.tone)} />
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/15 bg-white px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-gray-600">
                You keep Twilio, skip-trace, and CRM accounts
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-primary">We wire them</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_15%,rgba(19,81,51,0.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_5%_85%,rgba(19,81,51,0.045),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(19,81,51,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(19,81,51,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
        }}
      />

      <LandingContainer className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <LandingEyebrow>Real estate automation services</LandingEyebrow>

            <p className="font-display mb-4 text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem] lg:text-[3.35rem]">
              {COMPANY.name}
            </p>

            <h1 className="font-display font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
              <span className="block text-[1.85rem] text-muted-foreground sm:text-[2.2rem] lg:text-[2.45rem]">
                We help real estate teams
              </span>
              <span className="mt-1.5 block text-[2.1rem] sm:text-[2.55rem] lg:text-[2.9rem]">
                <span
                  className="inline box-decoration-clone rounded-md px-2 py-0.5 text-primary"
                  style={highlightMarkStyle}
                >
                  automate distressed deals
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-[1.6] text-muted-foreground">
              We build the systems you need: lead delivery, skip trace, SMS, CRM sync, offer PDFs,
              dashboards, and full custom software. You keep the vendors and the process. We make
              it work.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="fl-btn-primary h-11 px-6 text-[15px]">
                Book a free call <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#services"
                className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
              >
                See our services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Backed by our own data platform: {MARKETING_COVERAGE.foreclosureFilingsLive} filings ·{' '}
              {MARKETING_COVERAGE.counties} counties · {MARKETING_COVERAGE.dataRefresh.toLowerCase()}{' '}
              refresh
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-150 fill-mode-both">
            <ServicesSystemPreview />
          </div>
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
          What we build and deliver for you
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
          title="Everything we build for"
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
          title="From first call to"
          titleHighlight="live systems"
          description="You always know what we will build, when it ships, and what it costs."
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
              We run our own county-direct platform with {MARKETING_COVERAGE.foreclosureFilingsLive}{' '}
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
                  { value: MARKETING_COVERAGE.foreclosureFilingsLive, label: 'Filings' },
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
      title: 'Services built for your stack',
      text: 'Skip trace, SMS, CRM sync, and offers are services we deliver into your tools, not features you rent from us forever.',
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
          title="A partner that builds,"
          titleHighlight="then hands off"
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
          A short call is enough to sketch most projects. Skip trace, SMS, CRM, offers, dashboards,
          or a full acquisition system. If we are not the right fit, we will say so.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/contact" className="fl-btn-primary px-6 py-2.5">
            Book a free call <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={CONTACT_MAILTO_SUBJECT('FreshLien services inquiry')}
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
