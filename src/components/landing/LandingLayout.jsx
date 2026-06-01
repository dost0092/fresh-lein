import { cn } from '@/lib/utils';

/** Single content width for every landing section (aligned with hero). */
export const LANDING_MAX = 'max-w-7xl';
export const LANDING_PAD = 'px-4 sm:px-6 lg:px-8';

export function LandingContainer({ children, className, innerClassName }) {
  return (
    <div className={cn('w-full', LANDING_PAD, className)}>
      <div className={cn('mx-auto w-full', LANDING_MAX, innerClassName)}>{children}</div>
    </div>
  );
}

export function LandingEyebrow({ children, className }) {
  return (
    <div className={cn('mb-3 flex items-center gap-2.5', className)}>
      <span className="h-4 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
        {children}
      </span>
    </div>
  );
}

export function LandingSectionHeader({ eyebrow, title, description, className, align = 'left' }) {
  return (
    <div
      className={cn(
        'mb-8 lg:mb-10',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        align === 'left' && 'max-w-2xl',
        className
      )}
    >
      {eyebrow && (
        <LandingEyebrow className={align === 'center' ? 'justify-center' : undefined}>
          {eyebrow}
        </LandingEyebrow>
      )}
      <h2 className="font-display text-xl font-semibold text-foreground lg:text-2xl">{title}</h2>
      {description && (
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</div>
      )}
    </div>
  );
}
