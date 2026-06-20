const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { Shield, CheckCircle, XCircle, Clock, RefreshCw, Database, Activity, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AdminPage() {
  const [counties, setCounties] = useState([]);
  const [filingCount, setFilingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.entities.County.list('name', 50),
      db.entities.ForeclosureFiling.list('-filing_date', 1),
    ]).then(([countyData, filings]) => {
      setCounties(countyData);
      setFilingCount(filings.length);
      setLoading(false);
    });
  }, []);

  const byStatus = counties.reduce((acc, c) => {
    acc[c.scraper_status || 'pending'] = (acc[c.scraper_status || 'pending'] || 0) + 1;
    return acc;
  }, {});

  const statusIcon = { active: CheckCircle, failed: XCircle, pending: Clock, inactive: Clock };
  const statusColor = { active: 'text-emerald-500', failed: 'text-red-500', pending: 'text-yellow-500', inactive: 'text-slate-400' };
  const statusBadge = { active: 'bg-emerald-100 text-emerald-700', failed: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700', inactive: 'bg-slate-100 text-slate-500' };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Admin Console</h1>
              <p className="text-muted-foreground text-sm">Internal data operations & system health</p>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Counties', value: counties.length, icon: Map, color: 'text-secondary bg-slate-100' },
              { label: 'Active Scrapers', value: byStatus.active || 0, icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Failed Scrapers', value: byStatus.failed || 0, icon: XCircle, color: 'text-red-600 bg-red-50' },
              { label: 'Total Filings', value: filingCount, icon: Database, color: 'text-navy bg-navy/10' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-lg border border-border p-5 shadow-card">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">{value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Counties Table */}
          <div className="bg-white rounded-lg border border-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-foreground">County Scraper Status</h2>
              <Button size="sm" variant="outline" className="text-xs border-border">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading county data...</div>
            ) : counties.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Database className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No county data found. Add counties to the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">County</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">FIPS</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Scraped</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rows</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counties.map((county, i) => {
                      const Icon = statusIcon[county.scraper_status || 'pending'];
                      return (
                        <tr key={county.id} className={cn("border-t border-border/50", i % 2 === 1 && "bg-muted/20")}>
                          <td className="px-6 py-3.5 font-medium text-foreground">{county.name}</td>
                          <td className="px-6 py-3.5 text-muted-foreground">{county.state}</td>
                          <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{county.fips}</td>
                          <td className="px-6 py-3.5">
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded border",
                              county.judicial ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-muted text-muted-foreground border-border"
                            )}>
                              {county.judicial ? 'Judicial' : 'Non-Judicial'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full", statusBadge[county.scraper_status || 'pending'])}>
                              <Icon className={cn("w-3 h-3", statusColor[county.scraper_status || 'pending'])} />
                              {(county.scraper_status || 'pending').charAt(0).toUpperCase() + (county.scraper_status || 'pending').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-sm text-muted-foreground">
                            {county.last_scraped ? (() => { try { return format(new Date(county.last_scraped), 'MMM d, h:mm a'); } catch { return '—'; } })() : '—'}
                          </td>
                          <td className="px-6 py-3.5 text-right font-semibold text-foreground">
                            {(county.rows_count || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}