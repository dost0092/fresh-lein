import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Map, List, SlidersHorizontal, X } from 'lucide-react';
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
const PAGE_SIZE = 15;

export default function ForeclosureExplorer({ title = 'Foreclosure Explorer' }) {
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

  const hasFilters = county !== 'all' || state !== 'all' || status !== 'all' || dateFrom || dateTo;

  const filterControls = (
    <div className="flex flex-wrap gap-2">
      <Select value={county} onValueChange={setCounty}>
        <SelectTrigger className="w-[160px] h-9 bg-white border-border">
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
        <SelectTrigger className="w-[100px] h-9 bg-white border-border">
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
        <SelectTrigger className="w-[130px] h-9 bg-white border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[140px] h-9 bg-white" />
      <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[140px] h-9 bg-white" />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground">
          <X className="w-3.5 h-3.5 mr-1" /> Clear
        </Button>
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Command-bar search */}
        <div className="shrink-0 border-b border-border bg-white px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-bold text-foreground tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Search {allRows.length.toLocaleString()} listings · {filtered.length.toLocaleString()} matches
              </p>
            </div>
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search address, defendant, plaintiff, sheriff #, parcel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-base border border-border rounded-xl bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="hidden md:flex flex-wrap gap-2 flex-1">{filterControls}</div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden h-9">
                  <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto max-h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4 flex flex-col gap-3">{filterControls}</div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center bg-muted/60 rounded-lg p-1 border border-border/60">
              <button
                type="button"
                onClick={() => setView('map')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all',
                  view === 'map' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Map className="w-4 h-4" /> Map
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all',
                  view === 'list' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="h-9"
              onClick={() => exportForeclosuresCsv(filtered)}
              disabled={!filtered.length}
            >
              <Download className="w-4 h-4 mr-1.5" /> Export
            </Button>
          </div>
        </div>

        {/* Main explorer */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[#f8f9fb]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                title="No matches"
                description="Try a broader search or clear your filters."
                actionLabel="Clear all"
                onAction={clearFilters}
              />
            </div>
          ) : view === 'map' ? (
            <div className="flex-1 relative min-h-[400px]">
              <MapView
                filings={filtered}
                onSelectFiling={setSelected}
                selectedId={selected?.id}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <ForeclosureListCompact
                rows={paginated}
                selectedId={selected?.id}
                onSelect={setSelected}
                onOpenDetail={(row) => setSelected(row)}
              />
              <div className="sticky bottom-0 flex items-center justify-between px-6 py-3 border-t border-border bg-white">
                <p className="text-sm text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <ForeclosurePreviewDrawer
            record={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
