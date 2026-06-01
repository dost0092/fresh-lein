import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  { id: 'starter', name: 'Starter', price: 15, popular: false },
  { id: 'pro', name: 'Professional', price: 25, popular: true },
  { id: 'enterprise', name: 'Enterprise', price: null, popular: false },
];

const rows = [
  {
    category: 'Coverage',
    items: [
      { label: 'Counties included', starter: '1', pro: '5', enterprise: 'Unlimited' },
      { label: 'Records per month', starter: '500', pro: '5,000', enterprise: 'Unlimited' },
      { label: 'Active foreclosure data', starter: true, pro: true, enterprise: true },
      { label: 'Pre-foreclosure (coming soon)', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Search & map',
    items: [
      { label: 'Address / ZIP search', starter: true, pro: true, enterprise: true },
      { label: 'Interactive map explorer', starter: true, pro: true, enterprise: true },
      { label: 'List view + filters', starter: true, pro: true, enterprise: true },
      { label: 'Saved searches', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Export & alerts',
    items: [
      { label: 'CSV export', starter: '200 rows', pro: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Email alerts', starter: '1 county', pro: '5 counties', enterprise: 'Unlimited' },
      { label: 'Saved properties', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { label: 'Analytics dashboard', starter: false, pro: true, enterprise: true },
      { label: 'REST API access', starter: false, pro: false, enterprise: true },
      { label: 'Team accounts', starter: false, pro: false, enterprise: true },
      { label: 'Priority support', starter: false, pro: false, enterprise: true },
    ],
  },
];

function CellValue({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 items-center justify-center mx-auto">
        <Check className="w-3.5 h-3.5 text-primary" />
      </span>
    );
  }
  if (value === false) {
    return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

export default function PricingCompareTable() {
  return (
    <section id="compare-plans" className="py-14 bg-slate-50/80 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-2">
            Compare all plan features
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore what each FreshLien plan offers for foreclosure intelligence.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 overflow-x-auto rounded-xl border border-border bg-white shadow-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 w-[40%] font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={cn(
                        'p-4 text-center min-w-[120px]',
                        plan.popular ? 'bg-primary/[0.06]' : 'bg-slate-50/50'
                      )}
                    >
                      {plan.popular && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                          <Star className="w-2.5 h-2.5 fill-primary" /> Most Popular
                        </span>
                      )}
                      <p className="font-semibold text-foreground">{plan.name}</p>
                      {plan.price != null ? (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="text-lg font-bold text-foreground">${plan.price}</span>/mo
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">Custom</p>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((group) => (
                  <Fragment key={group.category}>
                    <tr className="bg-muted/30">
                      <td colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {group.category}
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.label} className="border-t border-border/60 hover:bg-muted/20">
                        <td className="px-4 py-3 text-xs text-foreground">{item.label}</td>
                        <td className="px-4 py-3 text-center">
                          <CellValue value={item.starter} />
                        </td>
                        <td className="px-4 py-3 text-center bg-primary/[0.03]">
                          <CellValue value={item.pro} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <CellValue value={item.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enterprise side card */}
          <div className="xl:w-56 shrink-0">
            <div className="h-full rounded-xl bg-secondary text-secondary-foreground p-5 flex flex-col shadow-lg">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/15 px-2 py-1 rounded-full w-fit mb-4">
                <Zap className="w-3 h-3" /> Custom
              </span>
              <h3 className="font-semibold text-base mb-2">Enterprise Plan</h3>
              <p className="text-xs text-white/75 leading-relaxed flex-1">
                Custom pricing for organizations needing unlimited counties, API access, and dedicated support.
              </p>
              <p className="text-2xl font-bold my-4">Custom Pricing</p>
              <Link
                to="mailto:sales@freshlien.com"
                className="block text-center bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
