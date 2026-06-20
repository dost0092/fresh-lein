import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';

export default function MarketingPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>{children}</div>
      <MarketingFooter />
    </div>
  );
}
