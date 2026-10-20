import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck, Mail, MessageSquare } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import SocialLinks from '@/components/brand/SocialLinks';
import LeadForm, { SentState } from '@/components/site/LeadForm';
import { Container, Eyebrow, Reveal } from '@/components/site/ui';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

const OPTIONS = [
  {
    icon: CalendarCheck,
    title: 'Start a project',
    body: 'Share your workflow and goals. We reply with times for a strategy call.',
    to: '/book-audit',
    cta: 'Book a call',
  },
  {
    icon: Mail,
    title: 'Email the team',
    body: COMPANY.contactEmail,
    href: CONTACT_MAILTO,
    cta: 'Send an email',
  },
  {
    icon: MessageSquare,
    title: 'Common questions',
    body: 'Pricing, timelines, ownership, and how we work.',
    to: '/faq',
    cta: 'Read the FAQ',
  },
];

export default function ContactPage() {
  const [params] = useSearchParams();
  const sent = params.get('sent') === '1';

  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Contact',
        description: 'Contact FreshLien about real estate data engineering, AI, CRM automation, campaigns, or custom software.',
        path: '/contact',
      }}
    >
      <section className="relative overflow-hidden bg-paper">
        <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative pb-24 pt-32 sm:pt-36 lg:pt-44">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Contact</Eyebrow>
              <h1 className="site-display mt-5 !text-[2.6rem] sm:!text-[3.4rem]">
                Talk to a <span className="site-accent text-leaf">real person.</span>
              </h1>
              <p className="site-lead mt-6">
                Questions, partnerships, or a project in mind. Send a note and someone from the team will get back to you
                within one business day.
              </p>
              <div className="mt-10 space-y-3">
                {OPTIONS.map((o) => {
                  const Icon = o.icon;
                  const inner = (
                    <>
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf ring-1 ring-leaf-100">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{o.title}</p>
                        <p className="truncate text-sm text-ink-mute">{o.body}</p>
                      </div>
                      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-mute transition-colors group-hover:text-ink" />
                    </>
                  );
                  const cls =
                    'group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all hover:border-ink/20 hover:shadow-lg';
                  return o.href ? (
                    <a key={o.title} href={o.href} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link key={o.title} to={o.to} className={cls}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
              <SocialLinks className="mt-8" />
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-48px_rgba(11,26,19,0.35)] sm:p-10">
                {sent ? (
                  <SentState title="Message sent." />
                ) : (
                  <>
                    <h2 className="font-tight text-2xl font-semibold tracking-[-0.02em] text-ink">Send us a message</h2>
                    <div className="mt-8">
                      <LeadForm variant="short" subject="FreshLien website contact" defaults={{ topic: params.get('topic') || '' }} />
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </MarketingPageShell>
  );
}
