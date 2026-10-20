import { useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import LeadForm, { SentState } from '@/components/site/LeadForm';
import { ButtonLink, CheckList, Container, Eyebrow, Reveal } from '@/components/site/ui';
import { COMPANY, CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { PROCESS } from '@/data/siteContent';

const ON_THE_CALL = [
  'A walk through your current workflow and tools',
  'Where data, AI, or automation would help most',
  'A rough timeline and budget range',
  'An honest answer on whether we are the right fit',
];

export default function BookAuditPage() {
  const [params] = useSearchParams();
  const sent = params.get('sent') === '1';
  const defaults = {
    service: params.get('service') || undefined,
    team: params.get('team') || undefined,
    engagement: params.get('engagement') || undefined,
  };

  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Book a strategy call',
        description:
          'Tell FreshLien about your real estate workflow. Book a 30-minute strategy call about data engineering, AI, CRM automation, campaigns, or custom software.',
        path: '/book-audit',
      }}
    >
      <section className="relative overflow-hidden bg-paper">
        <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-zest/30 blur-3xl" aria-hidden />
        <Container className="relative pb-24 pt-32 sm:pt-36 lg:pt-44">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Book a strategy call</Eyebrow>
              <h1 className="site-display mt-5 !text-[2.6rem] sm:!text-[3.4rem]">
                Let us look at your workflow <span className="site-accent text-leaf">together.</span>
              </h1>
              <p className="site-lead mt-6">
                Share a few details and we will reply within one business day with times for a 30-minute call. No prep,
                no pitch deck.
              </p>

              <div className="mt-10 rounded-3xl border border-line bg-white p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">On the call</p>
                <CheckList items={ON_THE_CALL} className="mt-5" />
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">What happens next</p>
                <ol className="mt-5 space-y-4">
                  {PROCESS.slice(0, 3).map((p) => (
                    <li key={p.step} className="flex gap-4">
                      <span className="font-mono text-sm text-leaf">{p.step}</span>
                      <div>
                        <p className="font-semibold text-ink">{p.title}</p>
                        <p className="text-sm text-ink-mute">{p.duration}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <a
                href={CONTACT_MAILTO_SUBJECT('Project inquiry')}
                className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-leaf"
              >
                <Mail className="h-4 w-4 text-leaf" /> Prefer email? {COMPANY.contactEmail}
              </a>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-48px_rgba(11,26,19,0.35)] sm:p-10">
                {sent ? (
                  <>
                    <SentState />
                    <div className="flex justify-center">
                      <ButtonLink to="/services" variant="secondary" arrow>
                        Browse services meanwhile
                      </ButtonLink>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-tight text-2xl font-semibold tracking-[-0.02em] text-ink">Tell us about your project</h2>
                    <p className="mt-2 text-[15px] text-ink-mute">Takes about two minutes.</p>
                    <div className="mt-8">
                      <LeadForm variant="full" subject="FreshLien strategy call request" defaults={defaults} />
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
