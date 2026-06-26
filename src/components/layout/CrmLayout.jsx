import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Users, Send, Settings,
  LogOut, Menu, X, ChevronLeft, ChevronRight,
  MessageSquare, CreditCard, Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import FeedbackDialog from '@/components/FeedbackDialog';
import FreshLienLogo, { HOME_PATH } from '@/components/brand/FreshLienLogo';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/crm'           },
  { icon: Inbox,           label: 'My Inboxes', path: '/crm/senders'   },
  { icon: Users,           label: 'Contacts',   path: '/crm/contacts'  },
  { icon: Send,            label: 'Campaigns',  path: '/crm/campaigns' },
];

const BOTTOM_NAV = [
  { icon: CreditCard, label: 'Billing',  path: '/dashboard/billing' },
  { icon: Settings,   label: 'Settings', path: '/settings'          },
];

function NavItem({ icon: Icon, label, path, collapsed, onClick }) {
  const location = useLocation();
  const active = path === '/crm'
    ? location.pathname === '/crm'
    : location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'crm-nav-item',
        collapsed && 'justify-center px-2.5',
        active && 'crm-nav-item-active'
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

  const handleSignOut = async () => {
    try { await signOut(); navigate('/login', { replace: true }); } catch {}
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={cn(
        'flex h-[4.25rem] items-center border-b border-gray-100',
        collapsed ? 'justify-center px-2' : 'gap-3 px-5'
      )}>
        <FreshLienLogo to={HOME_PATH} variant="sidebar" onClick={onClose} />
        {!collapsed && (
          <span className="rounded-md border border-crm/20 bg-crm-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-crm">
            CRM
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Outreach
          </p>
        )}
        <div className="space-y-1">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
          ))}
        </div>

        <div className="mt-8">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Property Data
            </p>
          )}
          <Link
            to="/dashboard/foreclosures"
            onClick={onClose}
            title={collapsed ? 'Property Data' : undefined}
            className={cn('crm-nav-item', collapsed && 'justify-center px-2.5')}
          >
            <Gavel size={17} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && <span>Property Data</span>}
          </Link>
        </div>
      </nav>

      <div className="border-t border-gray-100 px-3 py-4">
        {!collapsed && isAuthenticated && profile?.email && (
          <p className="mb-3 truncate px-3 text-xs text-gray-400">{profile.email}</p>
        )}

        <div className="space-y-1">
          {BOTTOM_NAV.map(item => (
            <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
          ))}

          <FeedbackDialog
            trigger={
              <button
                title={collapsed ? 'Feedback' : undefined}
                className={cn('crm-nav-item w-full', collapsed && 'justify-center px-2.5')}
              >
                <MessageSquare size={17} strokeWidth={1.75} className="shrink-0" />
                {!collapsed && <span>Feedback</span>}
              </button>
            }
            showIcon={false}
          />

          <button
            onClick={handleSignOut}
            title={collapsed ? 'Log out' : undefined}
            className={cn(
              'crm-nav-item w-full hover:text-red-600',
              collapsed && 'justify-center px-2.5'
            )}
          >
            <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CrmLayout({ children }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="crm-app flex h-screen overflow-hidden bg-crm-subtle">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-[17rem] border-r border-gray-200/80 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="absolute right-3 top-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarInner collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className={cn(
        'relative hidden shrink-0 flex-col border-r border-gray-200/80 bg-white transition-all duration-300 ease-out lg:flex',
        collapsed ? 'w-[4.25rem]' : 'w-[15.5rem]'
      )}>
        <SidebarInner collapsed={collapsed} />

        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[4.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-gray-300 hover:text-crm"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <FreshLienLogo to={HOME_PATH} variant="mobile" />
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
