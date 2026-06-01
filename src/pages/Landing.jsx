import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import MarketingNav from '@/components/layout/MarketingNav';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Same-Day Data Freshness',
    description: 'We scrape US county courts directly every morning. No middlemen, no aggregation delays.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: MapPin,
    title: 'Interactive Map Intelligence',
    description: 'Color-coded urgency pins — spot urgent auctions in red, upcoming in orange.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'County-level email alerts the moment a new filing hits your market.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Download,
    title: 'Bulk CSV Export',
    description: 'Export filtered leads to your CRM, skip-tracing tool, or direct mail.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: BarChart2,
    title: 'Market Analytics',
    description: 'Filing trends, auction volumes, and equity distributions by county.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Lien Intelligence',
    description: 'Federal, state, HOA liens, and probate flags from every filing.',
    color: 'text-primary bg-primary/10',
  },
];

export default function Landing() {
  const [pricingType, setPricingType] = useState('platform');

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      <div className="pt-14 lg:pt-16">
        <HeroSection />
        <LandingMapExplorer />
        <DataCoverageSection />

        <section id="features" className="bg-white py-12 lg:py-14">
          <LandingContainer>
            <LandingSectionHeader
              eyebrow="Platform"
              title="Built for real estate investors"
              description="Every feature designed around the investor workflow — from lead discovery to closing."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="rounded-lg border border-border/70 bg-white p-5 transition-colors hover:border-primary/25 hover:bg-slate-50/40"
                >
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-md ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-foreground">{title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </LandingContainer>
        </section>

        <CompetitorTable />
        <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
        <PricingCompareTable pricingType={pricingType} />

        <section className="bg-primary py-12 lg:py-14">
          <LandingContainer innerClassName="text-center">
            <h2 className="font-display mb-3 text-xl font-semibold text-white lg:text-2xl">
              Ready to find deals before the crowd?
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-sm text-white/80">
              Join investors using AI-driven foreclosure intelligence to win more deals.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-white/90"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </LandingContainer>
        </section>

        <footer className="bg-navy-dark py-8">
          <LandingContainer>
            <div className="flex flex-col items-center justify-between gap-3 text-sm md:flex-row">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold">
                  FL
                </div>
                <span className="font-semibold">FreshLien</span>
                <span className="text-xs text-white/40">© 2026</span>
              </div>
              <div className="flex gap-5 text-xs text-white/50">
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </div>
            </div>
          </LandingContainer>
        </footer>
      </div>
    </div>
  );
}
