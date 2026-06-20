import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, MapPin, Layers } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/data/company';
import { MARKETING_COVERAGE } from '@/data/marketingStats';
import { ABOUT, BRAND } from '@/data/marketingContent';

const valueIcons = [Clock, Shield, MapPin, Layers];

const milestones = [
  { label: 'Counties covered', value: MARKETING_COVERAGE.counties },
  { label: 'Filings tracked', value: MARKETING_COVERAGE.foreclosureRecords },
  { label: 'Properties indexed', value: MARKETING_COVERAGE.propertiesIndexed },
  { label: 'States live', value: MARKETING_COVERAGE.states },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow="About FreshLien"
        title="Same-day distressed real estate intelligence"
        titleHighlight="for investors who move first"
        description={BRAND.positioning}
      />

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <LandingSectionHeader
              eyebrow="Our mission"
              title="Unify county data into"
              titleHighlight="one platform"
              description={ABOUT.mission}
            />
            <div className="rounded-2xl border border-border/60 bg-slate-50/60 p-6 lg:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">{ABOUT.story}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Today we cover {MARKETING_COVERAGE.counties} counties across {MARKETING_COVERAGE.states} states
                with {MARKETING_COVERAGE.foreclosureRecords} filings and {MARKETING_COVERAGE.propertiesIndexed} indexed
                properties — with pre-foreclosure, probate, and tax delinquency categories rolling out county by county.
              </p>
            </div>
          </div>
        </LandingContainer>
      </section>

      <section className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="What we're building"
            title="A complete distressed"
            titleHighlight="property platform"
            align="center"
            className="mx-auto"
            description="Web app, REST API, and bulk data feeds — covering the full distress spectrum from pre-foreclosure through REO."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
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
            {ABOUT.values.map(({ title, text }, i) => {
              const Icon = valueIcons[i];
              return (
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
              );
            })}
          </div>
        </LandingContainer>
      </section>

      <section className="bg-primary py-11 lg:py-14">
        <LandingContainer innerClassName="text-center">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            Ready to explore distressed property data?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
            Start free or browse live filings on the map — {COMPANY.name} covers foreclosure, probate, and tax lien intelligence.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95">
              <Link to="/register">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
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
