import React from 'react';
import { differenceInMonths, parseISO, isBefore } from 'date-fns';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ExpiryBadgeProps {
  expiryDate: string;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expiryDate }) => {
  const date = parseISO(expiryDate);
  const now = new Date();
  const monthsRemaining = differenceInMonths(date, now);

  if (isBefore(date, now)) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EFF1F5] text-[#8E96A8] border border-[#8E96A8]/20 text-[10px] font-bold">
        <XCircle size={12} />
        EXPIRED
      </div>
    );
  }

  if (monthsRemaining < 6) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F5E6E6] text-[#CC0001] border border-[#CC0001]/20 text-[10px] font-bold">
        <AlertTriangle size={12} />
        &lt; 6 MONTHS
      </div>
    );
  }

  if (monthsRemaining <= 12) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/20 text-[10px] font-bold">
        6–12 MONTHS
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E6F4ED] text-[#1A7A4A] border border-[#1A7A4A]/20 text-[10px] font-bold">
      &gt; 12 MONTHS
    </div>
  );
};
