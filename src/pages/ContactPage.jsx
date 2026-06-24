import { Mail, MessageSquare, Clock, Share2 } from 'lucide-react';
import SocialLinks from '@/components/brand/SocialLinks';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import ContactForm from '@/components/ContactForm';
import FeedbackDialog from '@/components/FeedbackDialog';
import { COMPANY, CONTACT_MAILTO, CONTACT_MAILTO_SUBJECT } from '@/data/company';

const contactOptions = [
  {
    icon: Mail,
    title: 'Email us',
    text: 'Best for sales, partnerships, and general questions.',
    action: (
      <a
        href={CONTACT_MAILTO}
        className="text-sm font-medium text-primary hover:underline"
      >
        {COMPANY.contactEmail}
      </a>
    ),
  },
  {
    icon: MessageSquare,
    title: 'Product feedback',
    text: 'Report a bug, request a feature, or tell us what to build next.',
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
    title: 'Response time',
    text: 'We typically reply within 1–2 business days. Enterprise inquiries get priority.',
    action: (
      <a
        href={CONTACT_MAILTO_SUBJECT('Enterprise inquiry')}
        className="text-sm font-medium text-primary hover:underline"
      >
        Contact sales
      </a>
    ),
  },
  {
    icon: Share2,
    title: 'Follow us',
    text: 'Stay updated on product news, county coverage, and foreclosure investing tips.',
    action: <SocialLinks />,
  },
];

export default function ContactPage() {
  return (
    <MarketingPageShell
      seo={{
        title: 'Contact FreshLien: Sales, Support & Partnerships',
        description:
          'Contact FreshLien for sales, enterprise plans, API access, county coverage requests, and product support. We reply within 1 to 2 business days.',
        path: '/contact',
      }}
    >
      <MarketingPageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        description={`Questions about plans, data coverage, or partnerships? Reach us at ${COMPANY.contactEmail} or use the form below.`}
      />

      <section className="py-11 lg:py-14">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              {contactOptions.map(({ icon: Icon, title, text, action }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/60 bg-white p-5 shadow-sm"
                >
                  <div className="icon-surface h-10 w-10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  <div className="mt-3">{action}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-3 lg:p-8">
              <h2 className="font-display text-lg font-semibold text-foreground">Send a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your message goes directly to our team at {COMPANY.contactEmail}.
              </p>
              <div className="mt-6">
                <ContactForm subject="FreshLien contact form" />
              </div>
            </div>
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
