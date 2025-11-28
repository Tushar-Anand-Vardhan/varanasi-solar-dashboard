import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { LeadTimeline } from '@/components/leads/LeadTimeline';
import { AddNoteForm } from '@/components/leads/AddNoteForm';
import { fetchLead, updateLead, addNote, fetchUsers } from '@/services/api';
import { Lead, LeadStatus, User } from '@/mocks/data';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'survey_scheduled', label: 'Survey Scheduled' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [leadData, usersData] = await Promise.all([
        fetchLead(id),
        fetchUsers(),
      ]);
      setLead(leadData);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: 'Lead not found',
        description: 'Could not load lead details.',
        variant: 'destructive',
      });
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    try {
      const updated = await updateLead(lead.id, { status });
      setLead(updated);
      toast({
        title: 'Status updated! ✨',
        description: `Lead moved to ${status.replace('_', ' ')}.`,
      });
      (window as any).__socketEmit?.('lead_updated', updated);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not update status.',
        variant: 'destructive',
      });
    }
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    if (!lead) return;
    try {
      const updated = await updateLead(lead.id, { assigned_to: assigneeId });
      setLead(updated);
      const assignee = users.find(u => u.id === assigneeId);
      toast({
        title: 'Assigned! 👤',
        description: `Lead assigned to ${assignee?.name || 'team member'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not assign lead.',
        variant: 'destructive',
      });
    }
  };

  const handleAddNote = async (content: string) => {
    if (!lead) return;
    try {
      const note = await addNote(lead.id, content);
      setLead(prev => prev ? {
        ...prev,
        timeline: [
          {
            id: note.id,
            type: 'note',
            content: note.content,
            created_at: note.created_at,
            user_name: 'You',
          },
          ...prev.timeline,
        ],
      } : prev);
      toast({
        title: 'Note added! 📝',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add note.',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsAppSuccess = () => {
    // Refresh lead to show new timeline entry
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta" />
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  const assignee = users.find(u => u.id === lead.assigned_to);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/leads')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Leads
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Lead Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-header-primary">{lead.name}</h1>
                <StatusBadge status={lead.status} />
                <SourceBadge source={lead.source} />
              </div>

              <div className="grid gap-2 text-sm">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-cta hover:underline"
                  aria-label={`Call ${lead.name}`}
                >
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </a>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lead.address}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Added {format(new Date(lead.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 lg:items-end">
              {/* Status Change */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select value={lead.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assign */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Assigned:</span>
                <Select
                  value={lead.assigned_to || ''}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* WhatsApp Actions */}
              <div className="flex flex-wrap gap-2 mt-2">
                <WhatsAppButton
                  leadId={lead.id}
                  phone={lead.phone}
                  type="owner"
                  leadName={lead.name}
                  onSuccess={handleWhatsAppSuccess}
                />
                <WhatsAppButton
                  leadId={lead.id}
                  phone={lead.phone}
                  type="customer"
                  leadName={lead.name}
                  onSuccess={handleWhatsAppSuccess}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Preview (if exists) */}
      {lead.quote_amount && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quote Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-cta">
                  ₹{lead.quote_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lead.system_size || 'System size TBD'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline & Notes */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Note</CardTitle>
          </CardHeader>
          <CardContent>
            <AddNoteForm onSubmit={handleAddNote} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadTimeline events={lead.timeline} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
