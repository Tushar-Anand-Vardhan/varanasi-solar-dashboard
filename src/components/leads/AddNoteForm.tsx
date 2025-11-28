import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AddNoteFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function AddNoteForm({ onSubmit }: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add a note... (e.g., 'Spoke with customer, interested in 5kW system')"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !content.trim()}
          size="sm"
          className="bg-cta hover:bg-cta/90"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Adding...' : 'Add Note'}
        </Button>
      </div>
    </form>
  );
}
