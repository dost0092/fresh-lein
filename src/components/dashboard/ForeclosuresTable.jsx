import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusClass = {
  Scheduled: 'status-scheduled',
  Sold: 'status-sold',
  Cancelled: 'status-cancelled',
  Appraisal: 'status-appraisal',
};

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function ForeclosuresTable({ rows, loading }) {
  if (loading) return <TableSkeleton />;

  const formatDate = (d) => {
    try {
      return d ? format(new Date(d), 'MMM d, yyyy') : '—';
    } catch {
      return d || '—';
    }
  };

  return (
    <div className="overflow-auto flex-1">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="whitespace-nowrap">Sheriff #</TableHead>
            <TableHead className="whitespace-nowrap">Sale Date</TableHead>
            <TableHead className="whitespace-nowrap min-w-[140px]">Plaintiff</TableHead>
            <TableHead className="whitespace-nowrap min-w-[120px]">Defendant</TableHead>
            <TableHead className="whitespace-nowrap min-w-[160px]">Property Address</TableHead>
            <TableHead className="whitespace-nowrap hidden xl:table-cell">Attorney</TableHead>
            <TableHead className="whitespace-nowrap hidden lg:table-cell">Parcel</TableHead>
            <TableHead>County</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="group hover:bg-primary/[0.03]">
              <TableCell className="font-mono text-xs whitespace-nowrap">{row.sheriff_number}</TableCell>
              <TableCell className="whitespace-nowrap text-sm">{formatDate(row.sale_date)}</TableCell>
              <TableCell className="max-w-[140px] truncate text-sm" title={row.plaintiff}>
                {row.plaintiff}
              </TableCell>
              <TableCell className="max-w-[120px] truncate text-sm" title={row.defendant}>
                {row.defendant}
              </TableCell>
              <TableCell className="max-w-[180px]">
                <p className="text-sm font-medium truncate">{row.property_address}</p>
                <p className="text-xs text-muted-foreground">
                  {row.city}, {row.state} {row.zip_code}
                </p>
              </TableCell>
              <TableCell className="hidden xl:table-cell max-w-[120px] truncate text-sm text-muted-foreground">
                {row.attorney_name}
              </TableCell>
              <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                {row.parcel_number}
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">{row.county_name}</TableCell>
              <TableCell className="text-sm">{row.state}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-md border',
                    statusClass[row.status] || 'bg-muted'
                  )}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  to={`/dashboard/foreclosures/${row.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
