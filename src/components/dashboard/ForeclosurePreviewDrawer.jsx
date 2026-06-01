import { Link } from 'react-router-dom';
import { X, MapPin, Calendar, DollarSign, ChevronRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import UrgencyBadge from './UrgencyBadge';
import { cn } from '@/lib/utils';

export default function ForeclosurePreviewDrawer({ record, onClose }) {
  if (!record) return null;

  const formatCurrency = (v) => (v != null ? `$${Number(v).toLocaleString()}` : '—');
  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-border shadow-drawer flex flex-col animate-slide-in-right">
      <div className="p-5 border-b border-border bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {record.days_to_auction != null && record.status === 'Scheduled' && (
              <div className="mb-2">
                <UrgencyBadge daysToAuction={record.days_to_auction} filingType="NTS" />
              </div>
            )}
            <h3 className="font-heading font-semibold text-lg text-foreground leading-snug">
              {record.property_address}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {record.city}, {record.state} {record.zip_code}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border shrink-0">
        <div className="bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Sale date</p>
          <p className="text-sm font-bold mt-1">{formatDate(record.sale_date)}</p>
        </div>
        <div className="bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Opening bid</p>
          <p className="text-sm font-bold mt-1">{formatCurrency(record.starting_bid)}</p>
        </div>
        <div className="bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Appraised</p>
          <p className="text-sm font-bold mt-1">{formatCurrency(record.appraised_value)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Defendant</p>
          <p className="font-medium">{record.defendant}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Plaintiff</p>
          <p className="text-muted-foreground">{record.plaintiff}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Sheriff #</p>
          <p className="font-mono text-xs">{record.sheriff_number}</p>
        </div>
        {record.estimated_equity > 0 && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-xs font-medium text-emerald-800">Est. equity spread</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{formatCurrency(record.estimated_equity)}</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-border bg-white space-y-2">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link to={`/dashboard/foreclosures/${record.id}`}>
            View full record <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Close preview
        </Button>
      </div>
    </div>
  );
}
