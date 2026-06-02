import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-14 lg:pt-16">
        <LandingPageContent />
      </div>
    </div>
  );
}
