import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Copy,
  Calendar,
  DollarSign,
  MapPin,
  Gavel,
  FileText,
  Building2,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import StatusTimeline from '@/components/dashboard/StatusTimeline';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchForeclosureById } from '@/lib/foreclosureService';
import { isPropertySaved, saveProperty, unsaveProperty } from '@/lib/savedPropertiesService';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

function copyText(text, label) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast({ title: 'Copied', description: `${label} copied to clipboard.` });
}

function MetricCard({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 bg-white transition-shadow hover:shadow-card',
        highlight ? 'border-primary/30 bg-primary/[0.03]' : 'border-border shadow-card'
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn('text-xl font-display font-semibold tracking-tight', highlight && 'text-primary')}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="saas-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/20 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function DataRow({ label, value, mono, onCopy }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-border/50 last:border-0 group">
      <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider sm:w-40 shrink-0">
        {label}
      </dt>
      <dd className={cn('text-xs text-foreground flex-1 flex items-start justify-between gap-2', mono && 'font-mono text-[11px]')}>
        <span>{value || '—'}</span>
        {onCopy && value && (
          <button
            type="button"
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted text-muted-foreground transition-opacity shrink-0"
            title="Copy"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </dd>
    </div>
  );
}

export default function ForeclosureDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, isSupabaseConfigured } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchForeclosureById(id)
      .then((data) => {
        setRecord(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !isAuthenticated || !isSupabaseConfigured) {
      setSaved(false);
      return;
    }
    isPropertySaved(id).then(setSaved).catch(() => setSaved(false));
  }, [id, isAuthenticated, isSupabaseConfigured]);

  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—';

  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'EEEE, MMMM d, yyyy') : '—';
    } catch {
      return d || '—';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  if (!record) {
    return (
      <AppLayout>
        <div className="p-12 text-center">
          <p className="text-muted-foreground mb-4">This foreclosure record could not be found.</p>
          <Button asChild>
            <Link to="/dashboard/foreclosures">Back to explorer</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const equity = record.estimated_equity;
  const equityPct = record.equity_pct;

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            <Link
              to="/dashboard/foreclosures"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide',
                      record.status === 'Scheduled' && 'status-scheduled',
                      record.status === 'Sold' && 'status-sold',
                      record.status === 'Cancelled' && 'status-cancelled',
                      record.status === 'Appraisal' && 'status-appraisal'
                    )}
                  >
                    {record.status}
                  </span>
                  {record.days_to_auction != null && record.status === 'Scheduled' && (
                    <UrgencyBadge daysToAuction={record.days_to_auction} filingType="NTS" />
                  )}
                </div>
                <h1 className="font-display text-xl lg:text-2xl font-semibold text-foreground tracking-tight leading-snug">
                  {record.property_address}
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {record.city}, {record.state} {record.zip_code}
                  <span className="text-border">|</span>
                  {record.county_name} County
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  variant={saved ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  disabled={!isAuthenticated || saveLoading}
                  onClick={async () => {
                    setSaveLoading(true);
                    try {
                      if (saved) {
                        await unsaveProperty(id);
                        setSaved(false);
                        toast({ title: 'Removed', description: 'Property removed from saved list.' });
                      } else {
                        await saveProperty(id);
                        setSaved(true);
                        toast({ title: 'Saved', description: 'Property added to your watchlist.' });
                      }
                    } catch (err) {
                      toast({
                        title: 'Could not save',
                        description: err.message,
                        variant: 'destructive',
                      });
                    } finally {
                      setSaveLoading(false);
                    }
                  }}
                >
                  <Bookmark className={cn('w-3.5 h-3.5 mr-1', saved && 'fill-current')} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="secondary" size="sm" className="h-8 text-xs" asChild>
                  <Link to="/dashboard/foreclosures?view=map">Map</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              icon={Calendar}
              label="Sale date"
              value={record.sale_date ? format(new Date(record.sale_date), 'MMM d, yyyy') : '—'}
              sub={formatDate(record.sale_date)}
              highlight
            />
            <MetricCard
              icon={DollarSign}
              label="Opening bid"
              value={formatCurrency(record.starting_bid)}
              sub="Sheriff sale minimum"
            />
            <MetricCard
              icon={Building2}
              label="Appraised value"
              value={formatCurrency(record.appraised_value)}
              sub="County appraisal"
            />
            <MetricCard
              icon={DollarSign}
              label="Est. equity"
              value={equity > 0 ? formatCurrency(equity) : '—'}
              sub={equityPct ? `${equityPct.toFixed(0)}% spread vs appraisal` : undefined}
              highlight={equity > 0}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Section title="Property" icon={MapPin}>
                <dl>
                  <DataRow
                    label="Street address"
                    value={record.property_address}
                    onCopy={() => copyText(record.property_address, 'Address')}
                  />
                  <DataRow label="City" value={record.city} />
                  <DataRow label="State" value={record.state} />
                  <DataRow label="ZIP" value={record.zip_code} />
                  <DataRow
                    label="Parcel number"
                    value={record.parcel_number}
                    mono
                    onCopy={() => copyText(record.parcel_number, 'Parcel')}
                  />
                  <DataRow label="County" value={`${record.county_name} County, ${record.state}`} />
                </dl>
              </Section>

              <Section title="Case & parties" icon={Gavel}>
                <dl>
                  <DataRow
                    label="Sheriff number"
                    value={record.sheriff_number}
                    mono
                    onCopy={() => copyText(record.sheriff_number, 'Sheriff #')}
                  />
                  <DataRow
                    label="Court case #"
                    value={record.court_case_number}
                    mono
                    onCopy={() => copyText(record.court_case_number, 'Case #')}
                  />
                  <DataRow label="Plaintiff" value={record.plaintiff} />
                  <DataRow label="Defendant" value={record.defendant} />
                  <DataRow label="Attorney" value={record.attorney_name} />
                </dl>
              </Section>

              <Section title="Auction" icon={FileText}>
                <dl>
                  <DataRow label="Sale date" value={formatDate(record.sale_date)} />
                  <DataRow label="Starting bid" value={formatCurrency(record.starting_bid)} />
                  <DataRow label="Appraised value" value={formatCurrency(record.appraised_value)} />
                  {record.days_to_auction != null && record.status === 'Scheduled' && (
                    <DataRow label="Days until sale" value={`${record.days_to_auction} days`} />
                  )}
                </dl>
              </Section>
            </div>

            <div className="space-y-6">
              <section className="saas-card p-6 sticky top-6">
                <h2 className="font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" /> Status timeline
                </h2>
                <StatusTimeline history={record.status_history} currentStatus={record.status} />
              </section>

              <div className="rounded-xl border border-border bg-white p-5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Investor note</p>
                <p>
                  Data is sourced from county scrapers. Additional fields (liens, probate flags, skip trace) may be
                  added as integrations expand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
