import { PanelLeft, Map, PanelRight, Search, BarChart3 } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { DASHBOARD_IA } from '@/data/marketingContent';

const ZONE_ICONS = {
  'Left sidebar': PanelLeft,
  Center: Map,
  'Right drawer': PanelRight,
  'Top bar': Search,
  'Bottom bar': BarChart3,
};

export default function DashboardIASection() {
  return (
    <section id="dashboard-ia" className="bg-white py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Dashboard"
          title="Purpose-built for"
          titleHighlight="investor workflows"
          description="Three-zone layout: filters on the left, map in the center, property detail on the right — with search and stats across the top and bottom."
        />

        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="grid border-b border-border bg-muted/20 lg:grid-cols-[280px_1fr_320px]">
            <div className="hidden border-r border-border bg-slate-50/80 p-4 lg:block">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Filters</p>
              <div className="mt-3 space-y-2">
                {['State', 'County', 'Filing type', 'Auction date', 'Equity %'].map((f) => (
                  <div key={f} className="rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-muted-foreground">
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[220px] bg-gradient-to-br from-primary/5 via-white to-primary/10 p-6 lg:min-h-[280px]">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(19,81,51,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(19,81,51,0.1) 0%, transparent 40%)',
              }} />
              <div className="relative flex h-full flex-col items-center justify-center text-center">
                <Map className="h-8 w-8 text-primary/60" />
                <p className="mt-2 text-sm font-semibold text-foreground">Interactive map</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Clustered pins color-coded by filing stage — red for urgent auctions, blue for pre-foreclosure
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {[
                    { color: '#E63946', label: '< 7 days' },
                    { color: '#F4A261', label: '7–30 days' },
                    { color: '#00B4D8', label: 'Pre-FC' },
                    { color: '#7B2D8B', label: 'Probate' },
                  ].map(({ color, label }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden border-l border-border bg-slate-50/80 p-4 lg:block">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Property detail</p>
              <div className="mt-3 space-y-2">
                {['123 Main St, Miami FL', 'Case #2024-CF-1234', 'Auction: Mar 15, 2026', 'Est. equity: 42%'].map((line) => (
                  <div key={line} className="rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-foreground">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
            {DASHBOARD_IA.map(({ zone, component, description }) => {
              const Icon = ZONE_ICONS[zone] ?? Map;
              return (
                <div key={zone} className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{zone}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-foreground">{component}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
