import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

const STATUS_ORDER = ['Appraisal', 'Scheduled', 'Sold', 'Cancelled'];

const statusStyles = {
  Appraisal: 'status-appraisal',
  Scheduled: 'status-scheduled',
  Sold: 'status-sold',
  Cancelled: 'status-cancelled',
};

export default function StatusTimeline({ history = [], currentStatus }) {
  const events = history.length
    ? history
    : STATUS_ORDER.map((s) => ({ status: s, status_date: null }));

  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((status, idx) => {
        const event = events.find((e) => e.status === status);
        const isPast = idx <= currentIdx;
        const isCurrent = status === currentStatus;

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isPast ? (
                <CheckCircle2 className={cn('w-5 h-5 shrink-0', isCurrent ? 'text-primary' : 'text-emerald-500')} />
              ) : (
                <Circle className="w-5 h-5 shrink-0 text-muted-foreground/30" />
              )}
              {idx < STATUS_ORDER.length - 1 && (
                <div className={cn('w-px flex-1 min-h-[2rem] my-1', isPast ? 'bg-primary/30' : 'bg-border')} />
              )}
            </div>
            <div className="pb-8 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-md border',
                    statusStyles[status] || 'bg-muted text-muted-foreground'
                  )}
                >
                  {status}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-primary">Current</span>
                )}
              </div>
              {event?.status_date && (
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(event.status_date), 'MMMM d, yyyy')}
                </p>
              )}
              {!event?.status_date && !isPast && (
                <p className="text-sm text-muted-foreground/50 mt-1">Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
