import { Shield, RefreshCw, Scale } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { TRUST_ITEMS } from '@/data/marketingContent';

const ICONS = [Shield, RefreshCw, Scale];

export default function TrustTransparencySection() {
  return (
    <section id="trust" className="fl-marketing-section-muted border-y">
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
              <div key={title} className="fl-card flex h-full flex-col p-6">
                <Icon className="mb-4 h-5 w-5 text-primary" strokeWidth={1.75} />
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
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
