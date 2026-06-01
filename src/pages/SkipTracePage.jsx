import AppLayout from '@/components/layout/AppLayout';
import { Zap, Lock, Phone, Mail, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function SkipTracePage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">Skip Trace</h1>
            <p className="text-muted-foreground text-sm mt-1">Append phone numbers and emails to property owners</p>
          </div>

          {/* Pro gate */}
          <div className="bg-white border-2 border-dashed border-cyan/30 rounded-2xl p-12 text-center mb-6">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Skip Trace is a Pro Feature</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Instantly append phone numbers and email addresses to any property owner in our database. 
              Available on Pro and Enterprise plans.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              <div className="p-3 bg-navy/5 rounded-xl text-center">
                <Phone className="w-5 h-5 text-navy mx-auto mb-1" />
                <p className="text-xs font-semibold text-foreground">Phone Numbers</p>
              </div>
              <div className="p-3 bg-navy/5 rounded-xl text-center">
                <Mail className="w-5 h-5 text-navy mx-auto mb-1" />
                <p className="text-xs font-semibold text-foreground">Email Addresses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Pricing</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">$0.25</p>
                <p className="text-xs text-muted-foreground">per record (Pro)</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">$0.20</p>
                <p className="text-xs text-muted-foreground">per record (Enterprise)</p>
              </div>
            </div>
            <Link to="/settings">
              <Button className="bg-secondary hover:bg-navy-dark text-white font-semibold px-8">
                Upgrade to Pro
              </Button>
            </Link>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              Skip trace data is sourced from FCRA-compliant providers (BatchSkipTracing). 
              By using this feature, you agree to use owner contact data for real estate investment purposes only.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}