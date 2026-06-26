import { useMemo, useState } from 'react';
import { Plus, Send, Pencil, Trash2, ArrowLeft, Clock, Users } from 'lucide-react';
import CrmLayout from '@/components/layout/CrmLayout';
import { toast } from '@/components/ui/use-toast';
import CampaignComposer from '@/components/crm/CampaignComposer';
import { audienceFor } from '@/lib/crm/crmService';
import { useCampaigns, useContacts, useSuppressions, useDeleteCampaign } from '@/lib/crm/useCrmQueries';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_CONFIG = {
  sent:    { label: 'Sent',    bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  draft:   { label: 'Draft',   bg: 'bg-gray-100 text-gray-600',      dot: 'bg-gray-400'    },
  sending: { label: 'Sending', bg: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500'    },
  failed:  { label: 'Failed',  bg: 'bg-red-50 text-red-700',         dot: 'bg-red-500'     },
  partial: { label: 'Partial', bg: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-500'   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function CrmCampaignsPage() {
  const { data: campaigns = []      } = useCampaigns();
  const { data: contacts = []       } = useContacts();
  const { data: suppressionList = []} = useSuppressions();
  const audienceCount = useMemo(
    () => audienceFor(contacts, suppressionList, 'all').length,
    [contacts, suppressionList]
  );
  const deleteMut = useDeleteCampaign();
  const [composing, setComposing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (composing !== null) {
    return (
      <CrmLayout>
        <div className="flex-1 overflow-y-auto bg-gray-50/40">
          <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setComposing(null)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Campaigns
              </button>
              <span className="text-sm font-semibold text-gray-400">
                {composing.id ? 'Edit Campaign' : 'New Campaign'}
              </span>
            </div>
            <CampaignComposer
              initial={composing.id ? composing : undefined}
              onClose={() => setComposing(null)}
            />
          </div>
        </div>
      </CrmLayout>
    );
  }

  return (
    <CrmLayout>
      <div className="flex-1 overflow-y-auto bg-gray-50/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Campaigns</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Send personalized email broadcasts to your leads.
              </p>
            </div>
            <button
              onClick={() => setComposing({})}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> New Campaign
            </button>
          </div>

          {/* Warning: no contacts */}
          {audienceCount === 0 && contacts.length > 0 && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <Users size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                No opted-in contacts yet. <a href="/crm/contacts" className="font-semibold underline">Import leads</a> first so your campaign has an audience.
              </p>
            </div>
          )}

          {/* Campaign list */}
          <div className="mt-6">
            {campaigns.length === 0 ? (
              <EmptyState onNew={() => setComposing({})} />
            ) : (
              <div className="space-y-3">
                {campaigns.map(c => (
                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    confirmDelete={confirmDelete}
                    onEdit={() => setComposing(c)}
                    onDelete={() => {
                      if (confirmDelete === c.id) {
                        deleteMut.mutate(c.id, {
                          onSuccess: () => { toast({ title: 'Campaign deleted' }); setConfirmDelete(null); },
                          onError: (err) => toast({ title: 'Delete failed', description: err?.message }),
                        });
                      } else {
                        setConfirmDelete(c.id);
                        setTimeout(() => setConfirmDelete(null), 3000);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CrmLayout>
  );
}

function CampaignCard({ campaign: c, onEdit, onDelete, confirmDelete }) {
  const sent = c.stats?.sent ?? c.sent_count ?? 0;
  const pct  = c.total > 0 ? Math.min(100, Math.round((sent / c.total) * 100)) : 0;

  return (
    <div className="group flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-gray-300 hover:shadow-sm transition-all sm:flex-row sm:items-center">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{c.name}</p>
          <StatusBadge status={c.status} />
        </div>
        <p className="mt-0.5 text-sm text-gray-500 truncate">{c.subject || 'No subject'}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {c.status === 'sent' ? `Sent ${formatDate(c.sent_at)}` : `Created ${formatDate(c.created_at)}`}
          </span>
          {c.status === 'sent' && (
            <span className="flex items-center gap-1">
              <Send size={11} /> {sent.toLocaleString()} sent
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={11} />
            {c.audienceTag === 'all' ? 'All contacts' : c.audienceTag}
          </span>
        </div>
        {c.status === 'sent' && c.total > 0 && (
          <div className="mt-2.5">
            <div className="h-1 w-full max-w-[180px] rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-gray-400">{pct}% delivered</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {c.status !== 'sent' && (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={12} /> Edit
          </button>
        )}
        <button
          onClick={onDelete}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            confirmDelete === c.id
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'border border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200'
          }`}
        >
          <Trash2 size={12} />
          {confirmDelete === c.id ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
      <Send size={24} className="text-gray-300" />
      <h3 className="mt-4 text-base font-semibold text-gray-800">No campaigns yet</h3>
      <p className="mt-1.5 max-w-xs text-sm text-gray-500">
        Create your first campaign to start reaching your leads with personalized emails.
      </p>
      <button
        onClick={onNew}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <Plus size={14} /> Create Campaign
      </button>
    </div>
  );
}
