import { cn } from '@/lib/utils';

const STYLES = {
  live: 'bg-neutral-100 text-primary border-neutral-200',
  partial: 'bg-amber-50 text-amber-800 border-amber-200',
  soon: 'bg-neutral-50 text-muted-foreground border-border',
};

const LABELS = {
  live: 'Live',
  partial: 'Beta',
  soon: 'Coming soon',
};

export default function StatusBadge({ status = 'live', className }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        STYLES[status] ?? STYLES.soon,
        className
      )}
    >
      {LABELS[status] ?? LABELS.soon}
    </span>
  );
}
