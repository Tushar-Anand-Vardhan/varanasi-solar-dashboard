import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Grid, List, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadTable } from '@/components/leads/LeadTable';
import { NewLeadModal, NewLeadData } from '@/components/leads/NewLeadModal';
import { fetchLeads, createLead, exportToCSV, fetchUsers } from '@/services/api';
import { Lead, LeadStatus, User } from '@/mocks/data';
import { toast } from '@/hooks/use-toast';
import { useSocketEvent } from '@/contexts/SocketContext';

type ViewMode = 'card' | 'table';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsData, usersData] = await Promise.all([
        fetchLeads({
          q: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        }),
        fetchUsers(),
      ]);
      setLeads(leadsData.leads);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: 'Error loading leads',
        description: 'Could not load leads. Please refresh.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(loadData, 300);
    return () => clearTimeout(debounce);
  }, [loadData]);

  // Listen for real-time lead updates
  useSocketEvent('lead_created', (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  });

  useSocketEvent('lead_updated', (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  });

  const handleCreateLead = async (data: NewLeadData) => {
    try {
      const newLead = await createLead(data);
      toast({
        title: 'Lead added! 🌞',
        description: `${data.name} has been added.`,
      });
      (window as any).__socketEmit?.('lead_created', newLead);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create lead.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleExport = () => {
    const leadsToExport = selectedLeads.length > 0
      ? leads.filter(l => selectedLeads.includes(l.id))
      : leads;
    
    const csv = exportToCSV(leadsToExport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported! 📄',
      description: `${leadsToExport.length} leads exported to CSV.`,
    });
  };

  const handleSelectLead = (id: string, selected: boolean) => {
    setSelectedLeads(prev =>
      selected ? [...prev, id] : prev.filter(lid => lid !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedLeads(selected ? leads.map(l => l.id) : []);
  };

  const statusOptions: { value: LeadStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'survey_scheduled', label: 'Survey Scheduled' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-header-primary">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage your solar leads from Varanasi and beyond.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-cta hover:bg-cta/90 text-white"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('card')}
            aria-label="Card view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedLeads.length} selected
          </span>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLeads([])}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Leads Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No leads found</h3>
          <p className="text-muted-foreground mt-1">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Add your first lead to get started!'}
          </p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <LeadTable
          leads={leads}
          selectedIds={selectedLeads}
          onSelect={handleSelectLead}
          onSelectAll={handleSelectAll}
          onExport={handleExport}
        />
      )}

      {/* Export Button (when no selection) */}
      {leads.length > 0 && selectedLeads.length === 0 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export All to CSV
          </Button>
        </div>
      )}

      {/* New Lead Modal */}
      <NewLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleCreateLead}
      />
    </div>
  );
}
