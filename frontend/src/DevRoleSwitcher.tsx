import React, { useState } from 'react';
import { useAuthStore, Role } from './store/authStore';
import { AlertTriangle } from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuthStore();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-ab-navy text-white p-3 rounded-lg shadow-xl z-50 border border-ab-red flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-bold text-ab-red">
        <AlertTriangle size={14} />
        DEV: SWITCH ROLE
      </div>
      <div className="flex flex-wrap gap-2">
        {(['TELLER', 'BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-2 py-1 text-[10px] rounded border ${
              user.role === role ? 'bg-ab-red border-ab-red' : 'bg-transparent border-white/20 hover:border-white'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      <div className="text-[10px] opacity-50 italic">
        Warning: UI-only role override for testing.
      </div>
    </div>
  );
};
