import { CalendarCheck, Clock, ShieldCheck } from 'lucide-react';
import { ButtonLink, Container, Reveal } from '@/components/site/ui';
import { CONTACT_MAILTO } from '@/data/company';

const POINTS = [
  { icon: Clock, text: '30-minute call, no prep needed' },
  { icon: CalendarCheck, text: 'Written plan and fixed quote' },
  { icon: ShieldCheck, text: 'You own everything we build' },
];

export default function CtaBand({
  title = 'Tell us what is slowing your team down.',
  accent = 'We will show you what to build.',
  description = 'Bring your markets, your tools, and your messiest workflow. You will leave the call with a clear next step, whether or not we work together.',
}) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          <div className="site-grid-bg-dark site-fade-mask pointer-events-none absolute inset-0" aria-hidden />
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-leaf-500/40 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-zest/25 blur-[110px]" aria-hidden />
          <Container className="relative !px-0">
            <div className="grid items-end gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="site-h2 !text-white">
                  {title} <span className="site-accent text-zest">{accent}</span>
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">{description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink to="/book-audit" variant="zest" arrow>
                    Book a call
                  </ButtonLink>
                  <ButtonLink href={CONTACT_MAILTO} variant="ghostDark">
                    Email the team
                  </ButtonLink>
                </div>
              </div>
              <ul className="space-y-4 lg:col-span-4">
                {POINTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-[15px] text-white/80">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zest">
                      <Icon className="h-4 w-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </Reveal>
    </section>
  );
}
