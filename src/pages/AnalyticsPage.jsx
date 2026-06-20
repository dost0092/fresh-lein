const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BarChart2, MapPin, Calendar, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO, startOfMonth } from 'date-fns';

const COLORS = ['#F97316', '#1e293b', '#135133', '#E63946', '#FFD166', '#7B2D8B'];

export default function AnalyticsPage() {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.ForeclosureFiling.list('-filing_date', 500).then(data => {
      setFilings(data);
      setLoading(false);
    });
  }, []);

  // Filing type breakdown
  const byType = filings.reduce((acc, f) => {
    acc[f.filing_type] = (acc[f.filing_type] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  // By state
  const byState = filings.reduce((acc, f) => {
    if (f.address_state) acc[f.address_state] = (acc[f.address_state] || 0) + 1;
    return acc;
  }, {});
  const stateData = Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));

  // Monthly trend (simulated from filing dates)
  const byMonth = filings.reduce((acc, f) => {
    if (!f.filing_date) return acc;
    try {
      const month = format(parseISO(f.filing_date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
    } catch {}
    return acc;
  }, {});
  const monthData = Object.entries(byMonth).slice(-6).map(([name, count]) => ({ name, count }));

  // Avg judgment by type
  const avgJudgment = Object.entries(
    filings.reduce((acc, f) => {
      if (!acc[f.filing_type]) acc[f.filing_type] = { sum: 0, count: 0 };
      if (f.judgment_amount) { acc[f.filing_type].sum += f.judgment_amount; acc[f.filing_type].count++; }
      return acc;
    }, {})
  ).map(([name, { sum, count }]) => ({ name, avg: count > 0 ? Math.round(sum / count) : 0 }));

  const formatK = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Market Analytics</h1>
              <p className="text-muted-foreground text-sm mt-1">Distressed property market trends and insights</p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-cyan/10 text-cyan border border-cyan/20 rounded-full px-3 py-1.5 text-xs font-semibold">
              <Lock className="w-3 h-3" /> Pro Feature
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Filings', value: filings.length.toLocaleString(), icon: BarChart2, color: 'text-orange-600 bg-orange-50' },
              { label: 'States Covered', value: Object.keys(byState).length, icon: MapPin, color: 'text-secondary bg-slate-100' },
              { label: 'Avg Judgment', value: filings.length > 0 ? formatK(Math.round(filings.reduce((s, f) => s + (f.judgment_amount || 0), 0) / filings.filter(f => f.judgment_amount).length)) : '$0', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Active Auctions', value: filings.filter(f => f.auction_date).length, icon: Calendar, color: 'text-orange-600 bg-orange-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-lg border border-border p-5 shadow-card">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Filing by State */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-card">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">Filings by State</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [v, 'Filings']} />
                  <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Filing Type Pie */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-card">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">Filing Type Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-card">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">Monthly Filing Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#1e293b" strokeWidth={2.5} dot={{ fill: '#1e293b', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Avg Judgment by Type */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-card">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm">Avg Judgment by Filing Type</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={avgJudgment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={formatK} />
                  <Tooltip formatter={(v) => [formatK(v), 'Avg Judgment']} />
                  <Bar dataKey="avg" fill="#1e293b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}