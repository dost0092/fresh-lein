import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Map, List, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
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
import { fetchForeclosures, exportForeclosuresCsv } from '@/lib/foreclosureService';
import { filterForeclosures } from '@/lib/foreclosureUtils';
import { MVP_COUNTIES } from '@/data/counties';
import { cn } from '@/lib/utils';

const STATUSES = ['Appraisal', 'Scheduled', 'Sold', 'Cancelled'];
const PAGE_SIZE = 20;

export default function ForeclosureExplorer({ title = 'Foreclosures' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialView = searchParams.get('view') === 'map' ? 'map' : 'list';
  const [view, setView] = useState(initialView);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [county, setCounty] = useState('all');
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchForeclosures().then((data) => {
      setAllRows(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const states = useMemo(() => [...new Set(MVP_COUNTIES.map((c) => c.state))].sort(), []);

  const filtered = useMemo(
    () => filterForeclosures(allRows, { search, county, state, status, dateFrom, dateTo }),
    [allRows, search, county, state, status, dateFrom, dateTo]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, county, state, status, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearch('');
    setCounty('all');
    setState('all');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setSearchParams({});
  };

  const hasFilters = county !== 'all' || state !== 'all' || status !== 'all' || dateFrom || dateTo || search.trim();

  const filterControls = (
    <>
      <Select value={county} onValueChange={setCounty}>
        <SelectTrigger className="filter-chip w-[140px]">
          <SelectValue placeholder="County" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All counties</SelectItem>
          {[...new Set(allRows.map((r) => r.county_name))].sort().map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="filter-chip w-[88px]">
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {states.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="filter-chip w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="filter-chip w-[130px]" />
      <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="filter-chip w-[130px]" />
    </>
  );

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="control-bar space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="page-title">{title}</h1>
              <p className="page-subtitle">
                {filtered.length} of {allRows.length} listings
                {hasFilters && ' · filtered'}
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
                onClick={() => exportForeclosuresCsv(filtered)}
                disabled={!filtered.length}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground">
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-muted/30">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
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
              <MapView filings={filtered} onSelectFiling={setSelected} selectedId={selected?.id} />
            </div>
          ) : (
            <div className="flex-1 overflow-auto py-3">
              <ForeclosureListCompact
                rows={paginated}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
              <div className="flex items-center justify-between px-5 py-2.5 mx-4 sm:mx-5 bg-white border border-border rounded-lg text-xs text-muted-foreground">
                <span>
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
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
