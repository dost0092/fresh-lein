import MarketingNav from '@/components/layout/MarketingNav';
import LoggedInDashboard from '@/components/dashboard/LoggedInDashboard';
import RequireAuthOrGuest from '@/components/RequireAuthOrGuest';
import RequireEntitlement from '@/components/RequireEntitlement';
import GuestAccessBanner from '@/components/dashboard/GuestAccessBanner';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';

function DashboardHomeContent() {
  return (
    <div className="fl-app min-h-screen bg-white">
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <GuestAccessBanner />
        <LoggedInDashboard />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <RequireAuthOrGuest>
      <RequireEntitlement>
        <DashboardHomeContent />
      </RequireEntitlement>
    </RequireAuthOrGuest>
  );
}
