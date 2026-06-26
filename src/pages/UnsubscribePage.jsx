import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { suppressEmails } from '@/lib/crm/crmStore';

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const email = params.get('e') || '';
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!email) return;
    // Local fallback (demo mode) + server-side suppression (multi-tenant).
    suppressEmails([email]);
    fetch('/api/crm/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .catch(() => {})
      .finally(() => setDone(true));
  }, [email]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">You're unsubscribed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {email ? (
            <>
              <span className="font-medium text-foreground">{email}</span> has been removed and will no longer receive
              marketing emails.
            </>
          ) : (
            'Your email has been removed from this list.'
          )}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{done ? 'No further action is needed.' : ''}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Return to FreshLien</Link>
        </Button>
      </div>
    </div>
  );
}
