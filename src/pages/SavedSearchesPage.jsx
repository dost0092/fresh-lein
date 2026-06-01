import AppLayout from '@/components/layout/AppLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { Link } from 'react-router-dom';

export default function SavedSearchesPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Saved Properties</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Bookmark foreclosure cases from the detail page. Requires Supabase auth.
        </p>
        <div className="saas-card">
          <EmptyState
            title="No saved properties yet"
            description="Open a foreclosure record and click Save property to build your watchlist."
            actionLabel="Browse foreclosures"
            actionHref="/dashboard/foreclosures"
          />
        </div>
      </div>
    </AppLayout>
  );
}
