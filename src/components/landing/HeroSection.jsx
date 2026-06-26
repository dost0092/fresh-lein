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
import { BRAND } from '@/data/marketingContent';
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
      <section className="relative overflow-hidden border-b border-border/60 bg-white py-16 sm:py-20 lg:py-28">
        <LandingContainer className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <LandingEyebrow>Distressed real estate intelligence</LandingEyebrow>

              <h1 className="font-display mb-6 font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                <span className="block text-[2.25rem] sm:text-[2.85rem] lg:text-[3.4rem]">
                  Same-day distressed property data,
                </span>
                <span className="mt-1 block text-[2.25rem] sm:text-[2.85rem] lg:text-[3.4rem]">
                  <span
                    className="inline box-decoration-clone rounded-md px-2 py-0.5 text-primary"
                    style={highlightMarkStyle}
                  >
                    before the crowd
                  </span>
                </span>
              </h1>

              <p className="mb-8 max-w-md text-lg leading-[1.6] text-muted-foreground">
                {BRAND.subheadline}
              </p>

              <form onSubmit={handleSearch} className="mb-6 max-w-lg">
                <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 sm:flex-row">
                  <div className="relative flex min-w-0 flex-1 items-center">
                    <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Address, city, county, or ZIP"
                      className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm focus:outline-none sm:h-12 sm:text-base"
                    />
                  </div>
                  <Button type="submit" className="fl-btn-primary h-11 shrink-0 rounded-none px-6 sm:h-12 sm:rounded-r-lg">
                    Search
                  </Button>
                </div>
                {!isAuthenticated && (
                  <p className="mt-2.5 text-xs text-muted-foreground sm:text-sm">
                    {getRemainingSearches()} free preview searches on the map below
                  </p>
                )}
              </form>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {isAuthenticated ? (
                  <>
                    <Button className="h-11 px-6 text-[15px] font-semibold" asChild>
                      <Link to="/dashboard/foreclosures">
                        <Gavel className="mr-2 h-4 w-4" /> Browse filings
                      </Link>
                    </Button>
                    <Link
                      to="/dashboard/foreclosures?view=map"
                      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      <Map className="h-4 w-4" /> Map view
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Button className="h-11 px-6 text-[15px] font-semibold" asChild>
                      <Link to="/register">
                        Get started free <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      Preview live map
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="overflow-hidden rounded-lg border border-border/80 shadow-card">
                <img
                  src="/hero-foreclosure.png"
                  alt="FreshLien distressed property map with urgency-coded pins"
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
