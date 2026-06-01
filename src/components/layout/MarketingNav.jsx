import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Foreclosures', href: '/dashboard/foreclosures' },
  { label: 'Saved Properties', href: '/dashboard/saved' },
  { label: 'Alerts', href: '/dashboard/alerts' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Account', href: '/settings' },
];

export default function MarketingNav({ variant = 'landing' }) {
  const location = useLocation();
  const isLanding = variant === 'landing';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md',
        isLanding
          ? 'bg-white/95 border-border shadow-nav'
          : 'bg-white border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#4257A7] rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">FL</span>
          </div>
          <span className="font-heading font-bold text-foreground text-xl tracking-tight">FreshLien</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-[#4257A7]',
                location.pathname === href || (href !== '/' && location.pathname.startsWith(href.replace('/#', '')))
                  ? 'text-[#4257A7]'
                  : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-[#4257A7] transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-[#4257A7] hover:bg-[#364a8f] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
          >
            Sign Up <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
