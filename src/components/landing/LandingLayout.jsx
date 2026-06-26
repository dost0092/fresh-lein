import { cn } from '@/lib/utils';
import { coverageIntroTitleClass, coverageIntroSubtitleClass } from '@/components/landing/CoverageStats';

export const LANDING_MAX = 'max-w-7xl';
export const LANDING_PAD = 'px-4 sm:px-6 lg:px-8';
export const LANDING_SECTION = 'py-16 lg:py-24';

/** Fixed marketing header height — keep in sync with MarketingNav */
export const MARKETING_NAV_HEIGHT_CLASS = 'h-[4.25rem] sm:h-[4.5rem]';
export const MARKETING_NAV_OFFSET_CLASS = 'pt-[4.25rem] sm:pt-[4.5rem]';

export const highlightMarkStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
        'mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary',
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
        'mb-10 lg:mb-12',
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
      <h2 className={coverageIntroTitleClass}>
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
        <p className={cn(coverageIntroSubtitleClass, align === 'center' && 'mx-auto')}>{description}</p>
      )}
    </div>
  );
}
