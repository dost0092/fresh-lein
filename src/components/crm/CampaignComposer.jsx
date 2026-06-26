import { useMemo, useRef, useState } from 'react';
import {
  Mail,
  MessageSquareText,
  Users,
  Eye,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { deriveTags, audienceFor, DEMO_SEND_LIMIT } from '@/lib/crm/crmService';
import { useContacts, useSuppressions, useSendCampaign, useSaveDraft } from '@/lib/crm/useCrmQueries';
import { TEMPLATE_VARIABLES, renderTemplate, smsSegments } from '@/lib/crm/template';
import { useAuth } from '@/lib/AuthContext';

const SAMPLE_CONTACT = {
  first_name: 'Jordan',
  last_name: 'Avery',
  email: 'jordan@example.com',
  neighborhood: 'Maple Heights',
  property_type: 'a 3-bed colonial',
  budget: '$450k',
};

export default function CampaignComposer({ initial, onClose }) {
  const { profile } = useAuth();
  const { data: contacts = [] } = useContacts();
  const { data: suppressionList = [] } = useSuppressions();
  const tags = useMemo(() => deriveTags(contacts), [contacts]);
  const sendMut = useSendCampaign();
  const saveDraftMut = useSaveDraft();

  const [name, setName] = useState(initial?.name || '');
  const [channel, setChannel] = useState(initial?.channel || 'email');
  const [audienceTag, setAudienceTag] = useState(initial?.audienceTag || 'all');
  const [subject, setSubject] = useState(initial?.subject || '');
  const [body, setBody] = useState(initial?.body || '');
  const [senderName, setSenderName] = useState(initial?.senderName || profile?.full_name || '');
  const [replyToEmail, setReplyToEmail] = useState(initial?.replyToEmail || profile?.email || '');
  const [result, setResult] = useState(null);
  const bodyRef = useRef(null);
  const sending = sendMut.isPending;

  const recipients = useMemo(
    () => audienceFor(contacts, suppressionList, audienceTag),
    [contacts, suppressionList, audienceTag]
  );
  const capped = recipients.slice(0, DEMO_SEND_LIMIT);
  const previewContact = recipients[0] || SAMPLE_CONTACT;

  const insertVariable = (token) => {
    const el = bodyRef.current;
    if (!el) {
      setBody((b) => b + token);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  };

  const checks = [
    { label: 'Campaign has a name', ok: name.trim().length > 0 },
    channel === 'email'
      ? { label: 'Subject line added', ok: subject.trim().length > 0 }
      : { label: 'Message written', ok: body.trim().length > 0 },
    { label: 'Message body written', ok: body.trim().length > 0 },
    { label: 'At least one recipient', ok: recipients.length > 0 },
    {
      label: 'Reply-to email added',
      ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyToEmail.trim()),
    },
    {
      label: 'Sender name added',
      ok: senderName.trim().length > 0,
    },
    {
      label: 'One-click unsubscribe included automatically',
      ok: true,
      auto: true,
    },
    {
      label: `Within demo limit of ${DEMO_SEND_LIMIT} recipients`,
      ok: recipients.length <= DEMO_SEND_LIMIT,
      warn: recipients.length > DEMO_SEND_LIMIT,
    },
  ];

  const canSend = checks.every((c) => c.ok) && channel === 'email' && !sending;

  const handleSend = () => {
    if (!canSend) return;
    setResult(null);
    sendMut.mutate(
      {
        campaignId: initial?.id,
        name,
        channel,
        subject,
        body,
        audienceTag,
        senderName: senderName.trim(),
        replyToEmail: replyToEmail.trim(),
      },
      {
        onSuccess: (data) => {
          setResult({ ...data, total: data.total ?? capped.length });
          toast({
            title: data.simulated ? 'Campaign sent (simulation)' : 'Campaign sent',
            description: `${data.sent} delivered${data.failed ? ` · ${data.failed} failed` : ''}.`,
          });
        },
        onError: (err) => toast({ title: 'Send failed', description: err?.message || 'Something went wrong.' }),
      }
    );
  };

  const handleSaveDraft = () => {
    saveDraftMut.mutate(
      { id: initial?.id, name: name || 'Untitled campaign', channel, subject, body, audienceTag },
      {
        onSuccess: () => {
          toast({ title: 'Draft saved' });
          onClose?.();
        },
        onError: (err) => toast({ title: 'Could not save draft', description: err?.message }),
      }
    );
  };

  if (result) {
    return <SendResult result={result} name={name} onClose={onClose} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_minmax(320px,420px)]">
      {/* Editor */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="camp-name">Campaign name</Label>
          <Input
            id="camp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. March new listings — Buyers"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Channel</Label>
          <div className="grid grid-cols-2 gap-2">
            <ChannelButton
              active={channel === 'email'}
              icon={Mail}
              label="Email"
              onClick={() => setChannel('email')}
            />
            <ChannelButton
              active={channel === 'sms'}
              icon={MessageSquareText}
              label="SMS"
              soon
              onClick={() => toast({ title: 'SMS coming soon', description: 'SMS requires A2P 10DLC carrier registration. Email is live now.' })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="camp-audience">Audience</Label>
          <select
            id="camp-audience"
            value={audienceTag}
            onChange={(e) => setAudienceTag(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All opted-in contacts</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                Tag: {t}
              </option>
            ))}
          </select>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {recipients.length} eligible recipient{recipients.length === 1 ? '' : 's'}
            {recipients.length > DEMO_SEND_LIMIT && (
              <span className="text-amber-600">· only the first {DEMO_SEND_LIMIT} will send on the demo plan</span>
            )}
          </p>
        </div>

        {channel === 'email' && (
          <div className="space-y-3 rounded-lg border border-border bg-neutral-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sender identity</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="camp-sender-name">Your name (shown to recipients)</Label>
                <Input
                  id="camp-sender-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Mike Avery · ABC Realty"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="camp-reply-to">Reply-to email (where replies go)</Label>
                <Input
                  id="camp-reply-to"
                  type="email"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  placeholder="you@yourbrokerage.com"
                />
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Recipients see <strong>{senderName.trim() || 'Your name'}</strong> as the sender. Replies go to{' '}
              <strong>{replyToEmail.trim() || 'your email'}</strong>. The technical sending address uses your verified
              FreshLien domain (set in Vercel) so mail lands in the inbox, not spam.
            </p>
          </div>
        )}

        {channel === 'email' && (
          <div className="space-y-1.5">
            <Label htmlFor="camp-subject">Subject line</Label>
            <Input
              id="camp-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="A new {{property_type}} just hit {{neighborhood}}"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="camp-body">Message</Label>
            {channel === 'sms' && (
              <span className="text-xs text-muted-foreground">
                {body.length} chars · {smsSegments(body)} segment(s)
              </span>
            )}
          </div>
          <Textarea
            id="camp-body"
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'Hi {{first_name}},\n\nA new home just came up in {{neighborhood}} that fits what you were looking for...'}
            className="min-h-[180px]"
          />
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Insert:
            </span>
            {TEMPLATE_VARIABLES.map((v) => (
              <button
                key={v.token}
                type="button"
                onClick={() => insertVariable(v.token)}
                className="rounded-md border border-border bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side: preview + compliance + actions */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm font-medium">
            <Eye className="h-4 w-4 text-muted-foreground" /> Live preview
          </div>
          <div className="p-4">
            {channel === 'email' ? (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Subject</p>
                <p className="text-sm font-semibold">
                  {renderTemplate(subject, previewContact) || (
                    <span className="text-muted-foreground/60">Your subject line…</span>
                  )}
                </p>
                <div className="mt-2 rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-foreground">
                  {renderTemplate(body, previewContact) ? (
                    renderTemplate(body, previewContact)
                      .split('\n')
                      .map((line, i) => <p key={i} className={line ? '' : 'h-3'}>{line}</p>)
                  ) : (
                    <span className="text-muted-foreground/60">Your message will appear here…</span>
                  )}
                  <p className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
                    Unsubscribe in one click · sent via FreshLien CRM
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Preview personalized for {previewContact.first_name || previewContact.email}
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-[240px] rounded-2xl bg-neutral-100 p-3">
                <div className="rounded-2xl rounded-bl-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                  {renderTemplate(body, previewContact) || 'Your text message…'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium">Compliance & deliverability</p>
          <ul className="space-y-1.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2 text-xs">
                {c.warn ? (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                ) : c.ok ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
                )}
                <span className={c.ok ? 'text-muted-foreground' : 'text-foreground'}>
                  {c.label}
                  {c.auto && <span className="ml-1 text-emerald-600">(auto)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleSend} disabled={!canSend} className="w-full gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending
              ? `Sending to ${capped.length}…`
              : `Send to ${capped.length} recipient${capped.length === 1 ? '' : 's'}`}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} className="flex-1 gap-2">
              <Save className="h-4 w-4" /> Save draft
            </Button>
            <Button variant="ghost" onClick={onClose} className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
          </div>
          {channel === 'email' && (
            <p className="text-center text-[11px] text-muted-foreground">
              Sends through a vetted relay (Resend/SendGrid) with SPF, DKIM &amp; unsubscribe headers. No key configured runs
              in safe simulation mode.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ChannelButton({ active, icon: Icon, label, onClick, soon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border bg-white text-muted-foreground hover:bg-neutral-50'
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
      {soon && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
          Soon
        </span>
      )}
    </button>
  );
}

function SendResult({ result, name, onClose }) {
  const failedRows = (result.results || []).filter((r) => !r.ok);
  const resendTestLimit =
    result.failed > 0 &&
    result.provider === 'resend' &&
    failedRows.some((r) => /only send testing emails|verify a domain/i.test(r.error || ''));

  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-xl font-semibold">
        {result.failed > 0 ? 'Campaign partially sent' : 'Campaign sent'}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        “{name}” {result.simulated ? 'was simulated successfully' : 'is on its way'}.
      </p>
      {result.simulated && (
        <p className="mx-auto mt-3 max-w-sm rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Simulation mode: no email provider key is configured, so no real emails were sent. Add a RESEND_API_KEY (or
          SENDGRID_API_KEY) in your environment to send for real.
        </p>
      )}
      {resendTestLimit && (
        <p className="mx-auto mt-3 max-w-sm rounded-lg bg-amber-50 px-3 py-2 text-left text-xs text-amber-800">
          <strong>Resend test mode:</strong> with <code className="text-[11px]">onboarding@resend.dev</code>, only your
          Resend signup email can receive mail. The other {result.failed} address
          {result.failed === 1 ? '' : 'es'} were rejected. Verify your domain in Resend and set{' '}
          <code className="text-[11px]">CRM_FROM_EMAIL</code> to e.g.{' '}
          <code className="text-[11px]">agents@mail.freshlien.com</code> to send to anyone.
        </p>
      )}
      {result.failed > 0 && !resendTestLimit && failedRows.length > 0 && (
        <div className="mx-auto mt-3 max-w-sm rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-left text-xs text-rose-800">
          <p className="font-medium">Failed recipients:</p>
          <ul className="mt-1 list-inside list-disc">
            {failedRows.slice(0, 5).map((r) => (
              <li key={r.to}>{r.to}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <ResultStat label="Recipients" value={result.total} />
        <ResultStat label="Sent" value={result.sent} good />
        <ResultStat label="Failed" value={result.failed} bad={result.failed > 0} />
      </div>
      <Button className="mt-6 w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}

function ResultStat({ label, value, good, bad }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p
        className={`text-2xl font-semibold tabular-nums ${
          good ? 'text-emerald-600' : bad ? 'text-rose-600' : ''
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
