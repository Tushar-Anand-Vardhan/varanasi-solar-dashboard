// Lead status types
export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'survey_scheduled' 
  | 'quoted' 
  | 'negotiation' 
  | 'won' 
  | 'lost';

// Lead source types
export type LeadSource = 
  | 'walk_in' 
  | 'referral' 
  | 'website' 
  | 'social' 
  | 'camp';

// Timeline event types
export interface TimelineEvent {
  id: string;
  type: 'note' | 'call' | 'whatsapp' | 'status_change' | 'visit';
  content: string;
  created_at: string;
  user_name?: string;
}

// Note type
export interface Note {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

// Lead type
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  status: LeadStatus;
  source: LeadSource;
  assigned_to?: string;
  quote_amount?: number;
  system_size?: string;
  scheduled_visit?: string;
  timeline: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'technician';
  phone: string;
}

// Mock users (4 demo users)
export const mockUsers: User[] = [
  { id: 'u1', name: 'Rajesh Sharma', email: 'rajesh@varanasisolar.com', role: 'admin', phone: '919876543210' },
  { id: 'u2', name: 'Priya Gupta', email: 'priya@varanasisolar.com', role: 'sales', phone: '919876543211' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@varanasisolar.com', role: 'sales', phone: '919876543212' },
  { id: 'u4', name: 'Vikram Singh', email: 'vikram@varanasisolar.com', role: 'technician', phone: '919876543213' },
];

// Mock leads (20 demo leads)
export const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Ramesh Kumar',
    phone: '919812345678',
    email: 'ramesh@gmail.com',
    address: 'B-45, Lanka, Varanasi',
    status: 'new',
    source: 'walk_in',
    assigned_to: 'u2',
    timeline: [
      { id: 't1', type: 'status_change', content: 'Lead created', created_at: '2024-01-15T10:30:00Z', user_name: 'System' },
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'l2',
    name: 'Sunita Devi',
    phone: '919812345679',
    address: 'C-12, Assi Ghat, Varanasi',
    status: 'contacted',
    source: 'referral',
    assigned_to: 'u3',
    timeline: [
      { id: 't2', type: 'whatsapp', content: 'Sent welcome message', created_at: '2024-01-14T14:00:00Z', user_name: 'Priya Gupta' },
      { id: 't3', type: 'status_change', content: 'Lead created', created_at: '2024-01-14T09:00:00Z', user_name: 'System' },
    ],
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T14:00:00Z',
  },
  {
    id: 'l3',
    name: 'Vijay Pandey',
    phone: '919812345680',
    email: 'vijay.p@email.com',
    address: 'D-78, Sigra, Varanasi',
    status: 'survey_scheduled',
    source: 'website',
    assigned_to: 'u4',
    scheduled_visit: '2024-01-20T10:00:00Z',
    timeline: [
      { id: 't4', type: 'visit', content: 'Survey scheduled for Jan 20', created_at: '2024-01-13T16:00:00Z', user_name: 'Amit Kumar' },
      { id: 't5', type: 'call', content: 'Discussed requirements - interested in 5kW system', created_at: '2024-01-13T11:00:00Z', user_name: 'Amit Kumar' },
    ],
    created_at: '2024-01-12T08:00:00Z',
    updated_at: '2024-01-13T16:00:00Z',
  },
  {
    id: 'l4',
    name: 'Meera Singh',
    phone: '919812345681',
    address: 'E-23, Bhelupur, Varanasi',
    status: 'quoted',
    source: 'social',
    assigned_to: 'u2',
    quote_amount: 285000,
    system_size: '5kW On-Grid',
    timeline: [
      { id: 't6', type: 'note', content: 'Quote sent via email - 5kW system at ₹2,85,000', created_at: '2024-01-11T15:00:00Z', user_name: 'Priya Gupta' },
    ],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-11T15:00:00Z',
  },
  {
    id: 'l5',
    name: 'Arun Yadav',
    phone: '919812345682',
    email: 'arun.y@company.com',
    address: 'F-56, Shivpur, Varanasi',
    status: 'negotiation',
    source: 'camp',
    assigned_to: 'u3',
    quote_amount: 450000,
    system_size: '8kW On-Grid',
    timeline: [
      { id: 't7', type: 'note', content: 'Customer asking for 10% discount', created_at: '2024-01-10T14:00:00Z', user_name: 'Amit Kumar' },
    ],
    created_at: '2024-01-08T09:00:00Z',
    updated_at: '2024-01-10T14:00:00Z',
  },
  {
    id: 'l6',
    name: 'Geeta Mishra',
    phone: '919812345683',
    address: 'G-89, Mahmoorganj, Varanasi',
    status: 'won',
    source: 'referral',
    assigned_to: 'u2',
    quote_amount: 195000,
    system_size: '3kW On-Grid',
    timeline: [
      { id: 't8', type: 'status_change', content: 'Deal closed! Installation scheduled.', created_at: '2024-01-09T11:00:00Z', user_name: 'Priya Gupta' },
    ],
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-09T11:00:00Z',
  },
  {
    id: 'l7',
    name: 'Ravi Tiwari',
    phone: '919812345684',
    address: 'H-34, Sarnath, Varanasi',
    status: 'lost',
    source: 'website',
    timeline: [
      { id: 't9', type: 'note', content: 'Budget constraints - will revisit next year', created_at: '2024-01-08T10:00:00Z', user_name: 'Amit Kumar' },
    ],
    created_at: '2024-01-02T08:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
  {
    id: 'l8',
    name: 'Anita Verma',
    phone: '919812345685',
    email: 'anita.v@gmail.com',
    address: 'I-67, Pandeypur, Varanasi',
    status: 'new',
    source: 'walk_in',
    timeline: [],
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
  {
    id: 'l9',
    name: 'Suresh Chauhan',
    phone: '919812345686',
    address: 'J-12, Cantonment, Varanasi',
    status: 'contacted',
    source: 'camp',
    assigned_to: 'u3',
    timeline: [
      { id: 't10', type: 'call', content: 'Initial call - interested in commercial system', created_at: '2024-01-14T16:00:00Z', user_name: 'Amit Kumar' },
    ],
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
  {
    id: 'l10',
    name: 'Kavita Jaiswal',
    phone: '919812345687',
    address: 'K-45, Nadesar, Varanasi',
    status: 'survey_scheduled',
    source: 'social',
    assigned_to: 'u4',
    scheduled_visit: '2024-01-21T14:00:00Z',
    timeline: [
      { id: 't11', type: 'visit', content: 'Survey scheduled for Jan 21 afternoon', created_at: '2024-01-14T12:00:00Z', user_name: 'Vikram Singh' },
    ],
    created_at: '2024-01-11T09:00:00Z',
    updated_at: '2024-01-14T12:00:00Z',
  },
  {
    id: 'l11',
    name: 'Deepak Srivastava',
    phone: '919812345688',
    email: 'deepak.s@business.com',
    address: 'L-78, Lahartara, Varanasi',
    status: 'quoted',
    source: 'website',
    assigned_to: 'u2',
    quote_amount: 680000,
    system_size: '10kW On-Grid',
    timeline: [],
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-12T15:00:00Z',
  },
  {
    id: 'l12',
    name: 'Pooja Agarwal',
    phone: '919812345689',
    address: 'M-23, Durgakund, Varanasi',
    status: 'new',
    source: 'referral',
    timeline: [],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'l13',
    name: 'Manoj Dubey',
    phone: '919812345690',
    address: 'N-56, Kamachha, Varanasi',
    status: 'contacted',
    source: 'walk_in',
    assigned_to: 'u2',
    timeline: [
      { id: 't12', type: 'whatsapp', content: 'Sent product brochure', created_at: '2024-01-13T10:00:00Z', user_name: 'Priya Gupta' },
    ],
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
  {
    id: 'l14',
    name: 'Shanti Prasad',
    phone: '919812345691',
    address: 'O-89, Godowlia, Varanasi',
    status: 'negotiation',
    source: 'camp',
    assigned_to: 'u3',
    quote_amount: 320000,
    system_size: '6kW On-Grid',
    timeline: [],
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-11T14:00:00Z',
  },
  {
    id: 'l15',
    name: 'Rakesh Maurya',
    phone: '919812345692',
    address: 'P-34, Ramnagar, Varanasi',
    status: 'won',
    source: 'referral',
    assigned_to: 'u2',
    quote_amount: 255000,
    system_size: '4kW On-Grid',
    timeline: [],
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-10T11:00:00Z',
  },
  {
    id: 'l16',
    name: 'Suman Patel',
    phone: '919812345693',
    email: 'suman.p@email.com',
    address: 'Q-67, Manduadih, Varanasi',
    status: 'survey_scheduled',
    source: 'website',
    assigned_to: 'u4',
    scheduled_visit: '2024-01-22T11:00:00Z',
    timeline: [],
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
  },
  {
    id: 'l17',
    name: 'Ashok Tripathi',
    phone: '919812345694',
    address: 'R-12, Chetganj, Varanasi',
    status: 'new',
    source: 'social',
    timeline: [],
    created_at: '2024-01-14T14:00:00Z',
    updated_at: '2024-01-14T14:00:00Z',
  },
  {
    id: 'l18',
    name: 'Nirmala Saxena',
    phone: '919812345695',
    address: 'S-45, Sonarpura, Varanasi',
    status: 'contacted',
    source: 'walk_in',
    assigned_to: 'u3',
    timeline: [],
    created_at: '2024-01-11T15:00:00Z',
    updated_at: '2024-01-13T11:00:00Z',
  },
  {
    id: 'l19',
    name: 'Prakash Rai',
    phone: '919812345696',
    email: 'prakash.r@company.com',
    address: 'T-78, Maldahiya, Varanasi',
    status: 'quoted',
    source: 'referral',
    assigned_to: 'u2',
    quote_amount: 520000,
    system_size: '8kW Hybrid',
    timeline: [],
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-12T16:00:00Z',
  },
  {
    id: 'l20',
    name: 'Uma Shankar',
    phone: '919812345697',
    address: 'U-23, Dashashwamedh, Varanasi',
    status: 'lost',
    source: 'website',
    timeline: [
      { id: 't13', type: 'note', content: 'Went with competitor - price issue', created_at: '2024-01-09T10:00:00Z', user_name: 'Priya Gupta' },
    ],
    created_at: '2024-01-04T09:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
  },
];

// Mock analytics data
export const mockAnalytics = {
  new_leads_24h: 4,
  pipeline_total: 14,
  pending_followups: 6,
  conversions_month: 2,
};
