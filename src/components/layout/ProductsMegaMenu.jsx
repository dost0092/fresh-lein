import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Code2,
  Gavel,
  Map,
  Bell,
  Download,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Mail,
  BarChart3,
  Newspaper,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PRODUCT_LINKS = [
  {
    icon: Gavel,
    label: 'Search & map',
    description: 'Live foreclosure filings with map and filters',
    href: '/dashboard/foreclosures',
  },
  {
    icon: Code2,
    label: 'REST API',
    description: 'Pull normalized filing data into your stack',
    href: '/api',
  },
  {
    icon: Bell,
    label: 'County alerts',
    description: 'Get notified when new filings match',
    href: '/dashboard/alerts',
  },
  {
    icon: Download,
    label: 'Bulk export',
    description: 'Download filtered results as CSV',
    href: '/pricing',
  },
  {
    icon: Map,
    label: 'Data coverage',
    description: 'Counties, states, and freshness',
    href: '/#coverage',
  },
];

const RESOURCE_LINKS = [
  {
    icon: Newspaper,
    label: 'Blog',
    description: 'Foreclosure & distressed property guides',
    href: '/blog',
  },
  {
    icon: BookOpen,
    label: 'API documentation',
    description: 'Endpoints, auth, and examples',
    href: '/api',
  },
  {
    icon: BarChart3,
    label: 'Coverage dashboard',
    description: 'Where we have data, county by county',
    href: '/#coverage',
  },
  {
    icon: HelpCircle,
    label: 'FAQ',
    description: 'Common questions about the data',
    href: '/faq',
  },
  {
    icon: ShieldCheck,
    label: 'Security',
    description: 'How we handle public records and access',
    href: '/security',
  },
  {
    icon: Mail,
    label: 'Contact sales',
    description: 'Talk to us about teams and volume',
    href: '/contact',
  },
];

function MegaMenu({ label, links, onNavigate, triggerClassName }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:text-primary',
          triggerClassName
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-200 data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-80 rounded-xl p-2">
        {links.map(({ icon: Icon, label: itemLabel, description, href }) => (
          <DropdownMenuItem
            key={`${label}-${href}-${itemLabel}`}
            asChild
            className="cursor-pointer rounded-lg p-0 focus:bg-neutral-50"
          >
            <Link to={href} onClick={onNavigate} className="flex gap-3 px-3 py-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{itemLabel}</span>
                <span className="block text-xs leading-snug text-muted-foreground">{description}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProductMenu({ onNavigate, triggerClassName }) {
  return (
    <MegaMenu label="Product" links={PRODUCT_LINKS} onNavigate={onNavigate} triggerClassName={triggerClassName} />
  );
}

export function ResourcesMenu({ onNavigate, triggerClassName }) {
  return (
    <MegaMenu label="Resources" links={RESOURCE_LINKS} onNavigate={onNavigate} triggerClassName={triggerClassName} />
  );
}

/** @deprecated Use ProductMenu */
export function PlatformMenu(props) {
  return <ProductMenu {...props} />;
}

function MobileLinkGroup({ title, links, onNavigate }) {
  return (
    <div>
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-1">
        {links.map(({ icon: Icon, label, description, href }) => (
          <Link
            key={`${title}-${href}-${label}`}
            to={href}
            onClick={onNavigate}
            className="flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-50"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{label}</span>
              <span className="block text-xs leading-snug text-muted-foreground">{description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProductsMegaMenuPanel({ onNavigate, className }) {
  return (
    <div className={cn('space-y-6', className)}>
      <MobileLinkGroup title="Product" links={PRODUCT_LINKS} onNavigate={onNavigate} />
      <MobileLinkGroup title="Resources" links={RESOURCE_LINKS} onNavigate={onNavigate} />
    </div>
  );
}

export default function ProductsMegaMenu() {
  return <ProductMenu />;
}

export { PRODUCT_LINKS, RESOURCE_LINKS };
