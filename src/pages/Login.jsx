import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import RedirectIfAuthed from '@/components/RedirectIfAuthed';
import { useAuth } from '@/lib/AuthContext';
import { isCheckoutPlanId, CHECKOUT_PLAN_LABELS } from '@/lib/checkoutPlans';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const checkoutPlan = isCheckoutPlanId(plan) ? plan : null;

  const goAfterAuth = async () => {
    if (checkoutPlan) {
      navigate(`/dashboard/billing?plan=${checkoutPlan}`, { replace: true });
      return;
    }
    const from = location.state?.from?.pathname;
    navigate(from || '/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ email, password });
      await goAfterAuth();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle={
        checkoutPlan
          ? `Log in to subscribe to ${CHECKOUT_PLAN_LABELS[checkoutPlan]}`
          : 'Log in to your FreshLien account'
      }
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to={checkoutPlan ? `/register?plan=${checkoutPlan}` : '/register'}
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-900">
          Add <code className="text-xs">VITE_SUPABASE_URL</code> and <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> to{' '}
          <code className="text-xs">.env.local</code> to enable login.
        </div>
      )}

      {checkoutPlan && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-sm text-foreground">
          After login you&apos;ll be redirected to <strong>Stripe</strong> to complete payment.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      {isSupabaseConfigured && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 mb-4"
          disabled={loading}
          onClick={async () => {
            setError('');
            try {
              const redirectTo = checkoutPlan
                ? `${window.location.origin}/dashboard/billing?plan=${checkoutPlan}`
                : `${window.location.origin}/dashboard`;
              await signInWithGoogle(redirectTo);
            } catch (err) {
              setError(err.message || 'Google login failed');
            }
          }}
        >
          Continue with Google
        </Button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {checkoutPlan ? 'Continuing to payment…' : 'Logging in…'}
            </>
          ) : (
            checkoutPlan ? 'Log in & pay' : 'Log in'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function Login() {
  return (
    <RedirectIfAuthed>
      <LoginForm />
    </RedirectIfAuthed>
  );
}
