'use client';

import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, CheckSquare, Square } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirmReset,
}: ResetConfirmModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    if (!isConfirmed) return;
    onConfirmReset();
    setIsConfirmed(false);
    onClose();
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 relative rounded-3xl shadow-2xl border border-rose-500/30 bg-slate-900/95 text-slate-100">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/30 shadow-lg shadow-rose-500/20">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              위험 작업 확인
            </span>
            <h2 className="text-lg font-black text-white mt-1">
              체육대회 데이터 전체 초기화
            </h2>
          </div>
        </div>

        {/* Warning Notice Box */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-xs space-y-2 mb-5">
          <p className="font-bold text-rose-200 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
            초기화 시 다음 상태로 즉시 변경됩니다:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
            <li>
              모든 경기 상태: <strong className="text-white">대기중</strong>으로 리셋
            </li>
            <li>
              종목별 경기 점수 및 골: <strong className="text-white">0 : 0</strong>으로 리셋
            </li>
            <li>
              우승/승리 확정 반: <strong className="text-white">승리한 반 없음</strong>으로 초기화
            </li>
            <li>
              18개 학급 종합 점수: <strong className="text-white">모두 0점</strong>으로 초기화
            </li>
            <li>
              순위제 7개 종목 기록: <strong className="text-white">모두 빈 기록</strong>으로 리셋
            </li>
          </ul>
          <p className="text-[11px] text-rose-400/90 pt-1 border-t border-rose-500/20 font-semibold">
            ⚠️ 이 작업은 되돌릴 수 없으므로 실제 경기 시작 전이나 테스트 후에만 실행하세요.
          </p>
        </div>

        {/* Confirmation Checkbox */}
        <div
          onClick={() => setIsConfirmed(!isConfirmed)}
          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all mb-5 ${
            isConfirmed
              ? 'bg-rose-500/15 border-rose-500/50 text-white'
              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="mt-0.5 text-rose-400 shrink-0">
            {isConfirmed ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <span className="text-xs font-semibold leading-snug select-none">
            위 내용을 모두 확인하였으며, 정말로 모든 경기를 대기중으로 변경하고 점수를 0점으로 초기화합니다.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleExecute}
            disabled={!isConfirmed}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg ${
              isConfirmed
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 cursor-pointer active:scale-95'
                : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            데이터 초기화 실행
          </button>
        </div>
      </div>
    </div>
  );
}
