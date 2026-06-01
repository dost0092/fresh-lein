import { Link } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: 15,
    description: 'One county, core search and export.',
    features: ['1 county', '500 records/month', 'CSV export', 'Saved properties', 'Email alerts'],
    cta: 'Get Started',
    popular: false,
    ctaVariant: 'secondary',
  },
  {
    name: 'Professional',
    price: 25,
    description: 'Multi-county coverage for active investors.',
    features: ['5 counties', '5,000 records/month', 'Unlimited exports', 'Saved searches', 'Alerts'],
    cta: 'Get Started',
    popular: true,
    ctaVariant: 'primary',
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Teams, API access, and priority support.',
    features: ['Unlimited counties', 'Unlimited records', 'API access', 'Team accounts', 'Priority support'],
    cta: 'Contact Sales',
    popular: false,
    ctaVariant: 'green',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/15 rounded-full px-3 py-1 text-xs font-medium mb-4">
            <Zap className="w-3 h-3" /> Pricing
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-2">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Start with sample data today. Scale to live county feeds when you&apos;re ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-xl border p-6 flex flex-col transition-shadow hover:shadow-card-hover bg-white',
                plan.popular ? 'border-primary shadow-md ring-1 ring-primary/10' : 'border-border shadow-card'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-display text-base font-semibold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.price != null ? (
                    <>
                      <span className="text-3xl font-display font-bold">${plan.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="text-xl font-display font-bold">Contact Sales</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-foreground">
                    <Check className="w-3.5 h-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta === 'Contact Sales' ? 'mailto:sales@freshlien.com' : '/register'}
                className={cn(
                  'block text-center font-medium py-2.5 px-4 rounded-lg text-xs transition-colors',
                  plan.ctaVariant === 'primary' && 'bg-primary hover:bg-primary/90 text-primary-foreground',
                  plan.ctaVariant === 'secondary' && 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
                  plan.ctaVariant === 'green' && 'bg-brand-green hover:bg-navy-light text-white'
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
