import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const competitors = [
  { name: 'PropStream', price: '$99/mo', lag: '30–60 days', probate: false, api: false, freshlienEdge: 'Same-day + probate + API' },
  { name: 'BatchData', price: '$500/mo', lag: '7–14 days', probate: false, api: true, freshlienEdge: '10x cheaper, has UI' },
  { name: 'ATTOM Data', price: '$5k–50k/yr', lag: '3–7 days', probate: 'partial', api: true, freshlienEdge: '20–100x cheaper' },
  { name: 'PropertyShark', price: '$150–275/mo', lag: '3–7 days', probate: false, api: false, freshlienEdge: 'API + probate + cheaper' },
  { name: 'CoreLogic', price: '$10k+/yr', lag: '1–3 days', probate: false, api: true, freshlienEdge: 'Affordable for SMB' },
  { name: 'REDX', price: '$70–150/mo', lag: '7–30 days', probate: false, api: false, freshlienEdge: 'Fresher + richer data' },
];

function Cell({ value, highlight }) {
  if (value === true) return <Check className={cn("w-5 h-5 mx-auto", highlight ? "text-cyan" : "text-emerald-500")} />;
  if (value === false) return <X className="w-5 h-5 mx-auto text-muted-foreground/40" />;
  if (value === 'partial') return <Minus className="w-5 h-5 mx-auto text-yellow-500" />;
  return <span className={cn("text-sm font-medium", highlight ? "text-cyan" : "text-foreground")}>{value}</span>;
}

export default function CompetitorTable() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Why FreshLien wins on every metric
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The only platform with same-day county-direct data at a price investors can afford.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Platform</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Data Lag</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Probate</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">API</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">FreshLien Edge</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={c.name} className={cn("border-t border-border/50", i % 2 === 1 && "bg-muted/20")}>
                    <td className="px-6 py-4 font-semibold text-foreground">{c.name}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{c.price}</td>
                    <td className="px-6 py-4 text-center text-sm text-orange-600 font-medium">{c.lag}</td>
                    <td className="px-6 py-4 text-center"><Cell value={c.probate} /></td>
                    <td className="px-6 py-4 text-center"><Cell value={c.api} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{c.freshlienEdge}</td>
                  </tr>
                ))}
                {/* FreshLien row */}
                <tr className="border-t-2 border-orange-400 bg-[#0F5132]">
                  <td className="px-6 py-5 font-bold text-white text-lg">FreshLien</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-orange-400 font-bold text-sm">$79–999/mo</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold">
                      ⚡ SAME-DAY
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center"><Cell value={true} highlight /></td>
                  <td className="px-6 py-5 text-center"><Cell value={true} highlight /></td>
                  <td className="px-6 py-5 text-white font-semibold text-sm">— THE BENCHMARK —</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-center text-[#0F5132] font-medium text-sm">
            <span className="font-bold">Core Moat:</span> County-direct scraping → same-day data → investor contacts homeowner 
            <span className="text-orange-600 font-bold"> BEFORE PropStream users even see the filing.</span>
          </p>
        </div>
      </div>
    </section>
  );
}