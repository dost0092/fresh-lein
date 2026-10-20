import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { IntegrationsSection } from '@/components/site/Integrations';
import { ButtonLink, Container, Eyebrow, PageHero, Reveal, Section, SectionHeading } from '@/components/site/ui';
import { BRAND, PRINCIPLES, SERVICES, SOLUTIONS } from '@/data/siteContent';

const DOMAIN = [
  'County recorder, assessor, clerk, and court systems',
  'Foreclosure, probate, tax, and lien filings',
  'Parcel, APN, and owner entity data',
  'Zoning codes, overlays, and entitlement',
  'Building permits and contractor data',
  'Acquisition and disposition workflows',
  'CRE underwriting, OMs, and rent rolls',
  'Investor, buyer, and seller outreach',
];

const FACTS = [
  { value: String(SERVICES.length), label: 'Service lines under one roof' },
  { value: String(SOLUTIONS.length), label: 'Real estate segments we build for' },
  { value: '100%', label: 'Of code and data owned by the client' },
  { value: 'Weekly', label: 'Demos on every build' },
];

export default function AboutPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'About',
        description:
          'FreshLien is a services company for real estate. We combine data engineering, AI, CRM automation, and outreach into one team that builds systems you own.',
        path: '/about',
      }}
    >
      <PageHero
        eyebrow="About FreshLien"
        title="We are the team real estate operators"
        accent="call to build things."
        description={BRAND.oneLiner}
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Our story</Eyebrow>
              <p className="mt-6 font-tight text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-[2.1rem]">
                FreshLien started by turning messy county records into clean leads.{' '}
                <span className="site-accent">Clients kept asking us to build the rest.</span>
              </p>
            </Reveal>
            <Reveal delay={0.08} className="space-y-5 text-[16px] leading-relaxed text-ink-soft lg:col-span-7">
              <p>We started by turning county records into clean leads for investors.</p>
              <p>
                Then we saw the real problem: six tools that never talked to each other, and good leads going cold in
                spreadsheets.
              </p>
              <p className="font-medium text-ink">So now we build the whole system, and hand you the keys.</p>
              <div className="pt-4">
                <ButtonLink to="/book-audit" arrow>
                  Work with us
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <section className="border-y border-line bg-paper">
        <Container>
          <div className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
            {FACTS.map((f) => (
              <div key={f.label} className="px-2 py-10 lg:px-8">
                <p className="font-tight text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">{f.value}</p>
                <p className="mt-2 text-sm text-ink-mute">{f.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Domain depth"
              title="We speak"
              accent="real estate."
              description="No ramp-up. This is what we work in every day."
            />
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DOMAIN.map((d, i) => (
                <Reveal key={d} delay={(i % 2) * 0.05} as="li">
                  <div className="h-full rounded-2xl border border-line p-5 text-[15px] font-medium text-ink">{d}</div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading eyebrow="What we believe" title="How we" accent="show up." />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-white p-7">
                  <span className="font-mono text-sm text-ink-mute">0{i + 1}</span>
                  <h3 className="mt-6 font-tight text-xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <IntegrationsSection />
      <CtaBand />
    </MarketingPageShell>
  );
}
