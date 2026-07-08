import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LandingContainer } from '@/components/landing/LandingLayout';
import FeedbackDialog from '@/components/FeedbackDialog';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';
import { APP_HOME } from '@/lib/routes';
import FreshLienLogo from '@/components/brand/FreshLienLogo';
import SocialLinks from '@/components/brand/SocialLinks';

const serviceLinks = [
  { label: 'Consulting', to: '/#services' },
  { label: 'Lead delivery', to: '/#services' },
  { label: 'Skip trace setup', to: '/#services' },
  { label: 'SMS and outreach', to: '/#services' },
  { label: 'CRM automation', to: '/#services' },
  { label: 'Offer PDFs', to: '/#services' },
  { label: 'Custom software', to: '/#services' },
];

const productLinks = [
  { label: 'FreshLien Platform', to: '/platform' },
  { label: 'Outreach CRM', to: '/crm' },
  { label: 'Search & map', to: APP_HOME },
  { label: 'REST API', to: '/api' },
  { label: 'County alerts', to: '/dashboard/alerts' },
  { label: 'Pricing', to: '/pricing' },
];

const resourceLinks = [
  { label: 'Blog', to: '/blog' },
  { label: 'API documentation', to: '/api' },
  { label: 'Coverage dashboard', to: '/platform#coverage' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Security', to: '/security' },
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark">
      <LandingContainer className="py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <FreshLienLogo to="/" variant="footer" onDark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              Real estate automation consultancy. We advise and build lead delivery, skip trace, SMS, CRM sync, offers, dashboards, and custom software for distressed deal teams.
            </p>
            <a
              href={CONTACT_MAILTO}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-primary" />
              {COMPANY.contactEmail}
            </a>
            <SocialLinks className="mt-4" onDark />
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Services</p>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map(({ label, to }) => (
                <li key={`${label}-${to}`}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Product</p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map(({ label, to }) => (
                <li key={`${label}-${to}`}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Resources</p>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map(({ label, to }) => (
                <li key={`${label}-${to}`}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Company</p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map(({ label, to }) => (
                <li key={`${label}-${to}`}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <FeedbackDialog
                  trigger={
                    <button type="button" className="text-sm text-white/60 transition-colors hover:text-white">
                      Feedback
                    </button>
                  }
                  showIcon={false}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {COMPANY.year} {COMPANY.name}. All rights reserved.</p>
          <p>County-direct public records for distressed property professionals.</p>
        </div>
      </LandingContainer>
    </footer>
  );
}
