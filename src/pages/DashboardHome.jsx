import MarketingNav from '@/components/layout/MarketingNav';
import LoggedInDashboard from '@/components/dashboard/LoggedInDashboard';
import RequireAuthOrGuest from '@/components/RequireAuthOrGuest';
import RequireEntitlement from '@/components/RequireEntitlement';
import GuestAccessBanner from '@/components/dashboard/GuestAccessBanner';

function DashboardHomeContent() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-[3.75rem] lg:pt-[4.25rem]">
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
