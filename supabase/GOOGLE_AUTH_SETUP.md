# Google Login setup — FreshLien

Your error:

```json
{ "code": 400, "error_code": "validation_failed", "msg": "Unsupported provider: provider is not enabled" }
```

This means **Google is not enabled in Supabase yet**. Follow every step below.

**Your Supabase project:** `mhodxzrbcaammqobvcnu`  
**Callback URL:** `https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback`

---

## Part 1 — Google Cloud Console (create OAuth credentials)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or pick an existing one) — e.g. **FreshLien**
3. Go to **APIs & Services** → **OAuth consent screen**
4. Choose **External** → **Create**
5. Fill in:
   - App name: `FreshLien`
   - User support email: your email
   - Developer contact: your email
6. Click **Save and Continue** through Scopes (defaults are fine) and Test users (add your Gmail if in testing mode)
7. Go to **APIs & Services** → **Credentials**
8. Click **+ Create Credentials** → **OAuth client ID**
9. Application type: **Web application**
10. Name: `FreshLien Supabase`
11. **Authorized JavaScript origins** — add:
    ```
    http://localhost:5173
    http://localhost:3000
    https://mhodxzrbcaammqobvcnu.supabase.co
    ```
    (Add your production domain later, e.g. `https://freshlien.com`)
12. **Authorized redirect URIs** — add **exactly**:
    ```
    https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback
    ```
13. Click **Create**
14. Copy the **Client ID** (`....apps.googleusercontent.com`) and **Client secret**

---

## Part 2 — Enable Google in Supabase

1. Open [Supabase Auth Providers](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/providers)
2. Find **Google** → click to expand
3. Turn **Enable Sign in with Google** ON
4. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
5. Click **Save**

---

## Part 3 — Set redirect URLs in Supabase

1. Go to [Auth URL Configuration](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/url-configuration)
2. **Site URL** (local dev):
   ```
   http://localhost:5173
   ```
3. **Redirect URLs** — add all of these (one per line):
   ```
   http://localhost:5173/**
   http://localhost:5173/dashboard
   http://localhost:5173/dashboard/billing
   http://localhost:3000/**
   ```
   (Add your production URLs when you deploy, e.g. `https://yourdomain.com/**`)

---

## Part 4 — Test in FreshLien

1. Restart dev server: `npm run dev`
2. Go to **Login** or **Register**
3. Click **Continue with Google**
4. Pick your Google account
5. You should land on **`/dashboard`** — same landing-style home with your stats strip and full nav

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `provider is not enabled` | Enable Google in Supabase (Part 2) |
| `redirect_uri_mismatch` | Redirect URI in Google must be exactly `https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback` |
| `Access blocked: app not verified` | Add your email under OAuth consent screen → Test users (while app is in Testing) |
| Redirects to wrong page | Check Site URL + Redirect URLs in Supabase (Part 3) |
| **Redirects to `localhost:3000` after Google login on Vercel** | **Site URL is still localhost.** Set Site URL to your Vercel URL and add `https://YOUR-APP.vercel.app/**` to Redirect URLs (see Production below) |
| User lands on URL with `#access_token=...` but not logged in | Add production URL to Redirect URLs; redeploy; hard refresh. FreshLien includes `AuthCallbackHandler` to finish login automatically. |
| User has no trial/profile | Run migration `005_trials_and_stripe_billing.sql` (creates profile on signup) |

---

## Production checklist (Vercel)

When you deploy FreshLien to Vercel (e.g. `https://fresh-lein.vercel.app`):

1. **Supabase → Auth → URL Configuration**
   - **Site URL:** `https://fresh-lein.vercel.app` (your exact Vercel URL or custom domain)
   - **Redirect URLs** — add:
     ```
     https://fresh-lein.vercel.app/**
     https://fresh-lein.vercel.app/dashboard
     http://localhost:5173/**
     http://localhost:3000/**
     ```

2. **Google Cloud Console → OAuth client**
   - **Authorized JavaScript origins** — add:
     ```
     https://fresh-lein.vercel.app
     ```
   - Keep redirect URI as Supabase callback (unchanged):
     ```
     https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback
     ```

3. **Vercel → Environment variables** (must match local `.env.local`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

4. Redeploy Vercel after env changes

5. Publish OAuth consent screen in Google when ready for public users

**Symptom:** Google login on Vercel sends you to `http://localhost:3000/#access_token=...`  
**Cause:** Supabase **Site URL** is still `http://localhost:3000` or your Vercel URL is missing from **Redirect URLs**.  
**Fix:** Update Part 3 above in Supabase dashboard (takes effect immediately — no redeploy needed for Supabase).

---

## Production checklist (legacy)

1. Google Cloud → add production origin + keep Supabase callback URL
2. Supabase Site URL → `https://yourdomain.com`
3. Supabase Redirect URLs → `https://yourdomain.com/**`
4. Publish OAuth consent screen in Google (when ready for public users)
