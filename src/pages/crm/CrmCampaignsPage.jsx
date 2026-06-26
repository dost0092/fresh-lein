import { useMemo, useState } from 'react';
import { Plus, Send, Mail, FileEdit, Trash2, ArrowLeft, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import CampaignComposer from '@/components/crm/CampaignComposer';
import { audienceFor } from '@/lib/crm/crmService';
import { useCampaigns, useContacts, useSuppressions, useDeleteCampaign } from '@/lib/crm/useCrmQueries';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CrmCampaignsPage() {
  const { data: campaigns = [] } = useCampaigns();
  const { data: contacts = [] } = useContacts();
  const { data: suppressionList = [] } = useSuppressions();
  const audienceCount = useMemo(
    () => audienceFor(contacts, suppressionList, 'all').length,
    [contacts, suppressionList]
  );
  const deleteMut = useDeleteCampaign();
  const [composing, setComposing] = useState(null); // null | {} | campaign

  if (composing) {
    return (
      <AppLayout>
      <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setComposing(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </button>
        <h1 className="mb-5 text-2xl font-semibold tracking-tight">
          {composing.id ? 'Edit campaign' : 'New campaign'}
        </h1>
        <CampaignComposer initial={composing.id ? composing : undefined} onClose={() => setComposing(null)} />
      </div>
      </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
    <div className="flex-1 overflow-y-auto">
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send personalized email broadcasts to your segmented contacts.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setComposing({})}>
          <Plus className="h-4 w-4" /> New campaign
        </Button>
      </div>

      {audienceCount === 0 && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have no opted-in contacts yet. Import contacts first so your campaign has an audience.
        </div>
      )}

      <div className="mt-5 space-y-2.5">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Send className="h-6 w-6" />
            </span>
            <h3 className="mt-3 text-base font-semibold">No campaigns yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first campaign to send a personalized broadcast to your contacts.
            </p>
            <Button className="mt-4 gap-2" onClick={() => setComposing({})}>
              <Plus className="h-4 w-4" /> New campaign
            </Button>
          </div>
        ) : (
          campaigns.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{c.name}</p>
                    {c.status === 'sent' ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <FileEdit className="h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {c.subject || 'No subject'} · Audience: {c.audienceTag === 'all' ? 'All contacts' : c.audienceTag}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
                    <Clock className="h-3 w-3" />
                    {c.status === 'sent'
                      ? `${c.stats?.sent ?? 0} sent · ${formatDate(c.sent_at)}`
                      : `Created ${formatDate(c.created_at)}`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {c.status !== 'sent' && (
                  <Button size="sm" variant="outline" onClick={() => setComposing(c)}>
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600"
                  onClick={() =>
                    deleteMut.mutate(c.id, {
                      onSuccess: () => toast({ title: 'Campaign deleted' }),
                      onError: (err) => toast({ title: 'Delete failed', description: err?.message }),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
    </AppLayout>
  );
}
