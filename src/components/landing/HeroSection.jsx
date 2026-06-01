import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  canSearchOnLanding,
  incrementLandingSearch,
  getRemainingSearches,
} from '@/lib/landingSearchLimit';
import ProGateModal from '@/components/landing/ProGateModal';

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
      <section className="relative bg-white pt-8 pb-12 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.04] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/15 rounded-full px-3 py-1 text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-driven foreclosure intelligence
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.12] tracking-tight mb-4">
              <span className="relative inline-block">
                AI-driven foreclosure
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-amber-400/50 -z-10 rounded-sm" />
              </span>
              {' '}
              analysis & deal discovery
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Preferred by real estate investors for efficient lien due diligence and accelerated
              sheriff-sale acquisitions — same-day county court data, not 30-day-old lists.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mb-4">
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 rounded-xl border border-border bg-white shadow-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-primary pointer-events-none" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter an address, neighborhood, city, or ZIP code"
                    className="w-full h-12 sm:h-14 pl-12 pr-4 text-sm bg-transparent border-0 focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 sm:h-14 rounded-none sm:rounded-none px-8 text-sm font-semibold shrink-0"
                >
                  Search
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                {getRemainingSearches()} free preview searches · then upgrade to Pro
              </p>
            </form>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="h-9 text-xs border-amber-400/60 text-amber-700 hover:bg-amber-50" asChild>
                <Link to="mailto:sales@freshlien.com">Contact us</Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-9 text-xs text-primary" asChild>
                <Link to="/register">Start free trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProGateModal open={showProGate} onClose={() => setShowProGate(false)} />
    </>
  );
}
