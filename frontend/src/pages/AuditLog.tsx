import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  History, Search, Filter, Download,
  Calendar, User, Building2, AlertCircle, Eye
} from 'lucide-react';
import { StatusChip } from '../components/ui/cardvault/StatusChip';

const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await api.get('/audit/');
      return res.data;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-l-4 border-l-ab-red';
      case 'WARNING': return 'border-l-4 border-l-ab-warning';
      default: return 'border-l-4 border-l-transparent';
    }
  };

  return (
    <AppShell title="Audit Trail">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg border border-ab-border shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-muted" size={18} />
            <input
              type="text"
              placeholder="Search by User, Event, or Description..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Calendar size={16} />
              Last 7 Days
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={16} />
              Event Type
            </button>
            <button className="btn-secondary flex items-center gap-2 text-ab-navy">
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ab-navy text-white text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Branch</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ab-border">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-5 py-4"><div className="h-4 bg-ab-surface rounded w-full"></div></td>
                  </tr>
                ))
              ) : auditLogs?.map((log: any) => (
                <tr
                  key={log.id}
                  className={`hover:bg-ab-navy-light/20 transition-colors group ${getSeverityColor(log.severity)}`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-ab-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <StatusChip status={log.event_type} />
                  </td>
                  <td className="px-5 py-3 font-semibold text-ab-navy whitespace-nowrap">
                    {log.user_id}
                  </td>
                  <td className="px-5 py-3 text-ab-text-light whitespace-nowrap">{log.branch_id}</td>
                  <td className="px-5 py-3 text-xs text-ab-text-light line-clamp-1 max-w-xs">{log.description}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedEntry(log)}
                      className="text-ab-red hover:bg-ab-red-light p-1 rounded-md transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {auditLogs?.length === 0 && (
            <div className="p-12 text-center">
              <History size={48} className="mx-auto text-ab-navy/10 mb-4" />
              <p className="text-ab-navy font-bold">No audit events found</p>
            </div>
          )}
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-ab-navy/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-ab-border flex justify-between items-center bg-ab-surface">
               <h3 className="font-bold text-ab-navy flex items-center gap-2">
                 <History size={18} className="text-ab-red" />
                 Audit Entry Details
               </h3>
               <button onClick={() => setSelectedEntry(null)} className="text-ab-muted hover:text-ab-red"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Timestamp</p>
                   <p className="text-sm font-mono">{new Date(selectedEntry.timestamp).toLocaleString()}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Event Type</p>
                   <StatusChip status={selectedEntry.event_type} />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">User ID</p>
                   <div className="flex items-center gap-2">
                     <User size={14} className="text-ab-muted" />
                     <p className="text-sm font-bold">{selectedEntry.user_id}</p>
                   </div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">IP Address</p>
                   <p className="text-sm font-mono">{selectedEntry.ip_address}</p>
                 </div>
               </div>

               <div>
                 <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Action Performed</p>
                 <div className="bg-ab-surface-2 p-4 rounded border border-ab-border">
                   <p className="text-sm text-ab-navy font-medium leading-relaxed">{selectedEntry.description}</p>
                 </div>
               </div>

               <div>
                 <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Before / After State (JSON Diff)</p>
                 <div className="bg-[#1e1e1e] p-4 rounded font-mono text-xs text-green-400 overflow-x-auto">
                    <pre>{JSON.stringify({
                      status: "IN_VAULT",
                      quantity: 200,
                      _update: { status: "ALLOCATED", quantity: 150 }
                    }, null, 2)}</pre>
                 </div>
               </div>
            </div>
            <div className="bg-ab-surface p-4 border-t border-ab-border flex justify-end">
               <button className="btn-secondary flex items-center gap-2" onClick={() => window.print()}>
                  <Download size={16} /> Download as PDF
               </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

const X: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default AuditLog;
