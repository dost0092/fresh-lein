import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Map, List, SlidersHorizontal, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import MapView from '@/components/dashboard/MapView';
import ForeclosureListCompact from '@/components/dashboard/ForeclosureListCompact';
import ForeclosurePreviewDrawer from '@/components/dashboard/ForeclosurePreviewDrawer';
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
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function ForeclosureExplorer({ title = 'Foreclosures' }) {
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
  const [selected, setSelected] = useState(null);
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

  useEffect(() => {
    if (view !== 'map') return;

    let cancelled = false;
    setMapLoading(true);

    fetchForeclosuresForMap({ filters })
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
  }, [view, filters]);

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

  const filterControls = (
    <>
      <Select value={county} onValueChange={setCounty}>
        <SelectTrigger className="filter-chip w-[140px]">
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
        <SelectTrigger className="filter-chip w-[88px]">
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
        <SelectTrigger className="filter-chip w-[120px]">
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
        className="filter-chip w-[130px]"
      />
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="filter-chip w-[130px]"
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
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-muted/50 rounded-md p-0.5 border border-border/80">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all',
                    view === 'list' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all',
                    view === 'map' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <Map className="w-3.5 h-3.5" /> Map
                </button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={handleExport}
                disabled={exporting || totalCount === 0}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> {exporting ? 'Exporting…' : 'Export'}
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
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mr-1 hidden sm:inline">
              Filters
            </span>
            <div className="hidden md:flex flex-wrap gap-2 flex-1">{filterControls}</div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden h-8 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-xl">
                <SheetHeader>
                  <SheetTitle className="text-base">Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4 flex flex-wrap gap-2">{filterControls}</div>
              </SheetContent>
            </Sheet>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs text-muted-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
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
              <EmptyState title="Could not load data" description={error} />
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
            <div className="flex-1 relative min-h-[calc(100vh-200px)]">
              {mapLoading && (
                <div className="absolute top-3 right-3 z-10 rounded-md bg-white/90 border border-border px-2 py-1 text-xs text-muted-foreground shadow-sm">
                  Loading map pins…
                </div>
              )}
              <MapView filings={mapData} onSelectFiling={setSelected} selectedId={selected?.id} />
            </div>
          ) : (
            <div className="flex-1 overflow-auto py-3">
              <ForeclosureListCompact rows={rows} selectedId={selected?.id} onSelect={setSelected} />
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

        {selected && <ForeclosurePreviewDrawer record={selected} onClose={() => setSelected(null)} />}
      </div>
    </AppLayout>
  );
}
