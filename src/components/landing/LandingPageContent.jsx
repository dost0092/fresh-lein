import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import CrmShowcaseSection from '@/components/landing/CrmShowcaseSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import PlatformOverviewSection from '@/components/landing/PlatformOverviewSection';
import CoreWorkflowsSection from '@/components/landing/CoreWorkflowsSection';
import WhyDifferentSection from '@/components/landing/WhyDifferentSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TrustTransparencySection from '@/components/landing/TrustTransparencySection';
import BlogPreviewSection from '@/components/landing/BlogPreviewSection';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import MarketingFooter from '@/components/landing/MarketingFooter';

export default function LandingPageContent({ topSlot = null }) {
  const { isAuthenticated } = useAuth();
  const [pricingType, setPricingType] = useState('platform');

  return (
    <>
      {topSlot}
      <CrmShowcaseSection />
      <HeroSection />
      <DataCoverageSection />
      <LandingMapExplorer />

      <PlatformOverviewSection />
      <CoreWorkflowsSection />
      <WhyDifferentSection />
      <UseCasesSection />
      <TrustTransparencySection />
      <BlogPreviewSection />

      <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
      <PricingCompareTable pricingType={pricingType} />

      <section className="border-t border-border bg-white py-14 lg:py-20">
        <LandingContainer innerClassName="text-center">
          <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            Find distressed deals before the crowd
          </h2>
          <p className="mx-auto mt-3 mb-8 max-w-lg text-base leading-[1.65] text-muted-foreground">
            Start free, search live county filings, and upgrade when you need more coverage.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard/foreclosures"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Open app <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/foreclosures"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-neutral-50"
              >
                Preview live data
              </Link>
            </div>
          )}
        </LandingContainer>
      </section>

      <MarketingFooter />
    </>
  );
}
