import { Shield, RefreshCw, Scale } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { TRUST_ITEMS } from '@/data/marketingContent';

const ICONS = [Shield, RefreshCw, Scale];

export default function TrustTransparencySection() {
  return (
    <section id="trust" className="border-y border-border bg-[#FAFAFA] py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Trust & transparency"
          title="Know exactly what"
          titleHighlight="you're getting"
          description="Source types, refresh rules, and compliance. We label what is live and what is still building."
        />

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map(({ title, items }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="flex h-full flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card"
              >
                <div className="icon-surface mb-4 h-10 w-10">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
