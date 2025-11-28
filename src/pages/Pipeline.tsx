import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { fetchLeads, updateLead } from '@/services/api';
import { Lead, LeadStatus } from '@/mocks/data';
import { toast } from '@/hooks/use-toast';
import { useSocketEvent } from '@/contexts/SocketContext';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'survey_scheduled', label: 'Survey', color: 'bg-purple-500' },
  { id: 'quoted', label: 'Quoted', color: 'bg-orange-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-pink-500' },
  { id: 'won', label: 'Won', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-gray-500' },
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchLeads({ limit: 100 });
      setLeads(data.leads);
    } catch (error) {
      toast({
        title: 'Error loading pipeline',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useSocketEvent('lead_created', (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  });

  useSocketEvent('lead_updated', (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    
    // Optimistic update
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, status: newStatus } : l
    ));

    try {
      const updated = await updateLead(leadId, { status: newStatus });
      toast({
        title: 'Stage updated! 🎯',
        description: `Lead moved to ${newStatus.replace('_', ' ')}.`,
      });
      (window as any).__socketEmit?.('lead_updated', updated);
    } catch (error) {
      // Revert on error
      loadData();
      toast({
        title: 'Error',
        description: 'Could not update lead status.',
        variant: 'destructive',
      });
    }
  };

  const getLeadsByStage = (status: LeadStatus) =>
    leads.filter(l => l.status === status);

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
        <h1 className="text-2xl font-bold text-header-primary">Pipeline</h1>
        <p className="text-muted-foreground mt-1">
          Drag and drop leads between stages. Book survey → close the deal! 🌞
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                      {stage.label}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      {getLeadsByStage(stage.id).length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-2 transition-colors rounded-lg p-2 ${
                          snapshot.isDraggingOver ? 'bg-muted' : ''
                        }`}
                      >
                        {getLeadsByStage(stage.id).map((lead, index) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-card border rounded-lg p-3 shadow-sm transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <Link
                                  to={`/leads/${lead.id}`}
                                  className="block hover:opacity-80"
                                >
                                  <p className="font-medium text-sm truncate">
                                    {lead.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Phone className="h-3 w-3" />
                                    {lead.phone}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate mt-1">
                                    {lead.address}
                                  </p>
                                  {lead.quote_amount && (
                                    <p className="text-xs font-medium text-cta mt-1">
                                      ₹{lead.quote_amount.toLocaleString('en-IN')}
                                    </p>
                                  )}
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
