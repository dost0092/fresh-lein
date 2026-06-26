import React, { useState } from 'react';
import CrmLayout from '../../components/layout/CrmLayout';
import { useSenders, useConnectSender, useDeleteSender, useVerifySender } from '../../lib/crm/useCrmQueries';
import { Mail, Plus, Trash2, CheckCircle, XCircle, Loader2, Eye, EyeOff, Inbox, Zap, Settings } from 'lucide-react';

const TABS = [
  { id: 'gmail',   label: 'Gmail',        Icon: Mail,     host: 'smtp.gmail.com',      port: 587 },
  { id: 'outlook', label: 'Outlook / 365', Icon: Inbox,   host: 'smtp.office365.com', port: 587 },
  { id: 'smtp',    label: 'Custom SMTP',   Icon: Settings, host: '',                   port: 587 },
];

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-blue-700',
  paused: 'bg-yellow-100 text-yellow-700',
  error:  'bg-red-100 text-red-700',
};

function GmailInstructions() {
  return (
    <div className="mb-5 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 space-y-2">
      <p className="font-semibold flex items-center gap-2">
        <Zap size={15} /> Gmail requires an <strong>App Password</strong> (not your regular password).
      </p>
      <ol className="list-decimal list-inside space-y-1 text-blue-700 pl-1">
        <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="underline font-medium">myaccount.google.com/security</a></li>
        <li>Enable <strong>2-Step Verification</strong> if not already on</li>
        <li>Search for <strong>"App Passwords"</strong> in the search bar</li>
        <li>Create a new App Password → select <strong>Mail / Other</strong> → name it "FreshLien"</li>
        <li>Copy the 16-character password below — use it instead of your Gmail password</li>
      </ol>
    </div>
  );
}

function OutlookInstructions() {
  return (
    <div className="mb-5 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 space-y-2">
      <p className="font-semibold flex items-center gap-2">
        <Zap size={15} /> For <strong>Microsoft 365 / Outlook.com</strong> SMTP.
      </p>
      <ol className="list-decimal list-inside space-y-1 text-blue-700 pl-1">
        <li>Your <strong>Outlook email + regular password</strong> usually works if SMTP AUTH is enabled</li>
        <li>For Microsoft 365 work accounts, ask your admin to enable SMTP AUTH for your account</li>
        <li>Or create an <strong>App Password</strong> at <a href="https://mysignins.microsoft.com/security-info" target="_blank" rel="noreferrer" className="underline font-medium">mysignins.microsoft.com</a></li>
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
  const [verifyStatus, setVerifyStatus] = useState(null); // null | 'ok' | 'error'
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
    <form onSubmit={handleConnect} className="space-y-4">
      {tab.id === 'gmail'   && <GmailInstructions />}
      {tab.id === 'outlook' && <OutlookInstructions />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Your {tab.label} Email</label>
          <input
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Display Name (shown to recipients)</label>
          <input
            type="text" required
            value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Jane Smith — Real Estate Investor"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {tab.id === 'smtp' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">SMTP Host</label>
            <input
              type="text" required
              value={smtpHost} onChange={e => setSmtpHost(e.target.value)}
              placeholder="smtp.yourdomain.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Port</label>
            <input
              type="number"
              value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {tab.id === 'gmail' ? 'Gmail App Password (16 characters)' : 'Password / App Password'}
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'} required
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder={tab.id === 'gmail' ? 'xxxx xxxx xxxx xxxx' : '••••••••'}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Encrypted with AES-256 before storage. We never read your password.
        </p>
      </div>

      {verifyStatus === 'ok' && (
        <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
          <CheckCircle size={16} /> Connection verified successfully
        </div>
      )}
      {verifyStatus === 'error' && (
        <div className="text-red-600 text-sm">
          <XCircle size={14} className="inline mr-1" />
          {verifyError}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button" onClick={handleVerify}
          disabled={!ready || verifyMut.isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          {verifyMut.isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
          Test Connection
        </button>
        <button
          type="submit"
          disabled={!ready || connectMut.isPending || verifyStatus === 'error'}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {connectMut.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Connect Inbox
        </button>
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
          <Inbox size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{sender.display_name}</p>
          <p className="text-sm text-gray-500 truncate">{sender.email}</p>
          <span className="text-xs text-gray-400">{providerLabel[sender.provider] || sender.provider}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 max-w-xs">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Sent today</span>
          <span>{sender.sent_today} / {sender.daily_limit}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sender.status] || STATUS_COLORS.active}`}>
          {sender.status}
        </span>
        {sender.last_error && (
          <span className="text-xs text-red-500 max-w-[160px] truncate" title={sender.last_error}>
            {sender.last_error}
          </span>
        )}
        <button
          onClick={handleDelete}
          disabled={deleteMut.isPending}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            confirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          {deleteMut.isPending ? <Loader2 size={13} className="animate-spin" /> : (confirm ? 'Confirm Delete' : <Trash2 size={13} />)}
        </button>
      </div>
    </div>
  );
}

export default function CrmSendersPage() {
  const { data: senders = [], isLoading } = useSenders();
  const [activeTab, setActiveTab]         = useState('gmail');
  const [showForm, setShowForm]           = useState(false);

  const tab = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <CrmLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Connected Inboxes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Emails are sent directly from your own Gmail or Outlook — never through FreshLien's servers.
            </p>
          </div>
          <button
            onClick={() => setShowForm(p => !p)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={15} />
            {showForm ? 'Cancel' : 'Connect Inbox'}
          </button>
        </div>

        {/* Why BYOI banner */}
        {senders.length === 0 && !showForm && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 flex gap-4">
            <Mail className="text-blue-600 shrink-0 mt-0.5" size={28} />
            <div>
              <h2 className="font-semibold text-blue-900 mb-1">Why connect your own inbox?</h2>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Emails come from <strong>your real Gmail</strong> — land in primary inbox, not spam</li>
                <li>Replies go directly to <strong>your Gmail inbox</strong> — no third-party relay</li>
                <li>Your reputation stays clean — no shared sending pool</li>
                <li>Gmail allows up to <strong>500 emails/day</strong>, Google Workspace up to 2,000</li>
                <li>FreshLien never reads your email — only sends on your behalf</li>
              </ul>
            </div>
          </div>
        )}

        {/* Connect Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={17} /> Connect a New Inbox
            </h2>

            {/* Provider tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === t.id
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <t.Icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            <ConnectForm
              tab={tab}
              onSuccess={() => { setShowForm(false); }}
            />
          </div>
        )}

        {/* Sender list */}
        <div className="space-y-3">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          )}
          {!isLoading && senders.length === 0 && !showForm && (
            <div className="text-center py-12 text-gray-400">
              <Inbox size={40} className="mx-auto mb-3 opacity-40" />
              <p>No inboxes connected yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={14} /> Connect Your First Inbox
              </button>
            </div>
          )}
          {senders.map(sender => (
            <SenderCard key={sender.id} sender={sender} />
          ))}
        </div>
      </div>
    </CrmLayout>
  );
}
