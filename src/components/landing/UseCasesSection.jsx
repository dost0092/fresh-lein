import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { USE_CASES } from '@/data/marketingContent';

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-white py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Use cases"
          title="Built for every"
          titleHighlight="distressed deal team"
          description="From solo wholesalers to enterprise servicers — same data, tailored workflows."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {USE_CASES.map(({ segment, pain, value }) => (
            <div
              key={segment}
              className="flex flex-col rounded-xl border border-border/70 bg-white p-5 shadow-sm transition-colors hover:border-primary/20"
            >
              <h3 className="font-display text-sm font-semibold text-foreground">{segment}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/70">Challenge: </span>
                {pain}
              </p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-primary">FreshLien: </span>
                {value}
              </p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
