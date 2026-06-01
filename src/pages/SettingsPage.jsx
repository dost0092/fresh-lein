import AppLayout from '@/components/layout/AppLayout';
import { Settings, User, CreditCard, Bell, Shield, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function PlanMeter({ label, used, total, color }) {
  const pct = total === null ? 0 : Math.min(100, (used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">
          {total === null ? `${used.toLocaleString()} used` : `${used.toLocaleString()} / ${total.toLocaleString()}`}
        </span>
      </div>
      {total !== null && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account, subscription, and preferences</p>
          </div>

          {/* Account */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-card mb-5">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-navy" />
              <h2 className="font-heading font-semibold text-foreground">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Full Name</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan" defaultValue="Waqas Dost" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan bg-muted/30" defaultValue="waqas@freshlien.com" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Company</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan" placeholder="Your company name" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Role</label>
                <select className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan bg-white">
                  <option>Real Estate Investor</option>
                  <option>Wholesale Operator</option>
                  <option>Mortgage Servicer</option>
                  <option>Real Estate Attorney</option>
                  <option>Hard Money Lender</option>
                  <option>Hedge Fund / PE</option>
                </select>
              </div>
              <Button className="bg-secondary text-white hover:bg-navy-dark">Save Changes</Button>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-card mb-5">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-navy" />
              <h2 className="font-heading font-semibold text-foreground">Subscription</h2>
            </div>

            <div className="flex items-start justify-between mb-5 p-4 bg-green-50 rounded-xl border border-green-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-secondary text-lg">Pro Plan</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">$199/month · Renews Jul 1, 2026</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs border-border">Change Plan</Button>
              </div>
            </div>

            <div className="space-y-4">
              <PlanMeter label="Property Views" used={127} total={500} color="bg-cyan" />
              <PlanMeter label="CSV Exports" used={3} total={10} color="bg-navy" />
              <PlanMeter label="Alert Zones" used={1} total={10} color="bg-purple-500" />
              <PlanMeter label="API Calls" used={0} total={1000} color="bg-emerald-500" />
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Plan Includes</p>
              <div className="grid grid-cols-2 gap-2">
                {['5 states', 'Unlimited views', 'Analytics', 'Skip trace', 'AI reports', '10 ZIP alerts'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-sm text-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-red-500" />
              <h2 className="font-heading font-semibold text-foreground">Danger Zone</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Cancel Subscription</p>
                <p className="text-xs text-muted-foreground mt-0.5">You'll retain access until Jul 1, 2026</p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-sm">
                Cancel Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}