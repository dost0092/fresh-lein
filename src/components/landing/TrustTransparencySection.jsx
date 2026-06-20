import { Shield, RefreshCw, Scale } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { TRUST_ITEMS } from '@/data/marketingContent';

const ICONS = [Shield, RefreshCw, Scale];

export default function TrustTransparencySection() {
  return (
    <section id="trust" className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Trust & transparency"
          title="Know exactly what"
          titleHighlight="you're getting"
          description="Source types, freshness rules, and compliance — no black-box data claims."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map(({ title, items }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="rounded-xl border border-border/70 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                <ul className="mt-4 space-y-2.5">
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
