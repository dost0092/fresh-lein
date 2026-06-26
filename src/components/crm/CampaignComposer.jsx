import { useMemo, useRef, useState } from 'react';
import {
  Mail, Users, Send, Save, CheckCircle2, AlertTriangle,
  Loader2, X, ChevronRight, ChevronLeft, Inbox, Eye, Sparkles,
  MessageSquareText, CircleCheck, CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { deriveTags, audienceFor, DEMO_SEND_LIMIT } from '@/lib/crm/crmService';
import {
  useContacts, useSuppressions, useSendCampaign, useSaveDraft,
  useSenders, useSendCampaignViaSmtp,
} from '@/lib/crm/useCrmQueries';
import { TEMPLATE_VARIABLES, renderTemplate } from '@/lib/crm/template';
import { useAuth } from '@/lib/AuthContext';

const SAMPLE_CONTACT = {
  first_name: 'Jordan', last_name: 'Avery', email: 'jordan@example.com',
  neighborhood: 'Maple Heights', property_type: 'a 3-bed colonial', budget: '$450k',
};

const STEPS = [
  { n: 1, label: 'Details'  },
  { n: 2, label: 'Audience' },
  { n: 3, label: 'Compose'  },
  { n: 4, label: 'Preview'  },
  { n: 5, label: 'Launch'   },
];

/* ─── Step Progress Bar ──────────────────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                done   ? 'bg-blue-600 text-white'          :
                active ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                         'bg-gray-100 text-gray-400'
              }`}>
                {done ? <CheckCircle2 size={16} /> : s.n}
              </div>
              <span className={`mt-1.5 text-[11px] font-medium whitespace-nowrap ${
                active ? 'text-blue-700' : done ? 'text-gray-600' : 'text-gray-400'
              }`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-4 transition-all ${done ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────────────────────────── */
function Field({ label, helper, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-800">{label}</Label>
      {children}
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function CampaignComposer({ initial, onClose }) {
  const { profile } = useAuth();
  const { data: contacts = []       } = useContacts();
  const { data: suppressionList = []} = useSuppressions();
  const { data: senders = []        } = useSenders();
  const tags        = useMemo(() => deriveTags(contacts), [contacts]);
  const sendMut     = useSendCampaign();
  const smtpSendMut = useSendCampaignViaSmtp();
  const saveDraftMut= useSaveDraft();

  // Form state — logic unchanged
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name || '');
  const [channel, setChannel]             = useState(initial?.channel || 'email');
  const [audienceTag, setAudienceTag]     = useState(initial?.audienceTag || 'all');
  const [subject, setSubject]             = useState(initial?.subject || '');
  const [body, setBody]                   = useState(initial?.body || '');
  const [selectedSenderId, setSelectedSenderId] = useState(initial?.senderAccountId || '');
  const [senderName, setSenderName]       = useState(initial?.senderName || profile?.full_name || '');
  const [replyToEmail, setReplyToEmail]   = useState(initial?.replyToEmail || profile?.email || '');
  const [result, setResult]               = useState(null);
  const bodyRef = useRef(null);
  const sending = sendMut.isPending || smtpSendMut.isPending;

  const selectedSender = senders.find(s => s.id === selectedSenderId);
  const usingOwnInbox  = !!selectedSender;

  const recipients = useMemo(
    () => audienceFor(contacts, suppressionList, audienceTag),
    [contacts, suppressionList, audienceTag]
  );
  const capped         = recipients.slice(0, DEMO_SEND_LIMIT);
  const previewContact = recipients[0] || SAMPLE_CONTACT;

  const insertVariable = (token) => {
    const el = bodyRef.current;
    if (!el) { setBody(b => b + token); return; }
    const start = el.selectionStart ?? body.length;
    const end   = el.selectionEnd   ?? body.length;
    setBody(body.slice(0, start) + token + body.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  };

  // Step validation
  const step1OK = name.trim().length > 0;
  const step2OK = recipients.length > 0;
  const step3OK = subject.trim().length > 0 && body.trim().length > 0;
  const senderOK = usingOwnInbox || senderName.trim().length > 0;
  const replyOK  = usingOwnInbox || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyToEmail.trim());
  const canLaunch = step1OK && step2OK && step3OK && senderOK && replyOK && !sending;

  const handleSend = () => {
    if (!canLaunch) return;
    setResult(null);

    if (usingOwnInbox) {
      smtpSendMut.mutate(
        {
          payload: { campaignId: initial?.id, name, subject, body },
          senderAccountId: selectedSenderId,
          recipients: capped.map(c => ({
            email: c.email,
            name: c.first_name ? `${c.first_name} ${c.last_name || ''}`.trim() : c.email,
            ...c,
          })),
        },
        {
          onSuccess: (data) => {
            setResult({ ...data, total: data.total ?? capped.length, smtpMode: true });
            toast({ title: 'Campaign sent', description: `${data.sent} emails sent from ${selectedSender.email}.` });
          },
          onError: (err) => toast({ title: 'Send failed', description: err?.message }),
        }
      );
      return;
    }

    sendMut.mutate(
      { campaignId: initial?.id, name, channel, subject, body, audienceTag,
        senderName: senderName.trim(), replyToEmail: replyToEmail.trim() },
      {
        onSuccess: (data) => {
          setResult({ ...data, total: data.total ?? capped.length });
          toast({
            title: data.simulated ? 'Campaign sent (simulation)' : 'Campaign sent',
            description: `${data.sent} delivered${data.failed ? ` · ${data.failed} failed` : ''}.`,
          });
        },
        onError: (err) => toast({ title: 'Send failed', description: err?.message }),
      }
    );
  };

  const handleSaveDraft = () => {
    saveDraftMut.mutate(
      { id: initial?.id, name: name || 'Untitled', channel, subject, body, audienceTag },
      {
        onSuccess: () => { toast({ title: 'Draft saved' }); onClose?.(); },
        onError:   (err) => toast({ title: 'Could not save draft', description: err?.message }),
      }
    );
  };

  if (result) return <SendResult result={result} name={name} onClose={onClose} />;

  return (
    <div className="mx-auto max-w-2xl">
      <StepBar current={step} />

      {/* ── Step 1: Details ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <StepHeader
            title="Campaign Details"
            sub="Give your campaign a name and choose the sending channel."
          />

          <Field label="Campaign Name" helper="Only visible to you.">
            <Input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Motivated Sellers — Texas June"
              className="h-11 text-base"
            />
          </Field>

          <Field label="Channel" helper="Email campaigns are live. SMS requires A2P registration.">
            <div className="grid grid-cols-2 gap-3">
              <ChannelCard
                icon={Mail} label="Email" active={channel === 'email'}
                onClick={() => setChannel('email')}
              />
              <ChannelCard
                icon={MessageSquareText} label="SMS (Coming Soon)" active={false} disabled
                onClick={() => toast({ title: 'SMS coming soon' })}
              />
            </div>
          </Field>
        </div>
      )}

      {/* ── Step 2: Audience ─────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          <StepHeader
            title="Choose Your Audience"
            sub="Select which contacts will receive this campaign."
          />

          <Field label="Send To" helper="Only opted-in, unsuppressed contacts receive the campaign.">
            <select
              value={audienceTag}
              onChange={e => setAudienceTag(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All opted-in contacts</option>
              {tags.map(t => <option key={t} value={t}>Tag: {t}</option>)}
            </select>
          </Field>

          <div className="rounded-lg border border-gray-200 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold tabular-nums text-gray-900">
                  {recipients.length.toLocaleString()}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {recipients.length === 0
                    ? 'No eligible contacts'
                    : `eligible recipient${recipients.length === 1 ? '' : 's'}`}
                </p>
              </div>
              {recipients.length > 0 && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  opted-in &amp; unsuppressed
                </span>
              )}
            </div>
            {recipients.length > DEMO_SEND_LIMIT && (
              <p className="mt-3 text-xs text-amber-600 flex items-center gap-1.5 border-t border-gray-100 pt-3">
                <AlertTriangle size={13} />
                Demo plan — only the first {DEMO_SEND_LIMIT} will be sent.
              </p>
            )}
          </div>

          {recipients.length === 0 && (
            <a href="/crm/contacts" className="block rounded-xl border border-gray-200 bg-white p-4 text-sm text-center text-blue-600 font-medium hover:bg-blue-50 transition-colors">
              Import contacts first →
            </a>
          )}
        </div>
      )}

      {/* ── Step 3: Compose ─────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <StepHeader
            title="Write Your Email"
            sub="Personalize with variables — each recipient gets their own version."
          />

          {/* Sender */}
          <Field label="Send From" helper={usingOwnInbox ? `Replies go to ${selectedSender.email}` : 'Connect your Gmail for better deliverability'}>
            {senders.length > 0 ? (
              <select
                value={selectedSenderId}
                onChange={e => setSelectedSenderId(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Platform email (Resend) —</option>
                {senders.map(s => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'active'}>
                    {s.display_name} &lt;{s.email}&gt;{s.status !== 'active' ? ` (${s.status})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">No inbox connected yet.</p>
                <a href="/crm/senders" className="text-sm font-semibold text-amber-800 underline hover:no-underline">Connect Gmail →</a>
              </div>
            )}
          </Field>

          {!usingOwnInbox && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Your Name" helper="Shown to recipients as the sender.">
                <Input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Jane Smith — RE Investor" className="h-11" />
              </Field>
              <Field label="Reply-To Email" helper="Where replies land.">
                <Input type="email" value={replyToEmail} onChange={e => setReplyToEmail(e.target.value)} placeholder="you@youremail.com" className="h-11" />
              </Field>
            </div>
          )}

          <Field label="Subject Line" helper="Keep it short and personal — under 50 characters works best.">
            <Input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Quick question about your property on {{neighborhood}}"
              className="h-11"
            />
          </Field>

          <Field label="Email Body" helper="Use variables below to personalize each email automatically.">
            {/* Variable pills */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {TEMPLATE_VARIABLES.filter(v => v.category === 'contact').map(v => (
                <button
                  key={v.token}
                  type="button"
                  onClick={() => insertVariable(v.token)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {v.token}
                </button>
              ))}
            </div>
            <Textarea
              ref={bodyRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={`Hi {{first_name}},\n\nI noticed your property at {{neighborhood}} and wanted to reach out...\n\n— ${senderName || 'Your name'}`}
              rows={10}
              className="text-sm leading-relaxed resize-none font-mono"
            />
          </Field>
        </div>
      )}

      {/* ── Step 4: Preview ─────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <StepHeader
            title="Preview Your Email"
            sub={`Showing how it looks for ${previewContact.first_name || previewContact.email || 'your first lead'}.`}
          />
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="font-medium">From:</span>
                <span>{usingOwnInbox ? `${selectedSender.display_name} <${selectedSender.email}>` : (senderName || 'Your Name')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="font-medium">To:</span>
                <span>{previewContact.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-900">
                <span className="text-xs font-medium text-gray-500 mt-0.5">Subject:</span>
                <span className="font-semibold">{renderTemplate(subject, previewContact) || '(no subject)'}</span>
              </div>
            </div>
            <div className="px-5 py-5">
              {body ? (
                renderTemplate(body, previewContact).split('\n').map((line, i) => (
                  <p key={i} className={`text-sm text-gray-800 leading-relaxed ${line === '' ? 'h-4' : ''}`}>{line}</p>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No body written yet — go back to Step 3.</p>
              )}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  You received this because you own property at the address mentioned above. <span className="underline">Unsubscribe</span>
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500">
            Every recipient gets a personalized version. Unsubscribe link is added automatically.
          </p>
        </div>
      )}

      {/* ── Step 5: Launch ──────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6">
          <StepHeader
            title="Ready to Launch?"
            sub="Review your campaign before sending. Once launched, emails go out immediately."
          />

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryCard label="Campaign"    value={name}                                               />
            <SummaryCard label="Recipients"  value={`${capped.length} contacts`}                       />
            <SummaryCard label="Send From"   value={usingOwnInbox ? selectedSender.email : 'Platform'} />
            <SummaryCard label="Subject"     value={subject || '—'}                                    />
            <SummaryCard label="Channel"     value="Email"                                              />
            <SummaryCard label="Unsubscribe" value="Auto-included ✓"                                   />
          </div>

          {/* Pre-flight checks */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Pre-flight checks</p>
            <ul className="space-y-2">
              {[
                { ok: step1OK,  label: 'Campaign has a name'              },
                { ok: step2OK,  label: `${capped.length} recipients ready`},
                { ok: !!subject.trim(), label: 'Subject line written'     },
                { ok: !!body.trim(),    label: 'Email body written'       },
                { ok: senderOK, label: usingOwnInbox ? `Sending from ${selectedSender.email}` : 'Sender name set' },
                { ok: true,     label: 'Unsubscribe link auto-included'   },
              ].map(c => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.ok
                    ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    : <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                  <span className={c.ok ? 'text-gray-700' : 'text-amber-700 font-medium'}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {usingOwnInbox && (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
              Sends from <strong>{selectedSender.email}</strong> — replies land in your Gmail inbox.
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!canLaunch}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {sending
              ? <><Loader2 size={18} className="animate-spin" /> Sending to {capped.length} people…</>
              : <><Send size={18} /> Launch Campaign — {capped.length} emails</>}
          </button>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={15} /> Cancel
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={saveDraftMut.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {saveDraftMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !step1OK) ||
                (step === 2 && !step2OK) ||
                (step === 3 && !step3OK)
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Continue <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StepHeader({ title, sub }) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{sub}</p>
    </div>
  );
}

function ChannelCard({ icon: Icon, label, active, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
        active   ? 'border-blue-500 bg-blue-50 text-blue-700'   :
        disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
                   'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/40'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
      {active && <CheckCircle2 size={16} className="absolute right-3 text-blue-600" />}
    </button>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900 truncate" title={value}>{value}</p>
    </div>
  );
}

/* ─── Send Result Screen ─────────────────────────────────────────────────── */
function SendResult({ result, name, onClose }) {
  const failedRows = (result.results || result.failedDetails || []).filter(r => !r.ok || r.error);
  const resendTestLimit =
    result.failed > 0 && result.provider === 'resend' &&
    failedRows.some(r => /only send testing emails|verify a domain/i.test(r.error || ''));

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="flex items-center gap-3 mb-1">
        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
        <h2 className="text-xl font-semibold text-gray-900">
          {result.failed > 0 && !result.smtpMode ? 'Partially sent' : 'Campaign sent'}
        </h2>
      </div>
      <p className="ml-9 text-sm text-gray-500">"{name}" is on its way to your leads.</p>

      {result.smtpMode && (
        <div className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          Sent directly from your Gmail — replies will arrive in your inbox.
          {result.message && <p className="mt-1 text-gray-500">{result.message}</p>}
        </div>
      )}
      {result.simulated && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Simulation mode</strong> — add RESEND_API_KEY in Vercel to send real emails.
        </div>
      )}
      {resendTestLimit && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Resend test mode:</strong> only your signup email can receive. Verify a domain in Resend to send to anyone.
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Total',  value: result.total  },
          { label: 'Sent',   value: result.sent   },
          { label: 'Failed', value: result.failed || 0 },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-semibold tabular-nums text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
