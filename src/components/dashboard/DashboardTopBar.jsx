import { useState } from 'react';
import { Search, Map, List, Download, X, RefreshCw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardTopBar({ view, onViewChange, filters, onFilterRemove, totalResults, onExport, onSearch }) {
  const [searchVal, setSearchVal] = useState('');

  const activeFilters = [];
  if (filters.states?.length) activeFilters.push({ key: 'states', label: `States: ${filters.states.join(', ')}` });
  if (filters.filing_types?.length) activeFilters.push({ key: 'filing_types', label: `Types: ${filters.filing_types.join(', ')}` });
  if (filters.zip) activeFilters.push({ key: 'zip', label: `ZIP: ${filters.zip}` });
  if (filters.judgment_min) activeFilters.push({ key: 'judgment_min', label: `Min: $${Number(filters.judgment_min).toLocaleString()}` });
  if (filters.judgment_max) activeFilters.push({ key: 'judgment_max', label: `Max: $${Number(filters.judgment_max).toLocaleString()}` });
  if (filters.federal_lien) activeFilters.push({ key: 'federal_lien', label: 'Federal Lien' });
  if (filters.state_lien) activeFilters.push({ key: 'state_lien', label: 'State Lien' });
  if (filters.hoa_lien) activeFilters.push({ key: 'hoa_lien', label: 'HOA Lien' });

  return (
    <div className="bg-white border-b border-border">
      {/* Top row */}
      <div className="flex items-center gap-3 px-5 h-14">
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by address, ZIP, or defendant..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch?.(searchVal)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary bg-muted/40 transition-all"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalResults.toLocaleString()}</span> results
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewChange('map')}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === 'map' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <Map className="w-3.5 h-3.5" /> Map
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === 'list' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
        </div>

        {/* Export */}
        <Button variant="outline" size="sm" className="border-border text-sm h-9" onClick={onExport}>
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
        </Button>
      </div>

      {/* Filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 px-5 pb-2.5 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Active:</span>
          {activeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => onFilterRemove(f.key)}
              className="flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full hover:bg-secondary/20 transition-colors font-medium"
            >
              {f.label} <X className="w-3 h-3 ml-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}