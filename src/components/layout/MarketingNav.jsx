import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MARKETING_NAV_HEIGHT_CLASS } from '@/components/landing/LandingLayout';
import SiteLogo from '@/components/site/SiteLogo';
import { useAuth } from '@/lib/AuthContext';
import { APP_HOME } from '@/lib/routes';
import { SERVICES, SOLUTIONS } from '@/data/siteContent';

const COMPANY_LINKS = [
  { label: 'About', to: '/about', desc: 'Who we are and how we work' },
  { label: 'Example work', to: '/case-studies', desc: 'The kinds of systems we build' },
  { label: 'FAQ', to: '/faq', desc: 'Pricing, timelines, ownership' },
  { label: 'Blog', to: '/blog', desc: 'Notes on real estate data and AI' },
  { label: 'Contact', to: '/contact', desc: 'Talk to the team' },
];

const MENUS = {
  services: {
    label: 'Services',
    all: { label: 'All services', to: '/services' },
    items: SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}`, desc: s.short, icon: s.icon })),
  },
  solutions: {
    label: 'Solutions',
    all: { label: 'All solutions', to: '/solutions' },
    items: SOLUTIONS.map((s) => ({ label: s.name, to: `/solutions/${s.slug}`, desc: s.short, icon: s.icon })),
  },
  company: {
    label: 'Company',
    items: COMPANY_LINKS,
  },
};

const PLAIN_LINKS = [
  { label: 'How we work', to: '/how-it-works' },
  { label: 'Engagements', to: '/pricing' },
];

function MegaPanel({ menuKey, onNavigate }) {
  const menu = MENUS[menuKey];
  const isCompany = menuKey === 'company';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_32px_64px_-32px_rgba(11,26,19,0.25)]"
    >
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-8 px-8 py-8 lg:grid-cols-12">
        <div className={cn(isCompany ? 'lg:col-span-7' : 'lg:col-span-9')}>
          <div className={cn('grid gap-1', isCompany ? 'grid-cols-2' : 'grid-cols-2')}>
            {menu.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className="group flex items-start gap-3.5 rounded-2xl p-3.5 transition-colors hover:bg-paper"
                >
                  {Icon && (
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-ink-soft ring-1 ring-line transition-colors group-hover:bg-ink group-hover:text-white group-hover:ring-ink">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink">{item.label}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-mute">{item.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          {menu.all && (
            <Link
              to={menu.all.to}
              onClick={onNavigate}
              className="group mt-3 inline-flex items-center gap-1.5 px-3.5 text-sm font-semibold text-ink hover:text-ink-soft"
            >
              {menu.all.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <div className={cn(isCompany ? 'lg:col-span-5' : 'lg:col-span-3')}>
          <Link
            to="/book-audit"
            onClick={onNavigate}
            className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-paper p-6 transition-colors hover:border-ink/20"
          >
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">Not sure where to start?</p>
              <p className="mt-3 font-tight text-xl font-semibold leading-snug text-ink">
                Book a 30-minute call. We will tell you what to build first.
              </p>
            </div>
            <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              Book a call
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose, isAuthenticated }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto bg-white sm:top-[4.5rem] lg:hidden"
        >
          <nav className="px-4 pb-10 pt-4 sm:px-6">
            {Object.entries(MENUS).map(([key, menu]) => (
              <div key={key} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === key ? null : key)}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-ink"
                  aria-expanded={expanded === key}
                >
                  {menu.label}
                  <ChevronDown className={cn('h-5 w-5 transition-transform', expanded === key && 'rotate-180')} />
                </button>
                {expanded === key && (
                  <div className="grid gap-1 pb-4">
                    {menu.all && (
                      <Link to={menu.all.to} onClick={onClose} className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink">
                        {menu.all.label}
                      </Link>
                    )}
                    {menu.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className="rounded-xl px-3 py-2.5 text-[15px] text-ink-soft hover:bg-paper"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {PLAIN_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={onClose} className="block border-b border-line py-4 text-lg font-semibold text-ink">
                {l.label}
              </Link>
            ))}
            <div className="mt-8 grid gap-3">
              <Link to="/book-audit" onClick={onClose} className="site-btn-primary w-full">
                Book a call <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={isAuthenticated ? APP_HOME : '/login'} onClick={onClose} className="site-btn-secondary w-full">
                {isAuthenticated ? 'Open app' : 'Client log in'}
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MarketingNav({ tone = 'light' }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const open = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const isActive = (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);
  const triggerActive = {
    services: isActive('/services'),
    solutions: isActive('/solutions'),
    company: ['/about', '/case-studies', '/faq', '/blog', '/contact'].some(isActive),
  };

  const solid = scrolled || openMenu || mobileOpen;
  const dark = tone === 'dark' && !solid;

  const linkBase =
    'inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[14.5px] font-medium transition-colors xl:px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500';

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid ? 'border-b border-line bg-white/95 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      )}
      onMouseLeave={scheduleClose}
    >
      <div className={cn('mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8', MARKETING_NAV_HEIGHT_CLASS)}>
        <SiteLogo onDark={dark} />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {Object.entries(MENUS).map(([key, menu]) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => open(key)}
              onClick={() => setOpenMenu(openMenu === key ? null : key)}
              aria-expanded={openMenu === key}
              className={cn(
                linkBase,
                dark
                  ? triggerActive[key]
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white'
                  : openMenu === key || triggerActive[key]
                    ? 'bg-paper text-ink'
                    : 'text-ink-soft hover:text-ink'
              )}
            >
              {menu.label}
              <ChevronDown className={cn('h-3.5 w-3.5 opacity-60 transition-transform', openMenu === key && 'rotate-180')} />
            </button>
          ))}
          {PLAIN_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onMouseEnter={scheduleClose}
              className={cn(
                linkBase,
                dark
                  ? isActive(l.to)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white'
                  : isActive(l.to)
                    ? 'bg-paper text-ink'
                    : 'text-ink-soft hover:text-ink'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to={isAuthenticated ? APP_HOME : '/login'}
            className={cn(
              'inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[14.5px] font-medium transition-colors',
              dark ? 'text-white/70 hover:text-white' : 'text-ink-soft hover:text-ink'
            )}
          >
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <Link
            to="/book-audit"
            className={cn(dark ? 'site-btn-zest' : 'site-btn-primary', 'group !h-11 !px-5 !text-[14.5px]')}
          >
            Book a call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden',
            dark ? 'border-white/20 bg-white/5 text-white' : 'border-line bg-white text-ink'
          )}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="hidden lg:block" onMouseEnter={() => clearTimeout(closeTimer.current)}>
        <AnimatePresence>
          {openMenu && <MegaPanel key={openMenu} menuKey={openMenu} onNavigate={() => setOpenMenu(null)} />}
        </AnimatePresence>
      </div>

    </header>
    <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isAuthenticated={isAuthenticated} />
    </>
  );
}

export { APP_HOME } from '@/lib/routes';
