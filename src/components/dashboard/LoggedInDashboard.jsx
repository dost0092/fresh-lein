import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Bell, Download, Zap, BarChart2, Shield } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import LandingMapExplorer from '@/components/landing/LandingMapExplorer';
import DataCoverageSection from '@/components/landing/DataCoverageSection';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardUpcomingSection from '@/components/dashboard/DashboardUpcomingSection';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';

const platformFeatures = [
  {
    icon: Zap,
    title: 'Same-day county data',
    detail: 'Filings synced from official county sources, not stale monthly lists.',
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
      <DataCoverageSection />
      <LandingMapExplorer />
      <DashboardOverview />
      <DashboardUpcomingSection />

      <section className="border-b border-border bg-white py-14 lg:py-20">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="Your toolkit"
            title="Everything you need to"
            titleHighlight="find deals first"
            description="Built for investors, wholesalers, and acquisition teams who need county records before they show up on legacy list sites."
          />
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="fl-card flex h-full flex-col p-6">
                <Icon className="mb-3 h-5 w-5 text-primary" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="border-t border-border bg-white py-14 lg:py-20">
        <LandingContainer innerClassName="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ready to dig in</p>
          <h2 className="font-display mt-3 text-xl font-semibold text-foreground sm:text-2xl">
            Search live foreclosure records
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Filter by county, sale date, and status, then export or save what matters.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard/foreclosures" className="fl-btn-primary px-6 py-2.5">
              Open foreclosure explorer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/dashboard/foreclosures?view=map" className="fl-btn-ghost px-6 py-2.5">
              Map view
            </Link>
          </div>
        </LandingContainer>
      </section>

      <MarketingFooter />
    </>
  );
}
