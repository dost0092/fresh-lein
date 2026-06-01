import { LandingContainer, LandingEyebrow } from '@/components/landing/LandingLayout';

const metrics = [
  {
    value: '48+',
    unit: 'counties',
    headline: 'Court feeds connected',
    detail: 'Sheriff-sale & foreclosure dockets pulled straight from county sources — not recycled list vendors.',
  },
  {
    value: '12K+',
    unit: 'records',
    headline: 'Indexed & searchable',
    detail: 'Addresses, sale dates, opening bids, and lien flags — refreshed as new filings hit the docket.',
  },
  {
    value: '<24h',
    unit: 'refresh',
    headline: 'Morning scrape cycle',
    detail: 'While competitors resell 30–60 day old data, FreshLien targets same-day court intelligence.',
  },
];

export default function DataCoverageSection() {
  return (
    <section className="border-y border-border bg-[#f4f6fa] py-12 lg:py-14">
      <LandingContainer>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
          <div className="lg:pt-1">
            <LandingEyebrow>Court data scale</LandingEyebrow>
            <h2 className="font-display text-xl font-semibold leading-snug text-foreground lg:text-2xl">
              From courthouse filing to your deal pipeline — faster
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              FreshLien ingests sheriff-sale and foreclosure dockets nationwide, then layers AI equity signals
              and lien context so you act on filings while they still matter.
            </p>
            <p className="mt-4 text-[11px] font-medium text-primary">
              Expanding county coverage every week · investor-grade accuracy
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
            <div className="border-b border-border/60 bg-primary px-4 py-2.5 sm:px-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
                Live coverage snapshot
              </p>
            </div>

            <ul className="divide-y divide-border/60">
              {metrics.map(({ value, unit, headline, detail }, index) => (
                <li key={headline} className="flex gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
                  <div className="flex w-16 shrink-0 flex-col items-start sm:w-20">
                    <span className="font-display text-2xl font-bold leading-none text-primary sm:text-[1.75rem]">
                      {value}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                      {unit}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 border-l border-border/50 pl-4 sm:pl-5">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-foreground">{headline}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
