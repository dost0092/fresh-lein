import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { fetchSavedProperties, unsaveProperty } from '@/lib/savedPropertiesService';
import { useAuth } from '@/lib/AuthContext';
import { Loader2, Trash2 } from 'lucide-react';

export default function SavedSearchesPage() {
  const { isSupabaseConfigured } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchSavedProperties()
      .then(setItems)
      .catch((err) => setError(err.message || 'Could not load saved properties.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [isSupabaseConfigured]);

  const handleRemove = async (foreclosureCaseId) => {
    try {
      await unsaveProperty(foreclosureCaseId);
      setItems((prev) => prev.filter((i) => i.foreclosure_case_id !== foreclosureCaseId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Saved Properties</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Bookmark foreclosure cases from the detail page.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="saas-card">
            <EmptyState
              title="No saved properties yet"
              description="Open a foreclosure record and click Save to build your watchlist."
              actionLabel="Browse foreclosures"
              actionHref="/dashboard/foreclosures"
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((row) => {
              const fc = row.foreclosure_cases;
              if (!fc) return null;
              const county = fc.counties;
              return (
                <li key={row.id} className="saas-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/dashboard/foreclosures/${fc.id}`}
                      className="font-medium text-sm text-foreground hover:text-primary"
                    >
                      {fc.property_address || 'Property'}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {county?.county_name}, {county?.state || fc.state} · {fc.status}
                      {fc.sale_date && ` · Sale ${format(new Date(fc.sale_date), 'MMM d, yyyy')}`}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs shrink-0"
                    onClick={() => handleRemove(row.foreclosure_case_id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
