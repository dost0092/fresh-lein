const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { Download, FileText, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function ExportsPage() {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(null);

  useEffect(() => {
    db.entities.ForeclosureFiling.list('-filing_date', 500).then(data => {
      setFilings(data);
      setLoading(false);
    });
  }, []);

  const handleExport = async () => {
    setExporting(true);
    const rows = filings.slice(0, 200);
    const headers = ['Address', 'City', 'State', 'ZIP', 'County', 'Filing Type', 'Filing Stage', 'Case Number', 'Filing Date', 'Auction Date', 'Judgment Amount', 'Defendant', 'Federal Lien', 'State Lien', 'HOA Lien', 'Estimated Value', 'Estimated Equity', 'Source URL'];
    const csv = [
      headers.join(','),
      ...rows.map(f => [
        `"${f.address_full || ''}"`,
        `"${f.address_city || ''}"`,
        f.address_state || '',
        f.address_zip || '',
        `"${f.county_name || ''}"`,
        f.filing_type || '',
        f.filing_stage || '',
        f.case_number || '',
        f.filing_date || '',
        f.auction_date || '',
        f.judgment_amount || '',
        `"${f.defendant_primary || ''}"`,
        f.federal_lien ? 'Yes' : 'No',
        f.state_lien ? 'Yes' : 'No',
        f.hoa_lien ? 'Yes' : 'No',
        f.estimated_value || '',
        f.estimated_equity || '',
        `"${f.source_url || ''}"`,
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshlien-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    setExported({ date: new Date(), count: rows.length });
    setTimeout(() => setExporting(false), 800);
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">CSV Exports</h1>
            <p className="text-muted-foreground text-sm mt-1">Export filtered foreclosure data to your CRM or direct mail tool</p>
          </div>

          {/* Plan limits */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-card mb-5">
            <h2 className="font-heading font-semibold text-foreground mb-4 text-sm">Your Export Limits</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { plan: 'Starter', rows: '200 rows/export', current: true },
                { plan: 'Pro', rows: '5,000 rows', current: false },
                { plan: 'Enterprise', rows: 'Unlimited', current: false },
              ].map(({ plan, rows, current }) => (
                <div key={plan} className={`p-3 rounded-xl border text-center ${current ? 'border-cyan bg-cyan/5' : 'border-border bg-muted/30'}`}>
                  <p className={`text-xs font-semibold mb-1 ${current ? 'text-cyan' : 'text-muted-foreground'}`}>{plan}</p>
                  <p className={`text-sm font-bold ${current ? 'text-foreground' : 'text-muted-foreground'}`}>{rows}</p>
                  {!current && <Lock className="w-3 h-3 text-muted-foreground mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Export Card */}
          <div className="bg-white border border-border rounded-2xl p-8 shadow-card mb-5 text-center">
            <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-navy" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">Export Current Results</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-semibold text-foreground">{Math.min(filings.length, 200)}</span> of {filings.length.toLocaleString()} filings (Starter limit: 200 rows)
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Includes: address, filing type, auction date, judgment, defendant, lien flags, equity estimate
            </p>
            <Button
              onClick={handleExport}
              disabled={exporting || loading}
              className="bg-secondary hover:bg-navy-dark text-white font-semibold px-8"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : 'Download CSV'}
            </Button>
          </div>

          {/* Recent Exports */}
          {exported && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <Download className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Export successful</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  {exported.count} rows exported on {format(exported.date, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              Upgrade to <strong>Pro</strong> for 5,000 rows per export, or <strong>Enterprise</strong> for unlimited. 
              Exports include all fields compatible with popular CRMs and skip-tracing tools.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}