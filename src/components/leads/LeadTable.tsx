import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { Lead } from '@/mocks/data';
import { format } from 'date-fns';

interface LeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onExport: () => void;
}

export function LeadTable({ leads, selectedIds, onSelect, onSelectAll }: LeadTableProps) {
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < leads.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all leads"
                className={someSelected ? 'opacity-50' : ''}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Source</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(lead.id)}
                  onCheckedChange={(checked) => onSelect(lead.id, !!checked)}
                  aria-label={`Select ${lead.name}`}
                />
              </TableCell>
              <TableCell>
                <Link
                  to={`/leads/${lead.id}`}
                  className="font-medium hover:text-cta hover:underline"
                >
                  {lead.name}
                </Link>
              </TableCell>
              <TableCell>
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-cta hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </a>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                {lead.address}
              </TableCell>
              <TableCell>
                <StatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <SourceBadge source={lead.source} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {format(new Date(lead.created_at), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
