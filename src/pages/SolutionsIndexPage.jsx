import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { SOLUTIONS } from '@/data/solutionsContent';

export default function SolutionsIndexPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'Real Estate Automation Solutions',
        description:
          'FreshLien solutions for lead data automation, acquisitions, dispositions, and property research—built for investors, wholesalers, and operators.',
        path: '/solutions',
      }}
    >
      <MarketingPageHero
        eyebrow="Solutions"
        title="One operational system across the"
        titleHighlight="deal lifecycle"
        description="FreshLien helps real estate teams move from fragmented records to clean leads, CRM activity, follow-up, offers, and dispositions—without replacing every tool you already use."
      />
      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-5 lg:grid-cols-2">
            {SOLUTIONS.map((s) => (
              <div key={s.id} className="fl-card flex h-full flex-col p-6">
                <h2 className="text-lg font-semibold text-foreground">{s.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={s.href} className="fl-link mt-5 inline-flex items-center gap-1">
                  {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
