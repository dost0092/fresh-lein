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
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/crm'           },
  { icon: Inbox,           label: 'My Inboxes',  path: '/crm/senders'   },
  { icon: Users,           label: 'Contacts',    path: '/crm/contacts'  },
  { icon: Send,            label: 'Campaigns',   path: '/crm/campaigns' },
];

const BOTTOM_NAV = [
  { icon: CreditCard, label: 'Billing',  path: '/dashboard/billing' },
  { icon: Settings,   label: 'Settings', path: '/settings'          },
];

const base = 'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100';

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
        base,
        collapsed && 'justify-center px-2',
        active
          ? 'bg-gray-100 text-gray-900 font-semibold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      )}
    >
      <Icon size={16} className="shrink-0" />
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
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-gray-100',
        collapsed ? 'justify-center px-2' : 'px-4 gap-3'
      )}>
        <FreshLienLogo to={HOME_PATH} variant="sidebar" onClick={onClose} />
        {!collapsed && (
          <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
            CRM
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {!collapsed && (
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Outreach
          </p>
        )}
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
          ))}
        </div>

        {/* Switch to data */}
        <div className="mt-5">
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Property Data
            </p>
          )}
          <Link
            to="/dashboard/foreclosures"
            onClick={onClose}
            title={collapsed ? 'Property Data' : undefined}
            className={cn(
              base,
              collapsed && 'justify-center px-2',
              'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            <Gavel size={16} className="shrink-0" />
            {!collapsed && <span>Property Data</span>}
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-2 py-3">
        {!collapsed && isAuthenticated && profile?.email && (
          <p className="mb-2 truncate px-3 text-xs text-gray-400">{profile.email}</p>
        )}

        <div className="space-y-0.5">
          {BOTTOM_NAV.map(item => (
            <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
          ))}

          <FeedbackDialog
            trigger={
              <button
                title={collapsed ? 'Feedback' : undefined}
                className={cn(
                  base, 'w-full',
                  collapsed && 'justify-center px-2',
                  'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                )}
              >
                <MessageSquare size={16} className="shrink-0" />
                {!collapsed && <span>Feedback</span>}
              </button>
            }
            showIcon={false}
          />

          <button
            onClick={handleSignOut}
            title={collapsed ? 'Log out' : undefined}
            className={cn(
              base, 'w-full',
              collapsed && 'justify-center px-2',
              'text-gray-500 hover:bg-gray-50 hover:text-red-600'
            )}
          >
            <LogOut size={16} className="shrink-0" />
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
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-100 shadow-lg transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="absolute right-3 top-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarInner collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r border-gray-100 shrink-0 relative transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-56'
      )}>
        <SidebarInner collapsed={collapsed} />

        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-400 hover:text-gray-600 z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <FreshLienLogo to={HOME_PATH} variant="mobile" />
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          {children}
        </div>
      </main>
    </div>
  );
}
