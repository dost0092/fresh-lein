import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import PlatformOverviewSection from '@/components/landing/PlatformOverviewSection';
import CoreWorkflowsSection from '@/components/landing/CoreWorkflowsSection';
import DashboardIASection from '@/components/landing/DashboardIASection';
import WhyDifferentSection from '@/components/landing/WhyDifferentSection';
import DataCategoriesSection from '@/components/landing/DataCategoriesSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TrustTransparencySection from '@/components/landing/TrustTransparencySection';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import EnterpriseFeaturesSection from '@/components/landing/EnterpriseFeaturesSection';
import MarketInsightsSection from '@/components/landing/MarketInsightsSection';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import MarketingFooter from '@/components/landing/MarketingFooter';

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
      <PlatformOverviewSection />
      <CoreWorkflowsSection />
      <DashboardIASection />
      <WhyDifferentSection />
      <DataCategoriesSection />
      <UseCasesSection />
      <TrustTransparencySection />
      <CompetitorTable />
      <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
      <PricingCompareTable pricingType={pricingType} />
      <EnterpriseFeaturesSection />
      <MarketInsightsSection />

      <section className="bg-primary py-11 lg:py-14">
        <LandingContainer innerClassName="text-center">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            Find distressed deals before the crowd
          </h2>
          <p className="mx-auto mt-2 mb-6 max-w-lg text-sm text-white/85 sm:text-base">
            Same-day county-direct intelligence for pre-foreclosure, foreclosure, probate, and tax lien data.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard/foreclosures"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/95"
            >
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/95"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/foreclosures"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Try dashboard
              </Link>
            </div>
          )}
        </LandingContainer>
      </section>

      <MarketingFooter />
    </>
  );
}
