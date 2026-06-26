import { useMemo, useState } from 'react';
import { Plus, Send, Pencil, Trash2, ArrowLeft, Clock, Users } from 'lucide-react';
import CrmLayout from '@/components/layout/CrmLayout';
import { toast } from '@/components/ui/use-toast';
import CampaignComposer from '@/components/crm/CampaignComposer';
import {
  CrmPage, CrmPageHeader, CrmPrimaryBtn, CrmEmptyState, CrmCard,
} from '@/components/crm/CrmUI';
import { audienceFor } from '@/lib/crm/crmService';
import { useCampaigns, useContacts, useSuppressions, useDeleteCampaign } from '@/lib/crm/useCrmQueries';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_CONFIG = {
  sent:    { label: 'Sent',    bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  draft:   { label: 'Draft',   bg: 'bg-gray-100 text-gray-600',      dot: 'bg-gray-400'    },
  sending: { label: 'Sending', bg: 'bg-crm-light text-crm',        dot: 'bg-crm'         },
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
        <CrmPage narrow>
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => setComposing(null)}
              className="crm-link inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> Back to campaigns
            </button>
            <span className="text-sm font-medium text-gray-400">
              {composing.id ? 'Edit campaign' : 'New campaign'}
            </span>
          </div>
          <CampaignComposer
            initial={composing.id ? composing : undefined}
            onClose={() => setComposing(null)}
          />
        </CrmPage>
      </CrmLayout>
    );
  }

  return (
    <CrmLayout>
      <CrmPage>
        <CrmPageHeader
          title="Campaigns"
          subtitle="Reach property owners with personalized emails from your own inbox."
          actions={
            <CrmPrimaryBtn onClick={() => setComposing({})}>
              <Plus size={16} /> New campaign
            </CrmPrimaryBtn>
          }
        />

        {audienceCount === 0 && contacts.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <Users size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-800">
              No opted-in contacts yet.{' '}
              <a href="/crm/contacts" className="font-semibold text-amber-900 underline hover:no-underline">
                Import leads
              </a>{' '}
              first so your campaign has an audience.
            </p>
          </div>
        )}

        {campaigns.length === 0 ? (
          <CrmCard>
            <CrmEmptyState
              icon={Send}
              title="No campaigns yet"
              description="Create your first campaign to start reaching property owners."
              action={
                <CrmPrimaryBtn onClick={() => setComposing({})}>
                  <Plus size={14} /> Create campaign
                </CrmPrimaryBtn>
              }
            />
          </CrmCard>
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
      </CrmPage>
    </CrmLayout>
  );
}

function CampaignCard({ campaign: c, onEdit, onDelete, confirmDelete }) {
  const sent = c.stats?.sent ?? c.sent_count ?? 0;
  const pct  = c.total > 0 ? Math.min(100, Math.round((sent / c.total) * 100)) : 0;

  return (
    <CrmCard hover className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-gray-900">{c.name}</p>
          <StatusBadge status={c.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">{c.subject || 'No subject'}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-gray-400">
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
          <div className="mt-3 max-w-[200px]">
            <div className="crm-progress">
              <div className="crm-progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-gray-400">{pct}% delivered</p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {c.status !== 'sent' && (
          <button onClick={onEdit} className="crm-btn-ghost px-3 py-1.5 text-xs">
            <Pencil size={12} /> Edit
          </button>
        )}
        <button
          onClick={onDelete}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
            confirmDelete === c.id
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'border border-gray-200 bg-white text-red-500 hover:border-red-200 hover:bg-red-50'
          }`}
        >
          <Trash2 size={12} />
          {confirmDelete === c.id ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </CrmCard>
  );
}
