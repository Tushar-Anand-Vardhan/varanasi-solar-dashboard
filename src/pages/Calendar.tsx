import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { fetchLeads } from '@/services/api';
import { Lead } from '@/mocks/data';
import { format, isSameDay, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLeads({ status: 'survey_scheduled', limit: 100 });
        setLeads(data.leads);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get visits for selected date (using scheduled_visit from mock data)
  const scheduledVisits = leads.filter(lead => {
    if (!lead.scheduled_visit) return false;
    return isSameDay(parseISO(lead.scheduled_visit), selectedDate);
  });

  // Get all dates that have scheduled visits
  const datesWithVisits = leads
    .filter(l => l.scheduled_visit)
    .map(l => parseISO(l.scheduled_visit!));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-header-primary">Calendar</h1>
        <p className="text-muted-foreground mt-1">
          View and manage scheduled site surveys across Varanasi.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasVisit: datesWithVisits,
              }}
              modifiersStyles={{
                hasVisit: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--cta) / 0.2)',
                },
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Scheduled Visits for Selected Date */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Visits on {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledVisits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No surveys scheduled for this day.</p>
                <p className="text-sm mt-1">
                  Schedule surveys from the lead detail page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledVisits.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/leads/${lead.id}`}
                    className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{lead.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {lead.address}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {lead.scheduled_visit && format(parseISO(lead.scheduled_visit), 'h:mm a')}
                        </div>
                      </div>
                      {lead.assigned_to && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          Assigned
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Scheduled Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No surveys scheduled yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  to={`/leads/${lead.id}`}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.address}</p>
                  {lead.scheduled_visit && (
                    <p className="text-sm text-cta mt-2">
                      {format(parseISO(lead.scheduled_visit), 'MMM d, h:mm a')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
