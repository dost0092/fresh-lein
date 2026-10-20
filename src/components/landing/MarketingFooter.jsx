import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import FeedbackDialog from '@/components/FeedbackDialog';
import SocialLinks from '@/components/brand/SocialLinks';
import SiteLogo from '@/components/site/SiteLogo';
import { Container } from '@/components/site/ui';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';
import { BRAND, SERVICES, SOLUTIONS } from '@/data/siteContent';

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'How we work', to: '/how-it-works' },
  { label: 'Engagements', to: '/pricing' },
  { label: 'Example work', to: '/case-studies' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Security', to: '/security' },
];

function Column({ title, links }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="text-[14.5px] text-white/65 transition-colors hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="site-grid-bg-dark pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <Container className="relative pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SiteLogo onDark />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">{BRAND.promise}</p>
            <a
              href={CONTACT_MAILTO}
              className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-white/85 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-white/60" />
              {COMPANY.contactEmail}
            </a>
            <SocialLinks className="mt-6" onDark />
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <Column
              title="Services"
              links={SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}` }))}
            />
            <Column
              title="Solutions"
              links={SOLUTIONS.map((s) => ({ label: s.name, to: `/solutions/${s.slug}` }))}
            />
            <div>
              <Column title="Company" links={COMPANY_LINKS} />
              <ul className="mt-3">
                <li>
                  <FeedbackDialog
                    trigger={
                      <button type="button" className="text-[14.5px] text-white/65 transition-colors hover:text-white">
                        Feedback
                      </button>
                    }
                    showIcon={false}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 select-none overflow-hidden" aria-hidden>
          <p className="whitespace-nowrap font-tight text-[18vw] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.04] lg:text-[15rem]">
            FreshLien
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {COMPANY.year} {COMPANY.name}. Data, AI, and growth services for real estate.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link to="/login" className="inline-flex items-center gap-1 transition-colors hover:text-white">
              Client log in <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
