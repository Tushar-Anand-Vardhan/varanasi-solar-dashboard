import { MessageCircle } from 'lucide-react';
import { ENV } from '@/config/env';

export function WhatsAppFAB() {
  const whatsappUrl = `https://wa.me/${ENV.OWNER_NUMBER}?text=${encodeURIComponent('Hi! I have a question about Varanasi Solar.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 md:hidden"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
