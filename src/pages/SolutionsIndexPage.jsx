import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import CtaBand from '@/components/site/CtaBand';
import { ButtonLink, Container, IconTile, PageHero, Reveal, Section } from '@/components/site/ui';
import { SOLUTIONS, getService } from '@/data/siteContent';

export default function SolutionsIndexPage() {
  return (
    <MarketingPageShell
      overlapNav
      seo={{
        title: 'Solutions',
        description:
          'Data, AI, CRM, and campaign solutions for real estate investors, brokerages, commercial real estate, developers, lenders, property managers, PropTech companies, and home services.',
        path: '/solutions',
      }}
    >
      <PageHero
        eyebrow="Solutions"
        title="Built for the way"
        accent="your side of real estate"
        after="works."
        description="Every part of the industry runs on different data, different tools, and different deals. Find yours and see what we typically build."
      >
        <div className="mt-10">
          <ButtonLink to="/book-audit" arrow>
            Book a strategy call
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 0.06} className="h-full">
                <Link
                  to={`/solutions/${s.slug}`}
                  className="site-card site-card-hover group flex h-full flex-col p-8 sm:p-10"
                >
                  <div className="flex items-start justify-between">
                    <IconTile icon={s.icon} className="transition-colors group-hover:bg-ink group-hover:text-zest group-hover:ring-ink" />
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-zest">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <h2 className="mt-8 font-tight text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">{s.name}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.headline}</p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {s.builds.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2.5 text-[14.5px] text-ink-soft">
                        <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
                    {s.services.map((slug) => (
                      <span key={slug} className="site-chip">
                        {getService(slug)?.name}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Do not see your team here?" accent="We probably still fit." />
    </MarketingPageShell>
  );
}
