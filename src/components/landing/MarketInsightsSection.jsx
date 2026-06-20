import { Newspaper, TrendingUp, Calendar, FileSearch } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { MARKET_INSIGHTS } from '@/data/marketingContent';

const ICONS = [Newspaper, TrendingUp, Calendar, FileSearch];

export default function MarketInsightsSection() {
  return (
    <section id="insights" className="border-y border-border bg-[#FAFAFA] py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Market intelligence"
          title="Distressed market"
          titleHighlight="insights & trends"
          description="Weekly filing counts, top distressed ZIPs, auction trends, and probate activity as we roll out more markets."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKET_INSIGHTS.map(({ title, description, tag }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="flex flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="icon-surface h-9 w-9">
                    <Icon className="h-4 w-4" />
                  </div>
                  <StatusBadge status="soon" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{tag}</span>
                <h3 className="mt-1 font-display text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
