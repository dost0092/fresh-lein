import { LandingContainer } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import {
  CoverageLeadBox,
  CoverageSectionIntro,
  CoverageStatsGrid,
} from '@/components/landing/CoverageStats';
import {
  COVERAGE_DISPLAY_STATS,
  COVERAGE_ROADMAP,
  MARKETING_COVERAGE,
} from '@/data/marketingStats';

export default function DataCoverageSection() {
  return (
    <section id="coverage" className="border-y border-border bg-[#FAFAFA] py-14 lg:py-20">
      <LandingContainer>
        <CoverageSectionIntro
          title="Clean and useful distressed property data that's easy to understand"
          subtitle="Because you want to find deals from county records, not wrangle raw PDFs and clerk portals."
        />

        <CoverageStatsGrid stats={COVERAGE_DISPLAY_STATS} />

        <CoverageLeadBox>{MARKETING_COVERAGE.coverageLead}</CoverageLeadBox>

        <div className="mt-12 overflow-hidden rounded-lg border border-border/80 bg-white shadow-card lg:mt-14">
          <div className="border-b border-border bg-neutral-50 px-4 py-4 sm:px-6">
            <h3 className="text-sm font-semibold text-foreground">Coverage roadmap</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              What is live, partial, or coming soon. Updated as counties go live.
            </p>
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
                    FreshLien today
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
                    U.S. universe (est.)
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE_ROADMAP.map((row, i) => (
                  <tr
                    key={row.id}
                    className={i % 2 === 1 ? 'border-t border-border/60 bg-neutral-50/50' : 'border-t border-border/60'}
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <p className="text-sm font-semibold text-foreground">{row.category}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground sm:px-6">{row.freshlienToday}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground sm:px-6">{row.nationalUniverse}</td>
                    <td className="px-5 py-4 text-center sm:px-6">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border sm:hidden">
            {COVERAGE_ROADMAP.map((row) => (
              <div key={row.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{row.category}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <dl className="mt-3 space-y-2 text-xs">
                  <div>
                    <dt className="font-medium text-muted-foreground">FreshLien today</dt>
                    <dd className="mt-0.5 text-foreground">{row.freshlienToday}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">U.S. universe (est.)</dt>
                    <dd className="mt-0.5 text-foreground">{row.nationalUniverse}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-[1.65] text-muted-foreground">
          Figures are estimates from public market data and live county integrations. We add clerk, recorder, and
          court sources county by county and label each market clearly.
        </p>
      </LandingContainer>
    </section>
  );
}
