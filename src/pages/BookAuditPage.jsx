import { useSearchParams } from 'react-router-dom';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import BookingWizard from '@/components/site/BookingWizard';
import { Accordion, Container, Eyebrow, IconTile, Reveal } from '@/components/site/ui';
import { GlyphCalendar, GlyphContract, GlyphShield } from '@/components/site/Glyphs';

const PROMISES = [
  { icon: GlyphCalendar, title: '30 minutes, free', body: 'No prep, no pitch deck.' },
  { icon: GlyphContract, title: 'A clear next step', body: 'A first build and a realistic range.' },
  { icon: GlyphShield, title: 'Confidential', body: 'We sign your NDA on request.' },
];

const BOOKING_FAQS = [
  {
    q: 'Is the call really free?',
    a: 'Yes. No obligation. If we are not the right fit, we will say so.',
  },
  {
    q: 'Who will I talk to?',
    a: 'Someone from the delivery team who builds the systems, not a sales rep.',
  },
  {
    q: 'What if none of the times work?',
    a: 'Pick the closest one and add a better window in the notes. We will work around you.',
  },
  {
    q: 'What happens after the call?',
    a: 'You get a short written plan: what to build first, a timeline, and a price range.',
  },
];

export default function BookAuditPage() {
  const [params] = useSearchParams();
  const defaults = {
    service: params.get('service') || undefined,
    team: params.get('team') || undefined,
    engagement: params.get('engagement') || undefined,
  };

  return (
    <MarketingPageShell
      overlapNav
      hideBookBar
      seo={{
        title: 'Book a strategy call',
        description:
          'Book a free 30-minute strategy call with FreshLien about real estate data engineering, AI, CRM automation, campaigns, or custom software.',
        path: '/book-audit',
      }}
    >
      <section className="relative overflow-clip bg-paper">
        <div className="site-grid-bg site-fade-b pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden />
        <Container className="relative pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">Book a strategy call</Eyebrow>
            <h1 className="site-display mt-6 !text-[2.4rem] sm:!text-[3.25rem]">
              Book a free call. <span className="site-accent">It takes a minute.</span>
            </h1>
            <p className="site-lead mx-auto mt-5 max-w-xl">
              Pick what you need and a time. We confirm by email. You talk to a builder, not a sales rep.
            </p>
          </Reveal>

          <div className="mt-12 lg:mt-14">
            <BookingWizard defaults={defaults} />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-[1.25rem] border border-line bg-white/70 p-5">
                <IconTile icon={Icon} size="sm" />
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-mute">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-20 sm:py-24">
        <Container size="narrow">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow>Before you book</Eyebrow>
              <h2 className="site-h2 mt-5 !text-[1.9rem] sm:!text-[2.2rem]">
                Good to <span className="site-accent">know.</span>
              </h2>
            </div>
            <div className="md:col-span-8">
              <Accordion items={BOOKING_FAQS} />
            </div>
          </div>
        </Container>
      </section>
    </MarketingPageShell>
  );
}
