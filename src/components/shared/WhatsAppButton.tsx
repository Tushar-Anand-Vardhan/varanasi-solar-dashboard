import { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendWhatsApp } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface WhatsAppButtonProps {
  leadId: string;
  phone: string;
  type: 'owner' | 'customer';
  leadName: string;
  onSuccess?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function WhatsAppButton({
  leadId,
  phone,
  type,
  leadName,
  onSuccess,
  variant = 'default',
  size = 'default',
  className = '',
}: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const message = type === 'owner'
        ? `New lead: ${leadName} (${phone}) — needs follow-up!`
        : `Namaste ${leadName}! Thank you for your interest in Varanasi Solar. We'll contact you shortly about your solar installation. 🌞`;

      await sendWhatsApp({
        to: phone,
        type,
        message,
        lead_id: leadId,
      });

      toast({
        title: type === 'owner' ? 'Owner notified! 🎉' : 'Message sent! 📱',
        description: type === 'owner'
          ? 'Done — owner notified.'
          : `WhatsApp sent to ${leadName}.`,
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Failed to send',
        description: 'Could not send WhatsApp message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      size={size}
      className={`${type === 'owner' ? 'bg-header-primary hover:bg-header-primary/90' : 'bg-green-600 hover:bg-green-700'} text-white ${className}`}
      aria-label={`Send WhatsApp to ${type === 'owner' ? 'owner' : 'customer'}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4 mr-2" />
      )}
      {type === 'owner' ? 'Notify Owner' : 'Message Customer'}
    </Button>
  );
}
