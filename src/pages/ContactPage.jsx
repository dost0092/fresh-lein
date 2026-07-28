import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, MessageSquare, Clock, Share2, ArrowRight } from 'lucide-react';
import SocialLinks from '@/components/brand/SocialLinks';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import FeedbackDialog from '@/components/FeedbackDialog';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const INQUIRY_TYPES = [
  'Data Engineering',
  'Automation',
  'AI Services',
  'Workflow Review',
  'Lead Data Automation',
  'Acquisition Automation',
  'Disposition Workflow',
  'Property Research',
  'CRM Integration',
  'Platform Access',
  'Partnership',
  'General Question',
];

const contactOptions = [
  {
    icon: Mail,
    title: 'Email',
    text: 'Best for service and partnership inquiries.',
    action: (
      <a href={CONTACT_MAILTO} className="text-sm font-medium text-primary hover:underline">
        {COMPANY.contactEmail}
      </a>
    ),
  },
  {
    icon: MessageSquare,
    title: 'Product feedback',
    text: 'Bugs or ideas for the live data product.',
    action: (
      <FeedbackDialog
        trigger={
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Open feedback form
          </button>
        }
        showIcon={false}
      />
    ),
  },
  {
    icon: Clock,
    title: 'Workflow audit',
    text: 'Prefer a structured intake for automation scoping.',
    action: (
      <Link to="/book-audit" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        Book an audit <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    ),
  },
  {
    icon: Share2,
    title: 'Follow us',
    text: 'Product and operations updates.',
    action: <SocialLinks />,
  },
];

function ContactInquiryForm({ defaultTopic = '' }) {
  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('feedback', 'sent');
    return url.toString();
  }, []);

  return (
    <form
      action={`https://formsubmit.co/${COMPANY.contactEmail}`}
      method="POST"
      className="space-y-4"
    >
      <input type="hidden" name="_subject" value="FreshLien contact" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {redirectUrl ? <input type="hidden" name="_next" value={redirectUrl} /> : null}
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry_type">Inquiry type</Label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          defaultValue={defaultTopic || INQUIRY_TYPES[0]}
          className="fl-input"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" required rows={5} />
      </div>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>I agree to be contacted about this inquiry.</span>
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}

export default function ContactPage() {
  const [params] = useSearchParams();
  const topic = params.get('topic') || '';

  return (
    <MarketingPageShell
      seo={{
        title: 'Contact FreshLien',
        description:
          'Contact FreshLien about data engineering, automation, AI services, workflow reviews, lead pipelines, acquisitions, dispositions, property research, CRM integrations, or partnerships.',
        path: '/contact',
      }}
    >
      <MarketingPageHero
        eyebrow="Contact"
        title="Talk to us about data engineering, automation, or AI"
        description={`Reach us at ${COMPANY.contactEmail} or use the form. For scoping, the workflow review intake is usually fastest.`}
      />

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              {contactOptions.map(({ icon: Icon, title, text, action }) => (
                <div key={title} className="fl-card p-5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                  <div className="mt-3">{action}</div>
                </div>
              ))}
            </div>
            <div className="fl-card p-6 lg:col-span-3">
              <ContactInquiryForm defaultTopic={topic} />
            </div>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
