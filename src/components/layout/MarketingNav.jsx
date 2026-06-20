import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LANDING_MAX,
  LANDING_PAD,
  MARKETING_NAV_HEIGHT_CLASS,
} from '@/components/landing/LandingLayout';
import { PlatformMenu, ProductsMegaMenuPanel } from '@/components/layout/ProductsMegaMenu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import FreshLienLogo, { HOME_PATH } from '@/components/brand/FreshLienLogo';
import { APP_HOME } from '@/lib/routes';

const navLinkClass =
  'inline-flex items-center rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 transition-colors hover:text-primary';

function NavDivider() {
  return <span className="mx-1 hidden h-6 w-px bg-border/80 lg:block" aria-hidden />;
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
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border/80 px-1.5 py-1 text-sm outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary/20">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {initial}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {profile?.email && (
          <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">{profile.email}</p>
        )}
        <DropdownMenuItem asChild>
          <Link to={APP_HOME} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Open app
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={HOME_PATH} className="cursor-pointer">Homepage</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="cursor-pointer">Pricing</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({ open, onOpenChange }) {
  const close = () => onOpenChange(false);
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate('/login', { replace: true });
  };

  const linkClass = (path) =>
    cn(
      'rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-neutral-50',
      location.pathname === path ? 'text-primary' : 'text-foreground'
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="rounded-md p-2 text-primary hover:bg-neutral-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw,320px)]">
        <SheetHeader className="border-b border-border pb-4">
          <FreshLienLogo to={HOME_PATH} variant="nav" onClick={close} />
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-0.5 border-b border-border pb-5">
          <Link to={HOME_PATH} onClick={close} className={linkClass(HOME_PATH)}>Home</Link>
          <Link to="/pricing" onClick={close} className={linkClass('/pricing')}>Pricing</Link>
          <Link to="/about" onClick={close} className={linkClass('/about')}>About</Link>
          <Link to={APP_HOME} onClick={close} className={linkClass(APP_HOME)}>
            {isAuthenticated ? 'Open app' : 'Preview live data'}
          </Link>
        </nav>
        <div className="mt-5">
          <ProductsMegaMenuPanel onNavigate={close} />
        </div>
        <div className="mt-6 border-t border-border pt-5">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-md px-3 py-2.5 text-left text-[15px] font-medium text-destructive hover:bg-destructive/5"
            >
              Sign out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild className="h-11 w-full justify-center text-[15px] font-semibold">
                <Link to="/login" onClick={close}>Sign in</Link>
              </Button>
              <Button asChild className="h-11 w-full justify-center text-[15px] font-semibold">
                <Link to="/register" onClick={close}>Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function MarketingNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pricingActive = location.pathname === '/pricing';
  const aboutActive = location.pathname === '/about';

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-white">
      <div className={cn('w-full', LANDING_PAD)}>
        <div className={cn('mx-auto flex items-center justify-between gap-4', MARKETING_NAV_HEIGHT_CLASS, LANDING_MAX)}>
          <FreshLienLogo to={HOME_PATH} variant="nav" />

          <div className="flex min-w-0 flex-1 items-center justify-end gap-0">
            <nav className="hidden items-center lg:flex lg:pr-5 lg:mr-5 lg:border-r lg:border-border/70">
              <PlatformMenu triggerClassName="text-[15px] font-medium text-primary/90 hover:text-primary px-3" />
              <NavDivider />
              <Link
                to="/pricing"
                className={cn(navLinkClass, pricingActive && 'font-semibold text-primary')}
              >
                Pricing
              </Link>
              <NavDivider />
              <Link
                to="/about"
                className={cn(navLinkClass, aboutActive && 'font-semibold text-primary')}
              >
                About
              </Link>
            </nav>

            <div className="hidden items-center gap-4 lg:flex">
              {isAuthenticated ? (
                <>
                  <Button asChild className="h-10 rounded-md px-5 text-[15px] font-semibold shadow-none">
                    <Link to={APP_HOME}>Open app</Link>
                  </Button>
                  <UserMenu />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[15px] font-medium text-primary/90 transition-colors hover:text-primary"
                  >
                    Sign in
                  </Link>
                  <Button asChild className="h-10 rounded-md px-5 text-[15px] font-semibold shadow-none">
                    <Link to="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>

            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}

export { APP_HOME } from '@/lib/routes';
