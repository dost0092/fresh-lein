import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import {
  API_COMPARE_ROWS,
  API_PLANS,
  PLATFORM_COMPARE_ROWS,
  PLATFORM_PLANS,
} from '@/data/pricingPlans';

function CellValue({ value }) {
  if (value === true) {
    return (
      <span className="mx-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100">
        <Check className="h-3.5 w-3.5 text-primary" />
      </span>
    );
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  }
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

export default function PricingCompareTable({ pricingType = 'platform' }) {
  const isApi = pricingType === 'api';
  const plans = isApi ? API_PLANS : PLATFORM_PLANS;
  const rows = isApi ? API_COMPARE_ROWS : PLATFORM_COMPARE_ROWS;

  return (
    <section id="compare-plans" className="border-t border-border bg-white py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          align="center"
          eyebrow="Compare"
          title="Plan features"
          className="mx-auto"
        />

        <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
          <div className="flex-1 overflow-x-auto rounded-lg border border-border/80 bg-white shadow-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-[40%] p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={cn(
                        'min-w-[120px] p-4 text-center',
                        plan.popular ? 'bg-neutral-50 ring-1 ring-inset ring-primary/15' : 'bg-[#FAFAFA]'
                      )}
                    >
                      {plan.popular && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white px-2 py-0.5 text-[10px] font-bold text-primary">
                          <Star className="h-2.5 w-2.5 fill-primary" /> Most Popular
                        </span>
                      )}
                      <p className="font-semibold text-foreground">{plan.name}</p>
                      {plan.price != null ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {plan.price === 0 ? (
                            <span className="text-lg font-bold text-foreground">$0</span>
                          ) : (
                            <span className="text-lg font-bold text-foreground">${plan.price}</span>
                          )}
                          /mo
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-muted-foreground">Custom</p>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((group) => (
                  <Fragment key={group.category}>
                    <tr className="bg-muted/30">
                      <td
                        colSpan={plans.length + 1}
                        className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.label} className="border-t border-border/60 hover:bg-muted/20">
                        <td className="px-4 py-3 text-xs text-foreground">{item.label}</td>
                        {plans.map((plan) => (
                          <td
                            key={plan.id}
                            className={cn('px-4 py-3 text-center', plan.popular && 'bg-neutral-50/80')}
                          >
                            <CellValue value={item[plan.id]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shrink-0 xl:w-64">
            <div className="flex min-h-[28rem] flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card">
              <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full border border-border bg-neutral-50 px-2 py-1 text-[10px] font-bold text-primary">
                <Zap className="h-3 w-3" /> Custom
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {isApi ? 'Enterprise API' : 'Enterprise Platform'}
              </h3>
              <p className="flex-1 text-sm leading-[1.65] text-muted-foreground">
                {isApi
                  ? 'Dedicated keys, custom counties, SLAs, and onboarding for data teams.'
                  : 'Unlimited counties, team seats, and dedicated support for your organization.'}
              </p>
              <p className="my-5 font-display text-2xl font-bold text-foreground">Custom pricing</p>
              <Button asChild className="h-11 w-full text-sm font-semibold">
                <Link to="/contact">Talk to our team</Link>
              </Button>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
