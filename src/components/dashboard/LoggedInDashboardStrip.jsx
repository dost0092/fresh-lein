import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Bookmark, Gavel, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { fetchDashboardStats } from '@/lib/foreclosureService';
import StatsCards from '@/components/dashboard/StatsCards';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { MARKETING_COVERAGE } from '@/data/marketingStats';

const quickLinks = [
  { icon: Gavel, label: 'Foreclosures', href: '/dashboard/foreclosures' },
  { icon: Bell, label: 'Alerts', href: '/dashboard/alerts' },
  { icon: Bookmark, label: 'Saved', href: '/dashboard/saved' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function LoggedInDashboardStrip() {
  const { profile, isTrialActive, trialEndsAt } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const name = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'there';

  return (
    <section className="border-b border-border bg-white">
      <LandingContainer className="py-6 lg:py-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your workspace</p>
            <h1 className="font-display mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Welcome back, {name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isTrialActive
                ? `${trialDaysLeft} day(s) left in your free trial · full platform access`
                : `Search live foreclosure data across ${MARKETING_COVERAGE.counties} counties`}
            </p>
          </div>
          <Link
            to="/dashboard/foreclosures"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open foreclosures <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <StatsCards stats={stats} loading={loading} />

        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-neutral-50"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
