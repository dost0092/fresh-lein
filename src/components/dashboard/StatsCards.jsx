import { Gavel, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CoverageStatItem, coverageStatGridClass } from '@/components/landing/CoverageStats';
import { formatCountiesDisplay } from '@/data/marketingStats';
import { cn } from '@/lib/utils';

const cards = [
  { key: 'activeForeclosures', label: 'Active filings in database', icon: Gavel },
  { key: 'countiesCovered', label: 'Priority counties covered', icon: MapPin },
  { key: 'upcomingAuctions', label: 'Upcoming auctions scheduled', icon: Calendar },
  { key: 'newListingsToday', label: 'New filings added today', icon: Sparkles },
];

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className={cn(coverageStatGridClass, 'max-w-none gap-4')}>
        {cards.map(({ key }) => (
          <div key={key} className="rounded-lg border border-border/80 bg-white p-5">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(coverageStatGridClass, 'max-w-none gap-4')}>
      {cards.map(({ key, label }) => (
        <div key={key} className="rounded-lg border border-border/80 bg-white p-5">
          <CoverageStatItem
            label={label}
            value={
              key === 'countiesCovered'
                ? formatCountiesDisplay()
                : (stats?.[key]?.toLocaleString() ?? '—')
            }
            align="left"
          />
        </div>
      ))}
    </div>
  );
}
