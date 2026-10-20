import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { Accordion, Container, PageHero, Section } from '@/components/site/ui';
import { SITE_FAQS } from '@/data/siteContent';

const MORE_FAQS = [
  {
    q: 'Do you sell data or software subscriptions?',
    a: 'Our focus is services: we build data, AI, CRM, and campaign systems for you. Where it helps, we can also connect the data products you already subscribe to so everything flows into one place.',
  },
  {
    q: 'Who will we work with day to day?',
    a: 'A lead engineer and a project manager who stay with your project from blueprint to launch, plus specialists in data, AI, or campaigns as the scope needs. You get a shared channel and a weekly demo.',
  },
  {
    q: 'How do you handle data security and privacy?',
    a: 'We work in your accounts wherever possible, use least-privilege access, and keep credentials in managed secret stores. We follow the terms of each data source and the consent rules that apply to outreach.',
  },
  {
    q: 'Can you work with our in-house developers?',
    a: 'Yes. We often pair with internal teams, follow your code standards and review process, and leave documentation so your team can own the system after launch.',
  },
  {
    q: 'Do you work outside the United States?',
    a: 'Most of our public-records work is US-focused. AI, CRM, campaign, and software projects can serve teams anywhere. Ask us about your market.',
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
