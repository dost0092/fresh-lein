import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import UrgencyBadge from './UrgencyBadge';

const statusClass = {
  Scheduled: 'status-scheduled',
  Sold: 'status-sold',
  Cancelled: 'status-cancelled',
  Appraisal: 'status-appraisal',
};

export default function ForeclosureListCompact({ rows, selectedId, onSelect, onOpenDetail }) {
  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  };

  const formatMoney = (v) => (v != null ? `$${Number(v).toLocaleString()}` : '—');

  return (
    <div className="divide-y divide-border bg-white mx-4 sm:mx-6 my-4 rounded-xl border border-border shadow-card overflow-hidden">
      {rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            'flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors group',
            row.id === selectedId ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/40 border-l-4 border-l-transparent'
          )}
          onClick={() => onSelect?.(row)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide',
                  statusClass[row.status]
                )}
              >
                {row.status}
              </span>
              {row.days_to_auction != null && row.status === 'Scheduled' && (
                <UrgencyBadge daysToAuction={row.days_to_auction} filingType="NTS" />
              )}
            </div>
            <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {row.property_address}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {row.city}, {row.state} · {row.county_name} Co.
              </span>
            </p>
          </div>

          <div className="hidden sm:block text-right shrink-0 w-28">
            <p className="text-sm font-medium text-foreground flex items-center justify-end gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {formatDate(row.sale_date)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Sale date</p>
          </div>

          <div className="hidden md:block text-right shrink-0 w-24">
            <p className="text-sm font-semibold text-foreground">{formatMoney(row.starting_bid)}</p>
            <p className="text-xs text-muted-foreground">Opening bid</p>
          </div>

          <Link
            to={`/dashboard/foreclosures/${row.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary hover:underline px-2 py-1 rounded-lg hover:bg-primary/5"
          >
            Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
