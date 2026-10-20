import { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPANY } from '@/data/company';
import { ENGAGEMENTS, SERVICES, SOLUTIONS } from '@/data/siteContent';

const TIMELINES = ['As soon as possible', 'Within 1 month', '1–3 months', 'Just exploring'];
const BUDGETS = ['Not sure yet', 'Under $10k', '$10k–$25k', '$25k–$75k', '$75k+', 'Monthly retainer'];

function Field({ label, htmlFor, optional, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="site-label">
        {label} {optional && <span className="font-normal text-ink-mute">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * Lead capture form posted to FormSubmit, which emails the submission to COMPANY.contactEmail.
 * `variant="full"` is the project intake; `variant="short"` is the general contact form.
 */
export default function LeadForm({ variant = 'full', subject, defaults = {}, sentParam = 'sent' }) {
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState(() =>
    defaults.service ? SERVICES.filter((s) => s.name === defaults.service).map((s) => s.name) : []
  );

  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set(sentParam, '1');
    return url.toString();
  }, [sentParam]);

  const toggle = (name) =>
    setServices((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const isFull = variant === 'full';

  return (
    <form
      action={`https://formsubmit.co/${COMPANY.contactEmail}`}
      method="POST"
      onSubmit={() => setSubmitting(true)}
      className="space-y-6"
    >
      <input type="hidden" name="_subject" value={subject || (isFull ? 'New project inquiry' : 'Website contact')} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {redirectUrl && <input type="hidden" name="_next" value={redirectUrl} />}
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
      {isFull && <input type="hidden" name="services" value={services.join(', ') || 'Not specified'} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="lf-name">
          <input id="lf-name" name="name" required autoComplete="name" className="site-input" placeholder="Jane Doe" />
        </Field>
        <Field label="Work email" htmlFor="lf-email">
          <input
            id="lf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="site-input"
            placeholder="jane@company.com"
          />
        </Field>
        <Field label="Company" htmlFor="lf-company" optional={!isFull}>
          <input id="lf-company" name="company" required={isFull} autoComplete="organization" className="site-input" />
        </Field>
        {isFull ? (
          <Field label="Your team" htmlFor="lf-team">
            <select id="lf-team" name="team_type" required defaultValue={defaults.team || ''} className="site-input">
              <option value="" disabled>
                Select one
              </option>
              {SOLUTIONS.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </Field>
        ) : (
          <Field label="Topic" htmlFor="lf-topic" optional>
            <input id="lf-topic" name="topic" defaultValue={defaults.topic || ''} className="site-input" placeholder="Project, partnership, press…" />
          </Field>
        )}
      </div>

      {isFull && (
        <>
          <fieldset>
            <legend className="site-label">What do you need help with?</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const active = services.includes(s.name);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggle(s.name)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                      active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft hover:border-ink/30'
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5 text-white/60" strokeWidth={3} />}
                    {s.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Engagement" htmlFor="lf-engagement">
              <select id="lf-engagement" name="engagement" defaultValue={defaults.engagement || 'Not sure yet'} className="site-input">
                <option>Not sure yet</option>
                {ENGAGEMENTS.map((e) => (
                  <option key={e.name}>{e.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Timeline" htmlFor="lf-timeline">
              <select id="lf-timeline" name="timeline" defaultValue={TIMELINES[1]} className="site-input">
                {TIMELINES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget" htmlFor="lf-budget">
              <select id="lf-budget" name="budget" defaultValue={BUDGETS[0]} className="site-input">
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Markets" htmlFor="lf-markets" optional>
            <input id="lf-markets" name="markets" className="site-input" placeholder="e.g. Phoenix MSA, North NJ, all of Texas" />
          </Field>
        </>
      )}

      <Field label={isFull ? 'What are you trying to solve?' : 'Message'} htmlFor="lf-message">
        <textarea
          id="lf-message"
          name="message"
          required
          rows={isFull ? 5 : 6}
          className="site-textarea"
          placeholder={
            isFull
              ? 'Tell us about your workflow, the tools you use today, and what a great outcome looks like.'
              : 'How can we help?'
          }
        />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-ink-mute">
          We only use your details to reply to this request. No mailing lists without your consent.
        </p>
        <button type="submit" disabled={submitting} className="site-btn-primary group shrink-0 disabled:opacity-60">
          {submitting ? 'Sending…' : isFull ? 'Send project details' : 'Send message'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}

export function SentState({ title = 'Thanks, we have got it.', body }) {
  return (
    <div className="py-10 text-center">
      <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </span>
      <h2 className="mt-6 font-tight text-2xl font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        {body || 'A member of the team will reply within one business day, usually with a couple of times for a call.'}
      </p>
    </div>
  );
}
