import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Gavel,
  Map,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { fetchDashboardStats } from '@/lib/foreclosureService';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { CoverageStatsGrid } from '@/components/landing/CoverageStats';
import { MARKETING_COVERAGE } from '@/data/marketingStats';
import { cn } from '@/lib/utils';

const metricMeta = [
  {
    key: 'activeForeclosures',
    label: 'Active filings in database',
    detail: 'Sheriff-sale records in your coverage area',
    icon: Gavel,
  },
  {
    key: 'countiesCovered',
    label: 'Priority counties covered',
    detail: `${MARKETING_COVERAGE.states} states · expanding weekly`,
    icon: TrendingUp,
    format: () => MARKETING_COVERAGE.counties,
  },
  {
    key: 'upcomingAuctions',
    label: 'Upcoming auctions scheduled',
    detail: 'Scheduled from today forward',
    icon: Calendar,
  },
  {
    key: 'newListingsToday',
    label: 'New filings added today',
    detail: 'Fresh court filings added in 24h',
    icon: Sparkles,
  },
];

const actions = [
  {
    icon: Gavel,
    title: 'Foreclosure explorer',
    description: 'Search, filter, and export live sheriff-sale data',
    href: '/dashboard/foreclosures',
    cta: 'Open explorer',
  },
  {
    icon: Map,
    title: 'Map view',
    description: 'Interactive pins with urgency-based color coding',
    href: '/dashboard/foreclosures?view=map',
    cta: 'View map',
  },
  {
    icon: Bell,
    title: 'County alerts',
    description: 'Get notified when new filings match your counties',
    href: '/dashboard/alerts',
    cta: 'Manage alerts',
  },
  {
    icon: Bookmark,
    title: 'Saved properties',
    description: 'Track addresses and cases you are researching',
    href: '/dashboard/saved',
    cta: 'View saved',
  },
];

function PlanBadge({ isTrialActive, trialDaysLeft, hasActiveSubscription, subscription }) {
  if (hasActiveSubscription && subscription?.plan_name) {
    return (
      <span className="inline-flex items-center rounded-full border border-border bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
        {subscription.plan_name} plan
      </span>
    );
  }

  if (isTrialActive && trialDaysLeft != null) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex items-center rounded-full border border-border bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          Pro trial
        </span>
        <span className="text-xs text-muted-foreground">
          {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} remaining
        </span>
        <Link to="/settings" className="text-xs font-medium text-primary hover:underline">
          Billing
        </Link>
        <Link to="/pricing" className="text-xs font-medium text-primary hover:underline">
          View plans
        </Link>
      </div>
    );
  }

  return (
    <Link
      to="/settings"
      className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary/30 hover:text-primary"
    >
      Manage subscription
    </Link>
  );
}

export default function DashboardOverview() {
  const { isTrialActive, trialEndsAt, subscription } = useAuth();
  const hasActiveSubscription = ['active', 'trialing'].includes(subscription?.status);
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

  const liveStats = metricMeta.map(({ key, label, detail, format }) => ({
    id: key,
    label,
    detail,
    value: format ? format() : (stats?.[key]?.toLocaleString() ?? '—'),
  }));

  return (
    <section className="border-b border-border bg-[#FAFAFA]">
      <LandingContainer className="py-12 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <LandingSectionHeader
            eyebrow="Platform overview"
            title="Live distressed property data"
            titleHighlight="at a glance"
            description={`Same-day data across ${MARKETING_COVERAGE.counties} counties and ${MARKETING_COVERAGE.foreclosureFilingsLiveFull} indexed filings. Search, map, export, and track auctions from one workspace.`}
            className="mb-0 max-w-2xl"
          />
          <div className="shrink-0 pt-1 lg:pt-2">
            <PlanBadge
              isTrialActive={isTrialActive}
              trialDaysLeft={trialDaysLeft}
              hasActiveSubscription={hasActiveSubscription}
              subscription={subscription}
            />
          </div>
        </div>

        <CoverageStatsGrid stats={liveStats} loading={loading} gridClassName="max-w-none" />

        <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map(({ icon: Icon, title, description, href, cta }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'group flex h-full flex-col rounded-lg border border-border/80 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover'
              )}
            >
              <span className="icon-surface mb-3 h-9 w-9">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                {cta}
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-white px-4 py-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Need account settings?</span>{' '}
            Profile, billing, and notification preferences
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-neutral-50"
          >
            <Settings className="h-3.5 w-3.5 text-primary" />
            Settings
          </Link>
        </div>
      </LandingContainer>
    </section>
  );
}
