import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ensureGuestAccessStarted, isGuestAccessExpired } from '@/lib/guestAccess';

export default function RequireAuthOrGuest({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  if (isGuestAccessExpired()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, guestExpired: true }}
      />
    );
  }

  ensureGuestAccessStarted();
  return children;
}
