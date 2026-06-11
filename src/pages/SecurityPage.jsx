import { Link } from 'react-router-dom';
import { KeyRound, Lock, Server, ShieldCheck } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

const practices = [
  {
    icon: Lock,
    title: 'Encryption in transit',
    text: 'All traffic between your browser and FreshLien is served over HTTPS (TLS). API and database connections use encrypted channels.',
  },
  {
    icon: KeyRound,
    title: 'Secure authentication',
    text: 'Passwords are hashed and never stored in plain text. Sessions are managed through Supabase Auth with industry-standard token handling.',
  },
  {
    icon: Server,
    title: 'Infrastructure',
    text: 'We host on Vercel and Supabase — providers with SOC 2 compliance programs, automated backups, and monitored uptime.',
  },
  {
    icon: ShieldCheck,
    title: 'Access controls',
    text: 'Database row-level security ensures users only access their own account data. Foreclosure records are read-only public filings.',
  },
];

export default function SecurityPage() {
  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow="Security"
        title="How we protect your data"
        description="FreshLien is built on modern, security-focused infrastructure so you can research deals with confidence."
      />

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <LandingSectionHeader
            eyebrow="Our practices"
            title="Security by design"
            description="We follow standard SaaS security practices and continuously improve as we scale."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {practices.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border/60 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="border-t border-border bg-slate-50/60 py-11 lg:py-14">
        <LandingContainer>
          <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-lg font-semibold text-foreground">Payments</h2>
            <p>
              Billing is handled by Stripe. Card details are entered on Stripe&apos;s secure checkout — we never
              see or store your full payment card number.
            </p>

            <h2 className="font-display text-lg font-semibold text-foreground">Reporting vulnerabilities</h2>
            <p>
              If you discover a security issue, please report it responsibly to{' '}
              <a href={CONTACT_MAILTO} className="text-primary hover:underline">
                {COMPANY.contactEmail}
              </a>
              . Include steps to reproduce and we will investigate promptly.
            </p>

            <p>
              For more on how we handle personal data, see our{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
