import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { fetchRecentForeclosures } from '@/lib/foreclosureService';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function formatDate(d) {
  try {
    return d ? format(new Date(d), 'MMM d, yyyy') : '—';
  } catch {
    return '—';
  }
}

function formatMoney(v) {
  return v != null ? `$${Number(v).toLocaleString()}` : '—';
}

export default function DashboardUpcomingSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentForeclosures(8)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-b border-border bg-white py-11 lg:py-14">
      <LandingContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <LandingSectionHeader
            eyebrow="Nearest auctions"
            title="Upcoming sheriff sales"
            titleHighlight="sorted by date"
            description="Soonest sale dates first — click any row for full case details, equity estimates, and status history."
            className="mb-0 max-w-2xl"
          />
          <Button asChild variant="outline" size="sm" className="shrink-0 border-primary/30 text-primary">
            <Link to="/dashboard/foreclosures">
              View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="hidden grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-border bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Property</span>
            <span>Sale date</span>
            <span>Starting bid</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-4 py-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="hidden h-10 w-24 sm:block" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No upcoming auctions scheduled. Check back after the next data refresh.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <Link
                  key={row.id}
                  to={`/dashboard/foreclosures/${row.id}`}
                  className="group grid gap-2 px-4 py-3.5 transition-colors hover:bg-primary/[0.02] sm:grid-cols-[1fr_120px_100px_100px] sm:items-center sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {row.property_address}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {row.city}, {row.state}
                      {row.county_name ? ` · ${row.county_name} Co.` : ''}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:hidden">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(row.sale_date)}
                      </span>
                      {row.days_to_auction != null && row.status === 'Scheduled' && (
                        <UrgencyBadge daysToAuction={row.days_to_auction} filingType="NTS" showDays />
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{formatDate(row.sale_date)}</p>
                    {row.days_to_auction === 0 ? (
                      <p className="text-[11px] font-medium text-red-600">Today</p>
                    ) : row.days_to_auction === 1 ? (
                      <p className="text-[11px] font-medium text-orange-600">Tomorrow</p>
                    ) : row.days_to_auction != null && row.status === 'Scheduled' ? (
                      <p className="text-[11px] text-muted-foreground">{row.days_to_auction} days out</p>
                    ) : null}
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">{formatMoney(row.starting_bid)}</p>
                    {row.appraised_value != null && (
                      <p className="text-[11px] text-muted-foreground">
                        Appraised {formatMoney(row.appraised_value)}
                      </p>
                    )}
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                      {row.status}
                    </span>
                    {row.days_to_auction != null && row.status === 'Scheduled' && (
                      <UrgencyBadge daysToAuction={row.days_to_auction} filingType="NTS" showDays />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </LandingContainer>
    </section>
  );
}
