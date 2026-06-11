import MarketingNav from '@/components/layout/MarketingNav';
import LoggedInDashboard from '@/components/dashboard/LoggedInDashboard';
import RequireAuth from '@/components/RequireAuth';
import RequireEntitlement from '@/components/RequireEntitlement';

function DashboardHomeContent() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-[3.75rem] lg:pt-[4.25rem]">
        <LoggedInDashboard />
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
