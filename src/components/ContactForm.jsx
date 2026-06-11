import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { COMPANY } from '@/data/company';

export default function ContactForm({ subject = 'FreshLien contact', className = '' }) {
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
      className={`space-y-4 ${className}`}
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {redirectUrl ? <input type="hidden" name="_next" value={redirectUrl} /> : null}
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-topic">Topic</Label>
        <Input id="contact-topic" name="topic" placeholder="Sales, support, partnership…" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
