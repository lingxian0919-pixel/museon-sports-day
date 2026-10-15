'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

interface ScorerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  verifyFn: (pin: string) => Promise<boolean>;
}

export default function ScorerPinModal({
  isOpen,
  onClose,
  onSuccess,
  verifyFn,
}: ScorerPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('기록원 PIN 번호를 입력해 주세요.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await verifyFn(pin.trim());
      if (isValid) {
        onSuccess(pin.trim());
        setPin('');
        setError(null);
        onClose();
      } else {
        setError('PIN 번호가 일치하지 않습니다. (기본 설정: 2026)');
      }
    } catch {
      setError('인증 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-sm p-6 relative rounded-3xl shadow-2xl border border-amber-500/30 bg-slate-900/95 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              기록원 권한 확인
            </span>
            <h2 className="text-lg font-black text-white mt-1">
              교사 / 기록원 PIN 인증
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          실시간 점수 수정 및 우승 확정 기능은 승인된 기록원만 사용할 수 있습니다. 교사용 보안 PIN 번호를 입력해 주세요.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>보안 PIN 번호</span>
              <span className="text-slate-400 text-[10px] ml-auto font-normal">(초기 기본: 2026)</span>
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(null);
              }}
              placeholder="PIN 번호 입력"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center tracking-widest text-lg font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPin('2026')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              2026 자동완성
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? '인증 확인 중...' : '기록원 인증'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
