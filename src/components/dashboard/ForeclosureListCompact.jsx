import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import UrgencyBadge from './UrgencyBadge';

const statusClass = {
  Scheduled: 'status-scheduled',
  Sold: 'status-sold',
  Cancelled: 'status-cancelled',
  Appraisal: 'status-appraisal',
};

export default function ForeclosureListCompact({ rows, selectedId, onSelect }) {
  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  };

  const formatMoney = (v) => (v != null ? `$${Number(v).toLocaleString()}` : '—');

  return (
    <div className="divide-y divide-border bg-white mx-4 sm:mx-5 rounded-lg border border-border overflow-hidden">
      {rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors group text-sm',
            row.id === selectedId
              ? 'bg-primary/[0.04] border-l-2 border-l-primary'
              : 'hover:bg-white border-l-2 border-l-transparent'
          )}
          onClick={() => onSelect?.(row)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className={cn('text-[10px] font-semibold px-1.5 py-0 rounded border', statusClass[row.status])}>
                {row.status}
              </span>
              {row.days_to_auction != null && row.status === 'Scheduled' && (
                <UrgencyBadge daysToAuction={row.days_to_auction} filingType="NTS" showDays />
              )}
            </div>
            <p className="font-medium text-foreground truncate group-hover:text-primary text-[13px]">
              {row.property_address}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {row.city}, {row.state} · {row.county_name}
            </p>
          </div>

          <div className="hidden sm:block text-right shrink-0 w-24">
            <p className="text-xs font-medium">{formatDate(row.sale_date)}</p>
            <p className="text-[10px] text-muted-foreground">Sale</p>
          </div>

          <div className="hidden md:block text-right shrink-0 w-20">
            <p className="text-xs font-semibold">{formatMoney(row.starting_bid)}</p>
            <p className="text-[10px] text-muted-foreground">Bid</p>
          </div>

          <Link
            to={`/dashboard/foreclosures/${row.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center text-xs font-medium text-primary hover:bg-primary/5 px-2 py-1 rounded"
          >
            Open <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}
