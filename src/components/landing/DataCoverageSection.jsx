import { LandingContainer, LandingEyebrow, highlightMarkStyle } from '@/components/landing/LandingLayout';

const metrics = [
  { value: '48+', label: 'Counties live' },
  { value: '12K+', label: 'Foreclosure records' },
  { value: 'Same-day', label: 'Court data refresh' },
];

export default function DataCoverageSection() {
  return (
    <section className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
      <LandingContainer>
        <div className="mb-8 max-w-xl">
          <LandingEyebrow>Data coverage</LandingEyebrow>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[1.75rem] lg:text-[2rem]">
            Unparalleled &amp; growing{' '}
            <span className="text-primary">
              <span className="inline box-decoration-clone rounded-sm px-1.5 py-0.5" style={highlightMarkStyle}>
                data coverage
              </span>
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            AI-enriched sheriff-sale filings nationwide.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map(({ value, label }) => (
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
