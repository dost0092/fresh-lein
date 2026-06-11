import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      <span className="mx-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
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
    <section id="compare-plans" className="border-t border-border bg-white py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          align="center"
          eyebrow="Compare"
          title="Plan features"
          className="mx-auto"
        />

        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="flex-1 overflow-x-auto rounded-xl border border-border bg-white shadow-card">
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
                        plan.popular ? 'bg-primary/[0.06]' : 'bg-slate-50/50'
                      )}
                    >
                      {plan.popular && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <Star className="h-2.5 w-2.5 fill-primary" /> Most Popular
                        </span>
                      )}
                      <p className="font-semibold text-foreground">{plan.name}</p>
                      {plan.price != null ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="text-lg font-bold text-foreground">${plan.price}</span>/mo
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
                        colSpan={4}
                        className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.label} className="border-t border-border/60 hover:bg-muted/20">
                        <td className="px-4 py-3 text-xs text-foreground">{item.label}</td>
                        <td className="px-4 py-3 text-center">
                          <CellValue value={item.starter} />
                        </td>
                        <td className="px-4 py-3 bg-primary/[0.03] text-center">
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

          <div className="shrink-0 xl:w-56">
            <div className="flex h-full flex-col rounded-xl bg-secondary p-5 text-secondary-foreground shadow-lg">
              <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold">
                <Zap className="h-3 w-3" /> Custom
              </span>
              <h3 className="mb-2 text-base font-semibold">
                {isApi ? 'Enterprise API' : 'Enterprise Platform'}
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-white/75">
                {isApi
                  ? 'Dedicated keys, custom counties, SLAs, and onboarding for data teams.'
                  : 'Unlimited counties, team seats, and dedicated support for your organization.'}
              </p>
              <p className="my-4 text-2xl font-bold">Custom pricing</p>
              <Link
                to="/contact"
                className="block rounded-lg bg-primary py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
