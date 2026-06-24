import { Link } from 'react-router-dom';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FAQ_ITEMS } from '@/data/faq';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <MarketingPageShell
      seo={{
        title: 'FAQ: Foreclosure Data, Coverage & Pricing',
        description:
          'Answers about FreshLien foreclosure data, county coverage, data freshness, pricing plans, CSV export, API access, and county alerts.',
        path: '/faq',
        jsonLd: faqSchema,
      }}
    >
      <MarketingPageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about FreshLien, our data, and plans."
      />

      <section className="pb-14 lg:pb-16">
        <LandingContainer>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 rounded-lg border border-border bg-[#FAFAFA] p-8 text-center">
              <p className="text-sm text-muted-foreground">Still have questions?</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button asChild>
                  <Link to="/contact">Contact us</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={CONTACT_MAILTO}>{COMPANY.contactEmail}</a>
                </Button>
              </div>
            </div>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
