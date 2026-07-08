import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus, RefreshCw, ChevronRight, Users, Kanban,
  NotebookPen, Loader2, ArrowRight,
} from 'lucide-react';
import CrmLayout from '@/components/layout/CrmLayout';
import {
  CrmPage, CrmPageHeader, CrmStatGrid, CrmStat,
  CrmGhostBtn, CrmCard, CrmSectionTitle, CrmPrimaryBtn,
} from '@/components/crm/CrmUI';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  funnelCounts,
  roughRoi,
  defaultEngagementConfig,
} from '@/data/pipeline';
import {
  listClients,
  createClient,
  listEngagements,
  createEngagement,
  listLeads,
  updateLeadStatus,
  listLeadActivities,
  addLeadActivity,
  listBuyers,
  createBuyer,
  intakeLeadsFromEngagement,
} from '@/lib/pipeline/pipelineService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';

function money(n) {
  if (n == null || n === '') return '—';
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatWhen(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function PipelineDashboardPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [engagements, setEngagements] = useState([]);
  const [leads, setLeads] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  const load = useCallback(async (preferredClientId) => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const clientRows = await listClients();
      setClients(clientRows);
      const activeId = preferredClientId || clientId || clientRows[0]?.id || '';
      setClientId(activeId);
      if (!activeId) {
        setEngagements([]);
        setLeads([]);
        setBuyers([]);
        setSelectedLeadId(null);
        setActivities([]);
        return;
      }
      const [eng, leadRows, buyerRows] = await Promise.all([
        listEngagements(activeId),
        listLeads({ clientId: activeId, limit: 300 }),
        listBuyers(activeId),
      ]);
      setEngagements(eng);
      setLeads(leadRows);
      setBuyers(buyerRows);
      if (selectedLeadId && !leadRows.some((l) => l.id === selectedLeadId)) {
        setSelectedLeadId(null);
        setActivities([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load pipeline. Apply migration 009 if tables are missing.');
    } finally {
      setLoading(false);
    }
  }, [clientId, selectedLeadId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const funnel = useMemo(() => funnelCounts(leads), [leads]);
  const closed = funnel.closed || 0;
  const roi = roughRoi({
    leadsDelivered: leads.length,
    dealsClosed: closed,
    avgDealValue: 15000,
  });

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const openLead = async (lead) => {
    setSelectedLeadId(lead.id);
    setNote('');
    try {
      const rows = await listLeadActivities(lead.id);
      setActivities(rows);
    } catch (err) {
      setActivities([]);
      setError(err.message);
    }
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    setBusy('client');
    setError('');
    try {
      const row = await createClient({ name: newClientName.trim() });
      await createEngagement({
        client_id: row.id,
        name: `${row.name} markets`,
        config: {
          ...defaultEngagementConfig(),
          states: ['NJ'],
        },
      });
      setNewClientName('');
      await load(row.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleIntake = async () => {
    const eng = engagements.find((e) => e.status === 'active') || engagements[0];
    if (!eng) {
      setError('Create an engagement for this client first.');
      return;
    }
    setBusy('intake');
    setError('');
    try {
      const result = await intakeLeadsFromEngagement(eng.id, { limit: 25 });
      await load(clientId);
      if (result.created.length === 0 && result.skipped.length > 0) {
        setError(`No new leads ( ${result.skipped.length} already in pipeline or skipped ).`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleStatus = async (status) => {
    if (!selectedLead) return;
    setBusy('status');
    setError('');
    try {
      await updateLeadStatus(selectedLead.id, status, {
        note: note.trim() || undefined,
        created_by: profile?.id,
      });
      setNote('');
      const rows = await listLeadActivities(selectedLead.id);
      setActivities(rows);
      await load(clientId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !note.trim()) return;
    setBusy('note');
    try {
      await addLeadActivity({
        lead_id: selectedLead.id,
        activity_type: 'note',
        content: note.trim(),
        created_by: profile?.id,
      });
      setNote('');
      setActivities(await listLeadActivities(selectedLead.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleAddBuyer = async () => {
    if (!clientId || !buyerName.trim()) return;
    setBusy('buyer');
    try {
      await createBuyer({
        client_id: clientId,
        name: buyerName.trim(),
        phone: buyerPhone.trim() || null,
        criteria: { states: ['NJ'] },
      });
      setBuyerName('');
      setBuyerPhone('');
      setBuyers(await listBuyers(clientId));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <CrmLayout>
      <CrmPage>
        <CrmPageHeader
          title="Acquisition pipeline"
          subtitle="Leads from filings through status, activity, and buyer match. Steps 3–7 (skip trace, SMS, CRM sync, offers) plug in next."
          actions={
            <>
              <CrmGhostBtn onClick={() => load(clientId)} disabled={loading || !!busy}>
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
              </CrmGhostBtn>
              <CrmPrimaryBtn onClick={handleIntake} disabled={!clientId || busy === 'intake'}>
                {busy === 'intake' ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Pull leads from filings
              </CrmPrimaryBtn>
            </>
          }
        />

        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {error}
            {/migration|relation|does not exist/i.test(error) && (
              <p className="mt-2 text-xs">
                Run <code className="rounded bg-white px-1">supabase/migrations/009_acquisition_pipeline.sql</code> in the
                Supabase SQL editor, then refresh.
              </p>
            )}
          </div>
        )}

        {!isSupabaseConfigured && (
          <CrmCard className="p-6 text-sm text-muted-foreground">
            Connect Supabase to use the pipeline. The foreclosure product and email CRM keep working without it.
          </CrmCard>
        )}

        <div className="mb-6 flex flex-wrap items-end gap-3">
          <label className="block min-w-[200px] flex-1">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Client</span>
            <select
              className="fl-input"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                load(e.target.value);
              }}
              disabled={loading || clients.length === 0}
            >
              {clients.length === 0 && <option value="">No clients yet</option>}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-1 flex-wrap gap-2">
            <input
              className="fl-input max-w-xs"
              placeholder="New client name"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
            />
            <CrmPrimaryBtn onClick={handleCreateClient} disabled={busy === 'client' || !newClientName.trim()}>
              {busy === 'client' ? <Loader2 size={15} className="animate-spin" /> : <Users size={15} />}
              Add client
            </CrmPrimaryBtn>
          </div>
        </div>

        <CrmStatGrid cols={4}>
          <CrmStat label="Leads" value={leads.length} sub={`${engagements.length} engagement(s)`} />
          <CrmStat label="In conversation" value={(funnel.contacted || 0) + (funnel.interested || 0)} sub="contacted + interested" />
          <CrmStat label="Under contract" value={funnel.under_contract || 0} sub={`${buyers.length} buyers on file`} />
          <CrmStat
            label="Closed"
            value={closed}
            sub={leads.length ? `${Math.round(roi.closeRate * 100)}% close rate (est.)` : 'no deals yet'}
          />
        </CrmStatGrid>

        <div className="mt-8">
          <CrmSectionTitle>Funnel</CrmSectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {LEAD_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  const first = leads.find((l) => l.status === status);
                  if (first) openLead(first);
                }}
                className="rounded-lg border border-gray-100 bg-white px-3 py-3 text-left shadow-sm transition hover:border-crm/30"
              >
                <p className="text-2xl font-semibold tabular-nums text-gray-900">{funnel[status] || 0}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  {LEAD_STATUS_LABELS[status]}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CrmSectionTitle>
              <span className="inline-flex items-center gap-2"><Kanban size={16} /> Leads</span>
            </CrmSectionTitle>
            <CrmCard className="mt-3 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center gap-2 p-10 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : leads.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No leads yet. Add a client, then click <strong>Pull leads from filings</strong> to create leads from
                  matching foreclosure cases.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <li key={lead.id}>
                      <button
                        type="button"
                        onClick={() => openLead(lead)}
                        className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-gray-50 ${
                          selectedLeadId === lead.id ? 'bg-crm-light/60' : ''
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {lead.property_address || 'Property TBD'}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {[lead.city, lead.state].filter(Boolean).join(', ')}
                            {lead.county_name ? ` · ${lead.county_name} County` : ''}
                            {lead.defendant ? ` · ${lead.defendant}` : ''}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-400">
                            Appraised {money(lead.appraised_value)} · Bid {money(lead.starting_bid)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                          {LEAD_STATUS_LABELS[lead.status] || lead.status}
                        </span>
                        <ChevronRight size={16} className="mt-1 shrink-0 text-gray-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CrmCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <CrmSectionTitle>
                <span className="inline-flex items-center gap-2"><NotebookPen size={16} /> Lead detail</span>
              </CrmSectionTitle>
              <CrmCard className="mt-3 p-4">
                {!selectedLead ? (
                  <p className="text-sm text-gray-500">Select a lead to update status and see activity.</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-900">{selectedLead.property_address}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Status: <strong>{LEAD_STATUS_LABELS[selectedLead.status]}</strong>
                      {selectedLead.parcel_number ? ` · Parcel ${selectedLead.parcel_number}` : ''}
                    </p>
                    {selectedLead.foreclosure_case_id && (
                      <Link
                        to={`/dashboard/foreclosures/${selectedLead.foreclosure_case_id}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-crm hover:underline"
                      >
                        Open filing <ArrowRight size={12} />
                      </Link>
                    )}

                    <label className="mt-4 block">
                      <span className="mb-1 block text-xs font-semibold text-gray-500">Note (optional)</span>
                      <textarea
                        className="fl-input min-h-[72px]"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Call outcome, offer talk, etc."
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <CrmGhostBtn onClick={handleAddNote} disabled={busy === 'note' || !note.trim()}>
                        Save note
                      </CrmGhostBtn>
                    </div>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Move status</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {LEAD_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={busy === 'status' || selectedLead.status === status}
                          onClick={() => handleStatus(status)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700 hover:border-crm/40 hover:text-crm disabled:opacity-40"
                        >
                          {LEAD_STATUS_LABELS[status]}
                        </button>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">Activity</p>
                    <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                      {activities.length === 0 && (
                        <li className="text-xs text-gray-400">No activity yet.</li>
                      )}
                      {activities.map((a) => (
                        <li key={a.id} className="rounded-md bg-gray-50 px-2.5 py-2 text-xs text-gray-700">
                          <span className="font-semibold capitalize">{a.activity_type.replace('_', ' ')}</span>
                          <span className="text-gray-400"> · {formatWhen(a.created_at)}</span>
                          <p className="mt-0.5 whitespace-pre-wrap">{a.content}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CrmCard>
            </div>

            <div>
              <CrmSectionTitle>Buyers</CrmSectionTitle>
              <CrmCard className="mt-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <input
                    className="fl-input flex-1"
                    placeholder="Buyer name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                  <input
                    className="fl-input flex-1"
                    placeholder="Phone"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                  />
                  <CrmPrimaryBtn onClick={handleAddBuyer} disabled={!clientId || busy === 'buyer' || !buyerName.trim()}>
                    Add
                  </CrmPrimaryBtn>
                </div>
                <ul className="mt-3 divide-y divide-gray-100">
                  {buyers.length === 0 && (
                    <li className="py-2 text-xs text-gray-400">No buyers yet. Add cash buyers for match when a lead is under contract.</li>
                  )}
                  {buyers.map((b) => (
                    <li key={b.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="font-medium text-gray-900">{b.name}</span>
                      <span className="text-xs text-gray-500">{b.phone || b.email || '—'}</span>
                    </li>
                  ))}
                </ul>
              </CrmCard>
            </div>
          </div>
        </div>
      </CrmPage>
    </CrmLayout>
  );
}
