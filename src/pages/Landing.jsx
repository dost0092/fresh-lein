import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <LandingPageContent />
      </div>
    </div>
  );
}
