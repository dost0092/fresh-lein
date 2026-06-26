import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo from '@/components/seo/Seo';
import { cn } from '@/lib/utils';

export default function MarketingPageShell({ children, className = '', seo }) {
  return (
    <div className={cn('fl-app min-h-screen bg-white', className)}>
      {seo && <Seo {...seo} />}
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>{children}</div>
      <MarketingFooter />
    </div>
  );
}
