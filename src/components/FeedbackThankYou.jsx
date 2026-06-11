import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export default function FeedbackThankYou() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('feedback') !== 'sent') return;

    toast({
      title: 'Thanks for your feedback!',
      description: 'We received your message and will get back to you if needed.',
    });

    const next = new URLSearchParams(searchParams);
    next.delete('feedback');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  return null;
}
