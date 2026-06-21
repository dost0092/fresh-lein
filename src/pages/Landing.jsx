import MarketingNav from '@/components/layout/MarketingNav';
import LandingPageContent from '@/components/landing/LandingPageContent';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { COMPANY } from '@/data/company';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: BASE_URL,
  logo: `${BASE_URL}/freshlien-logo.png`,
  description: COMPANY.description,
  sameAs: [
    'https://www.linkedin.com/company/freshlien',
    'https://www.facebook.com/people/FreshLien/61590612976427/',
  ],
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: COMPANY.name,
  url: BASE_URL,
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Same-day distressed property data for investors"
        description="FreshLien pulls county and court records into one searchable platform. Search 100K+ foreclosure filings across 250+ counties with same-day updates, alerts, exports, and an API."
        path="/"
        jsonLd={[orgSchema, siteSchema]}
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <LandingPageContent />
      </div>
    </div>
  );
}
