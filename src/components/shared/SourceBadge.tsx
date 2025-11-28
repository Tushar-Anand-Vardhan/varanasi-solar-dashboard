import { LeadSource } from '@/mocks/data';
import { User, Users, Globe, Share2, Calendar } from 'lucide-react';

interface SourceBadgeProps {
  source: LeadSource;
}

const sourceConfig: Record<LeadSource, { label: string; icon: React.ReactNode; className: string }> = {
  walk_in: {
    label: 'Walk-in',
    icon: <User className="h-3 w-3" />,
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  referral: {
    label: 'Referral',
    icon: <Users className="h-3 w-3" />,
    className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
  website: {
    label: 'Website',
    icon: <Globe className="h-3 w-3" />,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  social: {
    label: 'Social',
    icon: <Share2 className="h-3 w-3" />,
    className: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  camp: {
    label: 'Camp',
    icon: <Calendar className="h-3 w-3" />,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const config = sourceConfig[source];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
