import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Bookmark, Code2, Gavel, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const PRODUCTS = [
  {
    icon: Gavel,
    title: 'The Foreclosure Platform',
    description: 'Live county court filings, map view, filters, and full case details.',
    href: '/dashboard/foreclosures',
  },
  {
    icon: Code2,
    title: 'The Foreclosure APIs',
    description: 'REST endpoints for programmatic access to lien and auction data.',
    href: '/api',
  },
  {
    icon: Bell,
    title: 'County Alerts',
    description: 'Email notifications when new filings hit your target counties.',
    href: '/dashboard/alerts',
  },
  {
    icon: Bookmark,
    title: 'Saved Properties',
    description: 'Bookmark deals, track sale dates, and build your pipeline.',
    href: '/dashboard/saved',
  },
];

const USE_CASES = [
  { label: 'Real Estate Investors', href: '/register' },
  { label: 'Wholesalers', href: '/register' },
  { label: 'Mortgage Servicers', href: '/register' },
  { label: 'Real Estate Attorneys', href: '/register' },
];

function ProductLink({ icon: Icon, title, description, href, onNavigate }) {
  return (
    <Link
      to={href}
      onClick={onNavigate}
      className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
          {title}
          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export function ProductsMegaMenuPanel({ onNavigate, className }) {
  return (
    <div className={cn('grid gap-8 p-6 md:grid-cols-[1.4fr_1fr]', className)}>
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Products
        </p>
        <div className="space-y-1">
          {PRODUCTS.map((item) => (
            <ProductLink key={item.title} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Use Cases
        </p>
        <ul className="space-y-2.5">
          {USE_CASES.map(({ label, href }) => (
            <li key={label}>
              <Link
                to={href}
                onClick={onNavigate}
                className="text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-lg border border-border/80 bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LineChart className="h-4 w-4 text-primary" />
            Market Analytics
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            County trends, auction volume, and equity signals — included on Pro.
          </p>
          <Link
            to="/analytics"
            onClick={onNavigate}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View analytics →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductsMegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'h-auto bg-transparent py-2 text-sm font-medium text-foreground/80',
              'hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent'
            )}
          >
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(calc(100vw-2rem),680px)] overflow-hidden rounded-xl border border-border bg-white shadow-xl">
              <ProductsMegaMenuPanel />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export { PRODUCTS, USE_CASES };
