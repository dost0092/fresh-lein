import { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/layout/MarketingNav';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import { LandingContainer } from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { useAuth } from '@/lib/AuthContext';

function PricingPageHeader() {
  const { isAuthenticated, isTrialActive, trialEndsAt, subscription } = useAuth();
  const hasActiveSubscription = ['active', 'trialing'].includes(subscription?.status);

  if (!isAuthenticated) return null;

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <section className="border-b border-border bg-gradient-to-b from-primary/[0.04] to-white">
      <LandingContainer className="py-8 lg:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Plans & billing</p>
            <h1 className="font-display mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Choose the right plan for your team
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Compare platform and API tiers below. Upgrade anytime — your 13-day trial applies to paid plans.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveSubscription && subscription?.plan_name ? (
              <span className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary">
                Current: {subscription.plan_name}
              </span>
            ) : isTrialActive && trialDaysLeft != null ? (
              <span className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary">
                Pro trial · {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
              </span>
            ) : null}
            <Link
              to="/settings"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/30 hover:bg-primary/[0.03]"
            >
              Billing settings
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}

export default function PricingPage() {
  const [pricingType, setPricingType] = useState('platform');

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-14 lg:pt-16">
        <PricingPageHeader />
        <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
        <PricingCompareTable pricingType={pricingType} />
        <CompetitorTable />

        <MarketingFooter />
      </div>
    </div>
  );
}
