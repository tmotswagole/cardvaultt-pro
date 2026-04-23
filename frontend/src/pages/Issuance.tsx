import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Search, Check, ChevronRight, User, CreditCard,
  ShieldCheck, AlertTriangle, Loader2, Printer,
  RefreshCcw, Home, Eye
} from 'lucide-react';
import { StatusChip } from '../components/ui/cardvault/StatusChip';
import { ExpiryBadge } from '../components/ui/cardvault/ExpiryBadge';
import { SensitiveValue } from '../components/ui/cardvault/SensitiveValue';
import { RoleGuard } from '../components/ui/cardvault/RoleGuard';

const Issuance: React.FC = () => {
  const [step, setStep] = useState(1);
  const [searchId, setSearchId] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [issuanceSuccess, setIssuanceSuccess] = useState<any>(null);

  const { data: batches } = useQuery({
    queryKey: ['my-branch-inventory'],
    queryFn: async () => {
      const res = await api.get('/inventory/');
      return res.data;
    },
    enabled: step === 2
  });

  const handleLookup = async () => {
    setIsSearching(true);
    setLookupError(null);
    try {
      const res = await api.get(`/issuance/customer-lookup/${searchId}`);
      setCustomer(res.data);
    } catch (err: any) {
      setLookupError(err.response?.data?.detail || 'System unreachable');
    } finally {
      setIsSearching(false);
    }
  };

  const issueMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/issuance/issue', {
        customer_name: customer.full_name,
        account_number: customer.account_number,
        id_number: customer.id_number,
        card_batch_id: selectedBatch.id,
        serial_number: `SN-${Math.floor(Math.random() * 900000) + 100000}`
      });
      return res.data;
    },
    onSuccess: (data) => {
      setIssuanceSuccess(data);
      setShowConfirmModal(false);
      setStep(4);
    }
  });

  const steps = [
    { n: 1, label: 'Find Customer' },
    { n: 2, label: 'Select Card' },
    { n: 3, label: 'Confirm & Issue' },
  ];

  if (step === 4 && issuanceSuccess) {
    return (
      <AppShell title="Issuance Success">
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white rounded-xl border border-ab-border shadow-lg overflow-hidden">
            <div className="bg-ab-success p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold">Card Issued Successfully</h2>
              <p className="opacity-90 mt-1">Ref: {issuanceSuccess.serial_number}</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Customer Name</label>
                  <p className="font-bold text-ab-navy">{issuanceSuccess.customer_name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Account Number</label>
                  <p className="font-bold text-ab-navy">{issuanceSuccess.account_number}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Card Serial Number</label>
                  <p className="font-mono font-bold text-ab-red">{issuanceSuccess.serial_number}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Timestamp</label>
                  <p className="text-ab-navy">{new Date(issuanceSuccess.issued_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-ab-border">
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={() => window.print()}>
                  <Printer size={18} /> Print Receipt
                </button>
                <button className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={() => {
                  setStep(1); setCustomer(null); setIssuanceSuccess(null); setSelectedBatch(null); setSearchId('');
                }}>
                  <RefreshCcw size={18} /> Issue Another
                </button>
              </div>
              <button
                className="w-full text-ab-muted hover:text-ab-navy text-xs font-semibold flex items-center justify-center gap-2"
                onClick={() => window.location.href = '/dashboard'}
              >
                <Home size={14} /> Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Card Issuance">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-ab-border -translate-y-1/2 z-0"></div>
          {steps.map((s) => (
            <div key={s.n} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors border-4 ${
                  step === s.n ? 'bg-ab-red text-white border-ab-red-light' :
                  step > s.n ? 'bg-ab-success text-white border-ab-success-bg' : 'bg-white text-ab-muted border-ab-border'
                }`}
                aria-current={step === s.n ? 'step' : undefined}
              >
                {step > s.n ? <Check size={20} /> : s.n}
              </div>
              <span className={`text-xs font-bold ${step === s.n ? 'text-ab-red' : 'text-ab-muted'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Find Customer */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-ab-border shadow-sm p-8">
            <h3 className="text-lg font-bold text-ab-navy mb-6">Customer Enquiry</h3>
            <div className="flex gap-3 mb-8">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-muted" size={18} />
                <input
                  type="text"
                  placeholder="Enter Account Number or ID (e.g. 1002003004)"
                  className="input-field pl-10 h-12 text-base"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
              <button
                className="btn-primary px-8 h-12 flex items-center gap-2"
                onClick={handleLookup}
                disabled={!searchId || isSearching}
              >
                {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                Search Flexcube
              </button>
            </div>

            {lookupError && (
              <div className="bg-ab-red-light border border-ab-red/20 text-ab-red p-4 rounded-md text-sm mb-8 flex items-center gap-3">
                <AlertTriangle size={20} />
                <div>
                  <p className="font-bold">Error: {lookupError}</p>
                  <p className="opacity-80">Unable to reach core banking system. Please call Card Operations on ext. 1234.</p>
                </div>
              </div>
            )}

            {customer && (
              <div className="bg-ab-surface border border-ab-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-ab-navy">{customer.full_name}</h4>
                    <p className="text-sm text-ab-text-light">Account Number: {customer.account_number}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${customer.status === 'ACTIVE' ? 'bg-ab-success-bg text-ab-success border-ab-success/20' : 'bg-ab-red-light text-ab-red border-ab-red/20'}`}>
                    {customer.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">ID Number</label>
                    <SensitiveValue value={customer.id_number} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Account Type</label>
                    <p className="text-sm font-semibold text-ab-navy">{customer.account_type}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ab-muted uppercase block mb-1">Primary Branch</label>
                    <p className="text-sm font-semibold text-ab-navy">{customer.branch}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {customer.status !== 'ACTIVE' && (
                    <RoleGuard allowedRoles={['BR_MANAGER', 'CARD_OPS']}>
                      <button className="btn-secondary text-ab-red border-ab-red/20">Override Status</button>
                    </RoleGuard>
                  )}
                  <button
                    className="btn-primary px-8"
                    disabled={customer.status !== 'ACTIVE'}
                    onClick={() => setStep(2)}
                  >
                    Confirm Customer & Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Card */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-ab-border shadow-sm p-8">
            <h3 className="text-lg font-bold text-ab-navy mb-2">Available Card Stock</h3>
            <p className="text-sm text-ab-text-light mb-6">Select a card batch to issue from. Only batches with sufficient validity are shown.</p>

            <div className="space-y-3 mb-8">
              {batches?.filter((b: any) => b.quantity_available > 0).map((batch: any) => (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedBatch?.id === batch.id ? 'border-ab-red bg-ab-red-light' : 'border-ab-border hover:border-ab-navy-light bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedBatch?.id === batch.id ? 'bg-white' : 'bg-ab-surface'}`}>
                       <CreditCard className={selectedBatch?.id === batch.id ? 'text-ab-red' : 'text-ab-muted'} size={20} />
                    </div>
                    <div>
                       <p className="font-bold text-ab-navy">{batch.card_type.replace('_', ' ')}</p>
                       <p className="text-[10px] font-mono text-ab-muted">{batch.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-ab-muted uppercase">Stock</p>
                       <p className="text-sm font-bold text-ab-navy">{batch.quantity_available}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-ab-muted uppercase">Expiry</p>
                       <ExpiryBadge expiryDate={batch.expiry_date} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBatch?.id === batch.id ? 'border-ab-red' : 'border-ab-muted'}`}>
                      {selectedBatch?.id === batch.id && <div className="w-2.5 h-2.5 bg-ab-red rounded-full"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-ab-red font-semibold text-sm hover:underline">Back to Customer Lookup</button>
              <button
                className="btn-primary px-12"
                disabled={!selectedBatch}
                onClick={() => setStep(3)}
              >
                Proceed to Confirmation
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Issue */}
        {step === 3 && (
          <div className="bg-white rounded-lg border border-ab-border shadow-sm p-8">
            <h3 className="text-lg font-bold text-ab-navy mb-6">Review & Final Confirmation</h3>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-ab-muted uppercase tracking-widest border-b pb-2">Customer Details</h4>
                <div>
                   <label className="text-xs text-ab-text-light block">Full Name</label>
                   <p className="font-bold text-ab-navy">{customer.full_name}</p>
                </div>
                <div>
                   <label className="text-xs text-ab-text-light block">Account Number</label>
                   <p className="font-bold text-ab-navy">{customer.account_number}</p>
                </div>
                <div>
                   <label className="text-xs text-ab-text-light block">ID Number</label>
                   <p className="font-bold text-ab-navy">{customer.id_number}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-ab-muted uppercase tracking-widest border-b pb-2">Card Details</h4>
                <div>
                   <label className="text-xs text-ab-text-light block">Card Type</label>
                   <p className="font-bold text-ab-navy">{selectedBatch.card_type.replace('_', ' ')}</p>
                </div>
                <div>
                   <label className="text-xs text-ab-text-light block">Network</label>
                   <p className="font-bold text-ab-navy">{selectedBatch.network}</p>
                </div>
                <div>
                   <label className="text-xs text-ab-text-light block">Batch Reference</label>
                   <p className="font-mono text-xs font-bold text-ab-navy">{selectedBatch.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-ab-warning-bg/30 border border-ab-warning/20 p-5 rounded-lg mb-8">
               <div className="flex items-center gap-3 mb-3">
                 <ShieldCheck className="text-ab-warning" size={20} />
                 <h4 className="font-bold text-ab-navy text-sm">Policy Acknowledgement</h4>
               </div>
               <label className="flex items-start gap-3 cursor-pointer">
                 <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-ab-red"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                 />
                 <span className="text-xs text-ab-text-light leading-relaxed">
                   I confirm that I have verified the customer's identity by physical Omang/Passport and this card is being issued in accordance with Access Bank Botswana's Card Issuance Policy. This action is immutable and will be logged for audit.
                 </span>
               </label>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(2)} className="text-ab-red font-semibold text-sm hover:underline">Back to Card Selection</button>
              <button
                className="btn-primary px-12"
                disabled={!confirmChecked}
                onClick={() => setShowConfirmModal(true)}
              >
                Issue Physical Card
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-ab-navy/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-ab-red-light rounded-full flex items-center justify-center text-ab-red mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-ab-navy mb-2">Confirm Card Issuance</h3>
              <p className="text-sm text-ab-text-light leading-relaxed">
                You are about to permanently issue a <span className="font-bold">{selectedBatch.card_type.replace('_', ' ')}</span> to <span className="font-bold">{customer.full_name}</span>. This action cannot be reversed and will be recorded in the audit trail.
              </p>
            </div>
            <div className="bg-ab-surface p-4 flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => setShowConfirmModal(false)}
                disabled={issueMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={() => issueMutation.mutate()}
                disabled={issueMutation.isPending}
              >
                {issueMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : 'Confirm & Issue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Issuance;
