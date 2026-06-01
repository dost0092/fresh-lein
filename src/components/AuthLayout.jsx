import { Link } from 'react-router-dom';

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#4257A7] rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">FL</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">FreshLien</span>
          </Link>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4257A7]/10 mb-4">
            <Icon className="w-6 h-6 text-[#4257A7]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-border p-8">{children}</div>
        {footer && <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>}
      </div>
    </div>
  );
}
