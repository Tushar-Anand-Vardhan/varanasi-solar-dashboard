import { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { LeadCard } from '@/components/leads/LeadCard';
import { NewLeadModal, NewLeadData } from '@/components/leads/NewLeadModal';
import { fetchAnalytics, fetchLeads, createLead } from '@/services/api';
import { Lead } from '@/mocks/data';
import { toast } from '@/hooks/use-toast';
import { useSocketEvent } from '@/contexts/SocketContext';

interface Analytics {
  new_leads_24h: number;
  pipeline_total: number;
  pending_followups: number;
  conversions_month: number;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [analyticsData, leadsData] = await Promise.all([
        fetchAnalytics(),
        fetchLeads({ limit: 5 }),
      ]);
      setAnalytics(analyticsData);
      setRecentLeads(leadsData.leads);
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: 'Could not load dashboard data. Please refresh.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for real-time lead updates
  useSocketEvent('lead_created', (newLead: Lead) => {
    setRecentLeads(prev => [newLead, ...prev.slice(0, 4)]);
    setAnalytics(prev => prev ? { ...prev, new_leads_24h: prev.new_leads_24h + 1 } : prev);
  });

  const handleCreateLead = async (data: NewLeadData) => {
    try {
      const newLead = await createLead(data);
      toast({
        title: 'Lead added! 🌞',
        description: `${data.name} has been added to your pipeline.`,
      });
      // Emit socket event for real-time update
      (window as any).__socketEmit?.('lead_created', newLead);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create lead. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-header-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your leads.
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

      {/* Microcopy hint */}
      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        💡 New lead? Tap the green button — we'll ping the owner.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="New Leads (24h)"
          value={analytics?.new_leads_24h || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
        />
        <KpiCard
          title="Pipeline Total"
          value={analytics?.pipeline_total || 0}
          icon={<Users className="h-5 w-5" />}
        />
        <KpiCard
          title="Pending Follow-ups"
          value={analytics?.pending_followups || 0}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 3, positive: false }}
        />
        <KpiCard
          title="Conversions (Month)"
          value={analytics?.conversions_month || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-header-primary">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No leads yet. Add your first lead to get started!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏠 Lanka Installs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cta">12</p>
            <p className="text-sm text-muted-foreground">Solar systems installed in Lanka area</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🛕 Assi Ghat Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-header-primary">8</p>
            <p className="text-sm text-muted-foreground">Pending surveys near Assi Ghat</p>
          </CardContent>
        </Card>
      </div>

      {/* New Lead Modal */}
      <NewLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleCreateLead}
      />
    </div>
  );
}
