import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getGuestDaysRemaining, GUEST_ACCESS_DAYS } from '@/lib/guestAccess';

export default function GuestAccessBanner() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  const daysLeft = getGuestDaysRemaining();
  const urgent = daysLeft <= 3;

  return (
    <div
      className={
        urgent
          ? 'border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950'
          : 'border-b border-primary/15 bg-primary/[0.06] px-4 py-2.5 text-sm text-foreground'
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <Clock className="hidden h-4 w-4 shrink-0 sm:inline" />
        <span>
          {daysLeft === 0 ? (
            <>Your {GUEST_ACCESS_DAYS}-day guest access ends today.</>
          ) : (
            <>
              Browsing as guest — <strong>{daysLeft}</strong> day{daysLeft === 1 ? '' : 's'} left of your{' '}
              {GUEST_ACCESS_DAYS}-day preview.
            </>
          )}
        </span>
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create free account
        </Link>
        <span className="text-muted-foreground">or</span>
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
        <span className="hidden text-muted-foreground sm:inline">to save deals, alerts, and exports.</span>
      </div>
    </div>
  );
}
