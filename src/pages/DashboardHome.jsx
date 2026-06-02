import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Gavel, Map } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import { Button } from '@/components/ui/button';
import { fetchDashboardStats, fetchForeclosures } from '@/lib/foreclosureService';
import { format } from 'date-fns';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchForeclosures()])
      .then(([s, cases]) => {
        setStats(s);
        setRecent(
          cases
            .filter((c) => c.status === 'Scheduled')
            .sort((a, b) => new Date(a.sale_date) - new Date(b.sale_date))
            .slice(0, 5)
        );
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Could not load dashboard data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/dashboard/foreclosures?q=${encodeURIComponent(q)}` : '/dashboard/foreclosures');
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="border-b border-border bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
              Find foreclosure deals fast
            </h1>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
              Search {stats?.countiesCovered ?? 48} counties · map or list view · full case details
            </p>
            <form onSubmit={handleSearch} className="mt-5 max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Address, defendant, sheriff number..."
                className="search-input pr-24"
              />
              <Button type="submit" size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 text-xs px-3">
                Search
              </Button>
            </form>
            <div className="flex justify-center gap-2 mt-4">
              <Button asChild size="sm" variant="default" className="h-8 text-xs">
                <Link to="/dashboard/foreclosures">
                  <Gavel className="w-3.5 h-3.5 mr-1" /> Browse all
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                <Link to="/dashboard/foreclosures?view=map">
                  <Map className="w-3.5 h-3.5 mr-1" /> Map view
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <StatsCards stats={stats} loading={loading} />

          <div className="saas-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Upcoming auctions</h2>
                <p className="text-xs text-muted-foreground">Soonest sale dates first</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary">
                <Link to="/dashboard/foreclosures">
                  View all <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-11 bg-muted/40 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/dashboard/foreclosures/${c.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 group"
                    >
                      <div className="min-w-0 pr-4">
                        <p className="font-medium truncate group-hover:text-primary">{c.property_address}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.county_name} Co., {c.state}
                        </p>
                      </div>
                      <span className="text-xs font-medium shrink-0">
                        {c.sale_date ? format(new Date(c.sale_date), 'MMM d') : '—'}
                      </span>
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
