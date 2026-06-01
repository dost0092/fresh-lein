import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gavel } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import { Button } from '@/components/ui/button';
import { fetchDashboardStats, fetchForeclosures } from '@/lib/foreclosureService';
import { format } from 'date-fns';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchForeclosures()]).then(([s, cases]) => {
      setStats(s);
      setRecent(
        cases
          .filter((c) => c.status === 'Scheduled')
          .sort((a, b) => new Date(a.sale_date) - new Date(b.sale_date))
          .slice(0, 5)
      );
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 max-w-7xl mx-auto w-full space-y-8 lg:space-y-10">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Active foreclosure intelligence across {stats?.countiesCovered ?? '—'} counties.
            </p>
          </div>

          <StatsCards stats={stats} loading={loading} />

          <div className="saas-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#4257A7]/10 flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-[#4257A7]" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-foreground">Upcoming auctions</h2>
                  <p className="text-sm text-muted-foreground">Next scheduled sheriff sales</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/foreclosures">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No upcoming auctions.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/dashboard/foreclosures/${c.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-[#4257A7] transition-colors">
                          {c.property_address}, {c.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {c.county_name} County, {c.state} · {c.sheriff_number}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-medium text-foreground">
                          {c.sale_date ? format(new Date(c.sale_date), 'MMM d, yyyy') : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">Sale date</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
