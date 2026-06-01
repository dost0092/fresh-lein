import { cn } from '@/lib/utils';

export const LANDING_MAX = 'max-w-7xl';
export const LANDING_PAD = 'px-4 sm:px-6 lg:px-8';

export const highlightMarkStyle = {
  backgroundColor: 'rgba(19, 81, 51, 0.14)',
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
};

export function LandingContainer({ children, className, innerClassName }) {
  return (
    <div className={cn('w-full', LANDING_PAD, className)}>
      <div className={cn('mx-auto w-full', LANDING_MAX, innerClassName)}>{children}</div>
    </div>
  );
}

export function LandingEyebrow({ children, className }) {
  return (
    <p
      className={cn(
        'mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary',
        className
      )}
    >
      {children}
    </p>
  );
}

export function LandingSectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  className,
  align = 'left',
}) {
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
        <LandingEyebrow className={align === 'center' ? 'text-center' : undefined}>
          {eyebrow}
        </LandingEyebrow>
      )}
      <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.75rem] lg:text-[2rem]">
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span
              className="inline box-decoration-clone rounded-sm px-1.5 py-0.5 text-primary"
              style={highlightMarkStyle}
            >
              {titleHighlight}
            </span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
