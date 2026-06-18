import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Bot, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { LANDING_MAX, LANDING_PAD } from '@/components/landing/LandingLayout';
import ProductsMegaMenu, { ProductsMegaMenuPanel } from '@/components/layout/ProductsMegaMenu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import FreshLienLogo from '@/components/brand/FreshLienLogo';
import { getGuestStartedAt } from '@/lib/guestAccess';

const navLinkClass =
  'py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground';

function FreshLienAiNavItem({ mobile }) {
  const badge = (
    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      Soon
    </span>
  );

  if (mobile) {
    return (
      <div className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2 font-medium">
          <Bot className="h-4 w-4 text-primary/70" />
          FreshLien AI
        </span>
        {badge}
      </div>
    );
  }

  return (
    <span
      className={cn(navLinkClass, 'inline-flex cursor-default items-center gap-1.5 text-foreground/55')}
      title="FreshLien AI — coming soon"
    >
      <Bot className="h-4 w-4 text-primary/60" />
      FreshLien AI
      {badge}
    </span>
  );
}

function UserMenu() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const initial = (profile?.full_name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 text-sm font-medium outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/30">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">{profile?.email}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/foreclosures" className="cursor-pointer">
            Foreclosures
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="cursor-pointer">
            Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({ open, onOpenChange }) {
  const close = () => onOpenChange(false);
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw,360px)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-base">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 border-t border-border pt-4">
          <ProductsMegaMenuPanel onNavigate={close} className="grid-cols-1 gap-6 p-0" />
        </div>
        <nav className="mt-6 flex flex-col gap-0.5 border-t border-border pt-4">
          <Link to="/dashboard" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Dashboard
          </Link>
          <FreshLienAiNavItem mobile />
          <Link to="/pricing" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Pricing
          </Link>
          <Link to="/about" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            About
          </Link>
          <Link to="/contact" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Contact
          </Link>
          <Link to="/faq" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            FAQ
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/alerts"
                onClick={close}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Bell className="h-4 w-4" /> Alerts
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
                Login
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="mx-0 mt-2 rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function MarketingNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const headerVisible = useScrollHeader();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasGuestSession = Boolean(getGuestStartedAt());
  const homeHref = isAuthenticated || hasGuestSession ? '/dashboard' : '/';
  const pricingActive =
    location.pathname === '/pricing' ||
    location.hash === '#pricing' ||
    location.hash === '#pricing-api';
  const aboutActive = location.pathname === '/about';
  const contactActive = location.pathname === '/contact';
  const dashboardActive = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b border-primary/10 bg-[#f6f9f7]/95 shadow-sm backdrop-blur-md',
        'transition-transform duration-300 ease-out will-change-transform',
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className={cn('w-full', LANDING_PAD)}>
        <div className={cn('mx-auto flex h-[3.75rem] items-center justify-between gap-4 lg:h-[4.25rem]', LANDING_MAX)}>
          <FreshLienLogo to={homeHref} variant="nav" />

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-10">
            <ProductsMegaMenu />
            <Link to="/dashboard" className={cn(navLinkClass, dashboardActive && 'font-semibold text-primary')}>
              Dashboard
            </Link>
            <FreshLienAiNavItem />
            <Link to="/pricing" className={cn(navLinkClass, pricingActive && 'font-semibold text-primary')}>
              Pricing
            </Link>
            <Link to="/about" className={cn(navLinkClass, aboutActive && 'font-semibold text-primary')}>
              About
            </Link>
            <Link to="/contact" className={cn(navLinkClass, contactActive && 'font-semibold text-primary')}>
              Contact
            </Link>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <Link
              to="/dashboard/alerts"
              className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-primary/5 hover:text-primary"
              title="Alerts"
              aria-label="Alerts"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/foreclosures"
                  className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex lg:py-2.5"
                >
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="hidden sm:block">
                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard/foreclosures"
                  className="hidden items-center gap-1.5 rounded-lg border border-primary/25 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 sm:inline-flex lg:py-2.5"
                >
                  Try dashboard
                </Link>
                <Link
                  to="/login"
                  className="hidden px-2 py-2 text-sm font-medium text-foreground/80 hover:text-primary sm:inline-flex lg:px-3"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex lg:py-2.5"
                >
                  Sign Up <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
