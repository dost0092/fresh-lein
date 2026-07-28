import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/data/company';

const RECEIVES = [
  'Workflow review',
  'Bottleneck identification',
  'Time-loss estimate',
  'Data and tool inventory',
  'Prioritized recommendations',
  'Initial implementation roadmap',
];

export default function BookAuditPage() {
  const [submitting, setSubmitting] = useState(false);
  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('audit', 'sent');
    return url.toString();
  }, []);

  const sent = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('audit') === 'sent';

  return (
    <MarketingPageShell
      seo={{
        title: 'Request a workflow review',
        description:
          'Request a FreshLien workflow review. We map where data engineering, automation, and AI can remove busywork in your real estate operation.',
        path: '/book-audit',
      }}
    >
      <MarketingPageHero
        eyebrow="Workflow review"
        title="Show us how your team works."
        titleHighlight="We'll point to what to build first."
        description="FreshLien offers data engineering, automation, and AI services. Tell us your markets, tools, and where time disappears. We map the workflow and send back a clear order of fixes."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground">What you receive</h2>
              <ul className="mt-4 space-y-2.5">
                {RECEIVES.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Commercial terms are discussed after intake. No public price list for reviews or
                implementation work.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Prefer email?{' '}
                <a href={`mailto:${COMPANY.contactEmail}?subject=Workflow%20Audit`} className="font-medium text-primary hover:underline">
                  {COMPANY.contactEmail}
                </a>
              </p>
            </div>

            <div className="lg:col-span-3">
              {sent ? (
                <div className="fl-card p-8 text-center">
                  <h2 className="text-lg font-semibold text-foreground">Request received</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thanks. We will review your workflow details and follow up shortly.
                  </p>
                  <Link to="/" className="fl-btn-primary mt-6 inline-flex">
                    Back to home <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form
                  action={`https://formsubmit.co/${COMPANY.contactEmail}`}
                  method="POST"
                  className="fl-card space-y-4 p-6"
                  onSubmit={() => setSubmitting(true)}
                >
                  <input type="hidden" name="_subject" value="FreshLien Workflow Review" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  {redirectUrl ? <input type="hidden" name="_next" value={redirectUrl} /> : null}
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full name</Label>
                      <Input id="full_name" name="full_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" name="website" type="url" placeholder="https://" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" name="role" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="markets">Primary market(s)</Label>
                      <Input id="markets" name="markets" placeholder="e.g. NJ, Atlanta MSA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Business type</Label>
                      <Input id="business_type" name="business_type" placeholder="Wholesaler, investor, brokerage…" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team_size">Team size</Label>
                      <Input id="team_size" name="team_size" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Monthly lead / record volume</Label>
                      <Input id="volume" name="volume" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crm">Current CRM</Label>
                      <Input id="crm" name="crm" placeholder="GoHighLevel, Podio, Salesforce…" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_sources">Current data sources</Label>
                    <Textarea id="data_sources" name="data_sources" rows={2} placeholder="County sites, vendors, CSVs…" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problem">Main workflow problem</Label>
                    <Textarea id="problem" name="problem" rows={3} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="manual_hours">Estimated weekly manual hours</Label>
                      <Input id="manual_hours" name="manual_hours" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting">Preferred meeting time</Label>
                      <Input id="meeting" name="meeting" placeholder="Timezone + windows" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outcome">Desired outcome</Label>
                    <Textarea id="outcome" name="outcome" rows={2} />
                  </div>

                  <label className="flex items-start gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" name="consent" required className="mt-0.5" />
                    <span>
                      I agree to be contacted about this workflow audit request. FreshLien will not
                      add you to marketing lists without separate consent.
                    </span>
                  </label>

                  <Button type="submit" disabled={submitting} className="fl-btn-primary w-full sm:w-auto">
                    {submitting ? 'Sending…' : 'Submit audit request'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
