import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardUpcomingSection from '@/components/dashboard/DashboardUpcomingSection';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { MARKETING_COVERAGE } from '@/data/marketingStats';

const platformFeatures = [
  {
    icon: Zap,
    title: 'Same-day court data',
    detail: 'Sheriff-sale filings synced from county sources — not stale monthly lists.',
  },
  {
    icon: MapPin,
    title: 'Map & urgency pins',
    detail: 'Color-coded markers by days-to-auction so you spot hot deals instantly.',
  },
  {
    icon: Bell,
    title: 'County alerts',
    detail: 'Email notifications when new filings match counties you track.',
  },
  {
    icon: Download,
    title: 'CSV export',
    detail: 'Download filtered results for your CRM, spreadsheet, or team.',
  },
  {
    icon: BarChart2,
    title: 'Market analytics',
    detail: 'Volume, coverage, and upcoming auction counts at a glance.',
  },
  {
    icon: Shield,
    title: 'Lien intelligence',
    detail: 'Plaintiff, defendant, parcel, and attorney fields on every record.',
  },
];

export default function LoggedInDashboard() {
  return (
    <>
      <HeroSection />
      <DashboardOverview />
      <LandingMapExplorer />
      <DashboardUpcomingSection />
      <DataCoverageSection />

      <section className="border-b border-border bg-white py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="Your toolkit"
            title="Everything you need to"
            titleHighlight="find deals first"
            description="Built for investors, wholesalers, and acquisition teams who need accurate foreclosure data before it hits the mass-market lists."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map(({ icon: Icon, title, detail }) => (
              <div
                key={title}
                className="rounded-xl border border-border/70 bg-white p-5 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="bg-primary py-12 lg:py-14">
        <LandingContainer innerClassName="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Ready to dig in</p>
          <h2 className="font-display mt-2 text-xl font-semibold text-white sm:text-2xl">
            Search {MARKETING_COVERAGE.foreclosureRecords} live foreclosure records
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
            Filter by county, sale date, and status — then export or save what matters.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard/foreclosures"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/95"
            >
              Open foreclosure explorer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/foreclosures?view=map"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Map view
            </Link>
          </div>
        </LandingContainer>
      </section>

      <MarketingFooter />
    </>
  );
}
