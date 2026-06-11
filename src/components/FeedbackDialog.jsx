import { useMemo } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { COMPANY } from '@/data/company';

export default function FeedbackDialog({
  trigger,
  triggerClassName,
  triggerLabel = 'Feedback',
  showIcon = true,
}) {
  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('feedback', 'sent');
    return url.toString();
  }, []);

  const defaultTrigger = (
    <button
      type="button"
      className={
        triggerClassName ||
        'inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground'
      }
    >
      {showIcon && <MessageSquare className="h-4 w-4" />}
      {triggerLabel}
    </button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            Tell us what you think, report a bug, or suggest a feature. We read every message.
          </DialogDescription>
        </DialogHeader>

        <form
          action={`https://formsubmit.co/${COMPANY.contactEmail}`}
          method="POST"
          className="space-y-4 pt-1"
        >
          <input type="hidden" name="_subject" value="FreshLien feedback" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          {redirectUrl ? <input type="hidden" name="_next" value={redirectUrl} /> : null}
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="space-y-2">
            <Label htmlFor="feedback-name">Name</Label>
            <Input id="feedback-name" name="name" placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-email">Email</Label>
            <Input
              id="feedback-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              name="message"
              required
              rows={4}
              placeholder="What's on your mind?"
            />
          </div>

          <Button type="submit" className="w-full">
            Send feedback
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
