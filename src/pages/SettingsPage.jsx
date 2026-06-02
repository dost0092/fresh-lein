import AppLayout from '@/components/layout/AppLayout';
import { User, CreditCard, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getStripePaymentLink } from '@/lib/checkoutPlans';
import { createStripePortalUrl, isStripeTestMode } from '@/lib/billing';
import { isCheckoutPlanId } from '@/lib/checkoutPlans';
import { startPlanCheckout } from '@/lib/startPlanCheckout';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PlanMeter({ label, used, total, color }) {
  const pct = total === null ? 0 : Math.min(100, (used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">
          {total === null ? `${used.toLocaleString()} used` : `${used.toLocaleString()} / ${total.toLocaleString()}`}
        </span>
      </div>
      {total !== null && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { rawProfile, subscription, isTrialActive, trialEndsAt, requiresPayment, isSuperAdmin, refreshBilling } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [billingError, setBillingError] = useState('');
  const [billingLoading, setBillingLoading] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const stripeTestMode = isStripeTestMode();

  const trialDaysLeft = useMemo(() => {
    if (!trialEndsAt) return null;
    const ms = trialEndsAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [trialEndsAt]);

  useEffect(() => {
    refreshBilling?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    const plan = searchParams.get('plan');
    if (plan && isCheckoutPlanId(plan)) setSelectedPlan(plan);

    if (checkout === 'success') {
      setCheckoutNotice('Payment received. Your subscription will activate in a few seconds.');
      refreshBilling?.();
      setSearchParams({}, { replace: true });
    } else if (checkout === 'cancel') {
      setCheckoutNotice('Checkout was cancelled. You can try again anytime.');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, refreshBilling, setSearchParams]);

  // Do not auto-start checkout on page load (causes endless spinner if Edge Function missing).
  // User clicks "Pay with Stripe" or sets Payment Link env vars.

  const subStatus = subscription?.status || 'inactive';
  const isActive = ['active', 'trialing'].includes(subStatus);

  const startCheckout = async (planId = selectedPlan) => {
    setBillingError('');
    setBillingLoading(true);
    try {
      await startPlanCheckout(planId);
      // Redirecting to Stripe — page may unload; reset spinner if redirect blocked
      setTimeout(() => setBillingLoading(false), 3000);
    } catch (err) {
      setBillingError(err.message || 'Failed to start checkout');
    } finally {
      setBillingLoading(false);
    }
  };

  const openPortal = async () => {
    setBillingError('');
    setBillingLoading(true);
    try {
      const url = await createStripePortalUrl();
      window.location.href = url;
    } catch (err) {
      setBillingError(err.message || 'Failed to open billing portal');
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account, subscription, and preferences</p>
          </div>

          {/* Account */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-card mb-5">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-navy" />
              <h2 className="font-heading font-semibold text-foreground">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Full Name</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={rawProfile?.full_name || ''} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-muted/30" defaultValue={rawProfile?.email || ''} readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Company</label>
                <input className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan" placeholder="Your company name" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Role</label>
                <select className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan bg-white">
                  <option>Real Estate Investor</option>
                  <option>Wholesale Operator</option>
                  <option>Mortgage Servicer</option>
                  <option>Real Estate Attorney</option>
                  <option>Hard Money Lender</option>
                  <option>Hedge Fund / PE</option>
                </select>
              </div>
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-card mb-5">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-navy" />
              <h2 className="font-heading font-semibold text-foreground">Subscription</h2>
            </div>

            {checkoutNotice && (
              <div className="mb-4 p-3 rounded-lg bg-primary/10 text-foreground text-sm">{checkoutNotice}</div>
            )}

            {billingError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{billingError}</div>
            )}

            {stripeTestMode && (
              <div className="mb-4 p-4 rounded-xl border border-blue-100 bg-blue-50/80 text-sm">
                <p className="font-semibold text-foreground mb-1">Stripe test mode</p>
                <p className="text-muted-foreground text-xs mb-2">
                  Use test card <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVC.
                </p>
                <p className="text-xs text-muted-foreground">
                  Quick fix: create a Payment Link in Stripe Dashboard, then add to <code className="text-[11px]">.env.local</code>:
                  <br />
                  <code className="text-[11px]">VITE_STRIPE_PAYMENT_LINK_STARTER=https://buy.stripe.com/...</code>
                </p>
              </div>
            )}

            {isSuperAdmin && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-900">
                Super admin account — full access without payment.{' '}
                <Link to="/dashboard" className="font-medium underline">
                  Go to dashboard
                </Link>
              </div>
            )}

            {requiresPayment && !isSuperAdmin && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm">
                <p className="font-medium text-foreground mb-1">Trial ended</p>
                <p className="text-muted-foreground text-xs">
                  Subscribe below to unlock the dashboard. Super admins and active trials have full access.
                </p>
              </div>
            )}

            {getStripePaymentLink('starter') && (
              <p className="mb-3 text-xs text-emerald-700">
                Payment Link configured — checkout will open Stripe directly (no Edge Function required).
              </p>
            )}

            <div
              className={cn(
                'flex items-start justify-between mb-5 p-4 rounded-xl border',
                isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-foreground text-lg">
                    {isActive ? (subscription?.plan_name || 'Active plan') : 'Free trial'}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {isActive ? 'Active' : isTrialActive ? 'Trial' : 'Expired'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isActive
                    ? 'Your subscription is active.'
                    : isTrialActive
                      ? `${trialDaysLeft ?? 0} day(s) left in your 13-day trial.`
                      : 'Your trial ended. Please subscribe to continue.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {!isActive && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedPlan === 'starter' ? 'default' : 'outline'}
                      className="text-xs flex-1"
                      onClick={() => setSelectedPlan('starter')}
                    >
                      Starter $15/mo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedPlan === 'pro' ? 'default' : 'outline'}
                      className="text-xs flex-1"
                      onClick={() => setSelectedPlan('pro')}
                    >
                      Pro $25/mo
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {isActive ? (
                    <Button variant="outline" size="sm" className="text-xs border-border" disabled={billingLoading} onClick={openPortal}>
                      Manage billing
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="text-xs"
                      disabled={billingLoading}
                      onClick={() => startCheckout(selectedPlan)}
                    >
                      {billingLoading ? 'Opening Stripe…' : requiresPayment ? 'Subscribe with Stripe' : 'Pay with Stripe'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <PlanMeter label="Property Views" used={127} total={500} color="bg-cyan" />
              <PlanMeter label="CSV Exports" used={3} total={10} color="bg-navy" />
              <PlanMeter label="Alert Zones" used={1} total={10} color="bg-purple-500" />
              <PlanMeter label="API Calls" used={0} total={1000} color="bg-emerald-500" />
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Plan Includes</p>
              <div className="grid grid-cols-2 gap-2">
                {['5 states', 'Unlimited views', 'Analytics', 'Skip trace', 'AI reports', '10 ZIP alerts'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-sm text-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-red-500" />
              <h2 className="font-heading font-semibold text-foreground">Danger Zone</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Cancel Subscription</p>
                <p className="text-xs text-muted-foreground mt-0.5">You'll retain access until Jul 1, 2026</p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-sm">
                Cancel Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}