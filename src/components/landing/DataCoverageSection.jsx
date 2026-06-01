import { Globe, MapPin, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Globe,
    value: '48+',
    label: 'Counties digitized and available now',
    badge: '+',
  },
  {
    icon: MapPin,
    value: '12K+',
    label: 'Foreclosure records (growing daily)',
    badge: '🔍',
  },
  {
    icon: TrendingUp,
    value: 'Same-day',
    label: 'Court scrape freshness vs. 30–60 day lag',
    badge: '↑',
  },
];

export default function DataCoverageSection() {
  return (
    <section className="py-14 bg-white border-y border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-10">
        <h2 className="font-display text-xl lg:text-2xl font-semibold text-primary mb-2">
          Unparalleled & growing data coverage
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Nationwide sheriff-sale and foreclosure filings with AI-enriched property signals — built for
          investors who need speed and accuracy.
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
        {stats.map(({ icon: Icon, value, label, badge }) => (
          <div key={label} className="flex items-center gap-4 text-left">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {badge}
              </span>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
