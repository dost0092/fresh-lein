import { cn } from '@/lib/utils';

const configs = {
  NOD: { label: 'NOD', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  LIS_PENDENS: { label: 'Lis Pendens', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  NTS: { label: 'NTS', className: 'bg-red-100 text-red-700 border-red-200' },
  AUCTION: { label: 'Auction', className: 'bg-red-100 text-red-700 border-red-200' },
  REO: { label: 'REO', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  PRE_FORECLOSURE: { label: 'Pre-Foreclosure', className: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  ACTIVE: { label: 'Active', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  POST: { label: 'Post', className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function FilingTypeBadge({ type, size = 'sm' }) {
  const config = configs[type] || { label: type, className: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={cn(
      "inline-flex items-center font-medium border rounded-md",
      size === 'sm' ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
      config.className
    )}>
      {config.label}
    </span>
  );
}