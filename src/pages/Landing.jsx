import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f6f9f7]">
      <MarketingNav />
      <div className="pt-[3.75rem] lg:pt-[4.25rem]">
        <LandingPageContent />
      </div>
    </div>
  );
}
