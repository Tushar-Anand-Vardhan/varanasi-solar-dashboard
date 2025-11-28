import { ENV, WHATSAPP_TEMPLATES } from '@/config/env';
import { Lead, LeadStatus, LeadSource, Note, mockLeads, mockUsers, mockAnalytics, User } from '@/mocks/data';

// In-memory store for mock mode (simulates database)
let leadsStore = [...mockLeads];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API response types
interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

interface FetchLeadsParams {
  limit?: number;
  page?: number;
  status?: LeadStatus;
  q?: string;
}

interface CreateLeadData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  source: LeadSource;
  notes?: string;
}

interface UpdateLeadData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: LeadStatus;
  source?: LeadSource;
  assigned_to?: string;
  quote_amount?: number;
  system_size?: string;
  scheduled_visit?: string;
}

interface SendWhatsAppData {
  to: string;
  type: 'owner' | 'customer';
  message: string;
  lead_id: string;
}

// ============================================
// API Functions
// ============================================

/**
 * Fetch leads with optional filters
 * GET /api/v1/leads?limit&page&status&q
 */
export async function fetchLeads(params: FetchLeadsParams = {}): Promise<LeadsResponse> {
  const { limit = 20, page = 1, status, q } = params;

  if (ENV.MOCK_MODE) {
    await delay(300);
    
    let filtered = [...leadsStore];
    
    // Filter by status
    if (status) {
      filtered = filtered.filter(l => l.status === status);
    }
    
    // Search by name or phone
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.phone.includes(query)
      );
    }
    
    // Sort by created_at desc
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Paginate
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return {
      leads: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  // Real API call
  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('page', String(page));
  if (status) queryParams.set('status', status);
  if (q) queryParams.set('q', q);

  const response = await fetch(`${ENV.API_URL}/leads?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
}

/**
 * Fetch single lead by ID
 * GET /api/v1/leads/:id
 */
export async function fetchLead(id: string): Promise<Lead> {
  if (ENV.MOCK_MODE) {
    await delay(200);
    const lead = leadsStore.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    return lead;
  }

  const response = await fetch(`${ENV.API_URL}/leads/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lead');
  return response.json();
}

/**
 * Create a new lead
 * POST /api/v1/leads
 */
export async function createLead(data: CreateLeadData): Promise<Lead> {
  if (ENV.MOCK_MODE) {
    await delay(400);
    
    const newLead: Lead = {
      id: `l${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: 'new',
      source: data.source,
      timeline: data.notes ? [{
        id: `t${Date.now()}`,
        type: 'note',
        content: data.notes,
        created_at: new Date().toISOString(),
        user_name: 'You',
      }] : [{
        id: `t${Date.now()}`,
        type: 'status_change',
        content: 'Lead created',
        created_at: new Date().toISOString(),
        user_name: 'System',
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    leadsStore = [newLead, ...leadsStore];
    return newLead;
  }

  const response = await fetch(`${ENV.API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create lead');
  return response.json();
}

/**
 * Update an existing lead
 * PUT /api/v1/leads/:id
 */
export async function updateLead(id: string, data: UpdateLeadData): Promise<Lead> {
  if (ENV.MOCK_MODE) {
    await delay(300);
    
    const index = leadsStore.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    const oldLead = leadsStore[index];
    const updatedLead: Lead = {
      ...oldLead,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Add status change to timeline
    if (data.status && data.status !== oldLead.status) {
      updatedLead.timeline = [{
        id: `t${Date.now()}`,
        type: 'status_change',
        content: `Status changed to ${data.status.replace('_', ' ')}`,
        created_at: new Date().toISOString(),
        user_name: 'You',
      }, ...updatedLead.timeline];
    }
    
    leadsStore[index] = updatedLead;
    return updatedLead;
  }

  const response = await fetch(`${ENV.API_URL}/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lead');
  return response.json();
}

/**
 * Add a note to a lead
 * POST /api/v1/leads/:id/notes
 */
export async function addNote(leadId: string, content: string): Promise<Note> {
  if (ENV.MOCK_MODE) {
    await delay(200);
    
    const index = leadsStore.findIndex(l => l.id === leadId);
    if (index === -1) throw new Error('Lead not found');
    
    const note: Note = {
      id: `n${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      user_id: 'u1',
    };
    
    leadsStore[index] = {
      ...leadsStore[index],
      timeline: [{
        id: note.id,
        type: 'note',
        content: note.content,
        created_at: note.created_at,
        user_name: 'You',
      }, ...leadsStore[index].timeline],
      updated_at: new Date().toISOString(),
    };
    
    return note;
  }

  const response = await fetch(`${ENV.API_URL}/leads/${leadId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to add note');
  return response.json();
}

/**
 * Send WhatsApp message
 * POST /api/v1/whatsapp/send
 * 
 * Request body:
 * {
 *   "to": "919876543210",
 *   "type": "owner" | "customer",
 *   "message": "New lead: Ramesh (919xxxxxxxxx) — needs follow-up!",
 *   "lead_id": "l1"
 * }
 */
export async function sendWhatsApp(data: SendWhatsAppData): Promise<{ success: boolean }> {
  if (ENV.MOCK_MODE) {
    await delay(500);
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    
    if (success) {
      // Add to lead timeline
      const index = leadsStore.findIndex(l => l.id === data.lead_id);
      if (index !== -1) {
        leadsStore[index] = {
          ...leadsStore[index],
          timeline: [{
            id: `t${Date.now()}`,
            type: 'whatsapp',
            content: `WhatsApp sent to ${data.type}: "${data.message.substring(0, 50)}..."`,
            created_at: new Date().toISOString(),
            user_name: 'You',
          }, ...leadsStore[index].timeline],
          updated_at: new Date().toISOString(),
        };
      }
      
      return { success: true };
    } else {
      throw new Error('Failed to send WhatsApp message');
    }
  }

  const response = await fetch(`${ENV.API_URL}/whatsapp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to send WhatsApp');
  return response.json();
}

/**
 * Fetch analytics summary
 * GET /api/v1/analytics/summary
 */
export async function fetchAnalytics(): Promise<typeof mockAnalytics> {
  if (ENV.MOCK_MODE) {
    await delay(200);
    
    // Calculate real stats from mock data
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      new_leads_24h: leadsStore.filter(l => new Date(l.created_at) > yesterday).length,
      pipeline_total: leadsStore.filter(l => !['won', 'lost'].includes(l.status)).length,
      pending_followups: leadsStore.filter(l => ['new', 'contacted'].includes(l.status)).length,
      conversions_month: leadsStore.filter(l => l.status === 'won').length,
    };
  }

  const response = await fetch(`${ENV.API_URL}/analytics/summary`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<User[]> {
  if (ENV.MOCK_MODE) {
    await delay(100);
    return mockUsers;
  }

  const response = await fetch(`${ENV.API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

/**
 * Export leads to CSV
 */
export function exportToCSV(leads: Lead[]): string {
  const headers = ['Name', 'Phone', 'Email', 'Address', 'Status', 'Source', 'Quote Amount', 'Created'];
  const rows = leads.map(l => [
    l.name,
    l.phone,
    l.email || '',
    l.address,
    l.status,
    l.source,
    l.quote_amount?.toString() || '',
    new Date(l.created_at).toLocaleDateString(),
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}
