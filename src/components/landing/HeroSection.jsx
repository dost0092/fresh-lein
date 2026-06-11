import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Gavel, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  canSearchOnLanding,
  incrementLandingSearch,
  getRemainingSearches,
} from '@/lib/landingSearchLimit';
import ProGateModal from '@/components/landing/ProGateModal';
import { LandingContainer, LandingEyebrow, highlightMarkStyle } from '@/components/landing/LandingLayout';
import { MARKETING_COVERAGE } from '@/data/marketingStats';
import { useAuth } from '@/lib/AuthContext';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [showProGate, setShowProGate] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (isAuthenticated) {
      navigate(q ? `/dashboard/foreclosures?q=${encodeURIComponent(q)}` : '/dashboard/foreclosures');
      return;
    }
    if (!canSearchOnLanding()) {
      setShowProGate(true);
      return;
    }
    incrementLandingSearch();
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('freshlien-landing-search', { detail: q }));
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50 bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'linear-gradient(180deg, rgba(19, 81, 51, 0.05) 0%, transparent 40%)',
          }}
        />

        <LandingContainer className="relative py-11 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <LandingEyebrow>AI-driven foreclosure intelligence</LandingEyebrow>

              <h1 className="font-display mb-4 font-semibold leading-[1.15] tracking-tight text-primary">
                <span className="block text-[1.85rem] sm:text-[2.1rem] lg:text-[2.5rem]">
                  Discover high-equity foreclosure deals
                </span>
                <span className="mt-1.5 block text-[1.85rem] sm:text-[2.1rem] lg:text-[2.5rem]">
                  with{' '}
                  <span
                    className="inline box-decoration-clone rounded-sm px-1.5 py-0.5 text-primary"
                    style={highlightMarkStyle}
                  >
                    AI-powered insights
                  </span>
                </span>
              </h1>

              <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Same-day county court data for investors — not month-old lists.
              </p>

              <form onSubmit={handleSearch} className="mb-4 max-w-lg">
                <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 sm:flex-row">
                  <div className="relative flex min-w-0 flex-1 items-center">
                    <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-primary/70" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Address, city, or ZIP"
                      className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm focus:outline-none sm:h-12 sm:text-base"
                    />
                  </div>
                  <Button type="submit" className="h-11 shrink-0 rounded-none px-6 sm:h-12">
                    Search
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {isAuthenticated
                    ? `${MARKETING_COVERAGE.foreclosureRecords} live records · search opens the full explorer with filters & export`
                    : `${getRemainingSearches()} free preview searches`}
                </p>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Button className="h-10 px-5 font-semibold" asChild>
                      <Link to="/dashboard/foreclosures">
                        <Gavel className="mr-2 h-4 w-4" /> Browse foreclosures
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 border-primary px-5 font-semibold text-primary hover:bg-primary/5"
                      asChild
                    >
                      <Link to="/dashboard/foreclosures?view=map">
                        <Map className="mr-2 h-4 w-4" /> Map view
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="h-10 border-primary px-5 font-semibold text-primary hover:bg-primary/5"
                      asChild
                    >
                      <Link to="/contact">Contact us</Link>
                    </Button>
                    <Button variant="ghost" className="h-10 font-semibold text-primary" asChild>
                      <Link to="/register">
                        Start free trial <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="overflow-hidden rounded-xl border border-border/70 shadow-md">
                <img
                  src="/hero-foreclosure.png"
                  alt="FreshLien foreclosure map"
                  className="aspect-[4/3] w-full object-cover"
                  width={1200}
                  height={900}
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </LandingContainer>
      </section>

      <ProGateModal open={showProGate} onClose={() => setShowProGate(false)} />
    </>
  );
}
