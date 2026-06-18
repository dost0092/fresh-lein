import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UrgencyBadge, { getUrgency, getMarkerColor } from './UrgencyBadge';

function formatDate(d) {
  try {
    return d ? format(new Date(d), 'MMM d, yyyy') : '—';
  } catch {
    return '—';
  }
}

function formatCurrency(v) {
  return v != null && v !== '' ? `$${Number(v).toLocaleString()}` : '—';
}

const STATUS_COLORS = {
  Scheduled: '#135133',
  Postponed: '#F4A261',
  Adjourned: '#FFD166',
  Cancelled: '#94A3B8',
  Purchased: '#4257A7',
  Redeemed: '#2A9D8F',
};

export default function MapRecordDetailPanel({ record, onClose, className }) {
  if (!record) return null;

  const urgency = getUrgency(record.days_to_auction, record.status === 'Appraisal' ? 'PRE' : 'NTS');
  const dotColor = getMarkerColor(urgency);
  const isActive = record.status === 'Scheduled';

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl',
        className
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
              {record.property_address || 'Foreclosure record'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {[record.city, record.state].filter(Boolean).join(', ')}
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">
              {record.county_name ? `${record.county_name} County` : 'County unavailable'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {isActive ? 'Active listing' : record.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 py-4">
        {[
          { label: 'State', value: record.state || '—' },
          { label: 'County', value: record.county_name || '—' },
          { label: 'Status', value: record.status || '—' },
          {
            label: 'Sale date',
            value: record.sale_date ? formatDate(record.sale_date) : 'TBD',
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-center text-white">
            <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">{label}</p>
            <p className="mt-0.5 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-4">
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Opening bid</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{formatCurrency(record.starting_bid)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Appraised</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{formatCurrency(record.appraised_value)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {record.days_to_auction != null && record.status === 'Scheduled' && (
          <div className="mb-4">
            <UrgencyBadge daysToAuction={record.days_to_auction} filingType="NTS" />
          </div>
        )}

        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Case details</p>
        <div className="space-y-2.5">
          {[
            { label: 'Defendant', value: record.defendant, color: STATUS_COLORS.Scheduled },
            { label: 'Plaintiff', value: record.plaintiff, color: '#4257A7' },
            { label: 'Sheriff #', value: record.sheriff_number, color: '#64748b' },
            { label: 'Attorney', value: record.attorney_name, color: '#7B2D8B' },
          ]
            .filter((row) => row.value)
            .map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-white px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
                <span className="max-w-[55%] truncate text-right text-xs font-semibold text-foreground">
                  {value}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="border-t border-border p-5">
        <Button asChild className="h-11 w-full text-sm font-semibold">
          <Link to={`/dashboard/foreclosures/${record.id}`}>
            Explore foreclosure data <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
