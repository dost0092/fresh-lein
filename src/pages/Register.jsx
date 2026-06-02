import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import RedirectIfAuthed from '@/components/RedirectIfAuthed';
import { useAuth } from '@/lib/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isCheckoutPlanId, CHECKOUT_PLAN_LABELS } from '@/lib/checkoutPlans';

function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { signUp, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const checkoutPlan = isCheckoutPlanId(plan) ? plan : null;

  const goAfterAuth = async () => {
    if (checkoutPlan) {
      navigate(`/dashboard/billing?plan=${checkoutPlan}`, { replace: true });
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signUp({ email, password, fullName });
      if (data?.user && !data.user.email_confirmed_at && !data.session) {
        setSuccess(true);
        setLoading(false);
      } else {
        await goAfterAuth();
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  if (success) {
    const handleResend = async () => {
      if (!isSupabaseConfigured) return;
      setResendLoading(true);
      setResendMessage('');
      try {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (resendError) throw resendError;
        setResendMessage('Confirmation email sent again. Check your inbox and spam folder.');
      } catch (err) {
        setResendMessage(err.message || 'Could not resend email. Try Google sign-in or contact support.');
      } finally {
        setResendLoading(false);
      }
    };

    return (
      <AuthLayout icon={Mail} title="Check your email" subtitle={`We sent a confirmation link to ${email}`}>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="text-center">
            Click the link in your email to activate your account, then{' '}
            <Link
              to={checkoutPlan ? `/login?plan=${checkoutPlan}` : '/login'}
              className="font-medium text-primary hover:underline"
            >
              log in
            </Link>
            {checkoutPlan ? ' to complete payment.' : '.'}
          </p>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-left text-xs leading-relaxed">
            <p className="font-semibold text-foreground">Email not arriving?</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Check spam, promotions, and junk folders</li>
              <li>Supabase sends ~2 emails/hour on the free plan until you add custom SMTP</li>
              <li>If you used Google before, sign in with Google instead — same email works</li>
            </ul>
            <p className="mt-2">
              Setup guide: <code className="text-[11px]">supabase/EMAIL_AUTH_SETUP.md</code>
            </p>
          </div>

          {resendMessage && (
            <p className="text-center text-xs text-foreground">{resendMessage}</p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-10"
            disabled={resendLoading}
            onClick={handleResend}
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              'Resend confirmation email'
            )}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle={
        checkoutPlan
          ? `Sign up for ${CHECKOUT_PLAN_LABELS[checkoutPlan]}`
          : 'Start exploring foreclosure intelligence'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={checkoutPlan ? `/login?plan=${checkoutPlan}` : '/login'}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-900">
          Configure Supabase in <code className="text-xs">.env.local</code> before signing up.
        </div>
      )}

      {checkoutPlan && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-sm text-foreground">
          After signup you&apos;ll go to <strong>Stripe</strong> to pay (13-day trial still applies if enabled).
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
              setError(err.message || 'Google signup failed');
            }
          }}
        >
          Continue with Google
        </Button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10 h-11"
              required
            />
          </div>
        </div>
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11"
              minLength={6}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {checkoutPlan ? 'Continuing…' : 'Creating account...'}
            </>
          ) : (
            checkoutPlan ? 'Sign up & pay' : 'Sign up'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function Register() {
  return (
    <RedirectIfAuthed>
      <RegisterForm />
    </RedirectIfAuthed>
  );
}
