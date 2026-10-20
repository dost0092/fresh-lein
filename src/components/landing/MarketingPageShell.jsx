import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo from '@/components/seo/Seo';
import MobileBookBar from '@/components/site/MobileBookBar';
import { cn } from '@/lib/utils';

/**
 * Marketing page chrome. Pages built with the site design system pass `overlapNav`
 * so their hero sits behind the transparent nav and handles its own top spacing.
 */
export default function MarketingPageShell({
  children,
  className = '',
  seo,
  overlapNav = false,
  navTone = 'light',
  hideBookBar = false,
}) {
  return (
    <div className={cn('fl-app site min-h-screen bg-white', className)}>
      {seo && <Seo {...seo} />}
      <MarketingNav tone={navTone} />
      <main className={overlapNav ? undefined : MARKETING_NAV_OFFSET_CLASS}>{children}</main>
      <MarketingFooter />
      {!hideBookBar && <MobileBookBar />}
    </div>
  );
}
