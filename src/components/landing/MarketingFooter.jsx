import { Link } from 'react-router-dom';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { LandingContainer } from '@/components/landing/LandingLayout';
import FeedbackDialog from '@/components/FeedbackDialog';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';
import { POSITIONING } from '@/data/sitePositioning';
import { SOLUTIONS } from '@/data/solutionsContent';
import { SERVICE_PACKAGES } from '@/data/servicePackages';
import { APP_HOME } from '@/lib/routes';
import FreshLienLogo from '@/components/brand/FreshLienLogo';
import SocialLinks from '@/components/brand/SocialLinks';

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Resources', to: '/resources' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
];

const productLinks = [
  { label: 'Platform overview', to: '/platform' },
  { label: 'Live foreclosure data', to: APP_HOME },
  { label: 'Outreach CRM', to: '/crm' },
  { label: 'REST API', to: '/api' },
  { label: 'Pricing', to: '/pricing' },
];

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Security', to: '/security' },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark">
      <LandingContainer className="py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <FreshLienLogo to="/" variant="footer" onDark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              {POSITIONING.footerDescription}
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Platform</p>
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Solutions</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/solutions" className="text-sm text-white/60 hover:text-white">
                  All solutions
                </Link>
              </li>
              {SOLUTIONS.map((s) => (
                <li key={s.id}>
                  <Link to={s.href} className="text-sm text-white/60 hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Services</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/services" className="text-sm text-white/60 hover:text-white">
                  All services
                </Link>
              </li>
              {SERVICE_PACKAGES.map((p) => (
                <li key={p.id}>
                  <Link to={p.href} className="text-sm text-white/60 hover:text-white">
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/book-audit" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
                  Book an Audit <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
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
              {legalLinks.map(({ label, to }) => (
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
          <p>
            © {COMPANY.year} {COMPANY.name}. All rights reserved.
          </p>
          <p>Real estate data and workflow automation for serious operators.</p>
        </div>
      </LandingContainer>
    </footer>
  );
}
