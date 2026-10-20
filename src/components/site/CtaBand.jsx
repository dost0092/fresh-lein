import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ButtonLink, Container, Reveal } from '@/components/site/ui';
import { CONTACT_MAILTO } from '@/data/company';

const STEPS = [
  { n: '1', title: 'Pick your topics', body: 'Data, AI, CRM, campaigns, or not sure yet.' },
  { n: '2', title: 'Choose a time', body: 'Any weekday, shown in your time zone.' },
  { n: '3', title: 'Get a clear plan', body: 'A written next step and a realistic range.' },
];

export default function CtaBand({
  title = 'Tell us what slows you down.',
  accent = 'We will show you what to build.',
  description = 'A free 30-minute call. You leave with a clear next step, whether or not we work together.',
}) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-night px-6 py-14 text-white sm:rounded-[2.25rem] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="site-grid-bg-dark site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(34,181,116,0.16),transparent)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />
          <Container className="relative !px-0">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="site-h2 !text-white">
                  {title} <span className="site-accent !text-white/45 sm:block">{accent}</span>
                </h2>
                <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/60">{description}</p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <ButtonLink to="/book-audit" variant="zest" arrow className="!h-12 !px-6 !text-[15px]">
                    Book a free call
                  </ButtonLink>
                  <ButtonLink href={CONTACT_MAILTO} variant="ghostDark" className="!h-12 !px-6 !text-[15px]">
                    Email the team
                  </ButtonLink>
                </div>
                <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-white/45">
                  <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-leaf-300" aria-hidden />
                  Replies within one business day
                </p>
              </div>

              <div className="lg:col-span-5">
                <Link
                  to="/book-audit"
                  className="group block rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2 backdrop-blur transition-colors hover:border-white/20"
                >
                  <div className="flex items-center justify-between px-4 pb-3 pt-3">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">How booking works</p>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">~1 min</p>
                  </div>
                  <ol className="space-y-1.5">
                    {STEPS.map((s) => (
                      <li key={s.n} className="flex items-center gap-4 rounded-2xl bg-white/[0.05] px-4 py-3.5 ring-1 ring-inset ring-white/[0.06]">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[12px] text-white/80">
                          {s.n}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14.5px] font-semibold text-white">{s.title}</span>
                          <span className="block text-[13px] text-white/50">{s.body}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="flex items-center justify-between px-4 pb-2 pt-4 text-[13.5px] font-semibold text-white/80 transition-colors group-hover:text-white">
                    Start booking
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </Reveal>
    </section>
  );
}
