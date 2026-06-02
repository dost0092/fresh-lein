import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import InteractiveMapExplorer from '@/components/dashboard/InteractiveMapExplorer';
import { sortByUpcomingSale } from '@/lib/foreclosureUtils';
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
import { useAuth } from '@/lib/AuthContext';

const PREVIEW_RESULT_LIMIT = 4;

export default function LandingMapExplorer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [showProGate, setShowProGate] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingSearches());

  useEffect(() => {
    let cancelled = false;
    setMapLoading(true);

    fetchForeclosuresForMap({ limit: isAuthenticated ? 800 : 200 })
      .then((data) => {
        if (!cancelled) setAllRows(sortByUpcomingSale(data));
      })
      .catch((err) => {
        console.warn('map data:', err.message);
        if (!cancelled) setAllRows([]);
      })
      .finally(() => {
        if (!cancelled) setMapLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const onHeroSearch = (e) => {
      const q = e.detail?.trim();
      if (!q) return;
      setQuery(q);
      setActiveQuery(q);
      setRemaining(getRemainingSearches());
    };
    window.addEventListener('freshlien-landing-search', onHeroSearch);
    return () => window.removeEventListener('freshlien-landing-search', onHeroSearch);
  }, []);

  const previewLimit = isAuthenticated ? 20 : PREVIEW_RESULT_LIMIT;
  const displayRows = useMemo(() => {
    const base = sortByUpcomingSale(allRows);
    if (!activeQuery.trim()) return base;
    return sortByUpcomingSale(filterForeclosures(base, { search: activeQuery }));
  }, [allRows, activeQuery]);

  const lockedCount = isAuthenticated
    ? 0
    : Math.max(0, (activeQuery.trim() ? displayRows.length : allRows.length) - PREVIEW_RESULT_LIMIT);

  const handleSearch = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    if (isAuthenticated) {
      navigate(`/dashboard/foreclosures?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    if (!canSearchOnLanding()) {
      setShowProGate(true);
      return;
    }

    incrementLandingSearch();
    setRemaining(getRemainingSearches());
    setActiveQuery(trimmed);
    setSelected(null);
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
                <>Click any pin or listing — soonest sale dates first · {allRows.length}+ properties on map</>
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

          <InteractiveMapExplorer
            listings={mapLoading ? [] : displayRows}
            loading={mapLoading}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            selected={selected}
            onSelect={setSelected}
            listLimit={previewLimit}
            lockedCount={lockedCount}
            showPaywallOverlay={!isAuthenticated && !canSearchOnLanding()}
            paywallContent={
              <div className="absolute inset-0 z-[1002] flex items-center justify-center bg-white/60 p-6 backdrop-blur-[2px]">
                <div className="max-w-sm rounded-xl border border-border bg-white p-6 text-center shadow-xl">
                  <Lock className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-sm font-semibold">Preview limit reached</h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Sign up for Pro to keep searching and unlock the full map.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link to="/register">Get Pro access</Link>
                  </Button>
                </div>
              </div>
            }
          />
        </LandingContainer>
      </section>

      <ProGateModal open={showProGate} onClose={() => setShowProGate(false)} />
    </>
  );
}
