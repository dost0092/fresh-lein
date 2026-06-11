import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Gavel, MapPin, Shield, Zap } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/data/company';
import { MARKETING_COVERAGE } from '@/data/marketingStats';

const values = [
  {
    icon: Zap,
    title: 'Speed matters',
    text: 'Foreclosure windows are short. We prioritize same-day court updates and urgency signals so you act before the crowd.',
  },
  {
    icon: Shield,
    title: 'Data you can trust',
    text: 'Records are sourced from county court filings — not scraped listing sites. Every case links back to sheriff numbers, sale dates, and status history.',
  },
  {
    icon: MapPin,
    title: 'Built for the field',
    text: 'Map-first search, county filters, and export tools designed for investors who live in spreadsheets and drive neighborhoods.',
  },
  {
    icon: BarChart2,
    title: 'Equity-first insights',
    text: 'Starting bid vs. appraised value, days to auction, and AI-powered highlights help you spot high-equity opportunities faster.',
  },
];

const milestones = [
  { label: 'Counties covered', value: MARKETING_COVERAGE.counties },
  { label: 'Foreclosure records', value: MARKETING_COVERAGE.foreclosureRecords },
  { label: 'States', value: MARKETING_COVERAGE.states },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow="About us"
        title="Foreclosure intelligence for investors who move fast"
        description={COMPANY.description}
      />

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <LandingSectionHeader
              eyebrow="Our mission"
              title="Find deals before"
              titleHighlight="everyone else"
              description="Real estate investors lose hours jumping between county sites, PDF dockets, and outdated spreadsheets. FreshLien unifies foreclosure data into one searchable platform — with map view, alerts, and the context you need to evaluate a deal in minutes."
            />
            <div className="rounded-2xl border border-border/60 bg-slate-50/60 p-6 lg:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We built {COMPANY.name} because foreclosure investing shouldn&apos;t require a research team.
                Whether you&apos;re wholesaling, buying at auction, or building a rental portfolio, you deserve
                court-sourced data, clean exports, and tools that respect how you actually work.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Today we cover {MARKETING_COVERAGE.counties} counties across {MARKETING_COVERAGE.states} states
                with {MARKETING_COVERAGE.foreclosureRecords} active and historical filings — and we&apos;re expanding
                every month.
              </p>
            </div>
          </div>
        </LandingContainer>
      </section>

      <section className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="By the numbers"
            title="Coverage that grows with you"
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
            {milestones.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-border/60 bg-white px-4 py-6 text-center shadow-sm"
              >
                <p className="font-display text-2xl font-semibold text-primary">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="What we believe"
            title="How we build"
            description="Every product decision starts with one question: does this help an investor find and close a better deal?"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-white p-5 transition-colors hover:border-primary/20"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="bg-primary py-11 lg:py-14">
        <LandingContainer innerClassName="text-center">
          <Gavel className="mx-auto h-8 w-8 text-white/80" />
          <h2 className="font-display mt-4 text-xl font-semibold text-white sm:text-2xl">
            Ready to explore foreclosure deals?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
            Start with a free trial or browse live data on the map.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95">
              <Link to="/register">
                Start free trial <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
