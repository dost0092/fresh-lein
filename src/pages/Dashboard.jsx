const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import FilterPanel from '@/components/dashboard/FilterPanel';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import MapView from '@/components/dashboard/MapView';
import FilingsTable from '@/components/dashboard/FilingsTable';
import PropertyDrawer from '@/components/dashboard/PropertyDrawer';
import { differenceInDays, parseISO } from 'date-fns';

function computeDaysToAuction(auctionDate) {
  if (!auctionDate) return null;
  try {
    const days = differenceInDays(parseISO(auctionDate), new Date());
    return Math.max(0, days);
  } catch { return null; }
}

function applyFilters(filings, filters) {
  return filings.filter(f => {
    if (filters.states?.length && !filters.states.includes(f.address_state)) return false;
    if (filters.filing_types?.length && !filters.filing_types.includes(f.filing_type)) return false;
    if (filters.zip) {
      const zips = filters.zip.split(',').map(z => z.trim()).filter(Boolean);
      if (zips.length && !zips.includes(f.address_zip)) return false;
    }
    if (filters.judgment_min && f.judgment_amount < Number(filters.judgment_min)) return false;
    if (filters.judgment_max && f.judgment_amount > Number(filters.judgment_max)) return false;
    if (filters.federal_lien && !f.federal_lien) return false;
    if (filters.state_lien && !f.state_lien) return false;
    if (filters.hoa_lien && !f.hoa_lien) return false;
    if (filters.probate_flag && !f.probate_flag) return false;
    if (filters.property_types?.length && !filters.property_types.includes(f.property_type)) return false;
    if (filters.days_since_filing_max) {
      const days = f.days_since_filing;
      if (days !== null && days > Number(filters.days_since_filing_max)) return false;
    }
    if (filters.auction_date_from && f.auction_date && f.auction_date < filters.auction_date_from) return false;
    if (filters.auction_date_to && f.auction_date && f.auction_date > filters.auction_date_to) return false;
    return true;
  });
}

export default function Dashboard() {
  const [view, setView] = useState('map');
  const [filters, setFilters] = useState({});
  const [allFilings, setAllFilings] = useState([]);
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.ForeclosureFiling.list('-filing_date', 500).then(data => {
      const enriched = data.map(f => ({
        ...f,
        days_to_auction: computeDaysToAuction(f.auction_date),
        days_since_filing: f.filing_date ? differenceInDays(new Date(), parseISO(f.filing_date)) : null,
      }));
      setAllFilings(enriched);
      setLoading(false);
    });
  }, []);

  const filtered = applyFilters(allFilings, filters);

  const handleFilterRemove = (key) => {
    const next = { ...filters };
    delete next[key];
    setFilters(next);
  };

  const handleExport = () => {
    const rows = filtered.slice(0, 200);
    const headers = ['Address', 'State', 'ZIP', 'County', 'Filing Type', 'Auction Date', 'Judgment Amount', 'Defendant', 'Federal Lien', 'State Lien', 'HOA Lien'];
    const csv = [
      headers.join(','),
      ...rows.map(f => [
        `"${f.address_full || ''}"`,
        f.address_state || '',
        f.address_zip || '',
        `"${f.county_name || ''}"`,
        f.filing_type || '',
        f.auction_date || '',
        f.judgment_amount || '',
        `"${f.defendant_primary || ''}"`,
        f.federal_lien ? 'Yes' : 'No',
        f.state_lien ? 'Yes' : 'No',
        f.hoa_lien ? 'Yes' : 'No',
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'freshlien-export.csv'; a.click();
  };

  return (
    <AppLayout>
      <DashboardTopBar
        view={view}
        onViewChange={setView}
        filters={filters}
        onFilterRemove={handleFilterRemove}
        totalResults={filtered.length}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters({})} />
        </div>
        <div className="flex flex-1 overflow-hidden relative">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-border border-t-cyan rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Loading foreclosure data...</p>
              </div>
            </div>
          ) : view === 'map' ? (
            <MapView
              filings={filtered}
              onSelectFiling={setSelectedFiling}
              selectedId={selectedFiling?.id}
            />
          ) : (
            <div className="flex-1 overflow-auto">
              <FilingsTable
                filings={filtered}
                onSelectFiling={setSelectedFiling}
                selectedId={selectedFiling?.id}
              />
            </div>
          )}
          {selectedFiling && (
            <PropertyDrawer
              filing={selectedFiling}
              onClose={() => setSelectedFiling(null)}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}