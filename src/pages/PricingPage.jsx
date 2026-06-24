import { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/layout/MarketingNav';
import Seo from '@/components/seo/Seo';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import { LandingContainer } from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import { useAuth } from '@/lib/AuthContext';
import { APP_HOME } from '@/lib/routes';

function PricingPageHeader() {
  const { isAuthenticated, isTrialActive, trialEndsAt, subscription } = useAuth();
  const hasActiveSubscription = ['active', 'trialing'].includes(subscription?.status);

  if (!isAuthenticated) return null;

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <section className="border-b border-border bg-white">
      <LandingContainer className="py-8 lg:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Plans & billing</p>
            <h1 className="font-display mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Choose the right plan for your team
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Start on Free, then upgrade anytime. Paid plans include a 13-day trial when you subscribe.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveSubscription && subscription?.plan_name ? (
              <span className="rounded-full border border-border bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary">
                Current: {subscription.plan_name}
              </span>
            ) : isTrialActive && trialDaysLeft != null ? (
              <span className="rounded-full border border-border bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary">
                Pro trial · {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
              </span>
            ) : null}
            <Link
              to="/settings"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-neutral-50"
            >
              Billing settings
            </Link>
            <Link
              to={APP_HOME}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to app
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
      <Seo
        title="Pricing: Foreclosure Data Plans from Free to Enterprise"
        description="FreshLien pricing: free county search, Starter at $15/mo, Professional at $25/mo, plus API and Enterprise plans for foreclosure data, exports, and alerts."
        path="/pricing"
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <PricingPageHeader />
        <PricingSection pricingType={pricingType} onPricingTypeChange={setPricingType} />
        <PricingCompareTable pricingType={pricingType} />
        <CompetitorTable />

        <MarketingFooter />
      </div>
    </div>
  );
}
