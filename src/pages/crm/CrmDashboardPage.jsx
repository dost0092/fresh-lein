import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Send,
  Mail,
  Tag as TagIcon,
  ShieldCheck,
  Upload,
  Plus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import { DEMO_SEND_LIMIT } from '@/lib/crm/crmService';
import { useContacts, useCampaigns } from '@/lib/crm/useCrmQueries';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function CrmDashboardPage() {
  const { data: contacts = [] } = useContacts();
  const { data: campaigns = [] } = useCampaigns();
  const stats = useMemo(() => {
    const emailsSent = campaigns
      .filter((c) => c.status === 'sent')
      .reduce((sum, c) => sum + (c.stats?.sent || 0), 0);
    return {
      contacts: contacts.length,
      optedIn: contacts.filter((c) => c.opt_in).length,
      campaigns: campaigns.length,
      emailsSent,
    };
  }, [contacts, campaigns]);
  const recent = campaigns.slice(0, 4);

  return (
    <AppLayout>
    <div className="flex-1 overflow-y-auto">
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage leads and run personalized email campaigns — built for real estate agents.
          </p>
        </div>
        <div className="flex gap-2">
          <ImportContactsDialog
            trigger={
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" /> Import
              </Button>
            }
          />
          <Button asChild className="gap-2">
            <Link to="/crm/campaigns">
              <Plus className="h-4 w-4" /> New campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} label="Contacts" value={stats.contacts} accent />
        <Stat icon={CheckCircle2} label="Opted in" value={stats.optedIn} />
        <Stat icon={Send} label="Campaigns" value={stats.campaigns} />
        <Stat icon={Mail} label="Emails sent" value={stats.emailsSent} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent campaigns */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recent campaigns</h2>
            <Link to="/crm/campaigns" className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No campaigns yet.{' '}
              <Link to="/crm/campaigns" className="font-medium text-primary">
                Create your first one
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.status === 'sent' ? `${c.stats?.sent ?? 0} sent · ${formatDate(c.sent_at)}` : 'Draft'}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={c.status === 'sent' ? 'bg-emerald-50 text-emerald-700' : ''}
                  >
                    {c.status === 'sent' ? 'Sent' : 'Draft'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Deliverability / getting started */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold">Deliverability</h2>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <DeliverItem>Vetted relay (Resend / SendGrid) — no raw SMTP</DeliverItem>
              <DeliverItem>SPF, DKIM &amp; DMARC alignment supported</DeliverItem>
              <DeliverItem>One-click unsubscribe on every email</DeliverItem>
              <DeliverItem>Auto-suppress complaints &amp; hard bounces</DeliverItem>
              <DeliverItem>Natural send pacing to protect reputation</DeliverItem>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">Demo plan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You can send up to <span className="font-semibold text-foreground">{DEMO_SEND_LIMIT} emails</span> per
              campaign while testing. Upgrade to scale to 10,000+ with queued delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </AppLayout>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function DeliverItem({ children }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </li>
  );
}
