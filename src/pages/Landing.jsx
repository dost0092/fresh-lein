import MarketingNav from '@/components/layout/MarketingNav';
import HomePageContent from '@/components/landing/HomePageContent';
import { MARKETING_NAV_OFFSET_CLASS } from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { COMPANY } from '@/data/company';
import { POSITIONING } from '@/data/sitePositioning';
import { SITE_FAQS } from '@/data/solutionsContent';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: BASE_URL,
  logo: `${BASE_URL}/freshlien-logo.png`,
  description: POSITIONING.positioning,
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
  description: POSITIONING.fiveSecond,
  areaServed: 'US',
  serviceType: [
    'Data engineering for real estate',
    'Workflow automation for real estate',
    'AI services for real estate',
    'Public records workflow automation',
    'Acquisition automation',
    'Disposition workflows',
    'Property research systems',
    'CRM integration for real estate',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SITE_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function Landing() {
  return (
    <div className="fl-app min-h-screen bg-white">
      <Seo
        title="Data engineering, automation, and AI for real estate"
        description="FreshLien offers data engineering, automation, and AI services. We pull public records into clean leads, then connect them to your CRM, follow-up, and offers."
        path="/"
        jsonLd={[orgSchema, serviceSchema, faqSchema]}
      />
      <MarketingNav />
      <div className={MARKETING_NAV_OFFSET_CLASS}>
        <HomePageContent />
      </div>
    </div>
  );
}
