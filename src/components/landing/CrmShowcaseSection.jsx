import { Link } from 'react-router-dom';
import {
  Users,
  Send,
  Upload,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { useAuth } from '@/lib/AuthContext';

const features = [
  {
    icon: Upload,
    title: 'Import in seconds',
    desc: 'Upload a CSV or Excel file, or paste a list of emails. Columns map themselves automatically.',
  },
  {
    icon: Users,
    title: 'Tag & segment',
    desc: 'Organize buyers, sellers, and hot leads with tags, then target the exact audience for each send.',
  },
  {
    icon: Sparkles,
    title: 'Personalize at scale',
    desc: 'Drop in first-name and neighborhood variables so every message reads like it was written by hand.',
  },
  {
    icon: ShieldCheck,
    title: 'Land in the inbox',
    desc: 'Vetted relays, SPF/DKIM alignment, one-click unsubscribe, and auto-suppression keep you out of spam.',
  },
];

export default function CrmShowcaseSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="border-y border-border bg-white py-16 lg:py-24">
      <LandingContainer>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Send className="h-3.5 w-3.5" /> The FreshLien CRM
            </span>
            <h2 className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              The CRM built for real estate agents who actually follow up
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Import your contacts, segment them in a click, and send personalized email campaigns that reach the inbox —
              all from one clean dashboard. Pair it with live foreclosure data and you never run out of people to reach.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={isAuthenticated ? '/crm' : '/register'}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                {isAuthenticated ? 'Open your CRM' : 'Start free'} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/crm/contacts' : '/login'}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
              >
                Import contacts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No credit card to test · send up to 50 emails on the demo plan
            </p>
          </div>

          {/* Visual mock */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Mail className="h-4 w-4 text-primary" /> New campaign
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  Ready to send
                </span>
              </div>
              <div className="space-y-3 pt-4 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Audience</p>
                  <p className="font-medium">Tag: Hot Lead · 42 recipients</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Subject</p>
                  <p className="font-medium">A new home just hit Maple Heights, Jordan</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-3 leading-relaxed text-foreground">
                  Hi Jordan, a 3-bed colonial in Maple Heights just came up that fits your budget…
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Unsubscribe added
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                    <Send className="h-3.5 w-3.5" /> Send to 42
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-2xl font-semibold tabular-nums text-primary">98%</p>
              <p className="text-[11px] text-muted-foreground">Inbox placement</p>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
