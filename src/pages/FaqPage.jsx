import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { Accordion, Container, PageHero, Section } from '@/components/site/ui';
import { SITE_FAQS } from '@/data/siteContent';

const MORE_FAQS = [
  {
    q: 'Do you sell data or software subscriptions?',
    a: 'No. We build systems for you, and can connect the subscriptions you already have.',
  },
  {
    q: 'Who will we work with day to day?',
    a: 'A lead engineer and a project manager, start to finish. Plus a shared channel and a weekly demo.',
  },
  {
    q: 'How do you handle data security and privacy?',
    a: 'We work in your accounts with minimal access, store credentials securely, and follow data and outreach rules.',
  },
  {
    q: 'Can you work with our in-house developers?',
    a: 'Yes. We follow your standards and leave docs so your team can own it.',
  },
  {
    q: 'Do you work outside the United States?',
    a: 'Public-records work is US-focused. AI, CRM, and software projects work anywhere.',
  },
];

const ALL = [...SITE_FAQS, ...MORE_FAQS];

export default function FaqPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'FAQ',
        description: 'Answers about FreshLien services, pricing, timelines, ownership, security, and how we work with real estate teams.',
        path: '/faq',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ALL.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        },
      }}
    >
      <PageHero
        eyebrow="FAQ"
        title="Questions,"
        accent="answered."
        description="Everything teams usually ask before working with us. If yours is not here, just ask."
      />
      <Section>
        <Container size="narrow">
          <Accordion items={ALL} />
        </Container>
      </Section>
      <CtaBand title="Still have a question?" accent="Ask us on a call." />
    </MarketingPageShell>
  );
}
