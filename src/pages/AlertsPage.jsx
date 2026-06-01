import AppLayout from '@/components/layout/AppLayout';
import EmptyState from '@/components/dashboard/EmptyState';

export default function AlertsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Alerts</h1>
        <p className="text-muted-foreground text-sm mb-8">
          County-level email alerts will activate once your subscription and Supabase data are connected.
        </p>
        <div className="saas-card">
          <EmptyState
            title="No alerts configured"
            description="Set up county alerts to get notified when new foreclosure filings match your markets."
          />
        </div>
      </div>
    </AppLayout>
  );
}
