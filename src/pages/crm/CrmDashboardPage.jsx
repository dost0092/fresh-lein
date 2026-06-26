import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Upload, ChevronRight } from 'lucide-react';
import CrmLayout from '@/components/layout/CrmLayout';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import { DEMO_SEND_LIMIT } from '@/lib/crm/crmService';
import { useContacts, useCampaigns } from '@/lib/crm/useCrmQueries';
import { useAuth } from '@/lib/AuthContext';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS = {
  sent:    { dot: 'bg-emerald-500', text: 'Sent'    },
  draft:   { dot: 'bg-gray-300',    text: 'Draft'   },
  sending: { dot: 'bg-blue-500',    text: 'Sending' },
  failed:  { dot: 'bg-red-400',     text: 'Failed'  },
  partial: { dot: 'bg-amber-400',   text: 'Partial' },
};

export default function CrmDashboardPage() {
  const { profile } = useAuth();
  const { data: contacts  = [] } = useContacts();
  const { data: campaigns = [] } = useCampaigns();

  const stats = useMemo(() => {
    const sentCampaigns = campaigns.filter(c => c.status === 'sent');
    return {
      contacts:   contacts.length,
      optedIn:    contacts.filter(c => c.opt_in).length,
      campaigns:  campaigns.length,
      emailsSent: sentCampaigns.reduce((s, c) => s + (c.stats?.sent || c.sent_count || 0), 0),
    };
  }, [contacts, campaigns]);

  const recent  = campaigns.slice(0, 5);
  const isEmpty = campaigns.length === 0 && contacts.length === 0;
  const firstName = profile?.full_name?.split(' ')[0] || '';

  return (
    <CrmLayout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {firstName ? `Good to see you, ${firstName}` : 'Dashboard'}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Your outreach overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImportContactsDialog
              trigger={
                <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <Upload size={14} /> Import
                </button>
              }
            />
            <Link
              to="/crm/campaigns"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} /> New Campaign
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Contacts',    value: stats.contacts,   sub: `${stats.optedIn} opted in`        },
            { label: 'Campaigns',   value: stats.campaigns,  sub: 'all time'                          },
            { label: 'Emails Sent', value: stats.emailsSent, sub: 'across campaigns'                  },
            { label: 'Send Limit',  value: DEMO_SEND_LIMIT,  sub: 'per campaign'                      },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-gray-200 bg-white px-4 py-4">
              <p className="text-2xl font-semibold tabular-nums text-gray-900">{s.value.toLocaleString()}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-700">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {isEmpty ? (
          /* ── Empty / Getting started ─────────────────────────────── */
          <div className="mt-8">
            <p className="mb-4 text-sm font-medium text-gray-500">Get started</p>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {[
                { step: '1', title: 'Connect your Gmail inbox', sub: 'Your emails send from your real Gmail account — better deliverability, zero cost.', to: '/crm/senders' },
                { step: '2', title: 'Import your leads',        sub: 'Upload a CSV, Excel file, or paste a list of emails.',                               to: '/crm/contacts'  },
                { step: '3', title: 'Create your first campaign', sub: 'Write a personalized email, choose your audience, and launch.',                    to: '/crm/campaigns' },
              ].map(s => (
                <Link
                  key={s.step}
                  to={s.to}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 text-xs font-bold text-gray-400 group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                    {s.step}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* ── Main content ────────────────────────────────────────── */
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">

            {/* Recent campaigns table */}
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                <h2 className="text-sm font-semibold text-gray-900">Recent Campaigns</h2>
                <Link to="/crm/campaigns" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400">No campaigns yet.</p>
                  <Link to="/crm/campaigns" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                    Create your first →
                  </Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400">Campaign</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 hidden sm:table-cell">Date</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 hidden sm:table-cell">Sent</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map(c => {
                      const cfg = STATUS[c.status] || STATUS.draft;
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{c.name}</p>
                            <p className="text-xs text-gray-400 truncate">{c.subject || 'No subject'}</p>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-500 hidden sm:table-cell whitespace-nowrap">
                            {formatDate(c.sent_at || c.created_at)}
                          </td>
                          <td className="px-3 py-3 text-xs tabular-nums text-gray-500 hidden sm:table-cell">
                            {(c.stats?.sent ?? c.sent_count ?? 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Quick links */}
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="border-b border-gray-100 px-4 py-3">
                  <h2 className="text-sm font-semibold text-gray-900">Quick Links</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { label: 'Create Campaign', to: '/crm/campaigns' },
                    { label: 'Import Contacts',  to: '/crm/contacts'  },
                    { label: 'Connect Inbox',    to: '/crm/senders'   },
                    { label: 'Property Data',    to: '/dashboard/foreclosures' },
                  ].map(l => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                    >
                      {l.label}
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Plan */}
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Plan</p>
                <p className="text-sm text-gray-700">
                  Demo — up to <span className="font-semibold text-gray-900">{DEMO_SEND_LIMIT} emails</span> per campaign.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Connect your Gmail inbox to send from your own account at no cost.
                </p>
                <Link to="/crm/senders" className="mt-3 inline-block text-xs font-medium text-blue-600 hover:text-blue-700">
                  Connect inbox →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </CrmLayout>
  );
}
