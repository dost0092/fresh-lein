import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Gavel, Bookmark, Bell, BarChart2, CreditCard, Settings,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Clock,
  Landmark, Receipt, MessageSquare, LogIn, Send, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import FeedbackDialog from '@/components/FeedbackDialog';
import FreshLienLogo, { HOME_PATH } from '@/components/brand/FreshLienLogo';
import GuestAccessBanner from '@/components/dashboard/GuestAccessBanner';
import { getGuestDaysRemaining } from '@/lib/guestAccess';
import { APP_HOME } from '@/lib/routes';

const navGroups = [
  {
    title: 'Property data',
    items: [
      { icon: Gavel, label: 'Search & map', path: APP_HOME },
      { icon: Clock, label: 'Pre-foreclosures', path: '/dashboard/pre-foreclosures', comingSoon: true },
      { icon: Landmark, label: 'Probate', path: '/dashboard/probate', comingSoon: true },
      { icon: Receipt, label: 'Tax delinquency', path: '/dashboard/tax', comingSoon: true },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { icon: Bookmark, label: 'Saved properties', path: '/dashboard/saved' },
      { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
      { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
  },
];

function NavItem({ icon: Icon, label, path, collapsed, onClick, comingSoon }) {
  const location = useLocation();
  const active = path === APP_HOME
    ? location.pathname === APP_HOME || location.pathname.startsWith(`${APP_HOME}/`)
    : location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (comingSoon) {
    return (
      <div
        title={collapsed ? `${label} (coming soon)` : undefined}
        className={cn('fl-nav-item cursor-not-allowed opacity-40', collapsed && 'justify-center px-2.5')}
      >
        <Icon size={17} strokeWidth={1.75} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Soon</span>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      to={path}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'fl-nav-item',
        collapsed && 'justify-center px-2.5',
        active && 'fl-nav-item-active'
      )}
    >
      <Icon size={17} strokeWidth={active ? 2.25 : 1.75} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

function SidebarInner({ collapsed, onClose }) {
  const { signOut, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const guestDaysLeft = getGuestDaysRemaining();

  const handleSignOut = async () => {
    try { await signOut(); navigate('/login', { replace: true }); } catch {}
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={cn(
        'flex h-[4.25rem] items-center border-b border-border/80',
        collapsed ? 'justify-center px-2' : 'px-5'
      )}>
        <FreshLienLogo
          to={HOME_PATH}
          variant={collapsed ? 'icon' : 'sidebar'}
          onClick={onClose}
          className={collapsed ? 'mx-auto' : undefined}
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navGroups.map((group, i) => (
          <div key={group.title} className={i > 0 ? 'mt-8' : undefined}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.title}
              </p>
            )}
            {collapsed && i > 0 && <div className="mx-auto mb-3 h-px w-7 bg-border" />}
            <div className="space-y-1">
              {group.items.map(item => (
                <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/80 px-3 py-4">
        <Link
          to="/crm"
          title={collapsed ? 'Open CRM' : undefined}
          className={cn(
            'mb-3 flex items-center gap-3 rounded-lg bg-crm px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-crm-hover hover:shadow-md',
            collapsed && 'justify-center px-2.5'
          )}
        >
          <Send size={17} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">Open CRM</span>
              <ExternalLink size={14} className="opacity-70" />
            </>
          )}
        </Link>

        {!collapsed && isAuthenticated && profile?.email && (
          <p className="mb-3 truncate px-3 text-xs text-muted-foreground">{profile.email}</p>
        )}
        {!collapsed && !isAuthenticated && (
          <p className="mb-3 px-3 text-xs text-muted-foreground">
            Guest preview · {guestDaysLeft} day{guestDaysLeft === 1 ? '' : 's'} left
          </p>
        )}

        <div className="space-y-1">
          <FeedbackDialog
            trigger={
              <button className={cn('fl-nav-item w-full', collapsed && 'justify-center px-2.5')}>
                <MessageSquare size={17} strokeWidth={1.75} className="shrink-0" />
                {!collapsed && <span>Feedback</span>}
              </button>
            }
            showIcon={false}
          />

          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className={cn('fl-nav-item w-full hover:text-red-600', collapsed && 'justify-center px-2.5')}
            >
              <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span>Log out</span>}
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className={cn('fl-nav-item w-full text-primary', collapsed && 'justify-center px-2.5')}
            >
              <LogIn size={17} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span>Log in / Sign up</span>}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fl-app flex h-screen overflow-hidden bg-fl-subtle">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-[17rem] border-r border-border/80 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="absolute right-3 top-4">
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X size={18} />
          </button>
        </div>
        <SidebarInner collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className={cn(
        'relative hidden shrink-0 flex-col border-r border-border/80 bg-white transition-all duration-300 ease-out lg:flex',
        collapsed ? 'w-[4.25rem]' : 'w-[15.5rem]'
      )}>
        <SidebarInner collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[4.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:border-border hover:text-primary"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-white px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <Menu size={20} />
          </button>
          <FreshLienLogo to={HOME_PATH} variant="mobile" />
          <div className="w-9" />
        </div>
        <GuestAccessBanner />
        {children}
      </main>
    </div>
  );
}
