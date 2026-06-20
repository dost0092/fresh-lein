import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { DATA_CATEGORIES } from '@/data/marketingContent';

export default function DataCategoriesSection() {
  return (
    <section id="data-categories" className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Data categories"
          title="Full distress spectrum"
          titleHighlight="in one dataset"
          description="Pre-foreclosure through REO — plus probate, tax delinquency, default signals, and enrichment layers."
        />

        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Filing type
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Stage
                  </th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                    Lead value
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {DATA_CATEGORIES.map((cat, i) => (
                  <tr
                    key={cat.id}
                    className={i % 2 === 1 ? 'border-t border-border/50 bg-muted/10' : 'border-t border-border/50'}
                  >
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">{cat.title}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{cat.filing}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{cat.stage}</td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground sm:table-cell">{cat.value}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={cat.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
