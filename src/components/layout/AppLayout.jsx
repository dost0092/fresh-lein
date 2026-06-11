import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gavel,
  Bookmark,
  Bell,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import FeedbackDialog from '@/components/FeedbackDialog';
import FreshLienLogo from '@/components/brand/FreshLienLogo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Gavel, label: 'Foreclosures', path: '/dashboard/foreclosures' },
  { icon: Clock, label: 'Pre-Foreclosures', path: '/dashboard/pre-foreclosures', comingSoon: true },
  { icon: Clock, label: 'Probate', path: '/dashboard/probate', comingSoon: true },
  { icon: Clock, label: 'Tax Delinquency', path: '/dashboard/tax', comingSoon: true },
  { icon: Bookmark, label: 'Saved Properties', path: '/dashboard/saved' },
  { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function NavContent({ collapsed, onNavClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavClick?.();
      navigate('/login', { replace: true });
    } catch (err) {
      console.warn('Log out failed:', err);
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path, comingSoon }) => {
          const active = isActive(path);
          const content = (
            <>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">{label}</span>
                  {comingSoon && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Soon
                    </span>
                  )}
                </>
              )}
            </>
          );

          if (comingSoon) {
            return (
              <div
                key={path}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground/60 cursor-not-allowed',
                  collapsed && 'justify-center'
                )}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={path}
              to={path}
              onClick={onNavClick}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                collapsed && 'justify-center'
              )}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {!collapsed && profile && (
          <p className="text-xs text-muted-foreground truncate px-3 mb-2">{profile.email}</p>
        )}
        <FeedbackDialog
          trigger={
            <button
              type="button"
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all',
                collapsed && 'justify-center'
              )}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Feedback</span>}
            </button>
          }
          showIcon={false}
        />
        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );
}

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <FreshLienLogo to="/dashboard" variant="sidebar" onClick={() => setMobileOpen(false)} />
          <button type="button" onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavContent collapsed={false} onNavClick={() => setMobileOpen(false)} />
      </aside>

      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-border transition-all duration-300 shrink-0 relative',
          collapsed ? 'w-[72px]' : 'w-60'
        )}
      >
        <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed && 'justify-center')}>
          <FreshLienLogo
            to="/dashboard"
            variant={collapsed ? 'icon' : 'sidebar'}
            className={collapsed ? 'mx-auto' : undefined}
          />
        </div>
        <NavContent collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-border shrink-0">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <FreshLienLogo to="/dashboard" variant="mobile" />
          <div className="w-8" />
        </div>
        {children}
      </main>
    </div>
  );
}
