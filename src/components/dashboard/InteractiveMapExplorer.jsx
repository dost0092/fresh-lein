import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Lock, MapPin } from 'lucide-react';
import MapView from '@/components/dashboard/MapView';
import MapRecordDetailPanel from '@/components/dashboard/MapRecordDetailPanel';
import { filterForeclosures, sortByUpcomingSale } from '@/lib/foreclosureUtils';
import { getUrgency, getMarkerColor } from '@/components/dashboard/UrgencyBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function formatDate(d) {
  try {
    return d ? format(new Date(d), 'MMM d, yyyy') : '—';
  } catch {
    return '—';
  }
}

/** Soonest upcoming sale dates first (tomorrow at top). Re-exported from utils. */
export { sortByUpcomingSale, sortByUpcomingSale as sortBySoonestSale } from '@/lib/foreclosureUtils';

export default function InteractiveMapExplorer({
  listings = [],
  loading = false,
  query = '',
  onQueryChange,
  onSearch,
  selected,
  onSelect,
  listLimit = 12,
  lockedCount = 0,
  showPaywallOverlay = false,
  paywallContent = null,
  leftPanelHeader = {
    title: 'Foreclosure coverage map',
    description: 'Upcoming auctions first — soonest sale dates at the top.',
  },
  heightClass = 'h-[min(85vh,720px)]',
  className,
}) {
  const [internalQuery, setInternalQuery] = useState(query);
  const searchValue = onQueryChange ? query : internalQuery;
  const setSearchValue = onQueryChange || setInternalQuery;

  useEffect(() => {
    setInternalQuery(query);
  }, [query]);

  const sortedListings = useMemo(() => sortByUpcomingSale(listings), [listings]);

  const filtered = useMemo(() => {
    const q = searchValue.trim();
    if (!q) return sortedListings.slice(0, listLimit);
    return sortByUpcomingSale(filterForeclosures(sortedListings, { search: q })).slice(0, listLimit);
  }, [sortedListings, searchValue, listLimit]);

  const mapFilings = searchValue.trim()
    ? sortByUpcomingSale(filterForeclosures(sortedListings, { search: searchValue }))
    : sortedListings;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchValue.trim());
  };

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl border border-border bg-slate-100 shadow-sm', heightClass, className)}>
      <MapView
        filings={mapFilings}
        onSelectFiling={onSelect}
        selectedId={selected?.id}
        hidePopups
        flyToSelected
        legendVariant="dark"
      />

      {/* Left panel */}
      <div className="absolute left-3 top-3 bottom-3 z-[1000] flex w-[min(calc(100%-1.5rem),360px)] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xl sm:left-4 sm:top-4 sm:bottom-4">
        <div className="border-b border-border px-4 py-4">
          <h2 className="font-display text-base font-semibold text-foreground">{leftPanelHeader.title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{leftPanelHeader.description}</p>

          <form onSubmit={handleSubmit} className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search using address, city, or ZIP"
              className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && filtered.length === 0 ? (
            <div className="space-y-2 px-1 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-lg border border-border bg-white p-3">
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-muted/70" />
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    <div className="h-8 rounded bg-muted/50" />
                    <div className="h-8 rounded bg-muted/50" />
                    <div className="h-8 rounded bg-muted/50" />
                  </div>
                </div>
              ))}
              <p className="pt-1 text-center text-xs text-muted-foreground">Loading foreclosure records…</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {searchValue.trim() ? 'No matches. Try another search.' : 'No foreclosure data available.'}
            </p>
          ) : (
            filtered.map((row) => {
              const urgency = getUrgency(row.days_to_auction, row.status === 'Appraisal' ? 'PRE' : 'NTS');
              const dotColor = getMarkerColor(urgency);
              const isSelected = selected?.id === row.id;

              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onSelect(row)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                      : 'border-border bg-white hover:border-primary/30 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                        {row.property_address}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {row.county_name ? `${row.county_name} Co., ` : ''}
                        {row.state}
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                        <div className="rounded bg-muted/50 px-1 py-1">
                          <p className="text-[9px] uppercase text-muted-foreground">Sale</p>
                          <p className="text-[10px] font-semibold">
                            {row.days_to_auction === 0
                              ? 'Today'
                              : row.days_to_auction === 1
                                ? 'Tomorrow'
                                : formatDate(row.sale_date)}
                          </p>
                        </div>
                        <div className="rounded bg-muted/50 px-1 py-1">
                          <p className="text-[9px] uppercase text-muted-foreground">Bid</p>
                          <p className="text-[10px] font-semibold">
                            {row.starting_bid != null ? `$${Number(row.starting_bid).toLocaleString()}` : '—'}
                          </p>
                        </div>
                        <div className="rounded bg-muted/50 px-1 py-1">
                          <p className="text-[9px] uppercase text-muted-foreground">Status</p>
                          <p className="text-[10px] font-semibold truncate">{row.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {lockedCount > 0 && (
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/[0.04] p-4 text-center">
              <Lock className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs font-semibold text-foreground">+{lockedCount} more results</p>
              <p className="mb-3 text-[11px] text-muted-foreground">Sign up to unlock full search</p>
              <Button asChild size="sm" className="h-8 w-full text-xs">
                <Link to="/register">Get Pro access</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right detail panel */}
      {selected && (
        <MapRecordDetailPanel
          record={selected}
          onClose={() => onSelect(null)}
          className="absolute right-3 top-3 bottom-3 z-[1000] hidden w-[min(calc(100%-1.5rem),400px)] sm:flex sm:right-4 sm:top-4 sm:bottom-4"
        />
      )}

      {/* Mobile detail — bottom sheet style */}
      {selected && (
        <div className="absolute inset-x-3 bottom-3 z-[1001] max-h-[55%] sm:hidden">
          <MapRecordDetailPanel record={selected} onClose={() => onSelect(null)} className="max-h-full" />
        </div>
      )}

      {showPaywallOverlay && paywallContent}
    </div>
  );
}
