import { LandingContainer, LandingEyebrow, highlightMarkStyle } from '@/components/landing/LandingLayout';
import { COVERAGE_STATS } from '@/data/marketingContent';
import { MARKETING_COVERAGE } from '@/data/marketingStats';

export default function DataCoverageSection() {
  return (
    <section id="coverage" className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
      <LandingContainer>
        <div className="mb-8 max-w-2xl">
          <LandingEyebrow>Data coverage</LandingEyebrow>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[1.75rem] lg:text-[2rem]">
            Measurable coverage.{' '}
            <span className="text-primary">
              <span className="inline box-decoration-clone rounded-sm px-1.5 py-0.5" style={highlightMarkStyle}>
                Same-day freshness.
              </span>
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {MARKETING_COVERAGE.coverageSubtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {COVERAGE_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-border/70 bg-white px-5 py-6 text-center shadow-sm"
            >
              <p className="font-display text-2xl font-bold text-primary lg:text-[1.75rem]">{value}</p>
              <p className="mt-1.5 text-sm font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
