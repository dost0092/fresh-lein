import { FileSignature, KeyRound, LifeBuoy, MonitorPlay, PackageCheck, ShieldCheck } from 'lucide-react';
import { Container, Reveal, SectionHeading } from '@/components/site/ui';

const ITEMS = [
  {
    icon: FileSignature,
    title: 'Fixed quote in writing',
    body: 'Scope, milestones, and price are agreed before any work starts. No surprise invoices.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidential by default',
    body: 'Happy to sign your NDA before you share files, lists, or workflows with us.',
  },
  {
    icon: KeyRound,
    title: 'Your accounts, your keys',
    body: 'We build inside your CRM, cloud, and data accounts with access you can revoke anytime.',
  },
  {
    icon: MonitorPlay,
    title: 'A live demo every week',
    body: 'You see real progress on real data every week, not a big reveal at the end.',
  },
  {
    icon: PackageCheck,
    title: 'Full handoff, no lock-in',
    body: 'Code, data, documentation, and credentials are yours at launch. No license fees.',
  },
  {
    icon: LifeBuoy,
    title: 'Support after launch',
    body: '30 days of support on every project, with optional ongoing help after that.',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why teams trust us"
          title="Clear terms. Your data."
          accent="No lock-in."
          description="Working with an outside team should feel safe. Here is what you can expect from day one."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.05} className="h-full">
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-white p-6">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-tight text-[17px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
