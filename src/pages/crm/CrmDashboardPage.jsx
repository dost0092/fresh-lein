import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Upload, ChevronRight, Send, Users, Mail } from 'lucide-react';
import CrmLayout from '@/components/layout/CrmLayout';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import {
  CrmPage, CrmPageHeader, CrmStatGrid, CrmStat,
  CrmGhostBtn, CrmCard, CrmSectionTitle,
} from '@/components/crm/CrmUI';
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
  sending: { dot: 'bg-crm',         text: 'Sending' },
  failed:  { dot: 'bg-red-400',     text: 'Failed'  },
  partial: { dot: 'bg-amber-400',   text: 'Partial' },
};

export default function CrmDashboardPage() {
  const { profile } = useAuth();
  const { data: contacts  = [] } = useContacts();
  const { data: campaigns = [] } = useCampaigns();

  const stats = useMemo(() => {
    const sentCampaigns = campaigns.filter(c => c.status === 'sent');
    const active = campaigns.filter(c => c.status === 'draft' || c.status === 'sending');
    return {
      contacts:   contacts.length,
      optedIn:    contacts.filter(c => c.opt_in).length,
      campaigns:  campaigns.length,
      active:     active.length,
      emailsSent: sentCampaigns.reduce((s, c) => s + (c.stats?.sent || c.sent_count || 0), 0),
    };
  }, [contacts, campaigns]);

  const recent  = campaigns.slice(0, 5);
  const isEmpty = campaigns.length === 0 && contacts.length === 0;
  const firstName = profile?.full_name?.split(' ')[0] || '';

  return (
    <CrmLayout>
      <CrmPage>
        <CrmPageHeader
          title={firstName ? `Welcome back, ${firstName}` : 'Dashboard'}
          subtitle="Your outreach at a glance."
          actions={
            <>
              <ImportContactsDialog
                trigger={
                  <CrmGhostBtn>
                    <Upload size={15} /> Import leads
                  </CrmGhostBtn>
                }
              />
              <Link to="/crm/campaigns" className="crm-btn-primary">
                <Plus size={15} /> New campaign
              </Link>
            </>
          }
        />

        <CrmStatGrid>
          <CrmStat label="Contacts" value={stats.contacts} sub={`${stats.optedIn} opted in`} />
          <CrmStat label="Active campaigns" value={stats.active} sub={`${stats.campaigns} total`} />
          <CrmStat label="Emails sent" value={stats.emailsSent} sub="all time" />
          <CrmStat label="Send limit" value={DEMO_SEND_LIMIT} sub="per campaign on demo" />
        </CrmStatGrid>

        {isEmpty ? (
          <div className="mt-10">
            <CrmSectionTitle>Get started</CrmSectionTitle>
            <CrmCard className="divide-y divide-gray-100 overflow-hidden">
              {[
                {
                  step: '1',
                  title: 'Connect your Gmail',
                  sub: 'Use your own inbox so every email comes from you. Replies land in your Gmail.',
                  to: '/crm/senders',
                  icon: Mail,
                },
                {
                  step: '2',
                  title: 'Upload your leads',
                  sub: 'Import a CSV or Excel file. We organize your contacts automatically.',
                  to: '/crm/contacts',
                  icon: Users,
                },
                {
                  step: '3',
                  title: 'Create your first campaign',
                  sub: 'Write a personalized email, pick your audience, and send with confidence.',
                  to: '/crm/campaigns',
                  icon: Send,
                },
              ].map(s => (
                <Link
                  key={s.step}
                  to={s.to}
                  className="group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-crm-subtle"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 text-xs font-bold text-gray-400 transition-all group-hover:border-crm group-hover:bg-crm-light group-hover:text-crm">
                    {s.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{s.sub}</p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-gray-300 transition-colors group-hover:text-crm" />
                </Link>
              ))}
            </CrmCard>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
            <CrmCard className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-sm font-semibold text-gray-900">Recent campaigns</h2>
                <Link to="/crm/campaigns" className="crm-link inline-flex items-center gap-1 text-xs">
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-sm text-gray-400">No campaigns yet.</p>
                  <Link to="/crm/campaigns" className="crm-link mt-2 inline-block text-sm">
                    Create your first campaign
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Campaign</th>
                        <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">Date</th>
                        <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">Sent</th>
                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recent.map(c => {
                        const cfg = STATUS[c.status] || STATUS.draft;
                        return (
                          <tr key={c.id} className="transition-colors hover:bg-crm-subtle/60">
                            <td className="px-6 py-4">
                              <p className="max-w-[220px] truncate font-medium text-gray-900">{c.name}</p>
                              <p className="truncate text-xs text-gray-400">{c.subject || 'No subject'}</p>
                            </td>
                            <td className="hidden whitespace-nowrap px-4 py-4 text-xs text-gray-500 sm:table-cell">
                              {formatDate(c.sent_at || c.created_at)}
                            </td>
                            <td className="hidden px-4 py-4 text-xs tabular-nums text-gray-500 sm:table-cell">
                              {(c.stats?.sent ?? c.sent_count ?? 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
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
                </div>
              )}
            </CrmCard>

            <div className="space-y-4">
              <CrmCard className="overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-900">Quick links</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { label: 'Create campaign', to: '/crm/campaigns' },
                    { label: 'Import contacts',  to: '/crm/contacts'  },
                    { label: 'Connect inbox',    to: '/crm/senders'   },
                    { label: 'Property data',    to: '/dashboard/foreclosures' },
                  ].map(l => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="group flex items-center justify-between px-5 py-3 text-sm text-gray-600 transition-colors hover:bg-crm-subtle hover:text-gray-900"
                    >
                      {l.label}
                      <ChevronRight size={14} className="text-gray-300 transition-colors group-hover:text-crm" />
                    </Link>
                  ))}
                </div>
              </CrmCard>

              <CrmCard className="px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Your plan</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Demo plan. Up to <span className="font-semibold text-gray-900">{DEMO_SEND_LIMIT} emails</span> per campaign.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Connect your Gmail to send from your own account at no extra cost.
                </p>
                <Link to="/crm/senders" className="crm-link mt-4 inline-block text-xs">
                  Connect inbox
                </Link>
              </CrmCard>
            </div>
          </div>
        )}
      </CrmPage>
    </CrmLayout>
  );
}
