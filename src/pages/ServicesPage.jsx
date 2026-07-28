import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import {
  SERVICE_PACKAGES,
  PRICING_DISCLAIMER,
  GOOD_FIT,
  ENGAGEMENT_MODEL,
} from '@/data/servicePackages';
import { SITE_FAQS } from '@/data/solutionsContent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ServicesPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'Real Estate Automation Services',
        description:
          'FreshLien combines software, implementation, integration, and workflow monitoring. Start with a workflow audit, then automate lead pipelines, acquisitions, or a full operating system.',
        path: '/services',
      }}
    >
      <MarketingPageHero
        eyebrow="Services"
        title="Software, implementation, and"
        titleHighlight="ongoing workflow monitoring"
        description="FreshLien combines product modules with implementation services. Start with one bottleneck. Expand into a complete operating system when the pilot is proven."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICE_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="fl-card flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{pkg.name}</h2>
                  <p className="shrink-0 text-sm font-bold text-primary">{pkg.priceLabel}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{pkg.priceNote}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {pkg.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">Best for: {pkg.bestFor}</p>
                <Link to={pkg.href} className="fl-btn-primary mt-5">
                  {pkg.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{PRICING_DISCLAIMER}</p>
        </LandingContainer>
      </section>

      <section className="border-t border-border/60 bg-fl-subtle py-14 lg:py-20">
        <LandingContainer>
          <LandingSectionHeader
            title="Engagement model"
            description="A controlled path from audit to production—not an open-ended build."
          />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENGAGEMENT_MODEL.map((step, i) => (
              <li key={step} className="fl-card p-5 text-sm">
                <span className="font-bold text-primary/40">0{i + 1}</span>
                <p className="mt-1 font-semibold text-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </LandingContainer>
      </section>

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Good fit</h2>
              <ul className="mt-4 space-y-2">
                {GOOD_FIT.yes.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">May not be a fit</h2>
              <ul className="mt-4 space-y-2">
                {GOOD_FIT.no.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LandingContainer>
      </section>

      <section className="border-t border-border/60 bg-fl-subtle py-14">
        <LandingContainer>
          <LandingSectionHeader title="FAQ" />
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {SITE_FAQS.map((item, i) => (
              <AccordionItem key={item.q} value={`s-faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <Link to="/book-audit" className="fl-btn-primary px-6">
              Book a Workflow Audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
