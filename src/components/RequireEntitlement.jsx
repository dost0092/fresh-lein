import { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function RequireEntitlement({ children }) {
  const { requiresPayment, isLoadingAuth, isAuthenticated, isProfileReady, isSuperAdmin } = useAuth();
  const location = useLocation();
  const hasUnlockedRef = useRef(false);

  if (isProfileReady || isSuperAdmin) {
    hasUnlockedRef.current = true;
  }

  // Only block on the first profile load — not on background token refresh.
  if (
    isLoadingAuth ||
    (isAuthenticated && !isProfileReady && !isSuperAdmin && !hasUnlockedRef.current)
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (requiresPayment) {
    return <Navigate to="/dashboard/billing" replace state={{ from: location, paywall: true }} />;
  }

  return children;
}
