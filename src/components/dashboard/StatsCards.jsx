import { Gavel, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const cards = [
  { key: 'activeForeclosures', label: 'Active Foreclosures', icon: Gavel },
  { key: 'countiesCovered', label: 'Counties Covered', icon: MapPin },
  { key: 'upcomingAuctions', label: 'Upcoming Auctions', icon: Calendar },
  { key: 'newListingsToday', label: 'New Listings Today', icon: Sparkles },
];

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map(({ key }) => (
          <div key={key} className="saas-card p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="saas-card p-6 group">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="w-9 h-9 rounded-lg bg-[#4257A7]/10 flex items-center justify-center group-hover:bg-[#4257A7]/15 transition-colors">
              <Icon className="w-4 h-4 text-[#4257A7]" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-foreground tracking-tight">
            {stats?.[key]?.toLocaleString() ?? '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
