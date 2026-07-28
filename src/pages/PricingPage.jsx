import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingNav from '@/components/layout/MarketingNav';
import Seo from '@/components/seo/Seo';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import { useAuth } from '@/lib/AuthContext';
import { APP_HOME } from '@/lib/routes';
import { SERVICE_PACKAGES, OFFER_DISCLAIMER } from '@/data/servicePackages';

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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Account</p>
            <h1 className="font-display mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Offers and account access
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Service and platform access are scoped after we talk. Manage an existing subscription in
              billing settings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveSubscription && subscription?.plan_name ? (
              <span className="rounded-full border border-border bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary">
                Current: {subscription.plan_name}
              </span>
            ) : isTrialActive && trialDaysLeft != null ? (
              <span className="rounded-full border border-border bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary">
                Trial · {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
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

function ServiceOffersBlock() {
  return (
    <section className="border-b border-border/60 bg-fl-subtle py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Offers"
          title="Details first. Terms"
          titleHighlight="after we talk"
          description="FreshLien offers data engineering, automation, and AI services for real estate. No public price list. Review the offers below, then contact us to discuss fit and terms."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="fl-card flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">{pkg.name}</h2>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {pkg.offerLabel}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{pkg.offerNote}</p>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">{pkg.description}</p>
              <Link to={pkg.href} className="fl-link mt-4 inline-flex items-center gap-1 text-xs">
                {pkg.cta} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{OFFER_DISCLAIMER}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/book-audit" className="fl-btn-primary px-5">
            Request a workflow review <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="fl-btn-ghost px-5">
            Contact us to discuss
          </Link>
        </div>
      </LandingContainer>
    </section>
  );
}

function PlatformOfferBlock() {
  return (
    <section className="py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Platform access"
          title="Foreclosure data access"
          titleHighlight="as a custom offer"
          description="County filings, coverage, exports, alerts, and API needs are scoped to your markets and volume. Contact us. We do not publish self-serve plan prices here."
        />
        <div className="fl-card mx-auto max-w-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Platform data access</h2>
              <p className="mt-1 text-xs text-muted-foreground">Scoped after a short intake call</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              Custom offer
            </span>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li>Live foreclosure and distressed filing coverage by county and state</li>
            <li>Filters, exports, alerts, and team access matched to how you work</li>
            <li>API or CRM delivery when you need filings in your own stack</li>
            <li>Optional pairing with automation services when the workflow is ready</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact?topic=Platform%20Access" className="fl-btn-primary px-5">
              Discuss platform access <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/platform" className="fl-btn-ghost px-5">
              See the platform
            </Link>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Offers"
        description="FreshLien automation, data engineering, AI, and platform offers. Details only. Contact us to discuss fit and terms. No public price list."
        path="/pricing"
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <PricingPageHeader />
        <ServiceOffersBlock />
        <PlatformOfferBlock />
        <MarketingFooter />
      </div>
    </div>
  );
}
