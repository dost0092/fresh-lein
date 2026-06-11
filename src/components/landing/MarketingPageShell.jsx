import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';

export default function MarketingPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <MarketingNav />
      <div className="pt-14 lg:pt-16">{children}</div>
      <MarketingFooter />
    </div>
  );
}
