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
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/dashboard/foreclosures?q=${encodeURIComponent(q)}` : '/dashboard/foreclosures');
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="border-b border-border bg-gradient-to-b from-white to-[#f8f9fb]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 text-center">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight text-balance">
              Find foreclosure deals in seconds
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
              Search across {stats?.countiesCovered ?? 48} counties. Switch between map and list. Full case files on every property.
            </p>
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Address, defendant, sheriff number, county..."
                className="w-full h-14 pl-14 pr-36 text-base rounded-2xl border border-border bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-xl">
                Search
              </Button>
            </form>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button asChild variant="secondary" size="sm">
                <Link to="/dashboard/foreclosures">
                  <Gavel className="w-4 h-4 mr-1.5" /> Browse all foreclosures
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/foreclosures?view=map">
                  <Map className="w-4 h-4 mr-1.5" /> Open map explorer
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
          <StatsCards stats={stats} loading={loading} />

          <div className="saas-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-heading font-semibold text-foreground">Upcoming auctions</h2>
                <p className="text-sm text-muted-foreground">Scheduled sheriff sales — soonest first</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/foreclosures">
                  Open explorer <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/dashboard/foreclosures/${c.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary">
                          {c.property_address}, {c.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {c.county_name} County, {c.state}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0 ml-4">
                        {c.sale_date ? format(new Date(c.sale_date), 'MMM d, yyyy') : '—'}
                      </p>
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
