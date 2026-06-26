import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
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
  Landmark,
  Receipt,
  MessageSquare,
  LogIn,
  LayoutDashboard,
  Users,
  Send,
  Inbox,
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
    title: 'CRM',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    path: '/crm' },
      { icon: Inbox,           label: 'My Inboxes',   path: '/crm/senders' },
      { icon: Users,           label: 'Contacts',     path: '/crm/contacts' },
      { icon: Send,            label: 'Campaigns',    path: '/crm/campaigns' },
    ],
  },
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

const navItemBase =
  'flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150';

function NavContent({ collapsed, onNavClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, isAuthenticated } = useAuth();
  const guestDaysLeft = getGuestDaysRemaining();

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
    if (path === APP_HOME) {
      return location.pathname === APP_HOME || location.pathname.startsWith(`${APP_HOME}/`);
    }
    // `/crm` is an index route; match it exactly so sub-pages don't keep it active.
    if (path === '/crm') {
      return location.pathname === '/crm';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title || 'primary'} className={groupIndex > 0 ? 'mt-5' : undefined}>
            {group.title &&
              (collapsed ? (
                groupIndex > 0 && <div className="mx-auto mb-3 h-px w-7 bg-border" />
              ) : (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                  {group.title}
                </p>
              ))}

            <div className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, path, comingSoon }) => {
                const active = isActive(path);
                const content = (
                  <>
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate text-left">{label}</span>
                        {comingSoon && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
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
                      title={collapsed ? `${label} (coming soon)` : undefined}
                      className={cn(
                        navItemBase,
                        'cursor-not-allowed text-muted-foreground/45',
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
                      navItemBase,
                      active
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-neutral-50 hover:text-foreground',
                      collapsed && 'justify-center'
                    )}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-border px-3 py-4">
        {!collapsed && isAuthenticated && profile && (
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{profile.email}</p>
        )}
        {!collapsed && !isAuthenticated && (
          <p className="mb-2 px-3 text-xs text-muted-foreground">
            Guest preview · {guestDaysLeft} day{guestDaysLeft === 1 ? '' : 's'} left
          </p>
        )}
        <FeedbackDialog
          trigger={
            <button
              type="button"
              className={cn(
                navItemBase,
                'w-full text-muted-foreground hover:bg-neutral-50 hover:text-foreground',
                collapsed && 'justify-center'
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Feedback</span>}
            </button>
          }
          showIcon={false}
        />
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              navItemBase,
              'w-full text-muted-foreground hover:bg-neutral-50 hover:text-foreground',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        ) : (
          <Link
            to="/login"
            onClick={onNavClick}
            className={cn(
              navItemBase,
              'w-full text-primary hover:bg-neutral-50',
              collapsed && 'justify-center'
            )}
          >
            <LogIn className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log in / Sign up</span>}
          </Link>
        )}
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
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <FreshLienLogo to={HOME_PATH} variant="sidebar" onClick={() => setMobileOpen(false)} />
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 hover:bg-muted">
            <X className="h-5 w-5" />
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
        <div
          className={cn(
            'flex h-16 items-center border-b border-border',
            collapsed ? 'justify-center px-2' : 'px-4'
          )}
        >
          <FreshLienLogo
            to={HOME_PATH}
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
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <FreshLienLogo to={HOME_PATH} variant="mobile" />
          <div className="w-8" />
        </div>
        <GuestAccessBanner />
        {children}
      </main>
    </div>
  );
}
