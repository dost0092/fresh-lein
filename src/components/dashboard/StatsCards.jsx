import { Gavel, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const cards = [
  { key: 'activeForeclosures', label: 'Active', icon: Gavel },
  { key: 'countiesCovered', label: 'Counties', icon: MapPin },
  { key: 'upcomingAuctions', label: 'Upcoming', icon: Calendar },
  { key: 'newListingsToday', label: 'New today', icon: Sparkles },
];

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ key }) => (
          <div key={key} className="saas-card p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="saas-card p-4 hover:border-primary/20 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <Icon className="w-3.5 h-3.5 text-primary/70" />
          </div>
          <p className="text-2xl font-display font-semibold text-foreground tracking-tight">
            {stats?.[key]?.toLocaleString() ?? '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
