import { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ForeclosuresTable from '@/components/dashboard/ForeclosuresTable';
import EmptyState from '@/components/dashboard/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchForeclosures, exportForeclosuresCsv } from '@/lib/foreclosureService';
import { MVP_COUNTIES } from '@/data/counties';

const PAGE_SIZE = 10;
const STATUSES = ['Appraisal', 'Scheduled', 'Sold', 'Cancelled'];

export default function ForeclosuresPage() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [county, setCounty] = useState('all');
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchForeclosures().then((data) => {
      setAllRows(data);
      setLoading(false);
    });
  }, []);

  const states = useMemo(() => [...new Set(MVP_COUNTIES.map((c) => c.state))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allRows.filter((r) => {
      if (county !== 'all' && r.county_name !== county) return false;
      if (state !== 'all' && r.state !== state) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (dateFrom && r.sale_date < dateFrom) return false;
      if (dateTo && r.sale_date > dateTo) return false;
      if (!q) return true;
      const hay = [
        r.sheriff_number,
        r.plaintiff,
        r.defendant,
        r.property_address,
        r.parcel_number,
        r.attorney_name,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allRows, search, county, state, status, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, county, state, status, dateFrom, dateTo]);

  return (
    <AppLayout>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-border bg-white shrink-0">
          <h1 className="font-display text-2xl font-bold text-foreground">Active Foreclosures</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sheriff sale listings across {MVP_COUNTIES.length} counties — sample data until scraper sync.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search address, defendant, sheriff #..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => exportForeclosuresCsv(filtered)}
                disabled={!filtered.length}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV Export
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All counties</SelectItem>
                  {[...new Set(allRows.map((r) => r.county_name))].sort().map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => (
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
                className="w-[150px]"
                placeholder="From"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white mx-4 sm:mx-6 lg:mx-8 my-4 lg:my-6 rounded-xl border border-border shadow-card">
          {!loading && paginated.length === 0 ? (
            <EmptyState
              title="No foreclosures match your filters"
              description="Clear filters or broaden your search to see sample listings."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch('');
                setCounty('all');
                setState('all');
                setStatus('all');
                setDateFrom('');
                setDateTo('');
              }}
            />
          ) : (
            <ForeclosuresTable rows={paginated} loading={loading} />
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border shrink-0">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
