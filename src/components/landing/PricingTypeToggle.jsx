import { cn } from '@/lib/utils';
import { LayoutGrid, Code2 } from 'lucide-react';

export default function PricingTypeToggle({ value, onChange }) {
  return (
    <div
      className="mx-auto mb-8 inline-flex rounded-lg border border-border bg-muted/40 p-1"
      role="tablist"
      aria-label="Pricing type"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'platform'}
        onClick={() => onChange('platform')}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
          value === 'platform'
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Platform pricing
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'api'}
        onClick={() => onChange('api')}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
          value === 'api'
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Code2 className="h-4 w-4" />
        API pricing
      </button>
    </div>
  );
}
