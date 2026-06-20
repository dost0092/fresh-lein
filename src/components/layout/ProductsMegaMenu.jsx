import { Link } from 'react-router-dom';
import { ChevronDown, Code2, Gavel, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PLATFORM_LINKS = [
  {
    icon: Gavel,
    label: 'Search & map',
    description: 'Live foreclosure data with filters',
    href: '/dashboard/foreclosures',
  },
  {
    icon: Code2,
    label: 'API',
    description: 'REST endpoints for integrations',
    href: '/api',
  },
  {
    icon: Map,
    label: 'Coverage',
    description: 'Counties, states & freshness',
    href: '/#coverage',
  },
];

export function PlatformMenu({ onNavigate, triggerClassName }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-primary/90 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20',
          triggerClassName
        )}
      >
        Platform
        <ChevronDown className="h-4 w-4 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-1.5">
        {PLATFORM_LINKS.map(({ icon: Icon, label, description, href }) => (
          <DropdownMenuItem key={href} asChild className="cursor-pointer rounded-md p-0 focus:bg-neutral-50">
            <Link to={href} onClick={onNavigate} className="flex gap-3 px-3 py-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-medium text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground">{description}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-md p-0 focus:bg-neutral-50">
          <Link to="/#use-cases" onClick={onNavigate} className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            View use cases →
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** @deprecated Use PlatformMenu — kept for mobile sheet compatibility */
export function ProductsMegaMenuPanel({ onNavigate, className }) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Platform</p>
      {PLATFORM_LINKS.map(({ icon: Icon, label, description, href }) => (
        <Link
          key={href}
          to={href}
          onClick={onNavigate}
          className="flex gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-neutral-50"
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-medium text-foreground">{label}</span>
            <span className="block text-xs text-muted-foreground">{description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function ProductsMegaMenu() {
  return <PlatformMenu />;
}

export { PLATFORM_LINKS };
