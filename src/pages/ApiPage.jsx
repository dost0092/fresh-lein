import AppLayout from '@/components/layout/AppLayout';
import { Key, Code, Lock, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const sampleEndpoints = [
  { method: 'GET', path: '/api/v1/foreclosures', desc: 'List/search filings with 50+ filters' },
  { method: 'GET', path: '/api/v1/foreclosures/{id}', desc: 'Full property detail with timeline' },
  { method: 'GET', path: '/api/v1/search', desc: 'Full-text + geo search' },
  { method: 'POST', path: '/api/v1/export/csv', desc: 'Export filtered results as CSV' },
  { method: 'POST', path: '/api/v1/skip-trace', desc: 'Append phone/email to owner' },
];

export default function ApiPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">API Access</h1>
            <p className="text-muted-foreground text-sm mt-1">REST API for programmatic access to FreshLien data</p>
          </div>

          {/* Enterprise Gate */}
          <div className="bg-navy rounded-2xl p-8 text-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white mb-2">API Access is an Enterprise Feature</h2>
            <p className="text-white/70 text-sm max-w-md mx-auto mb-6">
              Integrate FreshLien data directly into your systems with our REST API. 
              Generate API keys and access 1,000 calls/month on Pro, or unlimited on Enterprise.
            </p>
            <Link to="/settings">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8">
                Upgrade to Enterprise
              </Button>
            </Link>
          </div>

          {/* API Endpoints Preview */}
          <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden mb-5">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Code className="w-4 h-4" /> Available Endpoints
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {sampleEndpoints.map(ep => (
                <div key={ep.path} className="px-6 py-4 flex items-center gap-4">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono uppercase ${ep.method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-navy flex-1">{ep.path}</code>
                  <span className="text-xs text-muted-foreground">{ep.desc}</span>
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Sample Response */}
          <div className="bg-navy rounded-2xl p-5 font-mono text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-[11px] uppercase tracking-wide">Sample Response</span>
              <button className="text-white/40 hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="text-cyan leading-relaxed overflow-x-auto">{`{
  "data": [
    {
      "id": "uuid",
      "address_full": "123 Main St, Miami, FL 33101",
      "filing_type": "LIS_PENDENS",
      "filing_date": "2026-05-28",
      "auction_date": "2026-07-15",
      "judgment_amount": 285000,
      "days_to_auction": 44,
      "federal_lien": false,
      "estimated_equity": 125000,
      "equity_pct": 30.5
    }
  ],
  "total": 1842,
  "freshness": "2026-06-01T06:00:00Z"
}`}</pre>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}