import { cn } from '@/lib/utils';

export const coverageIntroTitleClass =
  'font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-foreground sm:text-[2.25rem] lg:text-[2.6rem]';

export const coverageIntroSubtitleClass =
  'mt-4 max-w-2xl text-[1.0625rem] leading-[1.6] text-muted-foreground';

export const coverageStatLabelClass = 'text-sm font-medium leading-snug text-muted-foreground';

export const coverageStatValueClass =
  'mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-[2.75rem]';

export const coverageStatDetailClass = 'mt-2 text-xs leading-[1.55] text-muted-foreground';

export const coverageStatGridClass =
  'mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8';

export function CoverageSectionIntro({
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  subtitleClassName,
}) {
  return (
    <div
      className={cn(
        'mx-auto mb-10 max-w-3xl lg:mb-14',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2 className={cn(coverageIntroTitleClass, titleClassName)}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            coverageIntroSubtitleClass,
            align === 'center' && 'mx-auto',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CoverageStatItem({
  label,
  value,
  detail,
  align = 'center',
  loading = false,
  className,
}) {
  const alignClass =
    align === 'left'
      ? 'text-left'
      : align === 'right'
        ? 'text-right'
        : 'text-center sm:text-left lg:text-center';

  return (
    <div className={cn(alignClass, className)}>
      <p className={coverageStatLabelClass}>{label}</p>
      {loading ? (
        <div className="mt-2 h-10 w-28 animate-pulse rounded bg-muted" />
      ) : (
        <p className={coverageStatValueClass}>{value}</p>
      )}
      {detail && <p className={coverageStatDetailClass}>{detail}</p>}
    </div>
  );
}

export function CoverageStatsGrid({
  stats,
  loading = false,
  align = 'center',
  className,
  gridClassName,
}) {
  return (
    <div className={cn(coverageStatGridClass, gridClassName, className)}>
      {stats.map(({ id, label, value, detail }) => (
        <CoverageStatItem
          key={id ?? label}
          label={label}
          value={value}
          detail={detail}
          align={align}
          loading={loading}
        />
      ))}
    </div>
  );
}

export function CoverageLeadBox({ children, className }) {
  return (
    <div
      className={cn(
        'mx-auto mt-10 max-w-3xl rounded-lg border border-border/80 bg-[#FAFAFA] px-4 py-4 text-center sm:px-6 sm:py-5',
        className
      )}
    >
      <p className="text-sm leading-[1.65] text-muted-foreground">{children}</p>
    </div>
  );
}
