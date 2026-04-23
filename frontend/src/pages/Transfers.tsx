import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import {
  ArrowLeftRight, Plus, Search, Filter,
  ChevronRight, Clock, CheckCircle2, XCircle,
  AlertTriangle, MoreHorizontal, X, Check
} from 'lucide-react';
import { StatusChip } from '../components/ui/cardvault/StatusChip';
import { RoleGuard } from '../components/ui/cardvault/RoleGuard';

const Transfers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'my-requests'>('pending');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const res = await api.get('/transfers/');
      return res.data;
    }
  });

  const createTransferMutation = useMutation({
    mutationFn: async (newTransfer: any) => {
      const res = await api.post('/transfers/', newTransfer);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setShowNewRequest(false);
    }
  });

  return (
    <AppShell title="Inter-Branch Transfers">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex bg-white p-1 rounded-lg border border-ab-border shadow-sm">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'pending' ? 'bg-ab-navy text-white shadow-md' : 'text-ab-muted hover:text-ab-navy'}`}
            >
              Pending Transfers
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'my-requests' ? 'bg-ab-navy text-white shadow-md' : 'text-ab-muted hover:text-ab-navy'}`}
            >
              My Requests
            </button>
          </div>

          <RoleGuard allowedRoles={['TELLER', 'BR_MANAGER', 'CARD_OPS']}>
            <button
              onClick={() => setShowNewRequest(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              New Transfer Request
            </button>
          </RoleGuard>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ab-navy text-white text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Ref ID</th>
                <th className="px-5 py-3">From Branch</th>
                <th className="px-5 py-3">To Branch</th>
                <th className="px-5 py-3">Card Type</th>
                <th className="px-5 py-3 text-right">Qty</th>
                <th className="px-5 py-3">Date Raised</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ab-border">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-5 py-4"><div className="h-4 bg-ab-surface rounded w-full"></div></td>
                  </tr>
                ))
              ) : transfers?.map((tr: any) => (
                <tr
                  key={tr.id}
                  className="hover:bg-ab-navy-light/20 transition-colors cursor-pointer group"
                  onClick={() => setSelectedTransfer(tr)}
                >
                  <td className="px-5 py-3 font-mono font-bold text-ab-navy">TRF-{tr.id.toString().padStart(5, '0')}</td>
                  <td className="px-5 py-3 text-ab-text-light">{tr.from_branch_id}</td>
                  <td className="px-5 py-3 text-ab-text-light">{tr.to_branch_id}</td>
                  <td className="px-5 py-3 font-medium">{tr.card_type.replace('_', ' ')}</td>
                  <td className="px-5 py-3 text-right font-bold">{tr.quantity}</td>
                  <td className="px-5 py-3 text-ab-muted text-xs">{new Date(tr.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <StatusChip status={tr.status as any} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1 hover:bg-ab-surface rounded-md text-ab-muted group-hover:text-ab-navy">
                       <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transfers?.length === 0 && (
            <div className="p-12 text-center">
              <ArrowLeftRight size={48} className="mx-auto text-ab-navy/10 mb-4" />
              <p className="text-ab-navy font-bold">No transfer requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Request Drawer */}
      {showNewRequest && (
        <>
          <div className="fixed inset-0 bg-ab-navy/40 backdrop-blur-sm z-40" onClick={() => setShowNewRequest(false)}></div>
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-ab-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-ab-navy">New Transfer Request</h3>
              <button onClick={() => setShowNewRequest(false)} className="text-ab-muted hover:text-ab-red"><X size={20} /></button>
            </div>
            <form
              className="flex-1 overflow-y-auto p-6 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createTransferMutation.mutate({
                  from_branch_id: 'GBR-001', // Mocked from user branch
                  to_branch_id: formData.get('to_branch'),
                  card_type: formData.get('card_type'),
                  quantity: parseInt(formData.get('quantity') as string),
                  reason: formData.get('reason')
                });
              }}
            >
              <div>
                <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Destination Branch</label>
                <select name="to_branch" required className="input-field">
                  <option value="">Select Branch</option>
                  <option value="FTW-001">Francistown</option>
                  <option value="MAU-001">Maun</option>
                  <option value="KAS-001">Kasane</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Card Type</label>
                <select name="card_type" required className="input-field">
                  <option value="VISA_DEBIT">Visa Debit</option>
                  <option value="MASTERCARD_DEBIT">Mastercard Debit</option>
                  <option value="PREPAID">Prepaid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Quantity</label>
                <input name="quantity" type="number" required min="1" className="input-field" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Urgency</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="urgency" value="NORMAL" defaultChecked className="accent-ab-red" />
                    <span className="text-sm">Normal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="urgency" value="URGENT" className="accent-ab-red" />
                    <span className="text-sm">Urgent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Reason</label>
                <textarea name="reason" className="input-field h-24 resize-none" placeholder="Explain why this transfer is needed..."></textarea>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={createTransferMutation.isPending} className="btn-primary w-full h-11 flex items-center justify-center gap-2">
                  {createTransferMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      {selectedTransfer && (
        <>
          <div className="fixed inset-0 bg-ab-navy/40 backdrop-blur-sm z-40" onClick={() => setSelectedTransfer(null)}></div>
          <div className="fixed right-0 top-0 h-full w-[500px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-ab-border flex justify-between items-center bg-ab-navy text-white">
                <div>
                  <h3 className="text-lg font-bold">Transfer Details</h3>
                  <p className="text-xs opacity-70 font-mono">TRF-{selectedTransfer.id.toString().padStart(5, '0')}</p>
                </div>
                <button onClick={() => setSelectedTransfer(null)} className="text-white/70 hover:text-white"><X size={20} /></button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                   <StatusChip status={selectedTransfer.status as any} />
                   <span className="text-xs text-ab-muted font-medium">{new Date(selectedTransfer.created_at).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div>
                     <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">From Branch</p>
                     <p className="font-bold text-ab-navy">{selectedTransfer.from_branch_id}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">To Branch</p>
                     <p className="font-bold text-ab-navy">{selectedTransfer.to_branch_id}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Card Type</p>
                     <p className="font-bold text-ab-navy">{selectedTransfer.card_type.replace('_', ' ')}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-ab-muted uppercase mb-1">Quantity</p>
                     <p className="font-bold text-ab-navy">{selectedTransfer.quantity} Cards</p>
                   </div>
                </div>

                <div className="bg-ab-surface p-4 rounded-lg">
                   <p className="text-[10px] font-bold text-ab-muted uppercase mb-2">Request Reason</p>
                   <p className="text-sm text-ab-text-light italic leading-relaxed">
                     "{selectedTransfer.reason || 'No reason provided'}"
                   </p>
                </div>

                <div>
                   <h4 className="text-xs font-bold text-ab-navy uppercase mb-4 flex items-center gap-2">
                     <Clock size={14} /> Transfer Timeline
                   </h4>
                   <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-ab-border">
                      <div className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-ab-success text-white flex items-center justify-center border-4 border-white z-10 shadow-sm"><Check size={12} /></div>
                        <div>
                           <p className="text-xs font-bold text-ab-navy">Request Raised</p>
                           <p className="text-[10px] text-ab-muted">2026-04-20 14:15 • Teller ACC04</p>
                        </div>
                      </div>
                      <div className="flex gap-4 relative opacity-50">
                        <div className="w-6 h-6 rounded-full bg-ab-border text-white flex items-center justify-center border-4 border-white z-10 shadow-sm"><Clock size={12} /></div>
                        <div>
                           <p className="text-xs font-bold text-ab-navy">Awaiting HO Approval</p>
                           <p className="text-[10px] text-ab-muted">Pending</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>

             {selectedTransfer.status === 'PENDING_APPROVAL' && (
               <div className="p-6 border-t border-ab-border bg-ab-surface-2 flex gap-3">
                 <RoleGuard allowedRoles={['BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN']}>
                   <button className="btn-secondary flex-1 border-ab-red text-ab-red hover:bg-ab-red-light">Reject</button>
                   <button className="btn-primary flex-1">Approve Transfer</button>
                 </RoleGuard>
               </div>
             )}
          </div>
        </>
      )}
    </AppShell>
  );
};

const Loader2: React.FC<{ size?: number, className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Transfers;
