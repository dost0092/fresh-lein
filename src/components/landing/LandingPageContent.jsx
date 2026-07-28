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
import { LandingContainer } from '@/components/landing/LandingLayout';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import MarketingFooter from '@/components/landing/MarketingFooter';

export default function LandingPageContent({ topSlot = null }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="fl-app">
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

      <section className="fl-marketing-section border-t">
        <LandingContainer innerClassName="text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Tell us what you need built
          </h2>
          <p className="mx-auto mt-3 mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            Automation offers and platform access are scoped after we talk. No public price list.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard/foreclosures" className="fl-btn-primary px-6 py-2.5">
              Open app <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="fl-btn-primary px-6 py-2.5">
                Contact us to discuss <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/book-audit" className="fl-btn-ghost px-6 py-2.5">
                Request a workflow review
              </Link>
            </div>
          )}
        </LandingContainer>
      </section>

      <MarketingFooter />
    </div>
  );
}
