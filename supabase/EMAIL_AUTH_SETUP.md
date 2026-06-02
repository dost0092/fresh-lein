# Email signup — confirmation emails not arriving

If users see **“Check your email”** but nothing arrives, this is almost always **Supabase email configuration**, not a bug in FreshLien.

**Project:** `mhodxzrbcaammqobvcnu`

---

## Why emails don’t arrive

| Cause | What happens |
|-------|----------------|
| **Default Supabase mailer** | Free tier allows only **~2–4 auth emails per hour**. Extra signups are silently dropped or delayed. |
| **No custom SMTP** | Emails come from Supabase’s shared sender — often flagged as **spam**. |
| **Email already used with Google** | Same address signed up via Google OAuth → password signup may not send a new confirmation. Use **Continue with Google**. |
| **Confirm email enabled** | User must click the link before login works — if mail never arrives, they’re stuck until SMTP is fixed. |

---

## Fix 1 — Add custom SMTP (recommended for production)

1. Open [Supabase → Project Settings → Auth → SMTP](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/smtp)
2. Enable **Custom SMTP**
3. Use a provider such as **[Resend](https://resend.com)** (easiest), SendGrid, or Postmark

### Example — Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (or use Resend’s test domain for staging)
3. Create an API key
4. In Supabase SMTP settings:

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (TLS) |
| Username | `resend` |
| Password | Your Resend API key |
| Sender email | `noreply@yourdomain.com` (must be verified in Resend) |
| Sender name | `FreshLien` |

5. Save → send a test email from Supabase if available

---

## Fix 2 — Auth redirect URL for confirmation links

Confirmation links must redirect to your live app.

1. [Auth → URL Configuration](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/url-configuration)
2. **Site URL** → your production URL, e.g. `https://fresh-lein.vercel.app`
3. **Redirect URLs** — include:
   ```
   https://fresh-lein.vercel.app/**
   http://localhost:5173/**
   http://localhost:3000/**
   ```

---

## Fix 3 — Dev-only: disable email confirmation

For local testing only (not recommended for production):

1. [Auth → Providers → Email](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/providers)
2. Turn off **Confirm email**
3. Users can log in immediately after signup

---

## Fix 4 — Check Supabase Auth logs

1. [Auth → Logs](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/logs)
2. Look for signup events and email send failures

---

## Quick workaround for your account

Your email `waqasdost0092@gmail.com` is likely already linked to **Google OAuth**.

→ Use **Continue with Google** on Login/Register instead of email/password.

Super admin emails (full access): see migration `005_trials_and_stripe_billing.sql`.

---

## Checklist

- [ ] Custom SMTP configured in Supabase
- [ ] Site URL = production Vercel domain
- [ ] Redirect URLs include production `/**`
- [ ] Checked spam folder
- [ ] Tried Google login for same email
- [ ] Checked Auth logs for send errors
