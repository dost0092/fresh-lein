import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LANDING_MAX,
  LANDING_PAD,
  MARKETING_NAV_HEIGHT_CLASS,
} from '@/components/landing/LandingLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import FreshLienLogo, { HOME_PATH } from '@/components/brand/FreshLienLogo';
import { APP_HOME } from '@/lib/routes';
import { SOLUTIONS } from '@/data/solutionsContent';

const navLinkClass =
  'inline-flex items-center rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 transition-colors hover:text-primary';

const MAIN_LINKS = [
  { label: 'Platform', href: '/platform' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SolutionsMenu({ triggerClassName }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:text-primary',
          triggerClassName
        )}
      >
        Solutions
        <ChevronDown className="h-4 w-4 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-80 rounded-xl p-2">
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-neutral-50">
          <Link to="/solutions" className="block px-3 py-2.5">
            <span className="block text-sm font-semibold text-foreground">All solutions</span>
            <span className="block text-xs text-muted-foreground">Deal lifecycle overview</span>
          </Link>
        </DropdownMenuItem>
        {SOLUTIONS.map((s) => (
          <DropdownMenuItem key={s.id} asChild className="cursor-pointer rounded-lg p-0 focus:bg-neutral-50">
            <Link to={s.href} className="block px-3 py-2.5">
              <span className="block text-sm font-semibold text-foreground">{s.name}</span>
              <span className="block text-xs leading-snug text-muted-foreground line-clamp-2">
                {s.description}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ResourcesMenu({ triggerClassName }) {
  const links = [
    { label: 'Case Studies', href: '/case-studies', desc: 'Illustrative workflows and architectures' },
    { label: 'Resources', href: '/resources', desc: 'Guides and upcoming articles' },
    { label: 'FAQ', href: '/faq', desc: 'Common questions' },
    { label: 'Blog', href: '/blog', desc: 'Product and market notes' },
    { label: 'API docs', href: '/api', desc: 'REST endpoints for filings' },
    { label: 'Contact', href: '/contact', desc: 'General inquiries' },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:text-primary',
          triggerClassName
        )}
      >
        Resources
        <ChevronDown className="h-4 w-4 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-72 rounded-xl p-2">
        {links.map((l) => (
          <DropdownMenuItem key={l.href} asChild className="cursor-pointer rounded-lg p-0 focus:bg-neutral-50">
            <Link to={l.href} className="block px-3 py-2.5">
              <span className="block text-sm font-semibold text-foreground">{l.label}</span>
              <span className="block text-xs text-muted-foreground">{l.desc}</span>
            </Link>
          </DropdownMenuItem>
        ))}
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
      location.pathname === path || location.pathname.startsWith(`${path}/`)
        ? 'text-primary'
        : 'text-foreground'
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
          {MAIN_LINKS.map((l) => (
            <Link key={l.href} to={l.href} onClick={close} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <Link to="/solutions" onClick={close} className={linkClass('/solutions')}>Solutions</Link>
          {SOLUTIONS.map((s) => (
            <Link key={s.id} to={s.href} onClick={close} className="rounded-md px-3 py-2 pl-6 text-sm text-muted-foreground hover:bg-neutral-50">
              {s.name}
            </Link>
          ))}
          <Link to="/case-studies" onClick={close} className={linkClass('/case-studies')}>Case Studies</Link>
          <Link to="/resources" onClick={close} className={linkClass('/resources')}>Resources</Link>
          <Link to="/book-audit" onClick={close} className={linkClass('/book-audit')}>Book an Audit</Link>
          <Link to={APP_HOME} onClick={close} className={linkClass(APP_HOME)}>
            {isAuthenticated ? 'Open app' : 'Preview live data'}
          </Link>
        </nav>
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
                <Link to="/login" onClick={close}>Log in</Link>
              </Button>
              <Button asChild className="fl-btn-primary h-11 w-full justify-center">
                <Link to="/book-audit" onClick={close}>Book a Workflow Audit</Link>
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

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-sm">
      <div className={cn('w-full', LANDING_PAD)}>
        <div className={cn('mx-auto flex items-center justify-between gap-4', MARKETING_NAV_HEIGHT_CLASS, LANDING_MAX)}>
          <FreshLienLogo to={HOME_PATH} variant="nav" />

          <div className="flex min-w-0 flex-1 items-center justify-end gap-0">
            <nav className="hidden items-center gap-0.5 lg:flex lg:pr-5 lg:mr-5 lg:border-r lg:border-border/70">
              <Link
                to="/platform"
                className={cn(navLinkClass, location.pathname === '/platform' && 'font-semibold text-primary')}
              >
                Platform
              </Link>
              <SolutionsMenu />
              <Link
                to="/services"
                className={cn(navLinkClass, location.pathname === '/services' && 'font-semibold text-primary')}
              >
                Services
              </Link>
              <Link
                to="/how-it-works"
                className={cn(navLinkClass, location.pathname === '/how-it-works' && 'font-semibold text-primary')}
              >
                How It Works
              </Link>
              <ResourcesMenu />
              <Link
                to="/pricing"
                className={cn(navLinkClass, location.pathname === '/pricing' && 'font-semibold text-primary')}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className={cn(navLinkClass, location.pathname === '/about' && 'font-semibold text-primary')}
              >
                About
              </Link>
            </nav>

            <div className="hidden items-center gap-4 lg:flex">
              {isAuthenticated ? (
                <>
                  <Link to={APP_HOME} className="text-[15px] font-medium text-primary/90 hover:text-primary">
                    Open app
                  </Link>
                  <Link to="/book-audit" className="fl-btn-primary h-10 px-5">
                    Book a Workflow Audit
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[15px] font-medium text-primary/90 transition-colors hover:text-primary"
                  >
                    Log in
                  </Link>
                  <Button asChild className="fl-btn-primary h-10 px-5 shadow-none">
                    <Link to="/book-audit">Book a Workflow Audit</Link>
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
