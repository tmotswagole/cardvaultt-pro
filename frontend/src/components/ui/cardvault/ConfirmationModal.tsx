import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  requiresInput?: boolean;
  inputLabel?: string;
  inputValue?: string;
  onInputChange?: (val: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title, message, confirmLabel, confirmVariant = 'primary',
  onConfirm, onCancel, isOpen, requiresInput, inputLabel,
  inputValue, onInputChange
}) => {
  if (!isOpen) return null;

  const isConfirmDisabled = requiresInput && (!inputValue || inputValue.length < 3);

  return (
    <div className="fixed inset-0 bg-ab-navy/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            confirmVariant === 'danger' ? 'bg-ab-red-light text-ab-red' : 'bg-ab-info-bg text-ab-info'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-ab-navy mb-2">{title}</h3>
          <p className="text-sm text-ab-text-light leading-relaxed mb-6">{message}</p>

          {requiresInput && (
            <div>
              <label className="block text-xs font-bold text-ab-muted uppercase mb-2">{inputLabel || 'Reason'}</label>
              <textarea
                className="input-field h-20 resize-none"
                placeholder="Required for audit purposes..."
                value={inputValue}
                onChange={(e) => onInputChange?.(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="bg-ab-surface p-4 flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
          <button
            className={`flex-1 btn-primary ${confirmVariant === 'danger' ? 'bg-ab-red hover:bg-ab-red-dark' : ''}`}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
