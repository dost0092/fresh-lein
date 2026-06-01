import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bell, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const productLinks = [
  { label: 'Foreclosures', href: '/dashboard/foreclosures', soon: false },
  { label: 'Pre-Foreclosures', href: '/dashboard/pre-foreclosures', soon: true },
  { label: 'Probate', href: '/dashboard/probate', soon: true },
  { label: 'Tax Delinquency', href: '/dashboard/tax', soon: true },
];

function ProductsDropdown({ onNavigate, align = 'start' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-2'
        )}
      >
        Products
        <ChevronDown className="w-4 h-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        {productLinks.map(({ label, href, soon }) =>
          soon ? (
            <DropdownMenuItem key={label} disabled className="text-xs opacity-60">
              {label}
              <span className="ml-auto text-[10px] font-semibold uppercase text-muted-foreground">Soon</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={label} asChild>
              <Link to={href} onClick={onNavigate} className="cursor-pointer text-sm w-full">
                {label}
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw,320px)]">
        <SheetHeader>
          <SheetTitle className="text-left text-base">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-2">
            Products
          </p>
          {productLinks.map(({ label, href, soon }) =>
            soon ? (
              <div
                key={label}
                className="flex items-center justify-between px-3 py-2.5 text-sm text-muted-foreground"
              >
                {label}
                <span className="text-[10px] font-semibold uppercase">Soon</span>
              </div>
            ) : (
              <Link
                key={label}
                to={href}
                onClick={() => onOpenChange(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted"
              >
                {label}
              </Link>
            )
          )}
          <div className="h-px bg-border my-3" />
          <Link
            to="/#pricing"
            onClick={() => onOpenChange(false)}
            className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted"
          >
            Pricing
          </Link>
          <Link
            to="/dashboard/alerts"
            onClick={() => onOpenChange(false)}
            className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted flex items-center gap-2"
          >
            <Bell className="w-4 h-4" /> Alerts
          </Link>
          <div className="h-px bg-border my-3" />
          <Link
            to="/login"
            onClick={() => onOpenChange(false)}
            className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => onOpenChange(false)}
            className="mx-3 mt-2 text-center bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg"
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

  const pricingActive = location.hash === '#pricing' || location.pathname.includes('pricing');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-border backdrop-blur-md shadow-sm',
        'transition-transform duration-300 ease-out will-change-transform',
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
        <div className="h-14 lg:h-16 flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 min-w-[140px]">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xs lg:text-sm">FL</span>
            </div>
            <span className="font-heading font-semibold text-foreground text-base lg:text-lg tracking-tight hidden sm:inline">
              FreshLien
            </span>
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-10 xl:gap-14">
            <ProductsDropdown />
            <Link
              to="/#pricing"
              className={cn(
                'text-sm font-medium transition-colors py-2',
                pricingActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              )}
            >
              Pricing
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 min-w-[140px] lg:min-w-[280px]">
            <Link
              to="/dashboard/alerts"
              className="p-2 rounded-lg text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
              title="Alerts"
              aria-label="Alerts"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium text-foreground/80 hover:text-primary px-3 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-sm transition-colors"
            >
              Sign Up <ArrowRight className="w-4 h-4" />
            </Link>

            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
