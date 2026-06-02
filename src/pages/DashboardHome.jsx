import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';
import LoggedInDashboardStrip from '@/components/dashboard/LoggedInDashboardStrip';
import RequireAuth from '@/components/RequireAuth';
import RequireEntitlement from '@/components/RequireEntitlement';

function DashboardHomeContent() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-14 lg:pt-16">
        <LandingPageContent topSlot={<LoggedInDashboardStrip />} mapFirst />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <RequireAuth>
      <RequireEntitlement>
        <DashboardHomeContent />
      </RequireEntitlement>
    </RequireAuth>
  );
}
