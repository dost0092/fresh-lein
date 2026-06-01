import AppLayout from '@/components/layout/AppLayout';
import { Briefcase, Lock, Plus, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PortfolioPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">Portfolio Monitor</h1>
            <p className="text-muted-foreground text-sm mt-1">Monitor your collateral portfolio for distress signals</p>
          </div>

          {/* Enterprise Gate */}
          <div className="bg-white border-2 border-dashed border-yellow-300 rounded-2xl p-12 text-center mb-6">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 text-xs font-semibold mb-4">
              <Lock className="w-3 h-3" /> Enterprise Only
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Portfolio Monitor</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
              Add any property addresses to your portfolio. Get instant alerts when any monitored 
              property receives a new distress filing — NOD, Lis Pendens, tax lien, or probate.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              {([
                { icon: Plus, label: 'Add Properties' },
                { icon: AlertTriangle, label: 'Instant Alerts' },
                { icon: CheckCircle, label: 'Health Score' },
              ] ).map(({ icon: FeatureIcon, label }) => (
                <div key={label} className="p-3 bg-muted rounded-xl text-center">
                  <FeatureIcon className="w-5 h-5 text-navy mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-foreground">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">$999/month</p>
            <p className="text-xs text-muted-foreground mb-6">Includes unlimited portfolio properties, real-time alerts, and health dashboard</p>
            <Link to="/settings">
              <Button className="bg-navy hover:bg-navy-dark text-white font-semibold px-8">
                Upgrade to Enterprise
              </Button>
            </Link>
          </div>

          {/* Feature Preview */}
          <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden opacity-60 pointer-events-none">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground text-sm">Portfolio Health Dashboard</h3>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['12 properties', '0 distress signals', '100% health'].map(v => (
                  <div key={v} className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-sm font-bold text-muted-foreground">{v}</p>
                  </div>
                ))}
              </div>
              <div className="h-24 bg-muted/30 rounded-xl flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Property list preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}