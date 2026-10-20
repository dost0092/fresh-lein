import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import { ButtonLink, Container, Eyebrow } from '@/components/site/ui';
import { GlyphCompass, GlyphDashboard, GlyphSign } from '@/components/site/Glyphs';

const SUGGESTIONS = [
  { to: '/services', icon: GlyphDashboard, title: 'Services', body: 'What we build for real estate teams' },
  { to: '/solutions', icon: GlyphSign, title: 'Solutions', body: 'Find the setup for your side of the market' },
  { to: '/book-audit', icon: GlyphCompass, title: 'Book a call', body: 'Free 30-minute strategy call' },
];

export default function PageNotFound() {
  return (
    <MarketingPageShell overlapNav seo={{ title: 'Page not found', description: 'This page could not be found.', path: '/404' }}>
      <section className="relative overflow-hidden bg-paper">
        <div className="site-grid-bg site-fade-b pointer-events-none absolute inset-0" aria-hidden />
        <Container size="narrow" className="relative pb-28 pt-36 text-center sm:pt-44">
          <Eyebrow className="justify-center">Error 404</Eyebrow>
          <h1 className="site-display mt-6 !text-[2.6rem] sm:!text-[3.5rem]">
            This lot is <span className="site-accent">still vacant.</span>
          </h1>
          <p className="site-lead mx-auto mt-5 max-w-lg">
            The page you are looking for has moved or never existed. Here are a few good places to go instead.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {SUGGESTIONS.map(({ to, icon: Icon, title, body }) => (
              <Link key={to} to={to} className="site-card site-card-hover group p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-white to-mist text-ink ring-1 ring-inset ring-line">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-ink" />
                </div>
                <p className="mt-5 text-[15px] font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-[13.5px] leading-snug text-ink-mute">{body}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </MarketingPageShell>
  );
}
