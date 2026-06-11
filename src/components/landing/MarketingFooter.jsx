import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { LandingContainer } from '@/components/landing/LandingLayout';
import FeedbackDialog from '@/components/FeedbackDialog';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

const productLinks = [
  { label: 'Platform', to: '/dashboard/foreclosures' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'API', to: '/pricing#pricing-api' },
  { label: 'County alerts', to: '/dashboard/alerts' },
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold">
                FL
              </div>
              <span className="font-heading text-base font-semibold">{COMPANY.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{COMPANY.tagline}</p>
            <a
              href={CONTACT_MAILTO}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-primary" />
              {COMPANY.contactEmail}
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Product</p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Company</p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map(({ label, to }) => (
                <li key={to}>
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

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Legal</p>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {COMPANY.year} {COMPANY.name}. All rights reserved.</p>
          <p>Court-sourced foreclosure data for investors.</p>
        </div>
      </LandingContainer>
    </footer>
  );
}
