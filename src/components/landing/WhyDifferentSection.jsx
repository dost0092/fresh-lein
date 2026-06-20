import { Zap, Clock, Scale, Eye, Target, Layers } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { DIFFERENTIATORS } from '@/data/marketingContent';

const ICONS = [Zap, Clock, Scale, Eye, Target, Layers];

export default function WhyDifferentSection() {
  return (
    <section id="why-freshlien" className="bg-white py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Why FreshLien"
          title="Built different from"
          titleHighlight="legacy list platforms"
          description="County-direct sourcing, same-day freshness, and full distress coverage — not recycled aggregator data."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map(({ title, description }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-white p-5 transition-colors hover:border-primary/20 hover:bg-primary/[0.02]"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
