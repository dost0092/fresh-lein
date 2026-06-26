import { cn } from '@/lib/utils';

export function CrmPage({ children, className, narrow }) {
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

export function CrmPageHeader({ title, subtitle, actions }) {
  return (
    <div className="crm-page-header">
      <div>
        <h1 className="crm-title">{title}</h1>
        {subtitle && <p className="crm-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function CrmStatGrid({ children, cols = 4 }) {
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

export function CrmStat({ label, value, sub }) {
  return (
    <div className="crm-stat">
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function CrmPrimaryBtn({ className, children, ...props }) {
  return (
    <button type="button" className={cn('crm-btn-primary', className)} {...props}>
      {children}
    </button>
  );
}

export function CrmSecondaryBtn({ className, children, ...props }) {
  return (
    <button type="button" className={cn('crm-btn-secondary', className)} {...props}>
      {children}
    </button>
  );
}

export function CrmGhostBtn({ className, children, ...props }) {
  return (
    <button type="button" className={cn('crm-btn-ghost', className)} {...props}>
      {children}
    </button>
  );
}

export function CrmLink({ className, children, ...props }) {
  return (
    <a className={cn('crm-link', className)} {...props}>
      {children}
    </a>
  );
}

export function CrmCard({ className, children, hover }) {
  return (
    <div className={cn('crm-card', hover && 'crm-card-hover', className)}>
      {children}
    </div>
  );
}

export function CrmEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="crm-empty">
      {Icon && <Icon size={28} strokeWidth={1.5} className="text-gray-300" />}
      <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function CrmSectionTitle({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </p>
  );
}
