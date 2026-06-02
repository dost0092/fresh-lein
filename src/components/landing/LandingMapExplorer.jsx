import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Lock, MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import MapView from '@/components/dashboard/MapView';
import { fetchForeclosuresForMap } from '@/lib/foreclosureService';
import { filterForeclosures } from '@/lib/foreclosureUtils';
import {
  canSearchOnLanding,
  incrementLandingSearch,
  getRemainingSearches,
  LANDING_FREE_SEARCH_LIMIT,
} from '@/lib/landingSearchLimit';
import ProGateModal from '@/components/landing/ProGateModal';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/lib/AuthContext';

const PREVIEW_RESULT_LIMIT = 4;

export default function LandingMapExplorer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [showProGate, setShowProGate] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingSearches());
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchForeclosuresForMap({ limit: isAuthenticated ? 800 : 200 })
      .then(setAllRows)
      .catch(() => setAllRows([]));
  }, [isAuthenticated]);

  useEffect(() => {
    const onHeroSearch = (e) => {
      const q = e.detail?.trim();
      if (!q) return;
      setQuery(q);
      setActiveQuery(q);
      setHasSearched(true);
      setRemaining(getRemainingSearches());
    };
    window.addEventListener('freshlien-landing-search', onHeroSearch);
    return () => window.removeEventListener('freshlien-landing-search', onHeroSearch);
  }, []);

  const previewLimit = isAuthenticated ? 12 : PREVIEW_RESULT_LIMIT;
  const results = useMemo(() => {
    if (!activeQuery.trim()) return allRows.slice(0, previewLimit);
    return filterForeclosures(allRows, { search: activeQuery });
  }, [allRows, activeQuery, previewLimit]);

  const previewResults = results.slice(0, previewLimit);
  const lockedCount = isAuthenticated ? 0 : Math.max(0, results.length - PREVIEW_RESULT_LIMIT);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (isAuthenticated) {
      navigate(q ? `/dashboard/foreclosures?q=${encodeURIComponent(q)}` : '/dashboard/foreclosures');
      return;
    }

    if (!canSearchOnLanding()) {
      setShowProGate(true);
      return;
    }

    incrementLandingSearch();
    setRemaining(getRemainingSearches());
    setActiveQuery(q);
    setHasSearched(true);
    setSelected(null);

    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  };

  return (
    <>
      <section id="explorer" className="border-b border-border bg-white py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="Live explorer"
            title="Foreclosure coverage map"
            description={
              isAuthenticated ? (
                <>Full platform access · open the explorer for filters, export, and all {allRows.length}+ map pins</>
              ) : remaining > 0 ? (
                <>
                  {LANDING_FREE_SEARCH_LIMIT} free searches ·{' '}
                  <span className="font-medium text-primary">{remaining} left</span>
                </>
              ) : (
                `${LANDING_FREE_SEARCH_LIMIT} free searches — then upgrade to Pro`
              )
            }
          />

          {isAuthenticated && (
            <div className="mb-4 flex justify-end">
              <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                <Link to="/dashboard/foreclosures">
                  Open full explorer <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}

          <div className="flex h-[520px] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm lg:h-[560px] lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-border flex flex-col bg-white">
              <div className="p-4 border-b border-border">
                <p className="text-xs font-semibold text-foreground mb-2">Search by address</p>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Address, city, or ZIP code"
                    className="w-full h-10 pl-10 pr-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </form>
                <Button type="submit" onClick={handleSearch} className="w-full mt-2 h-9 text-xs">
                  Search foreclosures
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {!hasSearched && (
                  <p className="text-xs text-muted-foreground px-1 py-2">
                    Sample listings shown. Enter an address to search.
                  </p>
                )}
                {previewResults.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelected(row)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      selected?.id === row.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                        {row.property_address}
                      </p>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                        {row.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {row.city}, {row.state}
                    </p>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                      <span>Sale {formatDate(row.sale_date)}</span>
                      <span className="font-medium text-foreground">
                        ${Number(row.starting_bid || 0).toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}

                {lockedCount > 0 && !isAuthenticated && (
                  <div className="relative rounded-lg border border-dashed border-primary/40 bg-primary/[0.04] p-4 text-center">
                    <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">
                      +{lockedCount} more results
                    </p>
                    <p className="text-[11px] text-muted-foreground mb-3">
                      Unlock full search & map with Pro
                    </p>
                    <Button asChild size="sm" className="h-8 text-xs w-full">
                      <Link to="/register">Upgrade to Pro</Link>
                    </Button>
                  </div>
                )}

                {hasSearched && results.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No matches. Try another address.</p>
                )}
              </div>

              {selected && (
                <div className="p-3 border-t border-border bg-muted/20">
                  <Link
                    to={`/dashboard/foreclosures/${selected.id}`}
                    className="flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View full record <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="flex-1 relative min-h-[280px] bg-slate-100">
              <MapView
                filings={hasSearched ? results : previewResults}
                onSelectFiling={setSelected}
                selectedId={selected?.id}
              />
              {!isAuthenticated && !canSearchOnLanding() && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[500] flex items-center justify-center p-6">
                  <div className="bg-white rounded-xl border border-border shadow-xl p-6 max-w-sm text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-2">Preview limit reached</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Sign up for Pro to keep searching addresses and unlock the full map.
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link to="/register">Get Pro access</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </LandingContainer>
      </section>

      <ProGateModal open={showProGate} onClose={() => setShowProGate(false)} />
    </>
  );
}
