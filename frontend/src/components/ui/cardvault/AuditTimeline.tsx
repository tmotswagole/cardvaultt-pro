import React from 'react';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle,
  User, Building2, ArrowRight
} from 'lucide-react';

export interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  branch: string;
  details?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
}

interface AuditTimelineProps {
  entries: AuditEntry[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ entries }) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={14} className="text-ab-success" />;
      case 'warning': return <AlertTriangle size={14} className="text-ab-warning" />;
      case 'danger': return <XCircle size={14} className="text-ab-red" />;
      default: return <Clock size={14} className="text-ab-info" />;
    }
  };

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case 'success': return 'bg-ab-success';
      case 'warning': return 'bg-ab-warning';
      case 'danger': return 'bg-ab-red';
      default: return 'bg-ab-info';
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-ab-border">
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-4 relative">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-ab-border z-10 shadow-sm">
            {getIcon(entry.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-ab-navy">{entry.action}</p>
              <span className="text-[10px] text-ab-muted font-mono">{entry.timestamp}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-ab-text-light font-medium">
              <span className="flex items-center gap-1"><User size={10} /> {entry.user}</span>
              <span className="flex items-center gap-1"><Building2 size={10} /> {entry.branch}</span>
            </div>
            {entry.details && (
              <p className="text-xs text-ab-text-light mt-2 bg-ab-surface p-2 rounded border border-ab-border italic">
                "{entry.details}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
