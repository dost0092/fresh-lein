import { cn } from '@/lib/utils';

const STYLES = {
  live: 'bg-primary/10 text-primary border-primary/20',
  partial: 'bg-amber-50 text-amber-800 border-amber-200',
  soon: 'bg-muted text-muted-foreground border-border',
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
