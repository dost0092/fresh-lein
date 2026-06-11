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
  return (
    <MarketingPageShell>
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

            <div className="mt-10 rounded-xl border border-border bg-slate-50/60 p-6 text-center">
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
