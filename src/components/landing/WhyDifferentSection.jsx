import { Check } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { DIFFERENTIATORS } from '@/data/marketingContent';

export default function WhyDifferentSection() {
  return (
    <section id="why-freshlien" className="bg-white py-14 lg:py-20">
      <LandingContainer>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
          <LandingSectionHeader
            eyebrow="How we're different"
            title="Our data is"
            titleHighlight="investor-ready"
            description="County records, updated same-day on live markets. Not recycled list feeds that lag a month behind."
            className="mb-0 lg:sticky lg:top-24"
          />

          <div className="grid gap-8 sm:grid-cols-2">
            {DIFFERENTIATORS.map(({ title, description }) => (
              <div key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
