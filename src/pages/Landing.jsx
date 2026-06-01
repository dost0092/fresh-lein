import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import PricingSection from '@/components/landing/PricingSection';
import CompetitorTable from '@/components/landing/CompetitorTable';
import MarketingNav from '@/components/layout/MarketingNav';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';

// Icon component is rendered dynamically from feature objects
const features = [
  {
    icon: Zap,
    title: 'Same-Day Data Freshness',
    description: 'We scrape US county courts directly every morning at 6 AM EST. No middlemen, no aggregation delays.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: MapPin,
    title: 'Interactive Map Intelligence',
    description: 'Color-coded urgency pins — spot urgent auctions in red, upcoming ones in orange, pre-foreclosures in blue.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'Set watch areas by ZIP code. Get email alerts the moment a new filing hits your target area.',
    color: 'text-orange-500 bg-orange-50',
  },
  {
    icon: Download,
    title: 'Bulk CSV Export',
    description: 'Export filtered leads directly to your CRM, skip-tracing tool, or direct mail campaign.',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    icon: BarChart2,
    title: 'Market Analytics',
    description: 'Charts and heatmaps showing filing trends, auction volumes, and equity distributions by county.',
    color: 'text-purple-500 bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Lien Intelligence',
    description: 'Auto-detect federal liens (IRS/USA), state liens, HOA liens, and probate flags from every filing.',
    color: 'text-red-500 bg-red-50',
  },
];

const dataSources = [
  { name: 'Pre-Foreclosure', desc: 'NOD / Lis Pendens', stage: 'Before auction', value: 'HIGHEST', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { name: 'Active Foreclosure', desc: 'NTS / Sheriff Sale', stage: 'Scheduled sale', value: 'HIGH', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { name: 'REO / Bank-Owned', desc: 'Post-auction deed', stage: 'Lender owns it', value: 'MEDIUM', color: 'bg-slate-50 border-slate-200 text-slate-600' },
  { name: 'Probate', desc: 'Probate court filing', stage: 'Estate selling', value: 'HIGH', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { name: 'Mortgage Default', desc: 'Tax lien / HELOC default', stage: 'Payment missed', value: 'HIGH', color: 'bg-red-50 border-red-200 text-red-700' },
  { name: 'Tax Delinquency', desc: 'County tax records', stage: 'Pre-lien', value: 'MEDIUM', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      <div className="pt-16">
        <HeroSection />

        {/* Features */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Built for real estate investors
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every feature designed around the investor workflow — from lead discovery to closing.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="p-6 bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Categories */}
        <section id="data" className="py-20 bg-brand-green">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                6 distress signal categories
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Every filing type that matters to real estate investors, all in one dashboard.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map(({ name, desc, stage, value, color }) => (
                <div key={name} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-white mb-0.5">{name}</h3>
                      <p className="text-sm text-white/60">{desc}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${color}`}>{value}</span>
                  </div>
                  <p className="text-xs text-white/50 uppercase tracking-wide font-medium">{stage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CompetitorTable />
        <PricingSection />

        {/* CTA */}
        <section className="py-20 bg-brand-green">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to find deals before the crowd?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join hundreds of investors using same-day foreclosure intelligence to win more deals.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-brand-green font-semibold px-8 py-3 rounded-lg text-base hover:bg-white/90 transition-all shadow-xl"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-navy-dark border-t border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">FL</span>
                </div>
                <span className="font-heading font-bold text-white">FreshLien</span>
                <span className="text-white/40 text-sm ml-2">© 2026 freshlien.com</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-white/50 hover:text-white transition-colors">Data Use Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}