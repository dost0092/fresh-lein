import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Globe,
  Loader2,
  Lock,
  Phone,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconTile } from '@/components/site/ui';
import { GlyphCompass, GlyphMail } from '@/components/site/Glyphs';
import { COMPANY, CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { SERVICES, SOLUTIONS } from '@/data/siteContent';

const NOT_SURE = 'Not sure yet';
const TIMELINES = ['As soon as possible', 'Within a month', '1–3 months', 'Just exploring'];
const BUDGETS = [NOT_SURE, 'Under $10k', '$10k–$25k', '$25k–$75k', '$75k+', 'Monthly retainer'];
const TIMES = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
const DRAFT_KEY = 'fl-booking-draft';

const STEPS = [
  { key: 'goals', label: 'Goals', title: 'What would you like help with?', hint: 'Pick as many as you like.' },
  { key: 'team', label: 'Your team', title: 'Tell us a little about your team.', hint: 'So the call starts in the right place.' },
  { key: 'time', label: 'Time', title: 'Pick a time that suits you.', hint: 'Shown in your local time zone.' },
  { key: 'details', label: 'Details', title: 'Where should we send the invite?', hint: 'Last step. Takes 30 seconds.' },
];

/** Next `count` weekdays, starting tomorrow. */
function upcomingWeekdays(count = 10) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
  }
  return days;
}

const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function fromIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function formatLongDate(iso) {
  return fromIso(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function timeZoneLabel() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const short = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value;
    return { zone, short: short || zone };
  } catch {
    return { zone: 'your local time', short: 'local' };
  }
}

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(value) {
  try {
    if (value) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable: the form still works, it just won't remember */
  }
}

const EMPTY = {
  services: [],
  team: '',
  timeline: '',
  budget: NOT_SURE,
  markets: '',
  callType: 'video',
  date: '',
  time: '',
  name: '',
  email: '',
  company: '',
  phone: '',
  notes: '',
  engagement: '',
};

/* ── Small building blocks ────────────────────────────────────────────── */

function OptionCard({ active, onClick, icon, title, body, className, radio = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={radio ? 'radio' : undefined}
      aria-checked={radio ? active : undefined}
      aria-pressed={radio ? undefined : active}
      className={cn(
        'group relative flex w-full items-start gap-3.5 rounded-2xl border bg-white p-4 text-left transition-[border-color,box-shadow,background-color] duration-200',
        active
          ? 'border-ink shadow-[0_0_0_1px_#0F1412,0_8px_24px_-12px_rgba(15,20,18,0.25)]'
          : 'border-line-strong hover:border-ink/30 hover:shadow-lift',
        className
      )}
    >
      {icon && <IconTile icon={icon} size="sm" interactive active={active} />}
      <span className="min-w-0 flex-1 pr-6">
        <span className="block text-[14.5px] font-semibold leading-snug text-ink">{title}</span>
        {body && <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-ink-mute">{body}</span>}
      </span>
      <span
        className={cn(
          'absolute right-3.5 top-3.5 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200',
          active ? 'border-ink bg-ink text-white' : 'border-line-strong bg-white text-transparent group-hover:border-ink/30'
        )}
        aria-hidden
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}

function Pill({ active, onClick, children, role = 'radio' }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'radio' ? active : undefined}
      aria-pressed={role === 'radio' ? undefined : active}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-all duration-200',
        active
          ? 'border-ink bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
          : 'border-line-strong bg-white text-ink-soft hover:border-ink/30 hover:text-ink'
      )}
    >
      {active && <Check className="h-3.5 w-3.5 text-white/70" strokeWidth={3} />}
      {children}
    </button>
  );
}

function GroupLabel({ children, optional, id }) {
  return (
    <p id={id} className="site-label">
      {children} {optional && <span className="font-normal text-ink-faint">· optional</span>}
    </p>
  );
}

function Progress({ step }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px]">
        <p className="font-medium text-ink">
          Step {step + 1} <span className="text-ink-faint">of {STEPS.length}</span>
        </p>
        <p className="text-ink-mute">{STEPS[step].label}</p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s.key} className="h-1 overflow-hidden rounded-full bg-line">
            <span
              className={cn(
                'block h-full rounded-full bg-ink transition-[width] duration-500 ease-out-expo',
                i <= step ? 'w-full' : 'w-0'
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Summary panel ────────────────────────────────────────────────────── */

function SummaryRow({ icon: Icon, label, children, muted }) {
  return (
    <div className="flex gap-3 py-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-ink-mute">{label}</p>
        <div className={cn('mt-0.5 text-[14px] font-medium', muted ? 'text-ink-faint' : 'text-ink')}>{children}</div>
      </div>
    </div>
  );
}

function Summary({ data, tz }) {
  const CallIcon = data.callType === 'phone' ? Phone : Video;
  return (
    <div className="rounded-[1.25rem] border border-line bg-white shadow-hairline">
      <div className="border-b border-line p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute">Your call</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-2 py-0.5 text-[11.5px] font-medium text-leaf ring-1 ring-inset ring-leaf-100">
            Free
          </span>
        </div>
        <p className="mt-3 font-tight text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Strategy call</p>
        <p className="mt-1 flex items-center gap-3 text-[13px] text-ink-mute">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> 30 min
          </span>
          <span className="h-3 w-px bg-line-strong" />
          <span className="inline-flex items-center gap-1.5">
            <CallIcon className="h-3.5 w-3.5" /> {data.callType === 'phone' ? 'Phone call' : 'Video call'}
          </span>
        </p>
      </div>
      <div className="divide-y divide-line px-5">
        <SummaryRow icon={CalendarDays} label="Preferred time" muted={!data.date || !data.time}>
          {data.date && data.time ? (
            <>
              {formatLongDate(data.date)}
              <span className="block text-[13px] font-normal text-ink-mute">
                {formatTime(data.time)} · {tz.short}
              </span>
            </>
          ) : (
            'Not picked yet'
          )}
        </SummaryRow>
        <SummaryRow icon={Check} label="Topics" muted={data.services.length === 0}>
          {data.services.length ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.services.map((s) => (
                <span key={s} className="site-chip !text-[11.5px]">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            'Not picked yet'
          )}
        </SummaryRow>
        {(data.team || data.timeline) && (
          <SummaryRow icon={Globe} label="Context">
            {[data.team, data.timeline].filter(Boolean).join(' · ')}
          </SummaryRow>
        )}
      </div>
      <div className="flex items-start gap-2.5 rounded-b-[1.25rem] border-t border-line bg-paper px-5 py-4 text-[12.5px] leading-relaxed text-ink-mute">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Only used to arrange this call. Happy to sign your NDA before you share anything sensitive.
      </div>
    </div>
  );
}

/* ── Success ──────────────────────────────────────────────────────────── */

function Success({ data, tz }) {
  const next = [
    { t: 'Within 1 business day', b: `We confirm your time and send a calendar invite to ${data.email}.` },
    { t: 'Before the call', b: 'Nothing to prepare. Bring your questions and the tools you use today.' },
    { t: 'After the call', b: 'You get a short written summary with a recommended first step.' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col items-center text-center">
        <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white shadow-float">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-leaf-500/25" aria-hidden />
          <Check className="relative h-7 w-7" strokeWidth={2.5} />
        </span>
        <h2 className="mt-7 font-tight text-[1.9rem] font-semibold tracking-[-0.03em] text-ink">
          Request received, {data.name.split(' ')[0] || 'thanks'}.
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
          We have your preferred time of{' '}
          <span className="font-semibold text-ink">
            {formatLongDate(data.date)} at {formatTime(data.time)} {tz.short}
          </span>
          . If it is taken, we will offer the closest slot.
        </p>
      </div>
      <ol className="mx-auto mt-10 max-w-md space-y-0">
        {next.map((n, i) => (
          <li key={n.t} className="relative flex gap-4 pb-6 last:pb-0">
            {i < next.length - 1 && <span className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px bg-line" aria-hidden />}
            <span className="relative mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white font-mono text-[10.5px] text-ink-mute">
              {i + 1}
            </span>
            <div>
              <p className="text-[14.5px] font-semibold text-ink">{n.t}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-ink-mute">{n.b}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/case-studies" className="site-btn-secondary">
          See example work
        </Link>
        <Link to="/" className="site-btn-primary group">
          Back to home <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Wizard ───────────────────────────────────────────────────────────── */

/**
 * Four-step booking request. Answers persist in sessionStorage so a refresh
 * never loses progress; the final step posts everything to FormSubmit, which
 * emails it to COMPANY.contactEmail.
 */
export default function BookingWizard({ defaults = {} }) {
  const reduce = useReducedMotion();
  const topRef = useRef(null);
  const days = useMemo(() => upcomingWeekdays(10), []);
  const tz = useMemo(timeZoneLabel, []);

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [touched, setTouched] = useState(false);
  const [data, setData] = useState(() => {
    const draft = readDraft();
    const base = { ...EMPTY, ...(draft || {}) };
    if (defaults.service && SERVICES.some((s) => s.name === defaults.service) && !base.services.includes(defaults.service)) {
      base.services = [...base.services, defaults.service];
    }
    if (defaults.team && SOLUTIONS.some((s) => s.name === defaults.team)) base.team = defaults.team;
    if (defaults.engagement) base.engagement = defaults.engagement;
    // Drop a stale date from an older draft.
    if (base.date && !days.some((d) => isoDate(d) === base.date)) base.date = '';
    return base;
  });

  useEffect(() => {
    if (status !== 'sent') writeDraft(data);
  }, [data, status]);

  const set = (patch) => setData((prev) => ({ ...prev, ...patch }));
  const toggleService = (name) =>
    setData((prev) => {
      if (name === NOT_SURE) return { ...prev, services: prev.services.includes(NOT_SURE) ? [] : [NOT_SURE] };
      const without = prev.services.filter((s) => s !== NOT_SURE);
      return {
        ...prev,
        services: without.includes(name) ? without.filter((s) => s !== name) : [...without, name],
      };
    });

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const canContinue = [
    data.services.length > 0,
    Boolean(data.team && data.timeline),
    Boolean(data.date && data.time),
    Boolean(data.name.trim() && emailOk && (data.callType !== 'phone' || data.phone.trim())),
  ][step];

  const go = (next) => {
    setTouched(false);
    setStep(next);
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const submit = async () => {
    setStatus('sending');
    const when = `${formatLongDate(data.date)} at ${formatTime(data.time)} (${tz.zone})`;
    const payload = {
      _subject: `Strategy call request: ${data.name}${data.company ? ` (${data.company})` : ''}`,
      _template: 'table',
      _captcha: 'false',
      _honey: '',
      name: data.name,
      email: data.email,
      company: data.company || '-',
      phone: data.phone || '-',
      call_type: data.callType === 'phone' ? 'Phone call' : 'Video call',
      preferred_time: when,
      services: data.services.join(', '),
      team_type: data.team,
      timeline: data.timeline,
      budget: data.budget,
      markets: data.markets || '-',
      engagement: data.engagement || '-',
      notes: data.notes || '-',
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${COMPANY.contactEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      writeDraft(null);
      setStatus('sent');
      topRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    } catch {
      setStatus('error');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canContinue) {
      setTouched(true);
      return;
    }
    if (step < STEPS.length - 1) go(step + 1);
    else submit();
  };

  const current = STEPS[step];
  const selectedDay = data.date ? fromIso(data.date) : null;

  if (status === 'sent') {
    return (
      <div ref={topRef} className="scroll-mt-28 rounded-[1.75rem] border border-line bg-white p-6 shadow-float sm:p-12">
        <Success data={data} tz={tz} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex min-h-[560px] flex-col rounded-[1.75rem] border border-line bg-white shadow-float lg:col-span-8"
      >
        <div className="border-b border-line px-6 pb-6 pt-6 sm:px-9 sm:pt-8">
          <Progress step={step} />
          <h2 className="mt-7 font-tight text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[1.85rem]">
            {current.title}
          </h2>
          <p className="mt-1.5 text-[14.5px] text-ink-mute">{current.hint}</p>
        </div>

        <div className="flex-1 px-6 py-7 sm:px-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.key}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <OptionCard
                      key={s.slug}
                      icon={s.icon}
                      title={s.name}
                      body={s.short}
                      active={data.services.includes(s.name)}
                      onClick={() => toggleService(s.name)}
                    />
                  ))}
                  <OptionCard
                    icon={GlyphCompass}
                    title="Not sure yet"
                    body="Help me figure out where to start."
                    active={data.services.includes(NOT_SURE)}
                    onClick={() => toggleService(NOT_SURE)}
                    className="sm:col-span-2"
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <GroupLabel id="bw-team">Which best describes you?</GroupLabel>
                    <div role="radiogroup" aria-labelledby="bw-team" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {SOLUTIONS.map((s) => (
                        <OptionCard
                          key={s.slug}
                          icon={s.icon}
                          title={s.name}
                          radio
                          active={data.team === s.name}
                          onClick={() => set({ team: s.name })}
                          className="!items-center !p-3"
                        />
                      ))}
                      <OptionCard
                        title="Something else"
                        radio
                        active={data.team === 'Other'}
                        onClick={() => set({ team: 'Other' })}
                        className="!items-center !p-3 sm:col-span-2 [&>span:first-child]:pl-1"
                      />
                    </div>
                  </div>
                  <div>
                    <GroupLabel id="bw-timeline">When would you like to start?</GroupLabel>
                    <div role="radiogroup" aria-labelledby="bw-timeline" className="flex flex-wrap gap-2">
                      {TIMELINES.map((t) => (
                        <Pill key={t} active={data.timeline === t} onClick={() => set({ timeline: t })}>
                          {t}
                        </Pill>
                      ))}
                    </div>
                  </div>
                  <div>
                    <GroupLabel id="bw-budget" optional>
                      Rough budget
                    </GroupLabel>
                    <div role="radiogroup" aria-labelledby="bw-budget" className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Pill key={b} active={data.budget === b} onClick={() => set({ budget: b })}>
                          {b}
                        </Pill>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bw-markets" className="site-label">
                      Markets <span className="font-normal text-ink-faint">· optional</span>
                    </label>
                    <input
                      id="bw-markets"
                      value={data.markets}
                      onChange={(e) => set({ markets: e.target.value })}
                      className="site-input"
                      placeholder="e.g. Phoenix MSA, North NJ, all of Texas"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <GroupLabel id="bw-type">How would you like to meet?</GroupLabel>
                    <div role="radiogroup" aria-labelledby="bw-type" className="grid grid-cols-2 gap-2.5 sm:max-w-md">
                      {[
                        { v: 'video', l: 'Video call', d: 'Google Meet or Zoom', I: Video },
                        { v: 'phone', l: 'Phone call', d: 'We call you', I: Phone },
                      ].map(({ v, l, d, I }) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={data.callType === v}
                          onClick={() => set({ callType: v })}
                          className={cn(
                            'flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200',
                            data.callType === v
                              ? 'border-ink shadow-[0_0_0_1px_#0F1412]'
                              : 'border-line-strong hover:border-ink/30'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                              data.callType === v ? 'bg-ink text-white' : 'bg-mist text-ink-soft'
                            )}
                          >
                            <I className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <span>
                            <span className="block text-[14px] font-semibold text-ink">{l}</span>
                            <span className="block text-[12.5px] text-ink-mute">{d}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <GroupLabel id="bw-day">Day</GroupLabel>
                      <p className="mb-2 text-[12.5px] text-ink-mute">
                        {days[0].toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div
                      role="radiogroup"
                      aria-labelledby="bw-day"
                      className="site-no-scrollbar -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 sm:-mx-9 sm:px-9"
                    >
                      {days.map((d) => {
                        const iso = isoDate(d);
                        const active = data.date === iso;
                        return (
                          <button
                            key={iso}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            aria-label={d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            onClick={() => set({ date: iso })}
                            className={cn(
                              'flex w-[4.25rem] shrink-0 snap-start flex-col items-center rounded-2xl border py-3 transition-all duration-200',
                              active
                                ? 'border-ink bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_20px_-10px_rgba(15,20,18,0.5)]'
                                : 'border-line-strong bg-white text-ink hover:border-ink/30'
                            )}
                          >
                            <span className={cn('text-[11px] font-medium uppercase tracking-wider', active ? 'text-white/60' : 'text-ink-mute')}>
                              {d.toLocaleDateString(undefined, { weekday: 'short' })}
                            </span>
                            <span className="site-tabular mt-1 font-tight text-xl font-semibold">{d.getDate()}</span>
                            <span className={cn('text-[11px]', active ? 'text-white/60' : 'text-ink-faint')}>
                              {d.toLocaleDateString(undefined, { month: 'short' })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <GroupLabel id="bw-time">Time</GroupLabel>
                      <p className="mb-2 inline-flex items-center gap-1.5 text-[12.5px] text-ink-mute">
                        <Globe className="h-3.5 w-3.5" /> {tz.zone}
                      </p>
                    </div>
                    <div role="radiogroup" aria-labelledby="bw-time" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {TIMES.map((t) => {
                        const active = data.time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            disabled={!selectedDay}
                            onClick={() => set({ time: t })}
                            className={cn(
                              'site-tabular h-11 rounded-xl border text-[14px] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
                              active
                                ? 'border-ink bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                : 'border-line-strong bg-white text-ink hover:border-ink/30'
                            )}
                          >
                            {formatTime(t)}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[12.5px] text-ink-mute">
                      {selectedDay ? 'We confirm by email within one business day.' : 'Pick a day first.'}
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bw-name" className="site-label">
                        Full name
                      </label>
                      <input
                        id="bw-name"
                        value={data.name}
                        onChange={(e) => set({ name: e.target.value })}
                        autoComplete="name"
                        className="site-input"
                        placeholder="Jane Doe"
                        aria-invalid={touched && !data.name.trim()}
                      />
                    </div>
                    <div>
                      <label htmlFor="bw-email" className="site-label">
                        Work email
                      </label>
                      <input
                        id="bw-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => set({ email: e.target.value })}
                        autoComplete="email"
                        className={cn('site-input', touched && !emailOk && '!border-red-300 focus:!ring-red-500/10')}
                        placeholder="jane@company.com"
                        aria-invalid={touched && !emailOk}
                      />
                    </div>
                    <div>
                      <label htmlFor="bw-company" className="site-label">
                        Company <span className="font-normal text-ink-faint">· optional</span>
                      </label>
                      <input
                        id="bw-company"
                        value={data.company}
                        onChange={(e) => set({ company: e.target.value })}
                        autoComplete="organization"
                        className="site-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="bw-phone" className="site-label">
                        Phone{' '}
                        {data.callType !== 'phone' && <span className="font-normal text-ink-faint">· optional</span>}
                      </label>
                      <input
                        id="bw-phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => set({ phone: e.target.value })}
                        autoComplete="tel"
                        className={cn(
                          'site-input',
                          touched && data.callType === 'phone' && !data.phone.trim() && '!border-red-300'
                        )}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bw-notes" className="site-label">
                      Anything we should know? <span className="font-normal text-ink-faint">· optional</span>
                    </label>
                    <textarea
                      id="bw-notes"
                      rows={4}
                      value={data.notes}
                      onChange={(e) => set({ notes: e.target.value })}
                      className="site-textarea"
                      placeholder="Your current tools, the workflow that hurts most, or a link to a list or site."
                    />
                  </div>
                  {status === 'error' && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800" role="alert">
                      That did not go through. Please try again, or email{' '}
                      <a className="font-semibold underline" href={CONTACT_MAILTO_SUBJECT('Strategy call request')}>
                        {COMPANY.contactEmail}
                      </a>
                      .
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="sticky bottom-0 z-10 flex items-center justify-between gap-4 rounded-b-[1.75rem] border-t border-line bg-white/90 px-6 py-4 backdrop-blur-md sm:px-9 lg:static lg:bg-paper/70 lg:backdrop-blur-none"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {step > 0 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[14.5px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <p className="hidden items-center gap-2 text-[12.5px] text-ink-mute sm:inline-flex">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-soft-pulse rounded-full bg-leaf-500" />
              </span>
              Replies within one business day
            </p>
          )}
          <div className="ml-auto flex items-center gap-4">
            {touched && !canContinue && (
              <p className="hidden text-[13px] text-red-700 sm:block" role="status">
                {step === 3 ? 'Add your name and a valid email.' : 'Choose an option to continue.'}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className={cn('site-btn-primary group', !canContinue && 'opacity-50 hover:bg-ink')}
              aria-disabled={!canContinue}
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Request this time <Check className="h-4 w-4" strokeWidth={2.5} />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <aside className="space-y-4 lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <Summary data={data} tz={tz} />
          <a
            href={CONTACT_MAILTO_SUBJECT('Strategy call request')}
            className="group mt-4 flex items-center gap-3 rounded-[1.25rem] border border-line bg-white p-4 text-[13.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <IconTile icon={GlyphMail} size="sm" interactive />
            <span className="min-w-0">
              <span className="block font-medium text-ink">Prefer email?</span>
              <span className="block truncate text-ink-mute">{COMPANY.contactEmail}</span>
            </span>
          </a>
        </div>
      </aside>
    </div>
  );
}
