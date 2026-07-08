import MarketingNav from '@/components/layout/MarketingNav';
import ServicesLandingContent from '@/components/landing/ServicesLandingContent';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { COMPANY } from '@/data/company';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: BASE_URL,
  logo: `${BASE_URL}/freshlien-logo.png`,
  description:
    'FreshLien builds real estate automation for distressed deal teams: lead delivery, skip trace, SMS, CRM sync, offer systems, dashboards, and custom software.',
  sameAs: [
    'https://www.linkedin.com/company/freshlien',
    'https://www.facebook.com/people/FreshLien/61590612976427/',
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: COMPANY.name,
  url: BASE_URL,
  description:
    'Real estate automation services: we build acquisition systems for distressed deal teams.',
  areaServed: 'US',
  serviceType: [
    'Distressed lead delivery',
    'Skip trace and owner contact setups',
    'SMS and email outreach systems',
    'CRM and pipeline automation',
    'Offer and contract document systems',
    'Buyer matching systems',
    'Custom real estate software development',
  ],
};

export default function Landing() {
  return (
    <div className="fl-app min-h-screen bg-white">
      <Seo
        title="Real estate automation services"
        description="FreshLien builds acquisition systems for real estate teams: lead delivery, skip trace, SMS, CRM sync, offer PDFs, dashboards, AI workflows, and custom software. Book a free call."
        path="/"
        jsonLd={[orgSchema, serviceSchema]}
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <ServicesLandingContent />
      </div>
    </div>
  );
}
