import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, RefreshCw } from 'lucide-react';
import InteractiveMapExplorer from '@/components/dashboard/InteractiveMapExplorer';
import { sortByUpcomingSale } from '@/lib/foreclosureUtils';
import { fetchLandingMapPreview } from '@/lib/foreclosureService';
import { readLandingMapCache, writeLandingMapCache } from '@/lib/landingMapCache';
import { isSupabaseConfigured } from '@/lib/supabase';
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
const GUEST_MAP_LIMIT = 40;
const AUTH_MAP_LIMIT = 80;

export default function LandingMapExplorer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [showProGate, setShowProGate] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingSearches());

  const loadMapData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoadError('Database not connected. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on your host.');
      setAllRows([]);
      setMapLoading(false);
      return;
    }

    const cached = readLandingMapCache();
    if (cached?.length) {
      setAllRows(cached);
      setMapLoading(false);
      setLoadError(null);
    } else {
      setMapLoading(true);
      setLoadError(null);
    }

    try {
      const limit = isAuthenticated ? AUTH_MAP_LIMIT : GUEST_MAP_LIMIT;
      const data = await fetchLandingMapPreview({ limit });
      setAllRows(sortByUpcomingSale(data));
      writeLandingMapCache(sortByUpcomingSale(data));
      setLoadError(null);
    } catch (err) {
      console.warn('Landing map data:', err.message);
      if (!cached?.length) {
        setLoadError(err.message || 'Could not load foreclosure records.');
        setAllRows([]);
      }
    } finally {
      setMapLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

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
  };

  return (
    <>
      <section id="explorer" className="border-b border-border bg-white py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="Live explorer"
            title="Foreclosure coverage"
            titleHighlight="map"
            description={
              loadError ? (
                <span className="text-destructive">Could not load live data. Try again below.</span>
              ) : isAuthenticated ? (
                <>
                  {mapLoading ? 'Loading live records…' : `${allRows.length.toLocaleString()}+ properties`} ·
                  urgency-colored pins · click any marker for sale date, bid, and county details
                </>
              ) : remaining > 0 ? (
                <>
                  {LANDING_FREE_SEARCH_LIMIT} free searches ·{' '}
                  <span className="font-medium text-primary">{remaining} left</span>
                </>
              ) : (
                `${LANDING_FREE_SEARCH_LIMIT} free searches, then upgrade to Pro`
              )
            }
          />

          {loadError && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <span>{loadError}</span>
              <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5" onClick={loadMapData}>
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </Button>
            </div>
          )}

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
            listings={displayRows}
            loading={mapLoading}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onSelect={(row) => row?.id && navigate(`/dashboard/foreclosures/${row.id}`)}
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
