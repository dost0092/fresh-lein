import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

export function getUrgency(daysToAuction, filingType) {
  if (filingType === 'REO') return 'reo';
  if (filingType === 'PROBATE' || false) return 'probate';
  if (daysToAuction === null || daysToAuction === undefined) return 'pre';
  if (daysToAuction < 7) return 'urgent';
  if (daysToAuction < 30) return 'soon';
  if (daysToAuction < 90) return 'upcoming';
  return 'pre';
}

export function getMarkerColor(urgency) {
  const colors = {
    urgent: '#E63946',
    soon: '#F4A261',
    upcoming: '#FFD166',
    pre: '#135133',
    probate: '#7B2D8B',
    reo: '#94A3B8'
  };
  return colors[urgency] || '#94A3B8';
}

export default function UrgencyBadge({ daysToAuction, filingType, showDays = true }) {
  const urgency = getUrgency(daysToAuction, filingType);

  const configs = {
    urgent: { label: `${daysToAuction}d to auction`, className: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
    soon: { label: `${daysToAuction}d to auction`, className: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock },
    upcoming: { label: `${daysToAuction}d to auction`, className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Calendar },
    pre: { label: 'No auction date', className: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: Clock },
    probate: { label: 'Probate', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: Clock },
    reo: { label: 'REO', className: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
  };

  const config = configs[urgency];
  const Icon = config.icon;

  if (!showDays) {
    const dotColors = {
      urgent: 'bg-red-500', soon: 'bg-orange-500', upcoming: 'bg-yellow-500',
      pre: 'bg-cyan-500', probate: 'bg-purple-500', reo: 'bg-slate-400'
    };
    return <span className={cn("w-2.5 h-2.5 rounded-full inline-block", dotColors[urgency])} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium border rounded-md px-2 py-0.5", config.className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}