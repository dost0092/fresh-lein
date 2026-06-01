import { useState } from 'react';
import { X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATES = ['FL', 'TX', 'CA', 'NJ', 'NY', 'GA', 'AZ', 'CO', 'WA', 'OH'];
const FILING_TYPES = ['NOD', 'LIS_PENDENS', 'NTS', 'AUCTION', 'REO'];
const PROPERTY_TYPES = ['SFR', 'MFR', 'CONDO', 'LAND', 'COMM'];

const FILING_LABELS = {
  NOD: 'Notice of Default',
  LIS_PENDENS: 'Lis Pendens',
  NTS: 'Notice of Trustee Sale',
  AUCTION: 'Auction',
  REO: 'REO / Bank-Owned'
};

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onReset }) {
  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v !== '';
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    return false;
  }).length;

  return (
    <div className="w-64 xl:w-72 bg-white border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1e293b]" />
          <span className="font-semibold text-sm text-foreground">Filters</span>
          {activeCount > 0 && (
            <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 h-4">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* States */}
        <Section title="State">
          <div className="flex flex-wrap gap-1.5">
            {STATES.map(s => (
              <button
                key={s}
                onClick={() => toggleArrayFilter('states', s)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                  (filters.states || []).includes(s)
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white text-foreground border-border hover:border-[#1e293b]/50"
                )}
              >{s}</button>
            ))}
          </div>
        </Section>

        {/* Filing Type */}
        <Section title="Filing Type">
          <div className="space-y-2">
            {FILING_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.filing_types || []).includes(type)}
                  onChange={() => toggleArrayFilter('filing_types', type)}
                  className="rounded border-border text-navy accent-navy w-3.5 h-3.5"
                />
                <span className="text-sm text-foreground group-hover:text-navy transition-colors">{FILING_LABELS[type]}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* ZIP Code */}
        <Section title="ZIP Code" defaultOpen={false}>
          <input
            type="text"
            placeholder="e.g. 33101, 77002"
            value={filters.zip || ''}
            onChange={e => onChange({ ...filters, zip: e.target.value })}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300/30 focus:border-orange-400 transition-all"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Comma-separate multiple ZIPs</p>
        </Section>

        {/* Judgment Amount */}
        <Section title="Judgment Amount" defaultOpen={false}>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.judgment_min || ''}
                onChange={e => onChange({ ...filters, judgment_min: e.target.value })}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
              <input
                type="number"
                placeholder="1000000"
                value={filters.judgment_max || ''}
                onChange={e => onChange({ ...filters, judgment_max: e.target.value })}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
              />
            </div>
          </div>
        </Section>

        {/* Days Since Filing */}
        <Section title="Recency" defaultOpen={false}>
          <label className="text-xs text-muted-foreground mb-2 block">Filed within last N days</label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={filters.days_since_filing_max || ''}
            onChange={e => onChange({ ...filters, days_since_filing_max: e.target.value })}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
          />
        </Section>

        {/* Property Type */}
        <Section title="Property Type" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => toggleArrayFilter('property_types', t)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                  (filters.property_types || []).includes(t)
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white text-foreground border-border hover:border-[#1e293b]/50"
                )}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* Lien Flags */}
        <Section title="Lien Flags" defaultOpen={false}>
          <div className="space-y-2.5">
            {[
              { key: 'federal_lien', label: 'Federal Lien (USA)', color: 'text-red-600' },
              { key: 'state_lien', label: 'State Lien', color: 'text-orange-600' },
              { key: 'hoa_lien', label: 'HOA Lien', color: 'text-yellow-600' },
              { key: 'probate_flag', label: 'Probate Filing', color: 'text-purple-600' },
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters[key] || false}
                  onChange={e => onChange({ ...filters, [key]: e.target.checked })}
                  className="rounded border-border w-3.5 h-3.5"
                />
                <span className={cn("text-sm font-medium", color)}>{label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Auction Date */}
        <Section title="Auction Date" defaultOpen={false}>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <input
                type="date"
                value={filters.auction_date_from || ''}
                onChange={e => onChange({ ...filters, auction_date_from: e.target.value })}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <input
                type="date"
                value={filters.auction_date_to || ''}
                onChange={e => onChange({ ...filters, auction_date_to: e.target.value })}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Apply button */}
      <div className="p-4 border-t border-border">
        <Button className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white font-medium text-sm">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}