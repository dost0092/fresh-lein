import { Link } from 'react-router-dom';
import { Lock, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LANDING_FREE_SEARCH_LIMIT } from '@/lib/landingSearchLimit';

export default function ProGateModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-border">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="icon-surface mb-4 h-12 w-12 rounded-xl">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Upgrade to unlock full search
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          You&apos;ve used your {LANDING_FREE_SEARCH_LIMIT} free preview searches on the landing page.
          Create a Pro account for unlimited address search, map explorer, exports, and alerts.
        </p>
        <ul className="text-xs text-foreground space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Unlimited property & address search
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Full map + list explorer
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> CSV export & saved properties
          </li>
        </ul>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full h-10">
            <Link to="/register">Start Pro from $25/mo</Link>
          </Button>
          <Button variant="outline" asChild className="w-full h-9 text-xs">
            <Link to="/login">Already have an account? Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
