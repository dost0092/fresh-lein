import MarketingNav from '@/components/layout/MarketingNav';
import MarketingFooter from '@/components/landing/MarketingFooter';

export default function MarketingPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-[#f6f9f7] ${className}`}>
      <MarketingNav />
      <div className="pt-[3.75rem] lg:pt-[4.25rem]">{children}</div>
      <MarketingFooter />
    </div>
  );
}
