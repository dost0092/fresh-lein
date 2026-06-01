import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import PricingSection from '@/components/landing/PricingSection';
import PricingCompareTable from '@/components/landing/PricingCompareTable';
import CompetitorTable from '@/components/landing/CompetitorTable';
import MarketingNav from '@/components/layout/MarketingNav';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Same-Day Data Freshness',
    description: 'We scrape US county courts directly every morning. No middlemen, no aggregation delays.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: MapPin,
    title: 'Interactive Map Intelligence',
    description: 'Color-coded urgency pins — spot urgent auctions in red, upcoming in orange.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'County-level email alerts the moment a new filing hits your market.',
    color: 'text-brand-green bg-brand-green/10',
  },
  {
    icon: Download,
    title: 'Bulk CSV Export',
    description: 'Export filtered leads to your CRM, skip-tracing tool, or direct mail.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: BarChart2,
    title: 'Market Analytics',
    description: 'Filing trends, auction volumes, and equity distributions by county.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Lien Intelligence',
    description: 'Federal, state, HOA liens, and probate flags from every filing.',
    color: 'text-brand-green bg-brand-green/10',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      <div className="pt-14">
        <HeroSection />
        <LandingMapExplorer />
        <DataCoverageSection />

        <section id="features" className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-2">
                Built for real estate investors
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Every feature designed around the investor workflow — from lead discovery to closing.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="p-5 bg-white rounded-lg border border-border shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CompetitorTable />
        <PricingSection />
        <PricingCompareTable />

        <section className="py-14 bg-brand-green">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              Ready to find deals before the crowd?
            </h2>
            <p className="text-sm text-white/80 mb-6">
              Join investors using AI-driven foreclosure intelligence to win more deals.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-brand-green font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-white/90 shadow-lg"
            >
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <footer className="bg-navy-dark py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-[10px] font-bold">
                FL
              </div>
              <span className="font-semibold">FreshLien</span>
              <span className="text-white/40 text-xs">© 2026</span>
            </div>
            <div className="flex gap-5 text-xs text-white/50">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
