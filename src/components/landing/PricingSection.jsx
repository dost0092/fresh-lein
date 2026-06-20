import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { APP_HOME } from '@/lib/routes';
import { CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import PricingTypeToggle from '@/components/landing/PricingTypeToggle';
import { API_PLANS, PLATFORM_PLANS } from '@/data/pricingPlans';
import { useAuth } from '@/lib/AuthContext';
import { startPlanCheckout } from '@/lib/startPlanCheckout';

const COPY = {
  platform: {
    eyebrow: 'Pricing',
    title: 'Plans for every',
    titleHighlight: 'investor stage',
    description:
      'Start free, then add states, exports, alerts, and API access as your team grows.',
  },
  api: {
    eyebrow: 'API pricing',
    title: 'Distressed property data',
    titleHighlight: 'via REST API',
    description: 'Integrate normalized filing data into CRMs, underwriting tools, and custom dashboards.',
  },
};

function PlanCards({ plans }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const handlePlanClick = async (plan) => {
    if (plan.cta === 'Contact Sales') return;

    if (plan.isFree || plan.price === 0) {
      navigate(isAuthenticated ? APP_HOME : '/register');
      return;
    }

    const planId = plan.stripePlanId;
    if (!planId) {
      navigate(isAuthenticated ? APP_HOME : '/register');
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
      <div
        className={cn(
          'grid items-stretch gap-5 sm:gap-6',
          plans.length >= 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'
        )}
      >
        {plans.map((plan) => {
          const isSales = plan.cta === 'Contact Sales';
          const isFree = plan.isFree || plan.price === 0;
          const isLoading = !isFree && Boolean(plan.stripePlanId) && loadingPlan === plan.stripePlanId;
          const hasBadge = plan.popular || isFree;

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex min-h-[28rem] flex-col rounded-lg border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover',
                hasBadge && 'pt-10',
                plan.popular ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border/80'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="rounded-md bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                </div>
              )}
              {isFree && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="rounded-md border border-primary/20 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Free forever
                  </span>
                </div>
              )}

              <div className="mb-5 min-h-[7.5rem]">
                <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  {isFree ? (
                    <>
                      <span className="font-display text-3xl font-bold text-foreground">$0</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </>
                  ) : plan.price != null ? (
                    <>
                      <span className="font-display text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="font-display text-2xl font-bold text-foreground">Custom</span>
                  )}
                </div>
                {isFree && (
                  <p className="mt-1 text-xs font-medium text-primary">No credit card required</p>
                )}
                <p className="mt-3 text-sm leading-[1.65] text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-2">
                {isFree ? (
                  <Button asChild className="h-11 w-full text-sm font-semibold">
                    <Link to={isAuthenticated ? APP_HOME : '/register'}>{plan.cta}</Link>
                  </Button>
                ) : isSales ? (
                  <Button asChild className="h-11 w-full text-sm font-semibold">
                    <a href={CONTACT_MAILTO_SUBJECT('FreshLien pricing inquiry')}>{plan.cta}</a>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={Boolean(loadingPlan)}
                    onClick={() => handlePlanClick(plan)}
                    className={cn(
                      'h-11 w-full text-sm font-semibold',
                      !plan.popular && 'border-primary text-primary hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening Stripe…
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                )}

                {!isSales && !isAuthenticated && (
                  <p className="min-h-[2rem] text-center text-[11px] leading-snug text-muted-foreground">
                    {isFree ? (
                      <>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                          Log in
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/login?plan=${plan.stripePlanId}`} className="font-medium text-primary hover:underline">
                          Log in
                        </Link>{' '}
                        if you already have an account
                      </>
                    )}
                  </p>
                )}
              </div>
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
    <section id="pricing" className="border-t border-border bg-white py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          align="center"
          eyebrow={copy.eyebrow}
          title={copy.title}
          titleHighlight={copy.titleHighlight}
          description={copy.description}
          className="mx-auto"
        />

        <PricingTypeToggle value={type} onChange={handleTypeChange} />

        <PlanCards plans={plans} />

        <p className="mt-10 text-center">
          <a href="#compare-plans" className="text-sm font-medium text-primary hover:underline">
            Compare all {type === 'api' ? 'API' : 'platform'} features ↓
          </a>
        </p>
      </LandingContainer>
    </section>
  );
}
