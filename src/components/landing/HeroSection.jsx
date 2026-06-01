import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  canSearchOnLanding,
  incrementLandingSearch,
  getRemainingSearches,
} from '@/lib/landingSearchLimit';
import ProGateModal from '@/components/landing/ProGateModal';
import { LandingContainer } from '@/components/landing/LandingLayout';

const TRUST_POINTS = [
  'Same-day county court data',
  '48+ counties live',
  'AI equity & lien scoring',
];

const highlightStyle = {
  backgroundColor: 'rgba(19, 81, 51, 0.12)',
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
};

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [showProGate, setShowProGate] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!canSearchOnLanding()) {
      setShowProGate(true);
      return;
    }

    incrementLandingSearch();
    const el = document.getElementById('explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('freshlien-landing-search', { detail: q }));
    }
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50 bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'linear-gradient(105deg, rgba(30, 41, 59, 0.04) 0%, transparent 42%), linear-gradient(180deg, rgba(19, 81, 51, 0.06) 0%, transparent 38%)',
          }}
        />

        <LandingContainer className="relative py-11 lg:py-14">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="h-4 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                  AI-driven foreclosure intelligence
                </span>
              </div>

              <h1 className="font-display mb-5 font-semibold leading-[1.18] tracking-tight">
                <span className="block text-[1.75rem] text-primary sm:text-[1.95rem] lg:text-[2.15rem] xl:text-[2.35rem]">
                  <span className="inline box-decoration-clone rounded-sm px-1.5 py-0.5" style={highlightStyle}>
                    Discover high-equity foreclosure deals
                  </span>
                </span>
                <span className="mt-1.5 block text-[1.75rem] text-primary sm:text-[1.95rem] lg:text-[2.15rem] xl:text-[2.35rem]">
                  <span className="inline box-decoration-clone rounded-sm px-1.5 py-0.5" style={highlightStyle}>
                    with AI-powered insights
                  </span>
                </span>
              </h1>

              <p className="mb-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Preferred by real estate investors for lien due diligence and sheriff-sale
                acquisitions — court filings refreshed daily, not month-old list brokers.
              </p>

              <form onSubmit={handleSearch} className="mb-3 w-full">
                <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 sm:flex-row">
                  <div className="relative flex min-w-0 flex-1 items-center">
                    <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-primary/70" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Address, neighborhood, city, or ZIP"
                      className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm focus:outline-none sm:h-11"
                    />
                  </div>
                  <Button type="submit" className="h-11 shrink-0 rounded-none px-6 text-sm font-semibold">
                    Search
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {getRemainingSearches()} free preview searches · then upgrade to Pro
                </p>
              </form>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-primary/30 text-xs text-primary hover:bg-primary/5"
                  asChild
                >
                  <Link to="mailto:sales@freshlien.com">Contact us</Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 text-xs font-semibold text-primary" asChild>
                  <Link to="/register">Start free trial →</Link>
                </Button>
              </div>

              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/65"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <div className="relative">
                <div
                  className="absolute -right-2 top-6 bottom-6 w-1 rounded-full bg-primary/15 lg:-right-3"
                  aria-hidden
                />
                <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-[0_12px_40px_-16px_rgba(19,81,51,0.28)]">
                  <img
                    src="/hero-foreclosure.png"
                    alt="FreshLien foreclosure map on laptop — search properties, view pins, and filter by status"
                    className="aspect-[5/4] w-full object-cover object-center sm:aspect-[4/3]"
                    width={1200}
                    height={900}
                    fetchPriority="high"
                  />
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-left">
                  <span className="font-semibold text-primary">Live map</span>
                  {' · '}
                  foreclosure, pre-foreclosure &amp; auction pins
                </p>
              </div>
            </div>
          </div>
        </LandingContainer>
      </section>

      <ProGateModal open={showProGate} onClose={() => setShowProGate(false)} />
    </>
  );
}
