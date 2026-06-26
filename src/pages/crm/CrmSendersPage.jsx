import React, { useState } from 'react';
import CrmLayout from '../../components/layout/CrmLayout';
import { useSenders, useConnectSender, useDeleteSender, useVerifySender } from '../../lib/crm/useCrmQueries';
import {
  Mail, Plus, Trash2, CheckCircle, XCircle, Loader2,
  Eye, EyeOff, Inbox, Settings,
} from 'lucide-react';
import {
  CrmPage, CrmPageHeader, CrmPrimaryBtn, CrmGhostBtn,
  CrmEmptyState, CrmCard,
} from '@/components/crm/CrmUI';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'gmail',   label: 'Gmail',         Icon: Mail,     host: 'smtp.gmail.com',      port: 587 },
  { id: 'outlook', label: 'Outlook / 365', Icon: Inbox,   host: 'smtp.office365.com', port: 587 },
  { id: 'smtp',    label: 'Custom SMTP',   Icon: Settings, host: '',                   port: 587 },
];

const STATUS_COLORS = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  error:  'bg-red-50 text-red-700',
};

function GmailInstructions() {
  return (
    <div className="crm-callout mb-5 space-y-2">
      <p className="font-semibold text-gray-900">Gmail needs an App Password</p>
      <p className="text-gray-600">Use an App Password, not your regular Gmail password.</p>
      <ol className="list-decimal space-y-1 pl-4 text-gray-600">
        <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="crm-link underline">myaccount.google.com/security</a></li>
        <li>Turn on 2-Step Verification if it is not already on</li>
        <li>Search for App Passwords</li>
        <li>Create one for Mail, name it FreshLien</li>
        <li>Paste the 16-character password below</li>
      </ol>
    </div>
  );
}

function OutlookInstructions() {
  return (
    <div className="crm-callout mb-5 space-y-2">
      <p className="font-semibold text-gray-900">Outlook / Microsoft 365</p>
      <ol className="list-decimal space-y-1 pl-4 text-gray-600">
        <li>Your Outlook email and password usually work if SMTP is enabled</li>
        <li>For work accounts, ask your admin to enable SMTP AUTH</li>
        <li>Or create an App Password at <a href="https://mysignins.microsoft.com/security-info" target="_blank" rel="noreferrer" className="crm-link underline">mysignins.microsoft.com</a></li>
      </ol>
    </div>
  );
}

function ConnectForm({ tab, onSuccess }) {
  const [email, setEmail]             = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword]       = useState('');
  const [smtpHost, setSmtpHost]       = useState(tab.host);
  const [smtpPort, setSmtpPort]       = useState(tab.port);
  const [showPass, setShowPass]       = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [verifyError, setVerifyError]   = useState('');

  const verifyMut  = useVerifySender();
  const connectMut = useConnectSender();

  async function handleVerify() {
    setVerifyStatus(null);
    try {
      await verifyMut.mutateAsync({ email, password, smtp_host: smtpHost, smtp_port: smtpPort });
      setVerifyStatus('ok');
    } catch (err) {
      setVerifyStatus('error');
      setVerifyError(err.message);
    }
  }

  async function handleConnect(e) {
    e.preventDefault();
    try {
      await connectMut.mutateAsync({
        email, display_name: displayName, provider: tab.id,
        password, smtp_host: smtpHost, smtp_port: smtpPort,
      });
      onSuccess();
    } catch (err) {
      setVerifyStatus('error');
      setVerifyError(err.message);
    }
  }

  const ready = email && displayName && password && (tab.id !== 'smtp' || smtpHost);

  return (
    <form onSubmit={handleConnect} className="space-y-5">
      {tab.id === 'gmail'   && <GmailInstructions />}
      {tab.id === 'outlook' && <OutlookInstructions />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="crm-label">Your {tab.label} email</label>
          <input
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="crm-input"
          />
        </div>
        <div>
          <label className="crm-label">Display name</label>
          <input
            type="text" required
            value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Jane Smith, Real Estate Investor"
            className="crm-input"
          />
          <p className="mt-1 text-xs text-gray-400">Shown to recipients as the sender.</p>
        </div>
      </div>

      {tab.id === 'smtp' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="crm-label">SMTP host</label>
            <input
              type="text" required
              value={smtpHost} onChange={e => setSmtpHost(e.target.value)}
              placeholder="smtp.yourdomain.com"
              className="crm-input"
            />
          </div>
          <div>
            <label className="crm-label">Port</label>
            <input
              type="number"
              value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))}
              className="crm-input"
            />
          </div>
        </div>
      )}

      <div>
        <label className="crm-label">
          {tab.id === 'gmail' ? 'Gmail App Password' : 'Password / App Password'}
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'} required
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder={tab.id === 'gmail' ? 'xxxx xxxx xxxx xxxx' : '••••••••'}
            className="crm-input pr-10"
          />
          <button
            type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Encrypted before storage. We never read your password.
        </p>
      </div>

      {verifyStatus === 'ok' && (
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
          <CheckCircle size={16} /> Connection verified
        </div>
      )}
      {verifyStatus === 'error' && (
        <div className="text-sm text-red-600">
          <XCircle size={14} className="mr-1 inline" />
          {verifyError}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <CrmGhostBtn type="button" onClick={handleVerify} disabled={!ready || verifyMut.isPending}>
          {verifyMut.isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
          Test connection
        </CrmGhostBtn>
        <CrmPrimaryBtn type="submit" disabled={!ready || connectMut.isPending || verifyStatus === 'error'}>
          {connectMut.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Connect inbox
        </CrmPrimaryBtn>
      </div>
    </form>
  );
}

function SenderCard({ sender, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const deleteMut = useDeleteSender();

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    await deleteMut.mutateAsync(sender.id);
  }

  const pct = sender.daily_limit > 0
    ? Math.min(100, Math.round((sender.sent_today / sender.daily_limit) * 100))
    : 0;

  const providerLabel = { gmail: 'Gmail', outlook: 'Outlook / 365', smtp: 'Custom SMTP' };

  return (
    <CrmCard hover className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crm-light text-crm">
          <Inbox size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{sender.display_name}</p>
          <p className="truncate text-sm text-gray-500">{sender.email}</p>
          <span className="text-xs text-gray-400">{providerLabel[sender.provider] || sender.provider}</span>
        </div>
      </div>

      <div className="max-w-xs min-w-0 flex-1">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>Sent today</span>
          <span>{sender.sent_today} / {sender.daily_limit}</span>
        </div>
        <div className="crm-progress">
          <div className="crm-progress-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[sender.status] || STATUS_COLORS.active}`}>
          {sender.status}
        </span>
        {sender.last_error && (
          <span className="max-w-[160px] truncate text-xs text-red-500" title={sender.last_error}>
            {sender.last_error}
          </span>
        )}
        <button
          onClick={handleDelete}
          disabled={deleteMut.isPending}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
            confirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
          )}
        >
          {deleteMut.isPending ? <Loader2 size={13} className="animate-spin" /> : (confirm ? 'Confirm delete' : <Trash2 size={13} />)}
        </button>
      </div>
    </CrmCard>
  );
}

export default function CrmSendersPage() {
  const { data: senders = [], isLoading } = useSenders();
  const [activeTab, setActiveTab]         = useState('gmail');
  const [showForm, setShowForm]           = useState(false);

  const tab = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <CrmLayout>
      <CrmPage narrow>
        <CrmPageHeader
          title="My Inboxes"
          subtitle="Send from your own Gmail or Outlook. Replies come straight to you."
          actions={
            <CrmPrimaryBtn onClick={() => setShowForm(p => !p)}>
              <Plus size={15} />
              {showForm ? 'Cancel' : 'Connect inbox'}
            </CrmPrimaryBtn>
          }
        />

        {senders.length === 0 && !showForm && (
          <div className="crm-callout mb-8">
            <h2 className="mb-2 font-semibold text-gray-900">Connect your Gmail</h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
              <li>Every email comes from your real address</li>
              <li>Replies land in your Gmail inbox</li>
              <li>Your sending reputation stays with your account</li>
              <li>Gmail allows up to 500 emails each day</li>
              <li>Google Workspace allows up to 2,000</li>
              <li>FreshLien only sends emails you approve</li>
            </ul>
          </div>
        )}

        {showForm && (
          <CrmCard className="mb-8 p-6">
            <h2 className="mb-5 flex items-center gap-2 font-semibold text-gray-900">
              <Plus size={17} /> Connect a new inbox
            </h2>

            <div className="mb-6 flex w-fit gap-1 rounded-xl bg-gray-100 p-1">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
                    activeTab === t.id
                      ? 'bg-white text-crm shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <t.Icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            <ConnectForm tab={tab} onSuccess={() => setShowForm(false)} />
          </CrmCard>
        )}

        <div className="space-y-3">
          {isLoading && (
            <div className="flex justify-center py-14">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          )}
          {!isLoading && senders.length === 0 && !showForm && (
            <CrmCard>
              <CrmEmptyState
                icon={Inbox}
                title="No inboxes connected"
                description="Connect your Gmail so every campaign sends from your own account."
                action={
                  <CrmPrimaryBtn onClick={() => setShowForm(true)}>
                    <Plus size={14} /> Connect your first inbox
                  </CrmPrimaryBtn>
                }
              />
            </CrmCard>
          )}
          {senders.map(sender => (
            <SenderCard key={sender.id} sender={sender} />
          ))}
        </div>
      </CrmPage>
    </CrmLayout>
  );
}
