import { Link } from 'react-router-dom';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import UrgencyBadge from './UrgencyBadge';

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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white border-l border-border shadow-drawer flex flex-col animate-slide-in-right">
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {record.days_to_auction != null && record.status === 'Scheduled' && (
              <div className="mb-1.5">
                <UrgencyBadge daysToAuction={record.days_to_auction} filingType="NTS" />
              </div>
            )}
            <h3 className="font-semibold text-sm text-foreground leading-snug">{record.property_address}</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {record.city}, {record.state}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border text-center text-xs">
        <div className="bg-white p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Sale</p>
          <p className="font-semibold mt-0.5">{formatDate(record.sale_date)}</p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Bid</p>
          <p className="font-semibold mt-0.5">{formatCurrency(record.starting_bid)}</p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Value</p>
          <p className="font-semibold mt-0.5">{formatCurrency(record.appraised_value)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase">Defendant</p>
          <p className="font-medium mt-0.5">{record.defendant}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase">Plaintiff</p>
          <p className="text-muted-foreground mt-0.5">{record.plaintiff}</p>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">{record.sheriff_number}</p>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Button asChild size="sm" className="w-full h-8 text-xs">
          <Link to={`/dashboard/foreclosures/${record.id}`}>
            Full record <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
