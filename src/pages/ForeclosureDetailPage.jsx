import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import StatusTimeline from '@/components/dashboard/StatusTimeline';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchForeclosureById } from '@/lib/foreclosureService';
import { cn } from '@/lib/utils';

function DetailCard({ title, children }) {
  return (
    <div className="saas-card p-6">
      <h2 className="font-heading font-semibold text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="py-2 border-b border-border/60 last:border-0">
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-foreground mt-0.5">{value || '—'}</dd>
    </div>
  );
}

export default function ForeclosureDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchForeclosureById(id).then((data) => {
      setRecord(data);
      setLoading(false);
    });
  }, [id]);

  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—';

  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMMM d, yyyy') : '—';
    } catch {
      return d || '—';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!record) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Foreclosure record not found.</p>
          <Button asChild variant="outline">
            <Link to="/dashboard/foreclosures">Back to list</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Link
                to="/dashboard/foreclosures"
                className="inline-flex items-center gap-1 text-sm text-[#4257A7] hover:underline mb-3"
              >
                <ArrowLeft className="w-4 h-4" /> Back to foreclosures
              </Link>
              <h1 className="font-display text-2xl font-bold text-foreground">{record.property_address}</h1>
              <p className="text-muted-foreground mt-1">
                {record.city}, {record.state} {record.zip_code} · {record.county_name} County
              </p>
            </div>
            <Button variant="outline" className="shrink-0" disabled title="Available after sign-in with Supabase">
              <Bookmark className="w-4 h-4 mr-2" />
              Save property
            </Button>
          </div>

          <span
            className={cn(
              'inline-flex text-xs font-semibold px-2.5 py-1 rounded-md border',
              record.status === 'Scheduled' && 'status-scheduled',
              record.status === 'Sold' && 'status-sold',
              record.status === 'Cancelled' && 'status-cancelled',
              record.status === 'Appraisal' && 'status-appraisal'
            )}
          >
            {record.status}
          </span>

          <div className="grid lg:grid-cols-2 gap-6">
            <DetailCard title="Property Information">
              <dl>
                <Field label="Address" value={`${record.property_address}, ${record.city}, ${record.state} ${record.zip_code}`} />
                <Field label="Parcel Number" value={record.parcel_number} />
                <Field label="County" value={`${record.county_name} County`} />
                <Field label="State" value={record.state} />
              </dl>
            </DetailCard>

            <DetailCard title="Case Information">
              <dl>
                <Field label="Sheriff Number" value={record.sheriff_number} />
                <Field label="Court Case Number" value={record.court_case_number} />
                <Field label="Plaintiff" value={record.plaintiff} />
                <Field label="Defendant" value={record.defendant} />
                <Field label="Attorney" value={record.attorney_name} />
              </dl>
            </DetailCard>

            <DetailCard title="Auction Information">
              <dl>
                <Field label="Sale Date" value={formatDate(record.sale_date)} />
                <Field label="Starting Bid" value={formatCurrency(record.starting_bid)} />
                <Field label="Appraised Value" value={formatCurrency(record.appraised_value)} />
              </dl>
            </DetailCard>

            <DetailCard title="Status Timeline">
              <StatusTimeline history={record.status_history} currentStatus={record.status} />
            </DetailCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
