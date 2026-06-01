import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bell, Bot, ChevronDown, Code2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { LANDING_MAX, LANDING_PAD } from '@/components/landing/LandingLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const platformProducts = [
  { label: 'Foreclosures', href: '/dashboard/foreclosures', soon: false },
  { label: 'Pre-Foreclosures', href: '/dashboard/pre-foreclosures', soon: true },
  { label: 'Probate', href: '/dashboard/probate', soon: true },
  { label: 'Tax Delinquency', href: '/dashboard/tax', soon: true },
];

function SoonBadge() {
  return (
    <span className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      Soon
    </span>
  );
}

const navLinkClass =
  'py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground';

function PlatformProductItems({ mobile, onNavigate }) {
  return platformProducts.map(({ label, href, soon }) =>
    soon ? (
      <div
        key={label}
        className={
          mobile
            ? 'flex items-center justify-between px-3 py-2.5 text-sm text-muted-foreground'
            : 'flex text-sm opacity-60'
        }
      >
        {label}
        <SoonBadge />
      </div>
    ) : mobile ? (
      <Link key={label} to={href} onClick={onNavigate} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
        {label}
      </Link>
    ) : (
      <DropdownMenuItem key={label} asChild>
        <Link to={href} className="cursor-pointer text-sm">
          {label}
        </Link>
      </DropdownMenuItem>
    )
  );
}

function ProductsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          navLinkClass,
          'flex items-center gap-1 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
        )}
      >
        Products
        <ChevronDown className="h-4 w-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Platform
        </DropdownMenuLabel>
        <PlatformProductItems />

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          API
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/#pricing-api" className="flex cursor-pointer items-center gap-2 text-sm">
            <Code2 className="h-3.5 w-3.5 text-primary/70" />
            REST API
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FreshLienAiNavItem({ mobile }) {
  if (mobile) {
    return (
      <div className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2 font-medium">
          <Bot className="h-4 w-4 text-primary/70" />
          FreshLien AI
        </span>
        <SoonBadge />
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
      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Soon
      </span>
    </span>
  );
}

function MobileNav({ open, onOpenChange }) {
  const close = () => onOpenChange(false);

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
      <SheetContent side="right" className="w-[min(100vw,320px)]">
        <SheetHeader>
          <SheetTitle className="text-left text-base">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-0.5">
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Platform
          </p>
          <PlatformProductItems mobile onNavigate={close} />

          <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            API
          </p>
          <Link
            to="/#pricing-api"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <Code2 className="h-4 w-4 text-primary/70" />
            REST API
          </Link>

          <div className="my-3 h-px bg-border" />

          <Link to="/dashboard" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Dashboard
          </Link>
          <FreshLienAiNavItem mobile />
          <Link to="/#pricing" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Pricing
          </Link>

          <div className="my-3 h-px bg-border" />

          <Link
            to="/dashboard/alerts"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <Bell className="h-4 w-4" />
            Alerts
          </Link>
          <Link to="/login" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
            Login
          </Link>
          <Link
            to="/register"
            onClick={close}
            className="mx-3 mt-3 rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground"
          >
            Sign Up
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function MarketingNav() {
  const location = useLocation();
  const headerVisible = useScrollHeader();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pricingActive =
    location.hash === '#pricing' ||
    location.hash === '#pricing-api' ||
    location.pathname.includes('pricing');
  const dashboardActive = location.pathname.startsWith('/dashboard');

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur-md',
        'transition-transform duration-300 ease-out will-change-transform',
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className={cn('w-full', LANDING_PAD)}>
        <div className={cn('mx-auto flex h-14 items-center justify-between gap-4 lg:h-16', LANDING_MAX)}>
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:h-9 lg:w-9">
              <span className="font-heading text-xs font-bold text-primary-foreground lg:text-sm">FL</span>
            </div>
            <span className="hidden font-heading text-base font-semibold tracking-tight text-foreground sm:inline lg:text-lg">
              FreshLien
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-10">
            <ProductsDropdown />
            <Link to="/dashboard" className={cn(navLinkClass, dashboardActive && 'text-primary')}>
              Dashboard
            </Link>
            <FreshLienAiNavItem />
            <Link to="/#pricing" className={cn(navLinkClass, pricingActive && 'text-primary')}>
              Pricing
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
            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
