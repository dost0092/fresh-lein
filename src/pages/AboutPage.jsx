import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, MapPin, Layers } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/data/company';
import { MARKETING_COVERAGE } from '@/data/marketingStats';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import { ABOUT, BRAND } from '@/data/marketingContent';

const valueIcons = [Clock, Shield, MapPin, Layers];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow="About FreshLien"
        title="Same-day distressed property data"
        titleHighlight="for investors who move first"
        description={BRAND.positioning}
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <LandingSectionHeader
              eyebrow="Our mission"
              title="Unify county data into"
              titleHighlight="one platform"
              description={ABOUT.mission}
            />
            <div className="rounded-lg border border-border/80 bg-[#FAFAFA] p-6 lg:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">{ABOUT.story}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Today we index {MARKETING_COVERAGE.foreclosureFilingsLiveFull} searchable foreclosure filings
                across {MARKETING_COVERAGE.counties} counties in {MARKETING_COVERAGE.states} states, with{' '}
                {MARKETING_COVERAGE.propertiesLinkedFull} properties linked. Probate, pre-foreclosure, and
                tax categories are rolling out with clear live or coming-soon labels.
              </p>
            </div>
          </div>
        </LandingContainer>
      </section>

      <DataCoverageSection />

      <section className="py-14 lg:py-20">
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
                  className="rounded-lg border border-border/80 bg-white p-6 shadow-card"
                >
                  <div className="icon-surface mb-3 h-10 w-10">
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

      <section className="border-t border-border bg-white py-14 lg:py-20">
        <LandingContainer innerClassName="text-center">
          <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            Ready to explore distressed property data?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Start free or browse live filings on the map. {COMPANY.name} covers foreclosure today, with probate and tax data rolling out.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
