import { Link } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: 15,
    description: 'For individual investors focused on a single county market.',
    features: [
      '1 county',
      '500 records/month',
      'CSV export',
      'Saved properties',
      'Email alerts',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: 25,
    description: 'For active wholesalers who need broader coverage and volume.',
    features: [
      '5 counties',
      '5,000 records/month',
      'Unlimited exports',
      'Saved searches',
      'Alerts',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For teams, funds, and platforms that need scale and API access.',
    features: [
      'Unlimited counties',
      'Unlimited records',
      'API access',
      'Team accounts',
      'Priority support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> Pricing
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with sample data today. Scale to live county feeds when you&apos;re ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl border-2 p-8 flex flex-col transition-shadow hover:shadow-card-hover',
                plan.popular
                  ? 'border-primary bg-white shadow-xl scale-[1.02]'
                  : 'border-border bg-white shadow-card'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {plan.price != null ? (
                    <>
                      <span className="text-4xl font-display font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-display font-bold text-foreground">Contact Sales</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta === 'Contact Sales' ? 'mailto:sales@freshlien.com' : '/register'}
                className={cn(
                  'block text-center font-semibold py-3 px-6 rounded-xl text-sm transition-all',
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                    : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          All plans billed monthly in USD. Enterprise pricing customized to your volume.
        </p>
      </div>
    </section>
  );
}
