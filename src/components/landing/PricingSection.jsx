import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import PricingTypeToggle from '@/components/landing/PricingTypeToggle';
import { API_PLANS, PLATFORM_PLANS } from '@/data/pricingPlans';
import { useAuth } from '@/lib/AuthContext';
import { startPlanCheckout } from '@/lib/startPlanCheckout';

const COPY = {
  platform: {
    eyebrow: 'Plans',
    title: 'Simple, transparent pricing',
  },
  api: {
    eyebrow: 'API',
    title: 'Foreclosure data via API',
  },
};

function PlanCards({ plans }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const handlePlanClick = async (plan) => {
    if (plan.cta === 'Contact Sales') return;

    const planId = plan.stripePlanId;
    if (!planId) {
      navigate(isAuthenticated ? '/dashboard' : '/register');
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?plan=${planId}`);
      return;
    }

    setError('');
    setLoadingPlan(planId);
    try {
      await startPlanCheckout(planId);
      setTimeout(() => setLoadingPlan(null), 3000);
    } catch (err) {
      setError(err.message || 'Could not start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {error && (
        <p className="mb-4 text-center text-sm text-destructive">{error}</p>
      )}
      <div className="grid items-stretch gap-4 md:grid-cols-3 lg:gap-5">
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.stripePlanId;
          const isSales = plan.cta === 'Contact Sales';

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-card-hover',
                plan.popular ? 'border-primary shadow-md ring-1 ring-primary/10' : 'border-border shadow-card'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-md bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="mb-1 font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  {plan.price != null ? (
                    <>
                      <span className="font-display text-3xl font-bold">${plan.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="font-display text-xl font-bold">Contact Sales</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isSales ? (
                <a
                  href={CONTACT_MAILTO_SUBJECT('FreshLien pricing inquiry')}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-center text-xs font-medium transition-colors',
                    'bg-primary text-white hover:bg-primary/90'
                  )}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled={Boolean(loadingPlan)}
                  onClick={() => handlePlanClick(plan)}
                  className={cn(
                    'w-full rounded-lg px-4 py-2.5 text-center text-xs font-medium transition-colors disabled:opacity-60',
                    plan.ctaVariant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    plan.ctaVariant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                    plan.ctaVariant === 'green' && 'bg-primary text-white hover:bg-primary/90'
                  )}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Opening Stripe…
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              )}

              {!isSales && !isAuthenticated && (
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  <Link to={`/login?plan=${plan.stripePlanId}`} className="text-primary hover:underline">
                    Log in
                  </Link>{' '}
                  if you already have an account
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function PricingSection({ pricingType, onPricingTypeChange }) {
  const location = useLocation();
  const [internalType, setInternalType] = useState('platform');

  const type = pricingType ?? internalType;
  const setType = onPricingTypeChange ?? setInternalType;

  const handleTypeChange = (next) => {
    setType(next);
    const hash = next === 'api' ? '#pricing-api' : '#pricing';
    window.history.replaceState(null, '', `${location.pathname}${hash}`);
  };

  useEffect(() => {
    if (location.hash === '#pricing-api') setType('api');
    else if (location.hash === '#pricing' || location.hash === '#pricing-platform') setType('platform');
  }, [location.hash, setType]);

  const copy = COPY[type];
  const plans = type === 'api' ? API_PLANS : PLATFORM_PLANS;

  return (
    <section id="pricing" className="bg-slate-50/40 py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          align="center"
          eyebrow={copy.eyebrow}
          title={copy.title}
          titleHighlight={copy.titleHighlight}
          description={copy.description}
          className="mx-auto"
        />

        <div className="flex justify-center">
          <PricingTypeToggle value={type} onChange={handleTypeChange} />
        </div>

        <PlanCards plans={plans} />

        <p className="mt-8 text-center">
          <a href="#compare-plans" className="text-sm font-medium text-primary hover:underline">
            Compare all {type === 'api' ? 'API' : 'platform'} features ↓
          </a>
        </p>
      </LandingContainer>
    </section>
  );
}
