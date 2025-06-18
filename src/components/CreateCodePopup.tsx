import React, { useState } from 'react';
import { X, Key, Sparkles } from 'lucide-react';

interface CreateCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCode: (code: string) => void;
}

export const CreateCodePopup: React.FC<CreateCodePopupProps> = ({
  isOpen,
  onClose,
  onCreateCode
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (code.trim()) {
      onCreateCode(code.trim());
      setCode('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Vault Code</h2>
              <p className="text-white/60 text-sm">Choose a unique identifier for your vault</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/80">
              Vault Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., MySecretVault2024"
              className="input-premium w-full text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              autoFocus
            />
            <p className="text-white/50 text-xs">
              Use letters, numbers, and symbols. Make it memorable but secure.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              code.trim()
                ? 'bg-gradient-primary text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Create Vault
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Security Notice</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Keep your vault code secure. You'll need it to access your images. We recommend using a unique, memorable code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};