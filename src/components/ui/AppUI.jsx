import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function AppPage({ children, className, narrow }) {
  return (
    <div className={cn(
      'mx-auto w-full px-6 py-10 sm:px-8',
      narrow ? 'max-w-3xl' : 'max-w-6xl',
      className
    )}>
      {children}
    </div>
  );
}

export function AppPageHeader({ title, subtitle, actions }) {
  return (
    <div className="fl-page-header">
      <div>
        <h1 className="fl-title">{title}</h1>
        {subtitle && <p className="fl-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function AppStatGrid({ children, cols = 4 }) {
  return (
    <div className={cn(
      'grid gap-4',
      cols === 4 && 'grid-cols-2 sm:grid-cols-4',
      cols === 3 && 'grid-cols-1 sm:grid-cols-3',
    )}>
      {children}
    </div>
  );
}

export function AppStat({ label, value, sub }) {
  return (
    <div className="fl-stat">
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function AppPrimaryBtn({ className, children, asChild, href, ...props }) {
  const cls = cn('fl-btn-primary', className);
  if (href) {
    return <Link to={href} className={cls} {...props}>{children}</Link>;
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}

export function AppSecondaryBtn({ className, children, ...props }) {
  return (
    <button type="button" className={cn('fl-btn-secondary', className)} {...props}>
      {children}
    </button>
  );
}

export function AppGhostBtn({ className, children, ...props }) {
  return (
    <button type="button" className={cn('fl-btn-ghost', className)} {...props}>
      {children}
    </button>
  );
}

export function AppLink({ className, children, ...props }) {
  return (
    <a className={cn('fl-link', className)} {...props}>
      {children}
    </a>
  );
}

export function AppCard({ className, children, hover }) {
  return (
    <div className={cn('fl-card', hover && 'fl-card-hover', className)}>
      {children}
    </div>
  );
}

export function AppEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="fl-empty">
      {Icon && <Icon size={28} strokeWidth={1.5} className="text-gray-300" />}
      <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
