import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Bookmark, Code2, Database, Gavel, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/landing/StatusBadge';
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
    title: 'Web App',
    description: 'Search, map, and monitor distressed properties with 50+ filters and property detail.',
    href: '/dashboard/foreclosures',
    status: 'live',
  },
  {
    icon: Code2,
    title: 'REST API',
    description: 'Programmatic access to normalized foreclosure, probate, and lien data.',
    href: '/api',
    status: 'live',
  },
  {
    icon: Database,
    title: 'Bulk Export & Feeds',
    description: 'CSV exports and warehouse-ready data feeds for teams and data ops.',
    href: '/pricing',
    status: 'partial',
  },
  {
    icon: Bell,
    title: 'County Alerts',
    description: 'Email notifications when new filings hit your target counties or criteria.',
    href: '/dashboard/alerts',
    status: 'live',
  },
  {
    icon: Bookmark,
    title: 'Saved Properties',
    description: 'Bookmark deals, track sale dates, and build your acquisition pipeline.',
    href: '/dashboard/saved',
    status: 'live',
  },
];

const USE_CASES = [
  { label: 'Fix-and-flip investors', href: '/#use-cases' },
  { label: 'Wholesalers', href: '/#use-cases' },
  { label: 'Real estate attorneys', href: '/#use-cases' },
  { label: 'Mortgage servicers', href: '/#use-cases' },
  { label: 'Hard money lenders', href: '/#use-cases' },
  { label: 'Hedge funds / PE', href: '/#use-cases' },
  { label: 'Probate professionals', href: '/#use-cases' },
];

function ProductLink({ icon: Icon, title, description, href, status, onNavigate }) {
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
        <p className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
          {title}
          <StatusBadge status={status} className="normal-case" />
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
          Platform
        </p>
        <div className="space-y-1">
          {PRODUCTS.map((item) => (
            <ProductLink key={item.title} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Use cases
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
            Market insights
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Weekly foreclosure pulse, top distressed ZIPs, and auction trends.
          </p>
          <Link
            to="/#insights"
            onClick={onNavigate}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View insights →
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
            Platform
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(calc(100vw-2rem),720px)] overflow-hidden rounded-xl border border-border bg-white shadow-xl">
              <ProductsMegaMenuPanel />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export { PRODUCTS, USE_CASES };
