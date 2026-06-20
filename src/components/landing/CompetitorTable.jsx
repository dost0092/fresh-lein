import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';

const competitors = [
  { name: 'PropStream', price: '$99/mo', lag: '30–60 days', probate: false, api: false, freshlienEdge: 'Same-day + probate + API' },
  { name: 'BatchData', price: '$500/mo', lag: '7–14 days', probate: false, api: true, freshlienEdge: '10x cheaper, has UI' },
  { name: 'ATTOM Data', price: '$5k–50k/yr', lag: '3–7 days', probate: 'partial', api: true, freshlienEdge: '20–100x cheaper' },
  { name: 'PropertyShark', price: '$150–275/mo', lag: '3–7 days', probate: false, api: false, freshlienEdge: 'API + probate + cheaper' },
  { name: 'CoreLogic', price: '$10k+/yr', lag: '1–3 days', probate: false, api: true, freshlienEdge: 'Affordable for SMB' },
  { name: 'REDX', price: '$70–150/mo', lag: '7–30 days', probate: false, api: false, freshlienEdge: 'Fresher + richer data' },
];

function Cell({ value }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (value === false) return <X className="mx-auto h-4 w-4 text-muted-foreground/35" />;
  if (value === 'partial') return <Minus className="mx-auto h-4 w-4 text-amber-500" />;
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

export default function CompetitorTable() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Benchmark"
          title="Why FreshLien wins"
        />

        <div className="overflow-hidden rounded-lg border border-border/80 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Data lag
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Probate
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    API
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    FreshLien edge
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr
                    key={c.name}
                    className={cn('border-t border-border/50', i % 2 === 1 && 'bg-muted/15')}
                  >
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground">{c.price}</td>
                    <td className="px-4 py-3 text-center text-xs font-medium text-amber-700">{c.lag}</td>
                    <td className="px-4 py-3 text-center">
                      <Cell value={c.probate} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Cell value={c.api} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.freshlienEdge}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-primary bg-[#FAFAFA]">
                  <td className="px-4 py-4 text-sm font-bold text-primary">FreshLien</td>
                  <td className="px-4 py-4 text-center text-xs font-semibold text-foreground">$79–999/mo</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center rounded-md border border-primary/20 bg-white px-2 py-0.5 text-[11px] font-bold text-primary">
                      Same-day
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Check className="mx-auto h-4 w-4 text-primary" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Check className="mx-auto h-4 w-4 text-primary" />
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold text-foreground">County-direct · same-day · full API</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Same-day county records, before legacy platforms that lag 30 to 60 days.
        </p>
      </LandingContainer>
    </section>
  );
}
