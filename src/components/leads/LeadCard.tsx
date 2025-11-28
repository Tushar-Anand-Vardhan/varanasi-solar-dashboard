import { Link } from 'react-router-dom';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { Lead } from '@/mocks/data';
import { format } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  return (
    <Link to={`/leads/${lead.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
              <StatusBadge status={lead.status} />
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-sm">
              <a
                href={`tel:${lead.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-cta hover:underline"
              >
                <Phone className="h-4 w-4" />
                {lead.phone}
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{lead.address}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <SourceBadge source={lead.source} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(lead.created_at), 'MMM d')}
              </div>
            </div>

            {/* Quote if exists */}
            {lead.quote_amount && (
              <div className="text-sm font-medium text-cta">
                ₹{lead.quote_amount.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
