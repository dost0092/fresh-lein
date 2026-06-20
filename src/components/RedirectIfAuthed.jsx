import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isCheckoutPlanId } from '@/lib/checkoutPlans';
import { APP_HOME } from '@/lib/routes';

/** Sends logged-in users away from login/register pages. */
export default function RedirectIfAuthed({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();
  const plan = new URLSearchParams(location.search).get('plan');

  // Brief auth check only — do not block login UI while profile/subscription loads.
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (isCheckoutPlanId(plan)) {
      return <Navigate to={`/dashboard/billing?plan=${plan}`} replace />;
    }
    const from = location.state?.from?.pathname;
    return <Navigate to={from || APP_HOME} replace />;
  }

  return children;
}
