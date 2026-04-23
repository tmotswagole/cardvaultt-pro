import React from 'react';
import { useAuthStore, Role } from '../../../store/authStore';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle,
  CreditCard, Package, ArrowLeftRight, ShieldCheck, ShieldOff
} from 'lucide-react';

export type StatusType = 'active' | 'blocked' | 'pending' | 'expired' | 'destroyed' | 'escalated' | 'in_transit' | 'delivered' | 'rejected' | 'IN_VAULT' | 'ALLOCATED' | 'ISSUED' | 'EXPIRED' | 'DESTROYED';

interface StatusChipProps {
  status: StatusType;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const config: Record<string, { label: string, icon: any, className: string }> = {
    active: { label: 'Active', icon: CheckCircle2, className: 'bg-[#E6F4ED] text-[#1A7A4A] border-[#1A7A4A]/20' },
    ISSUED: { label: 'Issued', icon: CreditCard, className: 'bg-[#E6F4ED] text-[#1A7A4A] border-[#1A7A4A]/20' },
    IN_VAULT: { label: 'In Vault', icon: Package, className: 'bg-[#E6EFF8] text-[#1B5FA8] border-[#1B5FA8]/20' },
    ALLOCATED: { label: 'Allocated', icon: ShieldCheck, className: 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/20' },
    blocked: { label: 'Blocked', icon: ShieldOff, className: 'bg-[#F5E6E6] text-[#CC0001] border-[#CC0001]/20' },
    pending: { label: 'Pending', icon: Clock, className: 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/20' },
    expired: { label: 'Expired', icon: XCircle, className: 'bg-[#EFF1F5] text-[#8E96A8] border-[#8E96A8]/20' },
    EXPIRED: { label: 'Expired', icon: XCircle, className: 'bg-[#EFF1F5] text-[#8E96A8] border-[#8E96A8]/20' },
    destroyed: { label: 'Destroyed', icon: XCircle, className: 'bg-[#1A2744]/10 text-[#1A2744] border-[#1A2744]/20' },
    DESTROYED: { label: 'Destroyed', icon: XCircle, className: 'bg-[#1A2744]/10 text-[#1A2744] border-[#1A2744]/20' },
    escalated: { label: 'Escalated', icon: AlertTriangle, className: 'bg-[#E6EFF8] text-[#1B5FA8] border-[#1B5FA8]/20' },
    in_transit: { label: 'In Transit', icon: ArrowLeftRight, className: 'bg-[#E6EFF8] text-[#1B5FA8] border-[#1B5FA8]/20' },
    delivered: { label: 'Delivered', icon: CheckCircle2, className: 'bg-[#E6F4ED] text-[#1A7A4A] border-[#1A7A4A]/20' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-[#F5E6E6] text-[#CC0001] border-[#CC0001]/20' },
  };

  const item = config[status] || { label: status, icon: Clock, className: 'bg-gray-100 text-gray-800 border-gray-200' };
  const Icon = item.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${item.className}`}>
      <Icon size={12} />
      <span className="uppercase tracking-wider">{item.label}</span>
    </div>
  );
};
