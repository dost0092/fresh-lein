import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Download, Map, List, SlidersHorizontal, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import InteractiveMapExplorer from '@/components/dashboard/InteractiveMapExplorer';
import { sortByUpcomingSale } from '@/lib/foreclosureUtils';
import ForeclosureListCompact from '@/components/dashboard/ForeclosureListCompact';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  fetchForeclosureFilterOptions,
  fetchForeclosuresForExport,
  fetchForeclosuresForMap,
  fetchForeclosuresPage,
  exportForeclosuresCsv,
  isUsingLiveData,
} from '@/lib/foreclosureService';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;
const GUEST_MAP_LIMIT = 80;
const AUTH_MAP_LIMIT = 150;

export default function ForeclosureExplorer({ title = 'Foreclosures' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const mapFetchLimit = isAuthenticated ? AUTH_MAP_LIMIT : GUEST_MAP_LIMIT;
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [mapRows, setMapRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const initialView = searchParams.get('view') === 'map' ? 'map' : 'list';
  const [view, setView] = useState(initialView);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');
  const [county, setCounty] = useState('all');
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ counties: [], states: [], statuses: [] });

  const filters = useMemo(
    () => ({ search: debouncedSearch, county, state, status, dateFrom, dateTo }),
    [debouncedSearch, county, state, status, dateFrom, dateTo]
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchForeclosureFilterOptions()
      .then(setFilterOptions)
      .catch((err) => console.warn('filter options:', err.message));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, county, state, status, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchForeclosuresPage({ page, pageSize: PAGE_SIZE, filters })
      .then(({ rows: data, total }) => {
        if (cancelled) return;
        setRows(data);
        setTotalCount(total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Could not load foreclosure data.');
        setRows([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filters]);

  const reloadList = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchForeclosuresPage({ page, pageSize: PAGE_SIZE, filters })
      .then(({ rows: data, total }) => {
        setRows(data);
        setTotalCount(total);
      })
      .catch((err) => setError(err.message || 'Could not load foreclosure data.'))
      .finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => {
    if (view !== 'map') return;

    let cancelled = false;
    setMapLoading(true);

    fetchForeclosuresForMap({ filters, limit: mapFetchLimit })
      .then((data) => {
        if (!cancelled) setMapRows(data);
      })
      .catch((err) => {
        if (!cancelled) console.warn('map data:', err.message);
      })
      .finally(() => {
        if (!cancelled) setMapLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view, filters, mapFetchLimit]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const clearFilters = () => {
    setSearch('');
    setCounty('all');
    setState('all');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setSearchParams({});
  };

  const hasFilters =
    county !== 'all' || state !== 'all' || status !== 'all' || dateFrom || dateTo || search.trim();

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const data = await fetchForeclosuresForExport(filters);
      exportForeclosuresCsv(data);
    } catch (err) {
      setError(err.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  }, [filters]);

  const openRecord = useCallback(
    (row) => {
      if (row?.id) navigate(`/dashboard/foreclosures/${row.id}`);
    },
    [navigate]
  );

  const filterControls = (
    <>
      <Select value={county} onValueChange={setCounty}>
        <SelectTrigger className="filter-chip h-9 w-[140px] shrink-0">
          <SelectValue placeholder="County" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All counties</SelectItem>
          {filterOptions.counties.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="filter-chip h-9 w-[88px] shrink-0">
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {filterOptions.states.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="filter-chip h-9 w-[120px] shrink-0">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {filterOptions.statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="filter-chip h-9 w-[132px] shrink-0 px-2 text-xs"
      />
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="filter-chip h-9 w-[132px] shrink-0 px-2 text-xs"
      />
    </>
  );

  const showEmpty = !loading && !error && totalCount === 0;
  const mapData = mapRows.length ? mapRows : rows;

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="control-bar space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="page-title">{title}</h1>
              <p className="page-subtitle">
                {totalCount.toLocaleString()} listings
                {hasFilters && ' · filtered'}
                {isUsingLiveData() && totalCount > 0 && ' · live data'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex h-9 items-center rounded-md border border-border/80 bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={cn(
                    'flex h-full items-center gap-1.5 rounded px-3 text-xs font-medium transition-all',
                    view === 'list'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="h-3.5 w-3.5" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={cn(
                    'flex h-full items-center gap-1.5 rounded px-3 text-xs font-medium transition-all',
                    view === 'map'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Map className="h-3.5 w-3.5" /> Map
                </button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-9 text-xs"
                onClick={handleExport}
                disabled={exporting || totalCount === 0}
              >
                <Download className="mr-1 h-3.5 w-3.5" /> {exporting ? 'Exporting…' : 'Export'}
              </Button>
            </div>
          </div>

          <div className="relative max-w-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search address, defendant, plaintiff, sheriff #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 hidden text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
              Filters
            </span>
            <div className="hidden flex-1 flex-wrap gap-2 md:flex">{filterControls}</div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs md:hidden">
                  <SlidersHorizontal className="mr-1 h-3.5 w-3.5" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-xl">
                <SheetHeader>
                  <SheetTitle className="text-base">Filters</SheetTitle>
                </SheetHeader>
                <div className="flex flex-wrap gap-2 py-4">{filterControls}</div>
              </SheetContent>
            </Sheet>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 text-xs text-muted-foreground"
              >
                <RotateCcw className="mr-1 h-3 w-3" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-muted/30">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Loading foreclosures…</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                title="Could not load data"
                description={error}
                actionLabel="Try again"
                onAction={reloadList}
              />
            </div>
          ) : showEmpty ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                title="No matches"
                description="Broaden your search or reset filters."
                actionLabel="Reset filters"
                onAction={clearFilters}
              />
            </div>
          ) : view === 'map' ? (
            <div className="flex-1 relative min-h-[calc(100vh-200px)] p-3 sm:p-4">
              {mapLoading && (
                <div className="absolute top-6 right-6 z-[1002] rounded-md border border-border bg-white/95 px-2 py-1 text-xs text-muted-foreground shadow-sm">
                  Loading map pins…
                </div>
              )}
              <InteractiveMapExplorer
                listings={sortByUpcomingSale(mapData)}
                loading={mapLoading}
                query={search}
                onQueryChange={setSearch}
                onSelect={openRecord}
                listLimit={25}
                heightClass="h-full min-h-[calc(100vh-220px)]"
                leftPanelHeader={{
                  title: 'Active foreclosures',
                  description: 'Upcoming auctions first. Tomorrow and nearest sale dates at the top.',
                }}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto py-3">
              <ForeclosureListCompact rows={rows} onOpenRecord={openRecord} />
              <div className="flex items-center justify-between px-5 py-2.5 mx-4 sm:mx-5 bg-white border border-border rounded-lg text-xs text-muted-foreground">
                <span>
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of{' '}
                  {totalCount.toLocaleString()}
                </span>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
