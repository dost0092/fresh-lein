import { useNavigate } from 'react-router-dom';
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

export default function ForeclosureListCompact({ rows, onOpenRecord }) {
  const navigate = useNavigate();

  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  };

  const formatMoney = (v) => (v != null ? `$${Number(v).toLocaleString()}` : '—');

  const openRecord = (row) => {
    if (onOpenRecord) {
      onOpenRecord(row);
      return;
    }
    if (row?.id) navigate(`/dashboard/foreclosures/${row.id}`);
  };

  return (
    <div className="mx-4 overflow-hidden rounded-lg border border-border bg-white sm:mx-5">
      <div className="hidden items-center gap-3 border-b border-border bg-neutral-50/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:flex">
        <span className="flex-1">Property</span>
        <span className="w-24 text-right">Sale date</span>
        <span className="hidden w-24 text-right md:block">Starting bid</span>
        <span className="w-16" />
      </div>

      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.id}
            role="button"
            tabIndex={0}
            className={cn(
              'group flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
              'border-l-2 border-l-transparent hover:border-l-primary hover:bg-neutral-50'
            )}
            onClick={() => openRecord(row)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openRecord(row);
              }
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <span className={cn('rounded border px-1.5 py-0.5 text-[10px] font-semibold', statusClass[row.status])}>
                  {row.status}
                </span>
                {row.days_to_auction != null && row.status === 'Scheduled' && (
                  <UrgencyBadge daysToAuction={row.days_to_auction} filingType="NTS" showDays />
                )}
              </div>
              <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                {row.property_address}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {[row.city, row.state].filter(Boolean).join(', ')}
                  {row.county_name ? ` · ${row.county_name}` : ''}
                </span>
              </p>
            </div>

            <div className="hidden w-24 shrink-0 text-right sm:block">
              <p className="text-xs font-medium text-foreground">{formatDate(row.sale_date)}</p>
            </div>

            <div className="hidden w-24 shrink-0 text-right md:block">
              <p className="text-xs font-semibold text-foreground">{formatMoney(row.starting_bid)}</p>
            </div>

            <span className="flex w-16 shrink-0 items-center justify-end text-xs font-medium text-primary">
              View <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
