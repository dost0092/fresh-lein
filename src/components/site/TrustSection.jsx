import { Container, IconTile, Reveal, SectionHeading } from '@/components/site/ui';
import { GlyphContract, GlyphDemo, GlyphHandoff, GlyphKey, GlyphShield, GlyphSupport } from '@/components/site/Glyphs';

const ITEMS = [
  {
    icon: GlyphContract,
    title: 'Fixed quote in writing',
    body: 'Agreed before work starts. No surprise invoices.',
  },
  {
    icon: GlyphShield,
    title: 'Confidential by default',
    body: 'We sign your NDA before you share anything.',
  },
  {
    icon: GlyphKey,
    title: 'Your accounts, your keys',
    body: 'We work in your accounts. Revoke access anytime.',
  },
  {
    icon: GlyphDemo,
    title: 'A live demo every week',
    body: 'Real progress on real data, every week.',
  },
  {
    icon: GlyphHandoff,
    title: 'Full handoff, no lock-in',
    body: 'Code, data, and docs are yours. No license fees.',
  },
  {
    icon: GlyphSupport,
    title: 'Support after launch',
    body: '30 days included, ongoing help if you want it.',
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
          description="What you can count on from day one."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.05} className="h-full">
              <div className="site-card site-card-hover group flex h-full gap-4 p-6">
                <IconTile icon={Icon} interactive />
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
