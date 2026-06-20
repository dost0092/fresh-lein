import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { USE_CASES } from '@/data/marketingContent';

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-white py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Use cases"
          title="Built for every"
          titleHighlight="distressed deal team"
          description="Wholesalers, flippers, attorneys, lenders, and funds. Same data, different workflows."
        />

        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {USE_CASES.map(({ segment, pain, value }) => (
            <div
              key={segment}
              className="flex h-full flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card"
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
