import { useState } from 'react';
import { ArrowUpDown, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import FilingTypeBadge from './FilingTypeBadge';
import UrgencyBadge from './UrgencyBadge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
}

export default function FilingsTable({ filings, onSelectFiling, selectedId }) {
  const [sortField, setSortField] = useState('filing_date');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sorted = [...filings].sort((a, b) => {
    const av = a[sortField], bv = b[sortField];
    if (av == null) return 1; if (bv == null) return -1;
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const formatCurrency = (v) => v ? `$${Number(v).toLocaleString()}` : '—';
  const formatDate = (d) => { try { return d ? format(new Date(d), 'MMM d, yyyy') : '—'; } catch { return d || '—'; } };

  const cols = [
    { field: 'address_full', label: 'Address', sortable: true },
    { field: 'filing_type', label: 'Type', sortable: true },
    { field: 'auction_date', label: 'Auction Date', sortable: true },
    { field: 'judgment_amount', label: 'Judgment', sortable: true },
    { field: 'defendant_primary', label: 'Defendant', sortable: true },
    { field: 'estimated_equity', label: 'Est. Equity', sortable: true },
    { field: 'days_to_auction', label: 'Urgency', sortable: true },
    { field: 'county_name', label: 'County', sortable: true },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
          <tr>
            {cols.map(col => (
              <th
                key={col.field}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap border-b border-border",
                  col.sortable && "cursor-pointer hover:text-foreground transition-colors select-none"
                )}
                onClick={() => col.sortable && handleSort(col.field)}
              >
                <span className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && <SortIcon field={col.field} sortField={sortField} sortDir={sortDir} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((filing, i) => (
            <tr
              key={filing.id}
              onClick={() => onSelectFiling(filing)}
              className={cn(
                "border-b border-border/50 cursor-pointer transition-colors",
                filing.id === selectedId ? "bg-orange-50 border-l-2 border-l-orange-500" : "hover:bg-muted/40",
                i % 2 === 0 ? "" : "bg-muted/20"
              )}
            >
              <td className="px-4 py-3 max-w-[200px]">
                <p className="font-medium text-foreground truncate text-sm">{filing.address_full}</p>
                <p className="text-xs text-muted-foreground">{filing.address_state} {filing.address_zip}</p>
              </td>
              <td className="px-4 py-3">
                <FilingTypeBadge type={filing.filing_type} />
              </td>
              <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                {formatDate(filing.auction_date)}
              </td>
              <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                {formatCurrency(filing.judgment_amount)}
              </td>
              <td className="px-4 py-3 max-w-[150px]">
                <p className="text-sm text-foreground truncate">{filing.defendant_primary || '—'}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={cn("font-semibold text-sm", filing.estimated_equity > 0 ? "text-emerald-600" : "text-red-500")}>
                  {formatCurrency(filing.estimated_equity)}
                </span>
              </td>
              <td className="px-4 py-3">
                <UrgencyBadge daysToAuction={filing.days_to_auction} filingType={filing.filing_type} />
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                {filing.county_name || '—'}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                No filings match your current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}