import { cn } from '@/lib/utils';
import { LayoutGrid, Code2 } from 'lucide-react';

export default function PricingTypeToggle({ value, onChange }) {
  return (
    <div
      className="mx-auto mb-10 w-full max-w-md rounded-xl border-2 border-border bg-white p-1.5 shadow-sm"
      role="tablist"
      aria-label="Pricing type"
    >
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          role="tab"
          aria-selected={value === 'platform'}
          onClick={() => onChange('platform')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition-all',
            value === 'platform'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted-foreground hover:bg-neutral-50 hover:text-foreground'
          )}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          Platform
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === 'api'}
          onClick={() => onChange('api')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition-all',
            value === 'api'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted-foreground hover:bg-neutral-50 hover:text-foreground'
          )}
        >
          <Code2 className="h-4 w-4 shrink-0" />
          API
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {value === 'platform' ? 'Web app plans for investors and teams' : 'REST API plans for developers'}
      </p>
    </div>
  );
}
