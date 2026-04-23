import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore, Role } from '../../../store/authStore';

interface SensitiveValueProps {
  value: string;
  maskChar?: string;
  revealRoles?: Role[];
}

export const SensitiveValue: React.FC<SensitiveValueProps> = ({
  value,
  maskChar = '•',
  revealRoles = ['SYS_ADMIN', 'AUDITOR', 'BR_MANAGER']
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const user = useAuthStore((state) => state.user);

  const canReveal = user && revealRoles.includes(user.role);

  const maskedValue = value.length > 6
    ? value.substring(0, 3) + maskChar.repeat(value.length - 6) + value.substring(value.length - 3)
    : maskChar.repeat(value.length);

  return (
    <div className="inline-flex items-center gap-2 font-mono">
      <span>{isVisible ? value : maskedValue}</span>
      {canReveal && (
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-ab-muted hover:text-ab-navy transition-colors"
          type="button"
        >
          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};
