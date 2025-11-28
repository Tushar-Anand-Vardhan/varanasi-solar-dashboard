// Environment configuration
// Set VITE_MOCK_MODE=false to connect to real API

export const ENV = {
  MOCK_MODE: import.meta.env.VITE_MOCK_MODE !== 'false',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  OWNER_NUMBER: import.meta.env.VITE_OWNER_NUMBER || '919876543210',
};

// WhatsApp message templates
// Variables: {name}, {phone}, {address}
export const WHATSAPP_TEMPLATES = {
  // Template for notifying the owner about a new lead
  owner: 'New lead: {name} ({phone}) — needs follow-up!',
  
  // Template for welcoming a new customer
  customer: 'Namaste {name}! Thank you for your interest in Varanasi Solar. We will contact you shortly about your solar installation.',
};
