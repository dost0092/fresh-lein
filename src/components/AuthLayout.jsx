import FreshLienLogo from '@/components/brand/FreshLienLogo';

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="fl-app flex min-h-screen items-center justify-center bg-fl-subtle px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <FreshLienLogo to="/" variant="auth" />
          </div>
          {Icon && (
            <Icon className="mx-auto mb-4 h-8 w-8 text-primary" strokeWidth={1.75} aria-hidden="true" />
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="fl-card p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}
