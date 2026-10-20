import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
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
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/35">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="text-[14px] text-white/60 transition-colors duration-200 hover:text-white">
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
    <footer className="relative overflow-hidden bg-night text-white">
      <div className="site-grid-bg-dark pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <Container className="relative pb-10 pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
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
            <p className="mt-3 flex items-center gap-2 text-[13px] text-white/40">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-leaf-300" aria-hidden />
              Replies within one business day
            </p>
            <Link
              to="/book-audit"
              className="group mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Book a free call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <SocialLinks className="mt-8" onDark />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8">
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
                      <button type="button" className="text-[14px] text-white/60 transition-colors duration-200 hover:text-white">
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
          <p className="whitespace-nowrap bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text font-tight text-[18vw] font-bold leading-[0.85] tracking-[-0.06em] text-transparent lg:text-[15rem]">
            FreshLien
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
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
