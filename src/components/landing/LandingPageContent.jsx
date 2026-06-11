import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import MarketingFooter from '@/components/landing/MarketingFooter';

const features = [
  { icon: Zap, title: 'Same-day court data' },
  { icon: MapPin, title: 'Map & urgency pins' },
  { icon: Bell, title: 'County alerts' },
  { icon: Download, title: 'CSV export' },
  { icon: BarChart2, title: 'Market analytics' },
  { icon: Shield, title: 'Lien intelligence' },
];

export default function LandingPageContent({ topSlot = null, mapFirst = false }) {
  const { isAuthenticated } = useAuth();
  const [pricingType, setPricingType] = useState('platform');

  const mapSection = <LandingMapExplorer key="map" />;
  const heroSection = <HeroSection key="hero" />;

  return (
    <>
      {topSlot}
      {mapFirst ? mapSection : heroSection}
      {mapFirst ? heroSection : mapSection}
      <DataCoverageSection />

      <section id="features" className="py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader eyebrow="Platform" title="Built for real estate investors" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {features.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-lg border border-border/60 bg-white px-3 py-5 text-center transition-colors hover:border-primary/20 hover:bg-primary/[0.02]"
              >
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold leading-snug text-foreground sm:text-sm">{title}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <CompetitorTable />
      <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
      <PricingCompareTable pricingType={pricingType} />

      <section className="bg-primary py-11 lg:py-14">
        <LandingContainer innerClassName="text-center">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            Find deals before the crowd
          </h2>
          <p className="mx-auto mt-2 mb-6 max-w-md text-sm text-white/85 sm:text-base">
            AI-driven foreclosure intelligence
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard/foreclosures"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/95"
            >
              Browse foreclosures <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/95"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </LandingContainer>
      </section>

      <MarketingFooter />
    </>
  );
}
