import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Foreclosures', href: '/dashboard/foreclosures' },
  { label: 'Saved', href: '/dashboard/saved' },
  { label: 'Alerts', href: '/dashboard/alerts' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function MarketingNav() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-border backdrop-blur-sm shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xs">FL</span>
          </div>
          <span className="font-heading font-semibold text-foreground text-base tracking-tight">FreshLien</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map(({ label, href }) => {
            const active =
              location.pathname === href ||
              (href !== '/' && href !== '/#pricing' && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  'text-xs font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="text-xs font-medium text-muted-foreground hover:text-primary px-2.5 py-1.5"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-3 py-1.5 rounded-md text-xs transition-colors"
          >
            Sign Up <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}
