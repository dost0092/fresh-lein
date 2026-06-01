import { X, MapPin, Calendar, DollarSign, User, ExternalLink, Shield, Home, Droplets, Zap, FileText, Copy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilingTypeBadge from './FilingTypeBadge';
import UrgencyBadge from './UrgencyBadge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function InfoRow({ label, value, className }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className={cn("text-xs text-right font-medium text-foreground max-w-[60%]", className)}>{value}</span>
    </div>
  );
}

function LienBadge({ type, show }) {
  if (!show) return null;
  const configs = {
    federal: { label: 'Federal Lien', className: 'bg-red-100 text-red-700 border-red-200' },
    state: { label: 'State Lien', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    hoa: { label: 'HOA Lien', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  };
  const c = configs[type];
  return <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded border", c.className)}>{c.label}</span>;
}

export default function PropertyDrawer({ filing, onClose }) {
  if (!filing) return null;

  const formatCurrency = (v) => v ? `$${Number(v).toLocaleString()}` : 'N/A';
  const formatDate = (d) => { try { return d ? format(new Date(d), 'MMM d, yyyy') : 'N/A'; } catch { return d || 'N/A'; } };
  const equityPct = filing.equity_pct ? `${filing.equity_pct.toFixed(0)}%` : null;

  const defendants = filing.defendants_raw
    ? filing.defendants_raw.split(';').map(d => d.trim()).filter(Boolean)
    : filing.defendant_primary ? [filing.defendant_primary] : [];

  return (
    <div className="w-[420px] flex flex-col bg-white border-l border-border shadow-drawer animate-slide-in-right overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-border bg-[#1e293b]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <FilingTypeBadge type={filing.filing_type} />
            {filing.days_to_auction !== null && filing.days_to_auction !== undefined && (
              <UrgencyBadge daysToAuction={filing.days_to_auction} filingType={filing.filing_type} />
            )}
          </div>
          <h3 className="font-heading font-semibold text-white text-sm leading-tight">
            {filing.address_full}
          </h3>
          <p className="text-white/60 text-xs mt-0.5">{filing.county_name}, {filing.address_state} {filing.address_zip}</p>
        </div>
        <button onClick={onClose} className="ml-3 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-px bg-border">
        <div className="bg-white p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Judgment</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(filing.judgment_amount)}</p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Est. Equity</p>
          <p className={cn("text-sm font-bold mt-0.5", filing.estimated_equity > 0 ? "text-emerald-600" : "text-red-500")}>
            {formatCurrency(filing.estimated_equity)}
          </p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">AVM Value</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(filing.estimated_value)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Filing Details */}
        <div className="px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Filing Details
          </h4>
          <InfoRow label="Case Number" value={filing.case_number} />
          <InfoRow label="Filing Date" value={formatDate(filing.filing_date)} />
          <InfoRow label="Auction Date" value={formatDate(filing.auction_date)} />
          {filing.days_to_auction > 0 && (
            <InfoRow label="Days to Auction" value={
              <span className={cn("font-bold", filing.days_to_auction < 7 ? "text-red-600" : filing.days_to_auction < 30 ? "text-orange-600" : "text-foreground")}>
                {filing.days_to_auction} days
              </span>
            } />
          )}
          <InfoRow label="Lender" value={filing.lender_name} />
          <InfoRow label="Attorney" value={filing.attorney_name} />
          {filing.source_url && (
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-muted-foreground font-medium">Source</span>
              <a href={filing.source_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-cyan hover:underline flex items-center gap-1">
                {filing.source_portal || 'View Source'} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Defendants / Lien Holders */}
        {defendants.length > 0 && (
          <div className="px-5 pb-4 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-4 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Defendants & Lien Holders
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <LienBadge type="federal" show={filing.federal_lien} />
              <LienBadge type="state" show={filing.state_lien} />
              <LienBadge type="hoa" show={filing.hoa_lien} />
            </div>
            {defendants.map((d, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0">
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground font-medium">{d}</span>
              </div>
            ))}
          </div>
        )}

        {/* Property Details */}
        <div className="px-5 pb-4 border-t border-border/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-4 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Property Details
          </h4>
          <InfoRow label="Property Type" value={filing.property_type} />
          <InfoRow label="Beds / Baths" value={filing.bedrooms && filing.bathrooms ? `${filing.bedrooms} bed / ${filing.bathrooms} bath` : null} />
          <InfoRow label="Square Feet" value={filing.sqft ? `${Number(filing.sqft).toLocaleString()} sqft` : null} />
          <InfoRow label="Year Built" value={filing.year_built} />
          <InfoRow label="Equity %" value={equityPct} className={filing.equity_pct > 40 ? "text-emerald-600" : undefined} />
          {filing.flood_zone && (
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Flood Zone
              </span>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded border",
                ['AE', 'A', 'VE'].includes(filing.flood_zone)
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-green-100 text-green-700 border-green-200"
              )}>
                Zone {filing.flood_zone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border bg-muted/30 space-y-2">
        <Button className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white font-medium text-sm h-9">
          <Zap className="w-3.5 h-3.5 mr-2" /> Skip Trace Owner
          <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded">PRO</span>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-sm h-9 border-border" onClick={() => {
            const text = `${filing.address_full}, ${filing.county_name}, ${filing.address_state}`;
            navigator.clipboard.writeText(text);
          }}>
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Address
          </Button>
          <Button variant="outline" className="flex-1 text-sm h-9 border-border text-orange-600 border-orange-200 hover:bg-orange-50">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> AI Report
            <span className="ml-1 text-[10px] bg-cyan/10 px-1 py-0.5 rounded">PRO</span>
          </Button>
        </div>
      </div>
    </div>
  );
}