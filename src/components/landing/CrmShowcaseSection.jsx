import { Link } from 'react-router-dom';
import {
  Send, Upload, Users, Inbox, ArrowRight,
  LayoutDashboard, CheckCircle2, Mail,
} from 'lucide-react';
import { LandingContainer, LandingEyebrow } from '@/components/landing/LandingLayout';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

const STEPS = [
  { n: '1', title: 'Connect your Gmail', desc: 'Use your real inbox. Replies land where you already work.' },
  { n: '2', title: 'Import your leads', desc: 'CSV, Excel, or paste a list. We organize contacts for you.' },
  { n: '3', title: 'Launch your campaign', desc: 'Personalize with variables. Send to the right audience.' },
];

const PROOF = [
  { value: '500', label: 'emails/day', sub: 'Gmail limit' },
  { value: '$0', label: 'sending fees', sub: 'You bring your inbox' },
  { value: '50', label: 'free sends', sub: 'Demo plan' },
];

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Inbox, label: 'Inboxes' },
  { icon: Users, label: 'Contacts' },
  { icon: Send, label: 'Campaigns' },
];

function CrmAppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.12)]">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </div>
          <div className="mx-auto flex h-7 min-w-0 flex-1 max-w-[220px] items-center justify-center rounded-md bg-white px-3 text-[11px] text-gray-400 sm:max-w-[280px]">
            app.freshlien.com/crm
          </div>
        </div>

        {/* App shell */}
        <div className="flex min-h-[340px] bg-fl-subtle">
          {/* Sidebar */}
          <div className="hidden w-[148px] shrink-0 border-r border-gray-100 bg-white p-3 sm:block">
            <div className="mb-4 flex items-center gap-1.5 px-1">
              <span className="text-[11px] font-bold tracking-tight text-gray-900">FreshLien</span>
              <span className="rounded border border-primary/20 bg-primary/10 px-1 py-px text-[8px] font-bold uppercase tracking-wider text-primary">
                CRM
              </span>
            </div>
            <div className="space-y-0.5">
              {NAV.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium',
                    active ? 'bg-primary/10 font-semibold text-primary' : 'text-gray-400'
                  )}
                >
                  <Icon size={13} strokeWidth={active ? 2.25 : 1.75} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <p className="text-sm font-semibold text-gray-900">Welcome back, Jordan</p>
            <p className="text-[11px] text-gray-400">Your outreach at a glance</p>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { v: '248', l: 'Contacts' },
                { v: '12', l: 'Campaigns' },
                { v: '1,840', l: 'Sent' },
                { v: '50', l: 'Limit' },
              ].map(s => (
                <div key={s.l} className="rounded-lg border border-gray-200/80 bg-white px-3 py-2.5">
                  <p className="text-lg font-semibold tabular-nums text-gray-900">{s.v}</p>
                  <p className="text-[10px] text-gray-400">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Campaign table */}
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200/80 bg-white">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-[11px] font-semibold text-gray-700">Recent campaigns</p>
              </div>
              {[
                { name: 'Maple Heights sellers', status: 'Sent', sent: '42', dot: 'bg-emerald-500' },
                { name: 'Pre-foreclosure TX', status: 'Draft', sent: '—', dot: 'bg-gray-300' },
              ].map(row => (
                <div key={row.name} className="flex items-center justify-between border-b border-gray-50 px-3 py-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-gray-900">{row.name}</p>
                    <p className="text-[10px] text-gray-400">{row.sent} recipients</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Compose hint */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/15 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Mail size={14} className="shrink-0 text-primary" />
                <p className="truncate text-[11px] text-gray-600">
                  Sending from <span className="font-medium text-gray-900">jordan@gmail.com</span>
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white">
                New campaign
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating proof card */}
      <div className="absolute -bottom-5 -left-2 hidden rounded-xl border border-gray-200/90 bg-white px-4 py-3 shadow-lg sm:block lg:-left-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Replies in your Gmail</p>
            <p className="text-[10px] text-gray-400">No shared sending pool</p>
          </div>
        </div>
      </div>

      {/* Floating stat */}
      <div className="absolute -right-2 top-8 hidden rounded-xl border border-gray-200/90 bg-white px-4 py-3 shadow-lg sm:block lg:-right-6">
        <p className="text-2xl font-semibold tabular-nums text-primary">98%</p>
        <p className="text-[10px] text-gray-400">Inbox placement</p>
      </div>
    </div>
  );
}

export default function CrmShowcaseSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section id="crm" className="relative overflow-hidden border-y border-border bg-white">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(19,81,51,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(19,81,51,0.04),transparent)]" />

      <LandingContainer className="relative py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <LandingEyebrow>Outreach CRM</LandingEyebrow>

            <h2 className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              Turn property leads into conversations
            </h2>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Import your contacts, write one email, and personalize it for every lead.
              Send from your own Gmail so replies land where you already work.
              Pair it with live foreclosure data and you never run out of people to reach.
            </p>

            {/* Proof stats */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {PROOF.map(p => (
                <div key={p.label} className="rounded-xl border border-border/80 bg-white px-3 py-3.5 text-center shadow-sm">
                  <p className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl">{p.value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-foreground">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={isAuthenticated ? '/crm' : '/register'}
                className="fl-btn-primary px-6 py-3"
              >
                {isAuthenticated ? 'Open your CRM' : 'Start free'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/crm/senders' : '/login'}
                className="fl-btn-ghost px-5 py-3"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No credit card to test. Send up to 50 emails on the demo plan.
            </p>
          </div>

          {/* App preview */}
          <CrmAppPreview />
        </div>

        {/* How it works */}
        <div className="mt-16 lg:mt-20">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(s => (
              <div key={s.n} className="fl-card p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 text-xs font-bold text-primary">
                  {s.n}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Upload, title: 'Import in seconds', desc: 'CSV, Excel, or paste. Columns map automatically.' },
            { icon: Users, title: 'Tag and segment', desc: 'Group buyers, sellers, and hot leads for each send.' },
            { icon: Send, title: 'Personalize at scale', desc: 'First name, neighborhood, and custom variables built in.' },
            { icon: Inbox, title: 'Your own inbox', desc: 'Send from Gmail or Outlook. Your reputation stays yours.' },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-border/80 bg-white p-5 shadow-sm">
              <f.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
