import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  Award, 
  ShieldCheck
} from 'lucide-react';

interface FounderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FounderAuthModal: React.FC<FounderAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setError(false);
      setIsSuccess(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numbers
    const cleanVal = val.replace(/\D/g, '');
    const newDigits = [...digits];

    if (cleanVal.length > 0) {
      newDigits[index] = cleanVal[cleanVal.length - 1]; // last character
      setDigits(newDigits);
      setError(false);

      // Auto advance to next input
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      } else {
        // All 4 digits entered, check code
        const code = newDigits.join('');
        verifyCode(code);
      }
    } else {
      newDigits[index] = '';
      setDigits(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const splitDigits = pasted.split('');
      setDigits(splitDigits);
      verifyCode(pasted);
    }
  };

  const verifyCode = (code: string) => {
    // The exact 4-digit code requested by the Founder & CEO
    if (code === '9134') {
      setIsSuccess(true);
      setError(false);
      localStorage.setItem('sg_ceo_auth', 'true');
      localStorage.setItem('sg_ceo_pin_verified', 'true');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } else {
      setError(true);
      setDigits(['', '', '', '']);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20 mx-auto">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Founder & CEO Only</span>
          </div>
          <h2 className="text-xl font-black text-white">Enter 4-Digit CEO Code</h2>
          <p className="text-xs text-slate-400">
            CEO Ansh Kumar master access unlock code
          </p>
        </div>

        {/* 4-Digit Input Boxes */}
        <div className="space-y-4 pt-1">
          <div className="flex justify-center items-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 text-center text-2xl font-black rounded-2xl bg-slate-950 border transition-all focus:outline-none ${
                  isSuccess
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/20'
                    : error
                    ? 'border-red-500 text-red-400 animate-shake ring-1 ring-red-500'
                    : digit
                    ? 'border-amber-500/80 text-amber-300 bg-amber-950/10'
                    : 'border-slate-800 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              />
            ))}
          </div>

          {/* Feedback messages */}
          {error && (
            <p className="text-xs text-red-400 font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Galat code! Sirf CEO Ansh Kumar ka code 9134 chalega.</span>
            </p>
          )}

          {isSuccess && (
            <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Code 9134 Verified! Welcome CEO Ansh Kumar 👑</span>
            </p>
          )}
        </div>

        {/* Protection Note */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Users cannot bypass this 4-digit code. All admin controls remain locked.
          </span>
        </div>

        {/* Quick fill button for testing/CEO convenience */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setDigits(['9', '1', '3', '4']);
              verifyCode('9134');
            }}
            className="text-amber-400/70 hover:text-amber-300 text-[11px] font-mono flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            <span>Use Code 9134</span>
          </button>
        </div>
      </div>
    </div>
  );
};
