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
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Our story</Eyebrow>
              <p className="mt-6 font-tight text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-[2.1rem]">
                FreshLien started by turning messy county records into clean leads.{' '}
                <span className="site-accent text-ink-mute">Clients kept asking us to build the rest.</span>
              </p>
            </Reveal>
            <Reveal delay={0.08} className="space-y-5 text-[16px] leading-relaxed text-ink-soft lg:col-span-7">
              <p>
                We began in public records: scraping recorder and court portals, matching owners to parcels, and getting
                distressed-property data to investors before it went stale. The data was useful, but the bigger problem
                was everything around it.
              </p>
              <p>
                Teams were paying for a parcel tool, a zoning tool, a permit feed, a list provider, a CRM, and a campaign
                agency, and none of them talked to each other. Analysts spent their days copying data between tabs. Good
                leads went cold in spreadsheets.
              </p>
              <p>
                So we became the team that builds the whole system. Today FreshLien designs and runs data pipelines, AI
                models, CRMs, campaigns, and custom software for investors, brokerages, CRE firms, developers, lenders,
                and PropTech companies. Same engineering depth, applied to the entire deal lifecycle.
              </p>
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
          <div className="grid gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Domain depth"
              title="We speak"
              accent="real estate."
              description="You will not spend the first month teaching us the business. These are the systems and workflows we work in every day."
            />
            <ul className="grid gap-3 sm:grid-cols-2">
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
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
