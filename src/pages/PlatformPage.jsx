import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { COMPANY } from '@/data/company';

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${COMPANY.name} Platform`,
  url: `${BASE_URL}/platform`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Same-day distressed property data platform: search 100K+ foreclosure filings across 250+ counties with map search, alerts, CSV export, and a REST API.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available; paid plans from $15/month.',
  },
};

export default function PlatformPage() {
  return (
    <div className="fl-app min-h-screen bg-white">
      <Seo
        title="Platform: same-day distressed property data"
        description="The FreshLien platform pulls county and court records into one searchable product. Search 100K+ foreclosure filings across 250+ counties with same-day updates, alerts, exports, and an API."
        path="/platform"
        jsonLd={productSchema}
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <LandingPageContent />
      </div>
    </div>
  );
}
