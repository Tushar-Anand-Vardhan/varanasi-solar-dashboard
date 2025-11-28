import { MessageSquare, FileText, Phone, Calendar, CheckCircle } from 'lucide-react';
import { TimelineEvent } from '@/mocks/data';
import { format } from 'date-fns';

interface LeadTimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<TimelineEvent['type'], React.ReactNode> = {
  note: <FileText className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  status_change: <CheckCircle className="h-4 w-4" />,
  visit: <Calendar className="h-4 w-4" />,
};

const eventColors: Record<TimelineEvent['type'], string> = {
  note: 'bg-muted text-muted-foreground',
  call: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  whatsapp: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  status_change: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  visit: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export function LeadTimeline({ events }: LeadTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity yet. Start by adding a note!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`p-2 rounded-full ${eventColors[event.type]}`}>
              {eventIcons[event.type]}
            </div>
            {index < events.length - 1 && (
              <div className="w-px h-full bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{event.content}</p>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(event.created_at), 'MMM d, h:mm a')}
              </time>
            </div>
            {event.user_name && (
              <p className="text-xs text-muted-foreground mt-1">
                by {event.user_name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
